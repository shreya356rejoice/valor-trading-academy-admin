"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, MoreVertical, UserPlus, Download, Filter } from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';

// Mock data
const students = [
  {
    id: '1',
    name: 'Emily Johnson',
    grade: '10',
    section: 'A',
    rollNo: '1001',
    gender: 'Female',
    feeStatus: 'Paid',
    attendance: '95%',
    parentName: 'Robert Johnson',
    contactNo: '+1 (555) 123-4567',
    email: 'emily@example.com',
    address: '123 Main St, Anytown, USA',
  },
  {
    id: '2',
    name: 'James Williams',
    grade: '9',
    section: 'B',
    rollNo: '902',
    gender: 'Male',
    feeStatus: 'Pending',
    attendance: '88%',
    parentName: 'Michael Williams',
    contactNo: '+1 (555) 234-5678',
    email: 'james@example.com',
    address: '456 Oak Ave, Somecity, USA',
  },
  {
    id: '3',
    name: 'Sophia Brown',
    grade: '11',
    section: 'A',
    rollNo: '1103',
    gender: 'Female',
    feeStatus: 'Paid',
    attendance: '92%',
    parentName: 'Daniel Brown',
    contactNo: '+1 (555) 345-6789',
    email: 'sophia@example.com',
    address: '789 Pine St, Othercity, USA',
  },
  {
    id: '4',
    name: 'Ethan Davis',
    grade: '10',
    section: 'C',
    rollNo: '1004',
    gender: 'Male',
    feeStatus: 'Overdue',
    attendance: '78%',
    parentName: 'William Davis',
    contactNo: '+1 (555) 456-7890',
    email: 'ethan@example.com',
    address: '101 Maple Rd, Newtown, USA',
  },
  {
    id: '5',
    name: 'Olivia Martinez',
    grade: '9',
    section: 'A',
    rollNo: '905',
    gender: 'Female',
    feeStatus: 'Paid',
    attendance: '97%',
    parentName: 'Carlos Martinez',
    contactNo: '+1 (555) 567-8901',
    email: 'olivia@example.com',
    address: '202 Cedar Ln, Bigcity, USA',
  },
];

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [viewType, setViewType] = useState('table');
  
  // Filter students based on search term and grade
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.rollNo.includes(searchTerm);
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    
    return matchesSearch && matchesGrade;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Students</h1>
            <p className="text-muted-foreground">
              Manage student records, view profiles, and track performance.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the student details below to add a new student record.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                    <Input id="firstName" placeholder="First Name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                    <Input id="lastName" placeholder="Last Name" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="grade" className="text-sm font-medium">Grade</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {[9, 10, 11, 12].map((grade) => (
                          <SelectItem key={grade} value={grade.toString()}>
                            Grade {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="section" className="text-sm font-medium">Section</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Section" />
                      </SelectTrigger>
                      <SelectContent>
                        {['A', 'B', 'C', 'D'].map((section) => (
                          <SelectItem key={section} value={section}>
                            Section {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" type="email" placeholder="student@example.com" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="parentName" className="text-sm font-medium">Parent's Name</label>
                  <Input id="parentName" placeholder="Parent's Name" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="contactNo" className="text-sm font-medium">Contact Number</label>
                  <Input id="contactNo" placeholder="Contact Number" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">Address</label>
                  <Input id="address" placeholder="Address" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Add Student</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-auto flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or roll number..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="9">Grade 9</SelectItem>
                <SelectItem value="10">Grade 10</SelectItem>
                <SelectItem value="11">Grade 11</SelectItem>
                <SelectItem value="12">Grade 12</SelectItem>
              </SelectContent>
            </Select>
            
            <Tabs value={viewType} onValueChange={setViewType} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="grid">Grid</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button variant="outline" size="icon" className="hidden sm:flex">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs value={viewType} className="w-full">
          <TabsContent value="table" className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Fee Status</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{student.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          {student.name}
                        </div>
                      </TableCell>
                      <TableCell>{student.grade}-{student.section}</TableCell>
                      <TableCell>{student.rollNo}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.feeStatus === 'Paid'
                              ? 'success'
                              : student.feeStatus === 'Pending'
                              ? 'warning'
                              : 'destructive'
                          }
                          className="px-2 py-0.5 text-xs"
                        >
                          {student.feeStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {student.attendance}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>View Attendance</DropdownMenuItem>
                            <DropdownMenuItem>View Grades</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredStudents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No students found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="grid" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col items-center p-6 pb-4">
                      <Avatar className="h-20 w-20 mb-4">
                        <AvatarFallback className="text-lg">{student.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">Roll No: {student.rollNo}</p>
                      <p className="text-sm text-muted-foreground">Grade {student.grade}-{student.section}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={
                            student.feeStatus === 'Paid'
                              ? 'success'
                              : student.feeStatus === 'Pending'
                              ? 'warning'
                              : 'destructive'
                          }
                          className="px-2 py-0.5 text-xs"
                        >
                          {student.feeStatus}
                        </Badge>
                        <Badge variant="outline" className="px-2 py-0.5 text-xs">
                          {student.attendance}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex divide-x border-t">
                      <Button variant="ghost" className="flex-1 rounded-none text-xs py-2 h-10">View</Button>
                      <Button variant="ghost" className="flex-1 rounded-none text-xs py-2 h-10">Edit</Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="flex-1 rounded-none text-xs py-2 h-10">More</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Attendance</DropdownMenuItem>
                          <DropdownMenuItem>View Grades</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredStudents.length === 0 && (
                <div className="col-span-full flex items-center justify-center h-32 border rounded-md">
                  <p className="text-muted-foreground">No students found.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}