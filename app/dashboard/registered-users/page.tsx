"use client";

import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Phone, MessageSquare, MapPin, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getAllRegisteredUsers, getCourseDropdown } from "@/components/api/register";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Course = {
  id: string;
  CourseName: string;
  courseType: string;
};

type CourseGroup = {
  courseType: string;
  courses: Course[];
};

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  brokerName: string;
  courseId: Course;
};

export default function RegisteredUsers() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [contactData, setContactData] = useState<Contact[]>([]);
  const [filteredData, setFilteredData] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [courseLoading, setCourseLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"live" | "physical">("live");
  const [selectedBroker, setSelectedBroker] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<string>(
    searchParams.get('courseId') || 'all'
  );
  const [courseGroups, setCourseGroups] = useState<CourseGroup[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const fetchCourseData = async () => {
    try {
      setCourseLoading(true);
      const data = await getCourseDropdown();
      setCourseGroups(data.payload);
      
      // Filter courses for the current tab
      const filteredCourses = data.payload
        .filter((group: CourseGroup) => group.courseType === selectedTab)
        .flatMap((group: CourseGroup) => group.courses);
      
      setCourses(filteredCourses);
      
      return filteredCourses;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    } finally {
      setCourseLoading(false);
    }
  };

  const fetchData = async (type: "live" | "physical", courseId: string = 'all') => {
    try {
      console.log(type,"type");
      
      setIsLoading(true);
      const data = await getAllRegisteredUsers(type, courseId);
      console.log(data,"data");
      
      setContactData(data.payload.data);
      setFilteredData(data.payload.data);
      
      // Update courses when tab changes
      if (courseGroups.length > 0) {
        const filteredCourses = courseGroups
          .filter(group => group.courseType === type)
          .flatMap(group => group.courses);
        setCourses(filteredCourses);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique broker names for the dropdown
  const brokerNames = Array.from(new Set(contactData.map(user => user.brokerName).filter(Boolean)));

  // Get courses based on selected tab
  const currentCourses = courseGroups
    .find(group => group.courseType === selectedTab)?.courses || [];

  // Handle course change
  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
    console.log("6");
    
    fetchData(selectedTab, value);
  };

  // Handle broker filter
  useEffect(() => {
    if (selectedBroker !== "all") {
      const filtered = contactData.filter(user => user.brokerName === selectedBroker);
      setFilteredData(filtered);
    } else {
      setFilteredData(contactData);
    }
  }, [selectedBroker, contactData]);

  // Handle initial load with URL parameters
  useEffect(() => {
    const courseId = searchParams.get('courseId') || 'all';
    const tabFromUrl = searchParams.get('courseType') as "live" | "physical" | null;
    
    // Set tab from URL if provided, otherwise keep current tab
    if (tabFromUrl && (tabFromUrl === 'live' || tabFromUrl === 'physical')) {
      setSelectedTab(tabFromUrl);
    }
    
    // Set course from URL if provided
    if (courseId && courseId !== 'all') {
      setSelectedCourse(courseId);
      
      // If tab wasn't in URL, try to determine it from course data
      if (!tabFromUrl) {
        const course = courseGroups
          .flatMap(group => group.courses)
          .find(c => c.id === courseId);
        
        if (course) {
          setSelectedTab(course.courseType as "live" | "physical");
        }
      }
    }
    console.log("2");
    
    // Fetch data with current tab and course
    fetchData(tabFromUrl || selectedTab, courseId);
  }, [JSON.stringify(searchParams)]);

  // Fetch course data on component mount and when tab changes
  // useEffect(() => {
  //   const loadData = async () => {
  //     await fetchCourseData();
  //     // After loading courses, fetch the data for the current tab
  //     console.log("1");
      
  //     fetchData(selectedTab, selectedCourse);
  //   };
    
  //   loadData();
  // }, [selectedTab]);

  const handleTabChange = async (value: string) => {
    if (value === "live" || value === "physical") {
      // Update URL first
      const params = new URLSearchParams(searchParams.toString());
      params.set('courseType', value);
      params.delete('courseId');
      
      // Update state
      setSelectedTab(value);
      setSelectedBroker("all");
      setSelectedCourse("all");
      
      // Refresh course data for the new tab
      await fetchCourseData();
      console.log("3");
      
      // Fetch data for the new tab
      fetchData(value, 'all');
      
      // Update URL
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  // const handleCourseChange = (value: string) => {
  //   setSelectedCourse(value);
  // };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <TooltipProvider>
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submissions Overview</h1>
          <p className="text-muted-foreground">View and manage all registered users at a glance.</p>
        </div>
        <div className="w-full md:w-[250px]">
          <Select 
            value={selectedCourse} 
            onValueChange={handleCourseChange}
            disabled={courseLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue 
                placeholder={courseLoading ? "Loading..." : `${selectedTab === 'live' ? 'Live' : 'Physical'} Courses`} 
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All {selectedTab === 'live' ? 'Live' : 'Physical'} Courses
              </SelectItem>
              {currentCourses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.CourseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs className="w-full" value={selectedTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="live">Live Webinars</TabsTrigger>
          <TabsTrigger value="physical">Traders Meet</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
              <div className="rounded-md border">
        {filteredData.length === 0 ? (
          <div className="text-center py-12 bg-card">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  No {selectedTab === 'live' ? 'Live Webinar' : 'Traders Meet'} Registrations
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  No users registered for {selectedTab === 'live' ? 'live webinars' : 'traders meet'} yet.
                </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sr. No</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone No.</TableHead>
                <TableHead>Broker Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((submission, index) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{submission?.courseId?.CourseName}</TableCell>
                  <TableCell className="font-medium">
                    {submission.firstName} {submission.lastName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{submission.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {submission.phone && (
                      <div className="flex items-center space-x-2">
                        <span>{submission.phone}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{submission?.brokerName}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
              </TabsContent>
      </Tabs>

      {/* <div className="rounded-md border">
        {filteredData.length === 0 ? (
          <div className="text-center py-12 bg-card">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No contact submissions</h3>
            <p className="mt-1 text-sm text-muted-foreground">No one has submitted the contact form yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sr. No</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone No.</TableHead>
                <TableHead>Broker Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((submission, index) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {submission.firstName} {submission.lastName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{submission.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {submission.phone && (
                      <div className="flex items-center space-x-2">
                        <span>{submission.phone}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{submission?.brokerName}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div> */}
    </div>
    </TooltipProvider>
  );
}
