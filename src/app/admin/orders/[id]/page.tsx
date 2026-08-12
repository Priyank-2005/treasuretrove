"use client";

import { useAdmin } from "@/context/AdminContext";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Package, Truck, Printer, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import Image from "next/image";
import { use } from "react";
import { OrderStatus } from "@/data/admin/orders";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { orders, updateOrderStatus } = useAdmin();
  
  const order = orders.find(o => o.id === resolvedParams.id);

  if (!order) {
    notFound();
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateOrderStatus(order.id, e.target.value as OrderStatus);
  };

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
              <h1 className="text-2xl font-semibold text-gray-900">{order.id}</h1>
              <StatusBadge status={order.status} />
              <StatusBadge status={order.paymentStatus} />
            </div>
            <p className="text-gray-500 mt-1">
              Placed on {new Date(order.date).toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2 py-2 px-4">
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
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
                {order.items.map((item, idx) => (
                  <li key={idx} className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 relative border border-gray-200 rounded overflow-hidden bg-white flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/admin/products/${item.productId}`} className="font-medium text-gray-900 hover:underline">
                        {item.name}
                      </Link>
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
                  value={order.status}
                  onChange={handleStatusChange}
                  className="w-full bg-white border-gray-300 rounded-md shadow-sm focus:ring-brand-charcoal focus:border-brand-charcoal text-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
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
                <Link href={`/admin/customers/${order.customerId}`} className="font-medium text-brand-charcoal hover:underline text-base">
                  {order.customerName}
                </Link>
              </div>
              
              <div>
                <p className="text-gray-500 text-xs uppercase font-medium tracking-wider mb-1">Contact</p>
                <a href={`mailto:${order.customerEmail}`} className="text-gray-900 hover:underline block">{order.customerEmail}</a>
              </div>
              
              <div>
                <p className="text-gray-500 text-xs uppercase font-medium tracking-wider mb-1">Shipping Address</p>
                <p className="text-gray-900 whitespace-pre-wrap">{order.shippingAddress}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-6">
            <h2 className="font-medium text-gray-900 mb-4 border-b border-gray-100 pb-2">Payment</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Method</span>
                <span className="font-medium text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <StatusBadge status={order.paymentStatus} />
              </div>
              {order.transactionId && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-mono text-xs text-gray-900 bg-gray-100 px-1 py-0.5 rounded">{order.transactionId}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
