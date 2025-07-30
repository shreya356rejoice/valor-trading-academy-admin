/*
  # Initial Schema Setup for Student Management System

  1. Tables
    - `profiles` - Stores user profile information
    - `students` - Stores student information
    - `teachers` - Stores teacher information
    - `classes` - Stores class information
    - `attendances` - Stores student attendance records
    - `assignments` - Stores assignment information
    - `submissions` - Stores assignment submissions
    - `notices` - Stores notices and announcements
    - `fees` - Stores fee records

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table for auth users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'teacher', 'student', 'parent')) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  roll_number TEXT UNIQUE NOT NULL,
  grade TEXT NOT NULL,
  section TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  date_of_birth DATE,
  address TEXT,
  contact_number TEXT,
  parent_name TEXT,
  parent_email TEXT,
  parent_contact TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  employee_id TEXT UNIQUE NOT NULL,
  subject TEXT,
  qualification TEXT,
  contact_number TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade TEXT NOT NULL,
  section TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (grade, section, academic_year)
);

-- Create attendances table
CREATE TABLE IF NOT EXISTS attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('present', 'absent', 'late', 'excused')) NOT NULL,
  marked_by UUID REFERENCES auth.users(id),
  marked_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (student_id, class_id, date)
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  due_date TIMESTAMPTZ NOT NULL,
  max_score INTEGER DEFAULT 100,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  submission_date TIMESTAMPTZ DEFAULT now(),
  file_url TEXT,
  notes TEXT,
  score INTEGER,
  feedback TEXT,
  status TEXT CHECK (status IN ('submitted', 'late', 'graded', 'returned')) DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (assignment_id, student_id)
);

-- Create notices table
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('general', 'holiday', 'exam', 'event', 'fee')) NOT NULL,
  published_by UUID REFERENCES auth.users(id),
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create fees table
CREATE TABLE IF NOT EXISTS fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  fee_type TEXT CHECK (type IN ('tuition', 'exam', 'transport', 'hostel', 'other')) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT CHECK (status IN ('paid', 'pending', 'overdue', 'waived')) DEFAULT 'pending',
  payment_date DATE,
  payment_method TEXT,
  transaction_id TEXT,
  receipt_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for students
CREATE POLICY "Students can view their own data"
  ON students FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Policies for attendances
CREATE POLICY "Teachers and admins can mark attendance"
  ON attendances FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Teachers and admins can view attendance"
  ON attendances FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Students can view their own attendance"
  ON attendances FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE user_id = auth.uid() AND id = attendances.student_id
    )
  );

-- Policies for assignments
CREATE POLICY "Teachers can create assignments"
  ON assignments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Everyone can view assignments"
  ON assignments FOR SELECT
  USING (true);

-- Policies for submissions
CREATE POLICY "Students can submit assignments"
  ON submissions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM students
      WHERE user_id = auth.uid() AND id = submissions.student_id
    )
  );

CREATE POLICY "Students can view their own submissions"
  ON submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE user_id = auth.uid() AND id = submissions.student_id
    )
  );

CREATE POLICY "Teachers can view and grade submissions"
  ON submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Teachers can update submissions"
  ON submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Policies for notices
CREATE POLICY "Admin and teachers can create notices"
  ON notices FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Everyone can view active notices"
  ON notices FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin and teachers can view all notices"
  ON notices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Policies for fees
CREATE POLICY "Admin can manage fees"
  ON fees FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Students can view their own fees"
  ON fees FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE user_id = auth.uid() AND id = fees.student_id
    )
  );

-- Triggers to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_students_modtime
BEFORE UPDATE ON students
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_teachers_modtime
BEFORE UPDATE ON teachers
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_classes_modtime
BEFORE UPDATE ON classes
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_attendances_modtime
BEFORE UPDATE ON attendances
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_assignments_modtime
BEFORE UPDATE ON assignments
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_submissions_modtime
BEFORE UPDATE ON submissions
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_notices_modtime
BEFORE UPDATE ON notices
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_fees_modtime
BEFORE UPDATE ON fees
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Insert initial admin user
INSERT INTO profiles (id, name, email, role)
VALUES ('00000000-0000-0000-0000-000000000000', 'System Admin', 'admin@example.com', 'admin');