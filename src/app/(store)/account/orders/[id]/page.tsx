"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";
import { getCustomerOrderById, getOrderTimeline } from "@/data/customer/orders";
import { cn } from "@/lib/utils";
import type { Order } from "@/data/admin/orders";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const order = getCustomerOrderById(id);
  
  if (!order) {
    notFound();
  }

  const timeline = getOrderTimeline(order);

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
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <Link
        href="/account/orders"
        className="inline-flex items-center text-sm text-text-light-muted hover:text-base-dark transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-gold-mid/20">
        <div>
          <h1 className="font-serif text-3xl text-base-dark mb-2">Order #{order.id}</h1>
          <p className="text-text-light-muted">Placed on {formatDate(order.date)}</p>
        </div>
        <div>
          {getStatusBadge(order.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Timeline */}
          <div className="bg-base-light border border-gold-mid/20 p-6">
            <h2 className="font-serif text-xl text-base-dark mb-6">Order Status</h2>
            <div className="relative pl-4 border-l border-gold-mid/30 space-y-8 ml-2">
              {timeline.map((step: any, index: number) => {
                const isCompleted = step.status === "completed";
                const isActive = step.status === "active";
                const isTerminal = step.status === "terminal"; // Like cancelled/refunded
                
                return (
                  <div key={index} className="relative pl-6">
                    {/* Circle marker */}
                    <div 
                      className={cn(
                        "absolute -left-[33px] top-1 w-4 h-4 rounded-full",
                        isCompleted ? "bg-gold-mid" : 
                        isActive ? "bg-gold-mid ring-2 ring-gold-mid/30 ring-offset-2 ring-offset-base-light" : 
                        isTerminal ? "bg-red-500" :
                        "bg-base-light border border-gold-mid/30"
                      )}
                    />
                    
                    <div>
                      <p className={cn(
                        "font-medium",
                        isCompleted || isActive || isTerminal ? "text-base-dark font-bold" : "text-text-light-muted"
                      )}>
                        {step.label}
                      </p>
                      {step.date && isCompleted && (
                        <p className="text-sm text-text-light-muted mt-1">{formatDate(step.date)}</p>
                      )}
                      {step.description && (
                        <p className="text-sm text-text-light-muted mt-1">{step.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items */}
          <div className="bg-base-light border border-gold-mid/20 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-gold-mid" />
              <h2 className="font-serif text-xl text-base-dark">Items Ordered</h2>
            </div>
            
            <div className="divide-y divide-gold-mid/10">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="py-4 flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded border border-gold-mid/20 bg-white overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product?.images?.[0] || "/placeholder.jpg"}
                      alt={item.product?.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-medium text-base-dark truncate">{item.product?.name}</h3>
                    <p className="text-sm text-text-light-muted mb-1">{item.product?.category}</p>
                    <p className="text-sm text-text-light-muted">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-medium text-base-dark">₹{((item.price || item.product?.price || 0) * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Price Summary */}
          <div className="bg-base-light border border-gold-mid/20 p-6">
            <h2 className="font-serif text-xl text-base-dark mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm mb-4 pb-4 border-b border-gold-mid/10">
              <div className="flex justify-between text-text-light-muted">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-gold-mid">
                  <span>Discount</span>
                  <span>-₹{order.discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-text-light-muted">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? "FREE" : `₹${order.shipping.toLocaleString("en-IN")}`}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-base-dark">Total</span>
              <span className="font-serif text-2xl font-medium text-base-dark">₹{order.total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-base-light border border-gold-mid/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-gold-mid" />
              <h2 className="font-medium text-base-dark">Shipping Address</h2>
            </div>
            <p className="text-sm text-text-light-muted whitespace-pre-line leading-relaxed">
              {order.shippingAddress}
            </p>
          </div>

          {/* Payment Info */}
          <div className="bg-base-light border border-gold-mid/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-gold-mid" />
              <h2 className="font-medium text-base-dark">Payment Details</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-light-muted">Method</span>
                <span className="font-medium text-base-dark">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-light-muted">Status</span>
                <span className={cn(
                  "font-medium",
                  order.paymentStatus === "Paid" ? "text-green-600" :
                  order.paymentStatus === "Refunded" ? "text-gray-600" : "text-yellow-600"
                )}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.transactionId && (
                <div className="flex justify-between">
                  <span className="text-text-light-muted">Transaction ID</span>
                  <span className="font-medium text-base-dark">{order.transactionId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
