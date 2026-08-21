"use client";

import { useState, useEffect } from "react";
import { SalesChart } from "@/components/admin/SalesChart";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setDbOrders(data.orders || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load orders for analytics");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-charcoal" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Detailed performance metrics for your store.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SalesChart orders={dbOrders} />
      </div>
    </div>
  );
}
