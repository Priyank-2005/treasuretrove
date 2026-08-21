"use client";

import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function SalesChart({ orders = [] }: { orders?: any[] }) {
  const [filter, setFilter] = useState("7 Days");

  const data = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    
    // Simple grouping by date
    const grouped: Record<string, { revenue: number, orders: number }> = {};
    
    // Sort orders by date
    const sortedOrders = [...orders].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Determine cutoff date based on filter
    const now = new Date();
    let cutoff = new Date();
    if (filter === "7 Days") cutoff.setDate(now.getDate() - 7);
    if (filter === "30 Days") cutoff.setDate(now.getDate() - 30);
    if (filter === "3 Months") cutoff.setMonth(now.getMonth() - 3);
    if (filter === "1 Year") cutoff.setFullYear(now.getFullYear() - 1);
    
    const filteredOrders = sortedOrders.filter(o => new Date(o.date) >= cutoff);

    filteredOrders.forEach(order => {
      if (order.status === "CANCELLED" || order.status === "REFUNDED") return;
      
      const dateObj = new Date(order.date);
      // Format as "MMM D"
      const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (!grouped[dateStr]) {
        grouped[dateStr] = { revenue: 0, orders: 0 };
      }
      grouped[dateStr].revenue += order.total;
      grouped[dateStr].orders += 1;
    });

    return Object.keys(grouped).map(key => ({
      name: key,
      revenue: grouped[key].revenue,
      orders: grouped[key].orders
    }));
  }, [orders, filter]);

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
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
              <YAxis 
                yAxisId="left" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#6b7280' }} 
                tickFormatter={(value) => `₹${value >= 1000 ? value / 1000 + 'k' : value}`}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#2d2d2d" strokeWidth={2} dot={{ r: 4, fill: '#2d2d2d' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <p>No sales data available for this period.</p>
          </div>
        )}
      </div>
    </div>
  );
}
