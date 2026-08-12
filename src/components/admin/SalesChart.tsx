"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Aug 6", revenue: 14000, orders: 12 },
  { name: "Aug 7", revenue: 22000, orders: 18 },
  { name: "Aug 8", revenue: 18500, orders: 15 },
  { name: "Aug 9", revenue: 28000, orders: 24 },
  { name: "Aug 10", revenue: 35000, orders: 32 },
  { name: "Aug 11", revenue: 29000, orders: 25 },
  { name: "Aug 12", revenue: 38150, orders: 38 },
];

export function SalesChart() {
  const [filter, setFilter] = useState("7 Days");

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Sales Overview</h2>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-sm border-gray-300 rounded-md shadow-sm focus:border-brand-charcoal focus:ring-brand-charcoal"
        >
          <option>7 Days</option>
          <option>30 Days</option>
          <option>3 Months</option>
          <option>1 Year</option>
        </select>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
            <YAxis 
              yAxisId="left" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6b7280' }} 
              tickFormatter={(value) => `₹${value / 1000}k`}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
            />
            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#2d2d2d" strokeWidth={2} dot={{ r: 4, fill: '#2d2d2d' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
