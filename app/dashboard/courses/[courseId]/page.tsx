import { notFound } from 'next/navigation';
import { getChapters, getCourses } from '@/components/api/course';
import { CourseChapters } from './course-chapters';

// Add metadata for the page
export const metadata = {
  title: 'Courses',
};

interface PageProps {
  params: { courseId: string }
}

// This function generates the static params at build time
export async function generateStaticParams() {
  try {
    const response = await getCourses();
    const courses = response.payload?.data || [];
    return courses.map((course: any) => ({
      courseId: course._id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function CourseChaptersPage({ params }: PageProps) {
  const { courseId } = params;
  
  try {
    const response = await getChapters(courseId); 
    const chapters = response.payload?.data?.filter(
      (chapter: any) => chapter.courseId._id === courseId
    ) || [];
    
    // Get course name from the first chapter if available
    const courseName = chapters[0]?.courseId?.CourseName || '';
    
    return (
      <CourseChapters 
        initialChapters={chapters} 
        courseId={courseId} 
        courseName={courseName} 
      />
    );
  } catch (error) {
    console.error('Error loading chapters:', error);
    notFound();
  }
}
