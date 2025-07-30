"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Download, Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';

// Mock data
const students = [
  {
    id: '1',
    name: 'Emily Johnson',
    grade: '10',
    section: 'A',
    rollNo: '1001',
    attendance: {
      '2023-10-01': 'present',
      '2023-10-02': 'present',
      '2023-10-03': 'present',
      '2023-10-04': 'absent',
      '2023-10-05': 'present',
    },
  },
  {
    id: '2',
    name: 'James Williams',
    grade: '9',
    section: 'B',
    rollNo: '902',
    attendance: {
      '2023-10-01': 'present',
      '2023-10-02': 'present',
      '2023-10-03': 'absent',
      '2023-10-04': 'present',
      '2023-10-05': 'present',
    },
  },
  {
    id: '3',
    name: 'Sophia Brown',
    grade: '11',
    section: 'A',
    rollNo: '1103',
    attendance: {
      '2023-10-01': 'present',
      '2023-10-02': 'absent',
      '2023-10-03': 'present',
      '2023-10-04': 'present',
      '2023-10-05': 'present',
    },
  },
  {
    id: '4',
    name: 'Ethan Davis',
    grade: '10',
    section: 'C',
    rollNo: '1004',
    attendance: {
      '2023-10-01': 'absent',
      '2023-10-02': 'present',
      '2023-10-03': 'present',
      '2023-10-04': 'absent',
      '2023-10-05': 'present',
    },
  },
  {
    id: '5',
    name: 'Olivia Martinez',
    grade: '9',
    section: 'A',
    rollNo: '905',
    attendance: {
      '2023-10-01': 'present',
      '2023-10-02': 'present',
      '2023-10-03': 'present',
      '2023-10-04': 'present',
      '2023-10-05': 'present',
    },
  },
];

export default function AttendancePage() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [activeTab, setActiveTab] = useState('mark');
  
  const filteredStudents = students.filter(
    (student) => `${student.grade}-${student.section}` === selectedClass
  );
  
  const formattedDate = format(date, 'yyyy-MM-dd');
  
  // Calculate attendance statistics for the selected date
  const totalStudents = filteredStudents.length;
  const presentStudents = filteredStudents.filter(
    (student) => student.attendance[formattedDate] === 'present'
  ).length;
  const absentStudents = filteredStudents.filter(
    (student) => student.attendance[formattedDate] === 'absent'
  ).length;
  const attendanceRate = totalStudents > 0 ? (presentStudents / totalStudents) * 100 : 0;

  // Function to toggle attendance status
  const toggleAttendance = (studentId: string) => {
    // In a real app, this would update the database
    console.log(`Toggling attendance for student ${studentId} on ${formattedDate}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            Mark and view student attendance records.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Class Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9-A">Grade 9-A</SelectItem>
                  <SelectItem value="9-B">Grade 9-B</SelectItem>
                  <SelectItem value="10-A">Grade 10-A</SelectItem>
                  <SelectItem value="10-B">Grade 10-B</SelectItem>
                  <SelectItem value="10-C">Grade 10-C</SelectItem>
                  <SelectItem value="11-A">Grade 11-A</SelectItem>
                </SelectContent>
              </Select>
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Selected: <span className="font-medium">Grade {selectedClass}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Date: <span className="font-medium">{format(date, 'PPP')}</span>
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Attendance Summary</CardTitle>
              <CardDescription>
                {format(date, 'EEEE, MMMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Total Students</span>
                  </div>
                  <span className="font-medium">{totalStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Present</span>
                  </div>
                  <span className="font-medium">{presentStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Absent</span>
                  </div>
                  <span className="font-medium">{absentStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Attendance Rate</span>
                  </div>
                  <span className="font-medium">{attendanceRate.toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
              <TabsTrigger value="view">View Records</TabsTrigger>
            </TabsList>
            
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          
          <TabsContent value="mark" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mark Attendance for Grade {selectedClass}</CardTitle>
                <CardDescription>
                  {format(date, 'EEEE, MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{student.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{student.rollNo}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={student.attendance[formattedDate] === 'present' ? 'success' : 'destructive'}
                          >
                            {student.attendance[formattedDate] === 'present' ? 'Present' : 'Absent'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant={student.attendance[formattedDate] === 'present' ? 'destructive' : 'success'}
                            size="sm"
                            onClick={() => toggleAttendance(student.id)}
                          >
                            {student.attendance[formattedDate] === 'present' ? 'Mark Absent' : 'Mark Present'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredStudents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No students found for this class.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                
                <div className="mt-4 flex justify-end">
                  <Button>Save Attendance</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="view" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attendance Records for Grade {selectedClass}</CardTitle>
                <CardDescription>
                  View attendance history by student or by date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="by-date">
                  <TabsList className="mb-4">
                    <TabsTrigger value="by-date">By Date</TabsTrigger>
                    <TabsTrigger value="by-student">By Student</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="by-date">
                    <div className="flex items-center mb-4 space-x-4">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 opacity-70" />
                        <span className="text-sm font-medium">
                          {format(date, 'EEEE, MMMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Roll No</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead>Marked By</TableHead>
                          <TableHead>Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{student.name.slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{student.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{student.rollNo}</TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant={student.attendance[formattedDate] === 'present' ? 'success' : 'destructive'}
                              >
                                {student.attendance[formattedDate] === 'present' ? 'Present' : 'Absent'}
                              </Badge>
                            </TableCell>
                            <TableCell>Ms. Johnson</TableCell>
                            <TableCell>9:15 AM</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="by-student">
                    <div className="space-y-4">
                      <Select defaultValue="1">
                        <SelectTrigger>
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredStudents.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name} ({student.rollNo})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead>Marked By</TableHead>
                            <TableHead>Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(students[0]?.attendance || {}).map(([date, status]) => (
                            <TableRow key={date}>
                              <TableCell>{date}</TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant={status === 'present' ? 'success' : 'destructive'}
                                >
                                  {status === 'present' ? 'Present' : 'Absent'}
                                </Badge>
                              </TableCell>
                              <TableCell>Ms. Johnson</TableCell>
                              <TableCell>9:15 AM</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}