"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, Play, MapPin, Edit, Trash2, MoreVertical, Video, Link as LinkIcon, UploadCloud, Image, CalendarPlus, BookPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle as DialogTitleUI, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { createCourse, getCourses, updateCourse, deleteCourse } from "@/components/api/course";
import React from "react";
import { Popover as ShadcnPopover, PopoverContent as ShadcnPopoverContent, PopoverTrigger as ShadcnPopoverTrigger } from "@/components/ui/popover";
import { Dialog as ConfirmDialog, DialogContent as ConfirmDialogContent, DialogHeader as ConfirmDialogHeader, DialogTitle as ConfirmDialogTitle, DialogFooter as ConfirmDialogFooter } from "@/components/ui/dialog";
import Link from "next/link";
import { DataTablePagination } from "@/components/ui/DataTablePagination";
import { Course } from "@/components/api/course";
import { ImageUpload } from "@/components/ui/image-upload";
import { Label } from "@/components/ui/label";

export default function TradersMeet() {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("recorded");
  const [formActiveTab, setFormActiveTab] = useState("recorded");
  const [isTabSwitching, setIsTabSwitching] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Date states...
  const [recordedStartDate, setRecordedStartDate] = useState<Date | undefined>();
  const [recordedEndDate, setRecordedEndDate] = useState<Date | undefined>();
  const [liveStartDate, setLiveStartDate] = useState<Date | undefined>();
  const [liveEndDate, setLiveEndDate] = useState<Date | undefined>();
  const [physicalStartDate, setPhysicalStartDate] = useState<Date | undefined>();
  const [physicalEndDate, setPhysicalEndDate] = useState<Date | undefined>();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Add error state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Add loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Handle file selection from ImageUpload component
  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };

  // Function to trim input values on blur
  const handleTrimInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const trimmedValue = e.target.value.trim();
    if (trimmedValue !== e.target.value) {
      e.target.value = trimmedValue;
      // Trigger change event to update form state
      const event = new Event('input', { bubbles: true });
      e.target.dispatchEvent(event);
    }
  };

  // Add this validation function at the top level of the component
  const validateForm = (formData: FormData, courseType: string) => {
    const errors: Record<string, string> = {};

    const startTime = formData.get('startTime')?.toString().trim() || '';
    const endTime = formData.get('endTime')?.toString().trim() || '';

    // Validate start time
    if (!startTime) {
      errors.startTime = 'Start time is required';
    }

    // Validate end time
    if (!endTime) {
      errors.endTime = 'End time is required';
    }

    // Only validate time range if both times are provided
    if (startTime && endTime) {
      const startTm = new Date(`2000-01-01T${startTime}`);
      const endTm = new Date(`2000-01-01T${endTime}`);

      if (startTm >= endTm) {
        errors.endTime = 'End time must be after start time';
      }
    }

    // Common validations for all course types
    const name = formData.get("name")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || "";
    const instructor = formData.get("instructor")?.toString().trim() || "";

    if (!name) {
      errors.name = "Course name is required";
    } else if (name.length < 5) {
      errors.name = "Course name must be at least 5 characters";
    }

    if (!description) {
      errors.description = "Description is required";
    } else if (description.length < 20) {
      errors.description = "Description must be at least 20 characters";
    }

    if (!instructor) {
      errors.instructor = "Instructor name is required";
    }

    // Validate price (required and > 0)
    // const priceValue = formData.get("price")?.toString();
    // const price = parseFloat(priceValue || "");
    // if (!priceValue || isNaN(price) || price <= 0) {
    //   errors.price = "Please enter a valid price greater than 0";
    // }

    // Validate hours (required and > 0)
    // const hoursValue = formData.get("hours")?.toString();
    // const hours = parseFloat(hoursValue || "");
    // if (!hoursValue || isNaN(hours) || hours <= 0) {
    //   errors.hours = "Please enter valid hours greater than 0";
    // }

    // Validate dates (use courseStart/courseEnd set before validation)
    const startDate = formData.get("courseStart")?.toString();
    const endDate = formData.get("courseEnd")?.toString();

    if (!startDate) {
      errors.startDate = "Start date is required";
    }
    if (!endDate) {
      errors.endDate = "End date is required";
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errors.dateRange = "End date must be after start date";
    }

    // Image required on create (skip when editing)
    const imageEntries = formData.getAll("image").filter((v) => v instanceof File && (v as File).size > 0) as File[];
    if (!editCourse && imageEntries.length === 0) {
      errors.image = "Please upload a image";
    }

    if (courseType === "live") {
      if (!formData.get("zoomLink")?.toString().trim() && !editCourse?.meetingLink) {
        errors.zoomLink = "Zoom meeting link is required";
      } else if (formData.get("zoomLink") && !isValidUrl(formData.get("zoomLink")?.toString() || "")) {
        errors.zoomLink = "Please enter a valid Zoom URL";
      }
    }

    // if (courseType === "physical") {
      if (!formData.get("location")?.toString().trim()) {
        errors.location = "Location is required";
      }
      // if (!formData.get("email")?.toString().trim()) {
      //   errors.email = "Email is required";
      // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get("email")?.toString().trim() || "")) {
      //   errors.email = "Please enter a valid email address";
      // }

      // // For required phone
      // if (!formData.get("phone")?.toString().trim()) {
      //   errors.phone = "Phone number is required";
      // } else if (!/^[+\d\s-]{10,}$/.test(formData.get("phone")?.toString().trim() || "")) {
      //   errors.phone = "Please enter a valid phone number (min 10 digits)";
      // }
    // }

    return errors;
  };

  // Add this URL validation helper function
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Fetch courses with pagination and filtering
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {

      const response = await getCourses({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        courseType: "physical",
      });

      if (response && response.success) {
        const { data, count } = response.payload;

        setCourses(data || []);
        setTotalItems(count || 0);
        setTotalPages(Math.ceil((count || 0) / itemsPerPage));
      } else {
        console.error("API Response indicates failure:", response);
        setError(response?.message || "Failed to load courses");
      }
    } catch (err: any) {
      console.error("Error in fetchCourses:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      // setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Pagination state changed:", {
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages,
      coursesCount: courses.length,
    });
  }, [currentPage, itemsPerPage, totalItems, totalPages, courses]);

  // Fetch courses when pagination or filters change
  useEffect(() => {
    fetchCourses();
  }, [currentPage, itemsPerPage, searchTerm, activeTab]);

  const resetForm = () => {
    setEditCourse(null);
    setRecordedStartDate(undefined);
    setRecordedEndDate(undefined);
    setLiveStartDate(undefined);
    setLiveEndDate(undefined);
    setPhysicalStartDate(undefined);
    setPhysicalEndDate(undefined);
    setFormErrors({});
    // setActiveTab('recorded');
    // Reset form fields if using a form ref
    const form = document.querySelector("form");
    if (form) {
      form.reset();
    }
  };

  // Add this effect to initialize form fields when editing
  useEffect(() => {
    if (editCourse) {
      // Set the active tab based on course type
      setActiveTab(editCourse.courseType || "recorded");
      setFormActiveTab(editCourse.courseType || "recorded");

      // Set date states if they exist
      if (editCourse.courseStart) {
        setRecordedStartDate(new Date(editCourse.courseStart));
        setLiveStartDate(new Date(editCourse.courseStart));
        setPhysicalStartDate(new Date(editCourse.courseStart));
      }
      if (editCourse.courseEnd) {
        setRecordedEndDate(new Date(editCourse.courseEnd));
        setLiveEndDate(new Date(editCourse.courseEnd));
        setPhysicalEndDate(new Date(editCourse.courseEnd));
      }
    } else {
      resetForm();
    }
  }, [editCourse]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const getYoutubeThumbnail = (url: string) => {
    const match = url.match(/(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
  };

  const handleDeleteCourse = async (id: string) => {
    setDeleteDialogOpen(false);
    try {
      const data = await deleteCourse(id);
      if (data.success) {
        toast.success("Course deleted successfully", {
          description: data?.message || "The course has been deleted.",
        });
        // Refresh course list
        const refreshed = await getCourses();
        setCourses(refreshed.payload.data);
      } else {
        toast.error("Failed to delete course", {
          description: data?.message || "An error occurred.",
        });
      }
    } catch (err) {
      toast.error("API error", {
        description: err instanceof Error ? err.message : "An error occurred.",
      });
    }
  };

  const CourseCard = ({ course }: { course: any }) => {
    // const videoThumb = course.courseVideo ? getYoutubeThumbnail(course.courseVideo) : null;
    // const [showVideo, setShowVideo] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);

    // const toggleVideo = (e: React.MouseEvent) => {
    //   e.preventDefault();
    //   e.stopPropagation();
    //   setShowVideo(!showVideo);
    // };

    // const getYoutubeEmbedUrl = (url: string) => {
    //   const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    //   const match = url.match(regExp);
    //   const videoId = match && match[2].length === 11 ? match[2] : null;
    //   return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : "";
    // };

    return (
      <Card className="hover:shadow-md transition-shadow overflow-hidden">
        <div className="relative aspect-video bg-background">
          <div className="relative aspect-video bg-background">
            {course.courseVideo ? (
              <img src={course.courseVideo} alt={course.CourseName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Image className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
        </div>
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg line-clamp-1">
                {/* <Link href={activeTab === "live" ? `/dashboard/courses/${course._id}/sessions` : `/dashboard/courses/${course._id}`} className="hover:underline cursor-pointer"> */}
                {course.CourseName}
                {/* </Link> */}
              </h3>
              <div className="text-sm text-muted-foreground line-clamp-2 h-10 overflow-hidden text-ellipsis">{course.description}</div>
            </div>
            <DropdownMenu open={popoverOpen} onOpenChange={setPopoverOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* {activeTab === "live" ? (
                  <Link href={`/dashboard/courses/${course._id}/sessions`} className="w-full">
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setPopoverOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      <span>Add Session</span>
                    </DropdownMenuItem>
                  </Link>
                ) : (
                  <Link href={`/dashboard/courses/${course._id}`} className="w-full">
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setPopoverOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <BookPlus className="mr-2 h-4 w-4" />
                      <span>Add Chapters</span>
                    </DropdownMenuItem>
                  </Link>
                )} */}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditCourse(course);
                    setOpen(true);
                    setPopoverOpen(false);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    setCourseToDelete(course);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">{course.courseStart ? format(new Date(course.courseStart), "MMM d, yyyy") : "No start date"}</span>
            <Badge variant="outline" className="capitalize">
              {course.courseType}
            </Badge>
          </div>

          <div className="text-sm text-muted-foreground font-bold">
            {course.startTime ? `${course?.startTime}` : "-"}
            {course.endTime ? ` to ${course?.endTime}` : "-"}
          </div>
          {/* {course.instructor && ( */}
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="font-bold">Instructor:</span>
            <span className="ml-1">{course.instructor}</span>
          </div>
          {/* )} */}

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <span className="ml-1 capitalize">{course.language || "English"} | Registered Users : 1</span>
            </div>
          </div>

          {course.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{course.location}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  function formatTo12Hour(time24: string) {
    const [hoursStr, minutes, seconds] = time24.split(":");
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
  
    hours = hours % 12 || 12; // Convert "0" to "12"
  
    return `${hours}:${minutes} ${ampm}`;
  }

  function convertTo24Hour(time12h: string): string {
    const [time, modifier] = time12h.trim().split(" ");
    let [hours, minutes] = time.split(":");
  
    if (hours === "12") {
      hours = modifier.toUpperCase() === "AM" ? "00" : "12";
    } else if (modifier.toUpperCase() === "PM") {
      hours = String(parseInt(hours, 10) + 12);
    }
  
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
  }

  async function handleCourseSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Prevent multiple submissions
    // if (isSubmitting) return;

    // setIsSubmitting(true);
    setFormErrors({});

    try {
      const formData = new FormData(e.currentTarget);
      // const courseType = formData.get("courseType");

      // Get the correct dates based on the active tab
      let startDate = "";
      let endDate = "";

      startDate = physicalStartDate ? format(physicalStartDate, "yyyy-MM-dd") : "";
      endDate = physicalEndDate ? format(physicalEndDate, "yyyy-MM-dd") : "";

      // Add the dates to form data
      formData.set("courseStart", startDate);
      formData.set("courseEnd", endDate);

      // Validate form
      const errors = validateForm(formData, "physical");
      
      setFormErrors(errors);

      // If there are errors, stop submission
      if (Object.keys(errors).length > 0) {
        setIsSubmitting(false);
        return;
      }

      // Get the thumbnail image file if it exists
      // const thumbnailImage = formData.get("image") as File | null;

      // Create a new FormData for the API request
      const apiFormData = new FormData();

      const courseTypeValue = "physical";

      const startTime = formData.get("startTime")?.toString() || "00:00:00";
      const endTime = formData.get("endTime")?.toString() || "00:00:00"; 

      // Add all form fields to the FormData
      apiFormData.append("courseType", courseTypeValue || "");
      apiFormData.append("CourseName", formData.get("name") || "");
      apiFormData.append("description", formData.get("description") || "");
      // apiFormData.append("price", formData.get("price") || "0");
      // apiFormData.append("hours", formData.get("hours") || "0");
      apiFormData.append("courseStart", startDate);
      apiFormData.append("courseEnd", endDate);
      apiFormData.append("startTime", formatTo12Hour(startTime));
      apiFormData.append("endTime", formatTo12Hour(endTime));
      apiFormData.append("instructor", formData.get("instructor") || "");
      apiFormData.append("language", formData.get("language") || "english");
      
      apiFormData.append("location", formData.get("location") || "");
        // apiFormData.append("email", formData.get("email") || "");
        // apiFormData.append("phone", formData.get("phone") || "");
      
      if (imageFile) {
        apiFormData.append("image", imageFile);
      }

      // Add the thumbnail image if it exists
      //   if (thumbnailImage && thumbnailImage.size > 0) {
      //     apiFormData.append("thumbnail", thumbnailImage);
      //   }

      // Add course images if they exist (for recorded courses)
      // const courseImages = formData.getAll("image") as File[];
      // if (courseImages && courseImages.length > 0) {
      //   courseImages.forEach((file, index) => {
      //     apiFormData.append(`image`, file);
      //   });
      // }

      try {
        let data;
        if (editCourse && editCourse._id) {
          // Update existing course
          data = await updateCourse(editCourse._id, apiFormData);
        } else {
          // Create new course
          data = await createCourse(apiFormData);
        }

        if (data.success) {
          setOpen(false);
          setEditCourse(null);
          toast.success(editCourse ? "Course updated successfully" : "Course created successfully", {
            description: data?.message || (editCourse ? "The course has been updated." : "The course has been created."),
          });
          // Refresh course list
          const refreshed = await getCourses();
          setCourses(refreshed.payload.data);
        } else {
          toast.error(editCourse ? "Failed to update course" : "Failed to create course", {
            description: data?.message || "An error occurred.",
          });
        }
      } catch (err: any) {
        if (err.response?.status === 413) {
          toast.error("File too large", {
            description: "The file you are trying to upload exceeds the maximum allowed size. Please try with a smaller file.",
          });
        } else {
          toast.error("Failed to update course", {
            description: err instanceof Error ? err.message : "An error occurred.",
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error("Error submitting course:", error);
      if (error.response?.status === 413) {
        toast.error("File too large", {
          description: "The file you are trying to upload exceeds the maximum allowed size. Please try with a smaller file.",
        });
      } else {
        toast.error(error instanceof Error ? error.message : "Failed to save course");
      }
      setIsSubmitting(false);
    }
  }

  const handleTabChange = (value: string) => {
    setIsTabSwitching(true);
    setActiveTab(value);
    setTimeout(() => {
      setIsTabSwitching(false);
    }, 500);
  };

  const isTabDisabled = (tabType: string) => {
    if (!editCourse) return false;
    return editCourse.courseType !== tabType;
  };

  const handleFormTabChange = (value: string) => {
    if (editCourse && editCourse.courseType !== value) {
      // Don't allow changing tabs when editing a course
      return;
    }
    setFormActiveTab(value);
  };

  const renderCourseList = (courses: any[], emptyMessage: string) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    } else if (error) {
      return <div className="text-red-500">{error}</div>;
    } else {
      return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={course._id || course.CourseName} course={course} />
          ))}
          {courses.length === 0 && <div className="col-span-full text-center text-gray-400">{emptyMessage}</div>}
        </div>
      );
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) {
            setFormErrors({});
            setIsSubmitting(false);
            setEditCourse(null);
            setRecordedStartDate(undefined);
            setRecordedEndDate(undefined);
            setLiveStartDate(undefined);
            setLiveEndDate(undefined);
            setPhysicalStartDate(undefined);
            setPhysicalEndDate(undefined);
            const form = document.querySelector("form");
            if (form) {
              form.reset();
            }
          } else {
            setFormActiveTab(editCourse?.courseType || "recorded");
            setFormErrors({});
          }
        }}
      >
        <DialogContent className="max-w-2xl gap-0">
          <DialogHeader>
            <DialogTitleUI>{editCourse ? `Edit Traders Meet` : "Create Traders Meet"}</DialogTitleUI>
          </DialogHeader>
          <Tabs value={formActiveTab} onValueChange={handleFormTabChange} className="w-full">
            {/* Physical Course Form */}
            <form className="space-y-4 h-[54vh] overflow-y-auto px-1 scroll-thin" onSubmit={handleCourseSubmit}>
              <input type="hidden" name="courseType" value="physical" />
              <div>
                <label className="block font-medium mb-1">Thumbnail Image</label>
                <ImageUpload
                  name="image"
                  id="course-thumbnail"
                  error={formErrors.image}
                  onChange={handleImageChange}
                  initialImage={editCourse?.courseVideo || null}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Title</label>
                <Input
                  placeholder="Course Name"
                  name="name"
                  defaultValue={editCourse?.CourseName || ""}
                  onBlur={handleTrimInput}
                  onKeyDown={(e) => {
                    if (e.key === ' ' && !(e.target as HTMLInputElement).value.trim()) {
                      e.preventDefault();
                    }
                  }}
                />
                {formErrors.name && <div className="text-red-500">{formErrors.name}</div>}
              </div>
              <div>
                <label className="block font-medium mb-1">Description</label>
                <Input
                  placeholder="Course Description"
                  name="description"
                  defaultValue={editCourse?.description || ""}
                  onBlur={handleTrimInput}
                  onKeyDown={(e) => {
                    if (e.key === ' ' && !(e.target as HTMLInputElement).value.trim()) {
                      e.preventDefault();
                    }
                  }}
                />
                {formErrors.description && <div className="text-red-500">{formErrors.description}</div>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Instructor Name</label>
                  <Input
                    placeholder="Instructor Name"
                    name="instructor"
                    defaultValue={editCourse?.instructor || ""}
                    onBlur={handleTrimInput}
                    onKeyDown={(e) => {
                      if (e.key === ' ' && !(e.target as HTMLInputElement).value.trim()) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {formErrors.instructor && <div className="text-red-500">{formErrors.instructor}</div>}
                </div>
                <div>
                  <label className="block font-medium mb-1">Language</label>
                  <select name="language" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" defaultValue={editCourse?.language || "english"}>
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="hindi">Hindi</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Traders Meet Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-10 justify-start text-left font-normal px-4">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {physicalStartDate ? format(physicalStartDate, "PPP") : <><input placeholder="Pick a date" className="!outline-none !border-none !bg-transparent !caret-transparent cursor-pointer !text-base !font-semibold" /></>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={physicalStartDate} onSelect={setPhysicalStartDate} initialFocus disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} />
                    </PopoverContent>
                  </Popover>
                  {formErrors.startDate && <div className="text-red-500">{formErrors.startDate}</div>}
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">Registration End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-10 justify-start text-left font-normal px-4">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {physicalEndDate ? format(physicalEndDate, "PPP") : <><input placeholder="Pick a date" className="!outline-none !border-none !bg-transparent !caret-transparent cursor-pointer !text-base !font-semibold" /></>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={physicalEndDate} onSelect={setPhysicalEndDate} initialFocus disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} />
                    </PopoverContent>
                  </Popover>
                  {formErrors.endDate && <div className="text-red-500">{formErrors.endDate}</div>}
                </div>
              </div>
              {formErrors.dateRange && <div className="text-red-500">{formErrors.dateRange}</div>}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="time-picker" className="px-1">
                    Start Time
                  </Label>
                  <Input
                    type="time"
                    id="time-picker"
                    name="startTime"
                    step="1"
                    defaultValue={editCourse?.startTime ? convertTo24Hour(editCourse.startTime) : "00:00:00"}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="time-picker" className="px-1">
                    End Time
                  </Label>
                  <Input
                    type="time"
                    id="time-picker"
                    name="endTime"
                    step="1"
                    defaultValue={editCourse?.endTime ? convertTo24Hour(editCourse.endTime) : "00:00:00"}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                  {formErrors.endTime && (
                    <span className="text-red-500">{formErrors.endTime}</span>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <label className="block font-medium">Place</label>
                <Input
                  placeholder="Place"
                  name="location"
                  defaultValue={editCourse?.location || ""}
                  className="w-full"
                  onBlur={handleTrimInput}
                  onKeyDown={(e) => {
                    if (e.key === ' ' && !(e.target as HTMLInputElement).value.trim()) {
                      e.preventDefault();
                    }
                  }}
                />
                {formErrors.location && <p className="text-red-500">{formErrors.location}</p>}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editCourse ? "Edit Traders Meet" : "Create Traders Meet"}
                </Button>
              </DialogFooter>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>Delete Course</ConfirmDialogTitle>
          </ConfirmDialogHeader>
          <div>
            Are you sure you want to delete <b>{courseToDelete?.CourseName}</b>? This action cannot be undone.
          </div>
          <ConfirmDialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => courseToDelete && handleDeleteCourse(courseToDelete._id)}>
              Delete
            </Button>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>

      <div className="flex items-center justify-between space-x-2 p-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Button
          onClick={() => {
            setEditCourse(null);
            resetForm();
            setOpen(true);
            setFormActiveTab(activeTab);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Traders Meet
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-4 px-6">

        {isTabSwitching ? (
          <div className="flex justify-center items-center min-h-[70vh]">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {renderCourseList(
              courses.filter((c) => c.courseType?.toLowerCase() === "physical"),
              "No physical courses found."
            )}
          </>
        )}
      </Tabs>
      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
        itemsPerPageOptions={[8, 10, 20, 30, 50]}
        className="border-t pt-4"
      />
    </div>
  );
}
