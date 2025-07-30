'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Filter } from 'lucide-react';

const payments = [
  {
    id: 1,
    customer: 'John Doe',
    email: 'john@example.com',
    item: 'Advanced Trading Strategies',
    type: 'Course',
    amount: '$299',
    status: 'Completed',
    date: '2024-01-15',
    paymentMethod: 'Credit Card'
  },
  {
    id: 2,
    customer: 'Jane Smith',
    email: 'jane@example.com',
    item: 'Scalping Master Bot',
    type: 'AlgoBot',
    amount: '$499',
    status: 'Completed',
    date: '2024-01-14',
    paymentMethod: 'PayPal'
  },
  {
    id: 3,
    customer: 'Mike Johnson',
    email: 'mike@example.com',
    item: 'Premium Telegram Channel',
    type: 'Telegram',
    amount: '$29',
    status: 'Pending',
    date: '2024-01-13',
    paymentMethod: 'Bank Transfer'
  }
];

const coursesSales = [
  { name: 'Advanced Trading Strategies', sales: 45, revenue: '$13,455' },
  { name: 'Crypto Trading Basics', sales: 67, revenue: '$13,333' },
  { name: 'Options Trading Masterclass', sales: 23, revenue: '$6,900' }
];

const algobotSales = [
  { name: 'Scalping Master Bot', sales: 45, revenue: '$22,455' },
  { name: 'Trend Following Bot', sales: 67, revenue: '$26,733' },
  { name: 'Arbitrage Bot', sales: 23, revenue: '$16,077' }
];

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.item.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || payment.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payment & Revenue</h1>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payments">All Payments</TabsTrigger>
          <TabsTrigger value="courses">Course Sales</TabsTrigger>
          <TabsTrigger value="algobots">AlgoBot Sales</TabsTrigger>
          <TabsTrigger value="telegram">Telegram</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payments" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="course">Courses</SelectItem>
                <SelectItem value="algobot">AlgoBots</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium">{payment.customer}</h3>
                        <p className="text-sm text-gray-500">{payment.email}</p>
                      </div>
                      <div>
                        <p className="font-medium">{payment.item}</p>
                        <p className="text-sm text-gray-500">{payment.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="font-bold text-green-600">{payment.amount}</p>
                        <p className="text-sm text-gray-500">{payment.paymentMethod}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={payment.status === 'Completed' ? 'default' : 'secondary'}>
                          {payment.status}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">{payment.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coursesSales.map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{course.name}</h3>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{course.sales}</p>
                        <p className="text-sm text-gray-500">Sales</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{course.revenue}</p>
                        <p className="text-sm text-gray-500">Revenue</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="algobots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AlgoBot Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {algobotSales.map((bot, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{bot.name}</h3>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{bot.sales}</p>
                        <p className="text-sm text-gray-500">Sales</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{bot.revenue}</p>
                        <p className="text-sm text-gray-500">Revenue</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Upload Code
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="telegram" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Telegram Subscription History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Premium Telegram Channel</h3>
                    <p className="text-sm text-gray-500">Monthly subscription</p>
                  </div>
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold">234</p>
                      <p className="text-sm text-gray-500">Subscribers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">$6,786</p>
                      <p className="text-sm text-gray-500">Monthly Revenue</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}