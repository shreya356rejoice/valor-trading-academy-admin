'use client';

import { useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import RevenueChart from '@/components/dashboard/RevenueChart';
import UserSignupChart from '@/components/dashboard/UserSignupChart';
import RevenueBreakdown from '@/components/dashboard/RevenueBreakdown';
import { DollarSign, Users, BookOpen, Bot, TrendingUp, TrendingDown } from 'lucide-react';
import { getTotalRevenueData } from '@/components/api/dashboard';


export default function Dashboard() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [totalRevenueData, setTotalRevenueData] = useState<any>([]);
useLayoutEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.replace('/');
  } else {
    setChecked(true); // Only render dashboard after this
  }

  getTotalRevenueData().then((data)=>{
    setTotalRevenueData(data.payload)
  })
}, []);
const stats = [
  { title: 'Total Revenue', value: totalRevenueData?.totalRevenue, change: `${totalRevenueData?.revenueChange?.percent}% from last month`, icon: DollarSign },
  { title: 'Active Users', value: '2,350', change: '+12% from last month', icon: Users },
  { title: 'Course Sales', value: '156', change: '+8% from last month', icon: BookOpen },
  { title: 'AlgoBot Sales', value: '89', change: '+25% from last month', icon: Bot },
];


  if (!checked) {
    // Skip rendering until token is verified
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {totalRevenueData?.revenueChange?.percent > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={totalRevenueData.monthlyRevenue}/>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New User Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <UserSignupChart />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <RevenueBreakdown period="weekly" />
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <RevenueBreakdown period="monthly" />
        </TabsContent>

        <TabsContent value="yearly" className="space-y-4">
          <RevenueBreakdown period="yearly" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
