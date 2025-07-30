'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', signups: 24 },
  { name: 'Tue', signups: 38 },
  { name: 'Wed', signups: 29 },
  { name: 'Thu', signups: 45 },
  { name: 'Fri', signups: 52 },
  { name: 'Sat', signups: 67 },
  { name: 'Sun', signups: 41 },
];

export default function UserSignupChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="signups" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}