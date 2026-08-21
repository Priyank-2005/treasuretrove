"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/account/orders/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else {
          setOrder(data.order);
          // Automatically trigger print dialog once data is loaded (optional, but nice UX)
          setTimeout(() => window.print(), 500);
        }
      })
      .catch(() => setError("Failed to load invoice"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl mb-4">Invoice not found</h2>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  const shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : null;
  const payment = order.payment;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 print:p-0 print:max-w-full">
      {/* Print Button (Hidden when printing) */}
      <div className="flex justify-end mb-8 print:hidden">
        <button 
          onClick={() => window.print()} 
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
        >
          Print Invoice
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
        <div>
          <h1 className="text-3xl font-serif mb-2">Treasure Trove</h1>
          <p className="text-sm text-gray-500">Premium Jewelry Collection</p>
          <p className="text-sm text-gray-500 mt-2">123 Fashion Street, Mumbai, 400001</p>
          <p className="text-sm text-gray-500">support@treasuretrove.com</p>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-bold text-gray-200 uppercase tracking-wider mb-2">Invoice</h2>
          <p className="font-medium text-lg">Order #{order.orderNumber}</p>
          <p className="text-sm text-gray-500">Date: {formatDate(order.date)}</p>
          <p className="text-sm text-gray-500 mt-1">Status: {order.status}</p>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 border-b border-gray-200 pb-2">Billed To</h3>
          <div className="text-sm">
            <p className="font-medium mb-1">{order.customerName}</p>
            <p className="text-gray-600">{order.customerEmail}</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 border-b border-gray-200 pb-2">Shipped To</h3>
          {shippingAddress ? (
            <div className="text-sm text-gray-600 leading-relaxed">
              <p className="font-medium text-gray-900">{shippingAddress.name}</p>
              <p>{shippingAddress.address}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</p>
              <p className="mt-1">{shippingAddress.phone}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No shipping address</p>
          )}
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-12">
        <thead>
          <tr className="border-b-2 border-gray-900 text-left">
            <th className="py-3 px-2 text-sm font-bold uppercase tracking-wider text-gray-600">Item</th>
            <th className="py-3 px-2 text-sm font-bold uppercase tracking-wider text-gray-600 text-center">Qty</th>
            <th className="py-3 px-2 text-sm font-bold uppercase tracking-wider text-gray-600 text-right">Price</th>
            <th className="py-3 px-2 text-sm font-bold uppercase tracking-wider text-gray-600 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {order.items.map((item: any, i: number) => (
            <tr key={i}>
              <td className="py-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 bg-gray-50 border border-gray-100 print:hidden">
                    <Image src={item.image || "/images/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
              </td>
              <td className="py-4 px-2 text-center text-sm">{item.quantity}</td>
              <td className="py-4 px-2 text-right text-sm">₹{item.price.toLocaleString("en-IN")}</td>
              <td className="py-4 px-2 text-right text-sm font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary & Payment */}
      <div className="flex justify-between items-start">
        <div className="w-1/2">
          {payment && (
            <div className="bg-gray-50 p-4 rounded text-sm print:bg-transparent print:p-0 print:border-none">
              <h3 className="font-bold text-gray-600 uppercase tracking-wider mb-2">Payment Details</h3>
              <p className="mb-1"><span className="text-gray-500 w-24 inline-block">Method:</span> <span className="font-medium">{payment.method.toUpperCase()}</span></p>
              <p className="mb-1"><span className="text-gray-500 w-24 inline-block">Status:</span> <span className="font-medium">{payment.status}</span></p>
              {payment.transactionId && (
                <p><span className="text-gray-500 w-24 inline-block">Transaction:</span> <span className="font-medium text-xs">{payment.transactionId}</span></p>
              )}
            </div>
          )}
        </div>
        <div className="w-1/3">
          <div className="space-y-3 text-sm border-b border-gray-200 pb-4 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{order.discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span>{order.shipping === 0 ? "FREE" : `₹${order.shipping.toLocaleString("en-IN")}`}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-2xl">₹{order.total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>Thank you for shopping with Treasure Trove.</p>
        <p>This is a computer generated invoice and does not require a signature.</p>
      </div>
    </div>
  );
}
