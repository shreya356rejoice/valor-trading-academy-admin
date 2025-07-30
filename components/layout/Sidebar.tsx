'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Bot, 
  MessageCircle, 
  CreditCard, 
  Bell, 
  UserPlus, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Mail,
  MessageSquare,
  User,
  LogOut,
  ChevronDown,
  Settings as SettingsIcon
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Customers',
    href: '/dashboard/customers',
    icon: Users
  },
  {
    title: 'Courses',
    href: '/dashboard/courses',
    icon: BookOpen
  },
  {
    title: 'AlgoBots',
    href: '/dashboard/algobots',
    icon: Bot
  },
  {
    title: 'Telegram',
    href: '/dashboard/telegram',
    icon: MessageCircle
  },
  {
    title: 'Payments',
    href: '/dashboard/payments',
    icon: CreditCard
  },
  {
    title: 'Notifications',
    href: '/dashboard/notifications',
    icon: Bell
  },
  {
    title: 'Referrals',
    href: '/dashboard/referrals',
    icon: UserPlus
  },
  {
    title: 'Newsletter',
    href: '/dashboard/newsletter',
    icon: Mail
  },
  {
    title: 'Contact',
    href: '/dashboard/contact',
    icon: MessageSquare
  },
  {
    title: 'Content',
    href: '/dashboard/content',
    icon: SettingsIcon
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={cn(
      "bg-background border-r transition-all duration-300 flex flex-col h-screen relative",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button - Fixed at the top right */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className={cn(
          "absolute -right-5 top-14 z-10 rounded-lg border bg-background p-0",
          "flex items-center justify-center hover:bg-muted w-8 h-8"
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      {/* Header with Logo */}
      <div className="flex items-center justify-between p-4 border-b relative">
        <div className={cn("flex items-center space-x-2", isCollapsed ? "w-full justify-center" : "")}>
          <div className={cn("relative", isCollapsed ? "h-10 w-10" : "h-10 w-10")}>
            <Image 
              src="/images/logo.png" 
              alt="Valor Trading Academy Logo"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-foreground">Valor Trading</h2>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
                         (item.href !== '/dashboard' && pathname.startsWith(item.href));
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start group",
                    isCollapsed ? "px-2" : "px-4"
                  )}
                >
                  <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                  {!isCollapsed && item.title}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Profile Section */}
      <div className={cn(
        "border-t border-muted p-4 mt-auto",
        isCollapsed ? "px-2 py-4" : "p-4"
      )}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-between h-auto p-2",
                isCollapsed ? "flex-col items-center justify-center space-y-1" : "flex items-center"
              )}
            >
              <div className="flex items-center">
                <Avatar className={cn("h-8 w-8", isCollapsed ? "mx-auto" : "mr-2")}>
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="text-left">
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-muted-foreground">admin@example.com</p>
                  </div>
                )}
              </div>
              {!isCollapsed && <ChevronDown className="h-4 w-4 ml-auto opacity-50" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align={isCollapsed ? "start" : "end"} side={isCollapsed ? "right" : "top"}>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}