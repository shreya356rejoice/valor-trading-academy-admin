"use client";

import { 
  BookOpen, Users, Calendar, Bell, FileText, 
  CreditCard, BarChart, CheckCircle 
} from 'lucide-react';

export function LandingFeatures() {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Student & Teacher Management",
      description: "Easily add, edit, and manage profiles for students and teachers."
    },
    {
      icon: <Calendar className="h-8 w-8 text-green-500" />,
      title: "Attendance Tracking",
      description: "Track and visualize attendance patterns with detailed reports."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-purple-500" />,
      title: "Assignment Management",
      description: "Create, distribute, and grade assignments seamlessly."
    },
    {
      icon: <FileText className="h-8 w-8 text-amber-500" />,
      title: "Homework Collection",
      description: "Collect and organize homework submissions in one place."
    },
    {
      icon: <Bell className="h-8 w-8 text-red-500" />,
      title: "Notice Board",
      description: "Announce holidays, events, and important information."
    },
    {
      icon: <CreditCard className="h-8 w-8 text-indigo-500" />,
      title: "Fee Management",
      description: "Track fee payments, dues, and generate payment receipts."
    },
    {
      icon: <BarChart className="h-8 w-8 text-teal-500" />,
      title: "Analytics & Reports",
      description: "Gain insights through comprehensive reports and analytics."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-cyan-500" />,
      title: "Role-based Access",
      description: "Specific views and permissions for admins, teachers, and students."
    }
  ];

  return (
    <section id="features" className="py-16 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Comprehensive Features
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to manage your educational institution efficiently
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-background shadow-sm transition-all hover:shadow-md"
            >
              <div className="p-2 bg-primary/10 rounded-full">{feature.icon}</div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-center text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}