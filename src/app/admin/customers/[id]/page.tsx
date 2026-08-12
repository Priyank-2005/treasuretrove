"use client";

import { useAdmin } from "@/context/AdminContext";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function CustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { customers, orders } = useAdmin();
  
  const customer = customers.find(c => c.id === resolvedParams.id);

  if (!customer) {
    notFound();
  }

  const customerOrders = orders.filter(o => o.customerId === customer.id);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/customers" className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{customer.name}</h1>
          <p className="text-gray-500 mt-1">Customer since {new Date(customer.joinedDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-brand-charcoal text-white flex items-center justify-center text-2xl font-semibold mb-4">
              {customer.name.charAt(0)}
            </div>
            <h2 className="text-lg font-medium text-gray-900">{customer.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{customer.id}</p>
          </div>
          
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <a href={`mailto:${customer.email}`} className="text-gray-900 hover:underline">{customer.email}</a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <a href={`tel:${customer.phone}`} className="text-gray-900 hover:underline">{customer.phone}</a>
            </div>
          </div>
        </div>
        
        {/* Lifetime Value */}
        <div className="md:col-span-2 grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">Total Orders</span>
            </div>
            <p className="text-3xl font-semibold text-gray-900">{customer.orders}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <span className="text-sm font-medium uppercase tracking-wider">Total Spent</span>
            </div>
            <p className="text-3xl font-semibold text-gray-900">₹{customer.totalSpent.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Order History</h2>
        </div>
        <div className="overflow-x-auto">
          {customerOrders.length > 0 ? (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customerOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-charcoal">
                      <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs">{order.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-gray-500 text-sm">
              This customer hasn't placed any orders yet (in the demo dataset).
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
