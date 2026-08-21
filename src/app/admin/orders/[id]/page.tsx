"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, Package, Printer, Loader2 } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import Image from "next/image";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setOrder(data.order);
      })
      .catch(() => setError("Failed to fetch order"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-6">{error || "The requested order does not exist."}</p>
        <Link href="/admin/orders" className="btn-primary">Back to Orders</Link>
      </div>
    );
  }

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setUpdating(true);
    
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      
      if (data.success) {
        setOrder(data.order);
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const fulfillmentStatus = order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase();
  const pStatus = order.payment?.status || 'Pending';
  const paymentStatus = pStatus.charAt(0).toUpperCase() + pStatus.slice(1).toLowerCase();
  const pMethod = order.payment?.method || 'N/A';
  const shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">{order.orderNumber}</h1>
              <StatusBadge status={fulfillmentStatus as any} />
              <StatusBadge status={paymentStatus as any} />
            </div>
            <p className="text-gray-500 mt-1">
              Placed on {new Date(order.date).toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/account/orders/${order.id}/invoice`} target="_blank" className="btn-secondary flex items-center gap-2 py-2 px-4">
            <Printer className="w-4 h-4" /> Print Invoice
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Items */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
              <h2 className="font-medium text-gray-900">Order Items</h2>
              <span className="text-sm text-gray-500">{order.items.length} items</span>
            </div>
            <div className="p-0">
              <ul className="divide-y divide-gray-200">
                {order.items.map((item: any, idx: number) => (
                  <li key={idx} className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 relative border border-gray-200 rounded overflow-hidden bg-white flex-shrink-0">
                      <Image src={item.image || "/images/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                      <div className="text-sm text-gray-500 mt-1">₹{item.price.toLocaleString('en-IN')} each</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50/50">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? "Free" : `₹${order.shipping}`}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-medium pt-2 border-t border-gray-200 mt-2">
                  <span>Total</span>
                  <span className="text-lg">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fulfillment Status */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-900">Update Status</h2>
            </div>
            
            <div className="flex items-center gap-4 p-4 border border-blue-100 bg-blue-50/50 rounded-md">
              <Package className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <select 
                  value={order.status.toUpperCase()}
                  onChange={handleStatusChange}
                  disabled={updating}
                  className="w-full bg-white border-gray-300 rounded-md shadow-sm focus:ring-brand-charcoal focus:border-brand-charcoal text-sm disabled:opacity-50"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">Updating the status will send a notification email to the customer (Simulated).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* Customer Details */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-6">
            <h2 className="font-medium text-gray-900 mb-4 border-b border-gray-100 pb-2">Customer</h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-brand-charcoal text-base">
                  {order.customerName}
                </p>
              </div>
              
              <div>
                <p className="text-gray-500 text-xs uppercase font-medium tracking-wider mb-1">Contact</p>
                <a href={`mailto:${order.customerEmail}`} className="text-gray-900 hover:underline block">{order.customerEmail}</a>
              </div>
              
              <div>
                <p className="text-gray-500 text-xs uppercase font-medium tracking-wider mb-1">Shipping Address</p>
                {shippingAddress ? (
                  <div className="text-gray-900 leading-relaxed">
                    <p>{shippingAddress.name}</p>
                    <p>{shippingAddress.address}</p>
                    <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</p>
                    <p>{shippingAddress.phone}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          {order.payment && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-6">
              <h2 className="font-medium text-gray-900 mb-4 border-b border-gray-100 pb-2">Payment</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium text-gray-900">{pMethod.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status</span>
                  <StatusBadge status={paymentStatus as any} />
                </div>
                {order.payment.transactionId && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Transaction ID</span>
                    <span className="font-mono text-xs text-gray-900 bg-gray-100 px-1 py-0.5 rounded">{order.payment.transactionId}</span>
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
