"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, MapPin, CreditCard, Printer, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/account/orders/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setOrder(data.order);
      })
      .catch(() => setError("Failed to load order details"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-charcoal" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-2xl mb-4">Order not found</h2>
        <p className="text-gray-500 mb-8">{error || "The order you are looking for does not exist."}</p>
        <Link href="/account/orders" className="btn-primary">Back to Orders</Link>
      </div>
    );
  }

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
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : null;
  const payment = order.payment;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/account/orders"
          className="inline-flex items-center text-sm text-gray-500 hover:text-brand-charcoal transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>
        <Link
          href={`/account/orders/${order.id}/invoice`}
          target="_blank"
          className="inline-flex items-center px-4 py-2 bg-brand-champagne text-brand-charcoal text-sm font-medium hover:bg-brand-gold/20 transition-colors"
        >
          <Printer className="w-4 h-4 mr-2" />
          Invoice
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-gray-200">
        <div>
          <h1 className="font-serif text-3xl text-brand-charcoal mb-2">Order #{order.orderNumber}</h1>
          <p className="text-gray-500">Placed on {formatDate(order.date)}</p>
        </div>
        <div>
          {getStatusBadge(order.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Items */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-brand-gold" />
              <h2 className="font-serif text-xl text-brand-charcoal">Items Ordered</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="py-4 flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded border border-gray-200 bg-white overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/images/placeholder.jpg"}
                      alt={item.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-medium text-brand-charcoal truncate">{item.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-medium text-brand-charcoal">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Price Summary */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="font-serif text-xl text-brand-charcoal mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm mb-4 pb-4 border-b border-gray-100">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? "FREE" : `₹${order.shipping.toLocaleString("en-IN")}`}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-brand-charcoal">Total</span>
              <span className="font-serif text-2xl font-medium text-brand-charcoal">₹{order.total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Shipping Address */}
          {shippingAddress && (
            <div className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-brand-gold" />
                <h2 className="font-medium text-brand-charcoal">Shipping Address</h2>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                <p className="font-medium text-brand-charcoal">{shippingAddress.name}</p>
                <p>{shippingAddress.address}</p>
                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</p>
                <p className="mt-2">Phone: {shippingAddress.phone}</p>
                <p>Email: {shippingAddress.email}</p>
              </div>
            </div>
          )}

          {/* Payment Info */}
          {payment && (
            <div className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-brand-gold" />
                <h2 className="font-medium text-brand-charcoal">Payment Details</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium text-brand-charcoal">{payment.method.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={cn(
                    "font-medium",
                    payment.status === "COMPLETED" ? "text-green-600" :
                    payment.status === "FAILED" ? "text-red-600" : "text-yellow-600"
                  )}>
                    {payment.status}
                  </span>
                </div>
                {payment.transactionId && (
                  <div className="flex justify-between mt-2 pt-2 border-t border-gray-100">
                    <span className="text-gray-500 text-xs mt-1">TXN ID</span>
                    <span className="font-medium text-xs break-all text-right max-w-[150px]">{payment.transactionId}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
