"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, Loader2 } from "lucide-react";

type FilterTab = "All" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
const TABS: FilterTab[] = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch('/api/account/orders')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setOrders(data.orders || []);
        }
      })
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "All") return true;
    const status = order.status.toUpperCase();
    if (activeFilter === "Processing") return ["PENDING", "CONFIRMED", "PROCESSING"].includes(status);
    return status === activeFilter.toUpperCase();
  });

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">Delivered</span>;
      case "PROCESSING":
      case "SHIPPED":
        return <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">{status}</span>;
      case "PENDING":
      case "CONFIRMED":
        return <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">{status}</span>;
      case "CANCELLED":
      case "REFUNDED":
        return <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600">{status}</span>;
      default:
        return <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-charcoal" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="flex items-baseline justify-between mb-8">
        <h1 className="font-serif text-3xl text-brand-charcoal">My Orders</h1>
        <span className="text-gray-500">{orders.length} orders</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
              activeFilter === tab
                ? "bg-brand-charcoal text-white border border-brand-charcoal"
                : "bg-transparent border border-gray-300 text-gray-500 hover:border-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-brand-champagne/30 border border-brand-champagne">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-champagne text-brand-gold mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-xl text-brand-charcoal mb-2">No orders found</h2>
          <p className="text-gray-500 mb-6">You don't have any {activeFilter.toLowerCase()} orders yet.</p>
          <Link href="/shop" className="btn-primary inline-flex items-center">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => {
            const itemCount = order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
            const firstItems = order.items.slice(0, 3);
            const remainingCount = order.items.length - 3;

            return (
              <div key={order.id} className="bg-white border border-gray-200 p-6 hover:shadow-soft transition group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-brand-charcoal mb-1">Order #{order.orderNumber}</h3>
                    <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  {firstItems.map((item: any, i: number) => (
                    <div key={item.id || i} className="relative w-12 h-12 rounded border border-gray-200 overflow-hidden bg-white">
                      <Image
                         src={item.image || "/images/placeholder.jpg"}
                        alt={item.name || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {remainingCount > 0 && (
                    <div className="w-12 h-12 rounded border border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-500 font-medium">
                      +{remainingCount} more
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">{itemCount} items</span>
                    <span className="font-serif text-lg font-medium text-brand-charcoal">
                      ₹{order.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="text-brand-gold hover:text-brand-charcoal inline-flex items-center text-sm font-medium transition-colors"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
