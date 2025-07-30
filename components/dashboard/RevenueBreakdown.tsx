'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getTotalRevenueData } from '../api/dashboard';

const weeklyData = [
  { name: 'Courses', value: 12450, color: '#8884d8' },
  { name: 'AlgoBots', value: 8930, color: '#82ca9d' },
  { name: 'Telegram', value: 3250, color: '#ffc658' },
];

const monthlyData = [
  { name: 'Courses', value: 45230, color: '#8884d8' },
  { name: 'AlgoBots', value: 32100, color: '#82ca9d' },
  { name: 'Telegram', value: 12800, color: '#ffc658' },
];

const yearlyData = [
  { name: 'Courses', value: 542300, color: '#8884d8' },
  { name: 'AlgoBots', value: 385200, color: '#82ca9d' },
  { name: 'Telegram', value: 153600, color: '#ffc658' },
];

interface RevenueBreakdownProps {
  period: 'weekly' | 'monthly' | 'yearly';
}

export default function RevenueBreakdown({ period }: RevenueBreakdownProps) {

  const data = period === 'weekly' ? weeklyData : period === 'monthly' ? monthlyData : yearlyData;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Breakdown - {period.charAt(0).toUpperCase() + period.slice(1)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="text-xl font-bold">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}