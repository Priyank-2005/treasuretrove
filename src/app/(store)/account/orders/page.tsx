"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { CUSTOMER_ORDERS } from "@/data/customer/orders";
import type { Order } from "@/data/admin/orders";

type FilterTab = "All" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
const TABS: FilterTab[] = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");

  const filteredOrders = CUSTOMER_ORDERS.filter((order) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Processing") return ["Pending", "Confirmed", "Processing"].includes(order.status);
    return order.status === activeFilter;
  });

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">Delivered</span>;
      case "Processing":
      case "Shipped":
        return <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">{status}</span>;
      case "Pending":
      case "Confirmed":
        return <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">{status}</span>;
      case "Cancelled":
      case "Refunded":
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="flex items-baseline justify-between mb-8">
        <h1 className="font-serif text-3xl text-base-dark">My Orders</h1>
        <span className="text-text-light-muted">{CUSTOMER_ORDERS.length} orders</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
              activeFilter === tab
                ? "bg-base-dark text-white border border-base-dark"
                : "bg-transparent border border-gold-mid/30 text-text-light-muted hover:border-gold-mid"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-base-light border border-gold-mid/20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-highlight/30 text-gold-mid mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-xl text-base-dark mb-2">No orders found</h2>
          <p className="text-text-light-muted mb-6">You don't have any {activeFilter.toLowerCase()} orders yet.</p>
          <Link href="/products" className="btn-pill inline-flex items-center">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => {
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
            const firstItems = order.items.slice(0, 3);
            const remainingCount = order.items.length - 3;

            return (
              <div key={order.id} className="bg-base-light border border-gold-mid/20 p-6 hover:shadow-soft transition group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-gold-mid/10">
                  <div>
                    <h3 className="font-medium text-base-dark mb-1">Order #{order.id}</h3>
                    <p className="text-sm text-text-light-muted">{formatDate(order.date)}</p>
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  {firstItems.map((item: any, i: number) => (
                    <div key={item.id || i} className="relative w-12 h-12 rounded border border-gold-mid/20 overflow-hidden bg-white">
                      <Image
                        src={item.product?.images?.[0] || "/placeholder.jpg"}
                        alt={item.product?.name || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {remainingCount > 0 && (
                    <div className="w-12 h-12 rounded border border-gold-mid/20 bg-gray-50 flex items-center justify-center text-xs text-text-light-muted font-medium">
                      +{remainingCount} more
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-sm text-text-light-muted">{itemCount} items</span>
                    <span className="font-serif text-lg font-medium text-base-dark">
                      ₹{order.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="text-gold-mid hover:text-base-dark inline-flex items-center text-sm font-medium transition-colors"
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
