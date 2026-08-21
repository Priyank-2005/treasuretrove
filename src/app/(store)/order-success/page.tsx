"use client";

import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "TT00000";

  return (
    <div className="container mx-auto px-4 py-24 min-h-[70vh] flex items-center justify-center">
      <div className="max-w-xl w-full bg-brand-champagne p-8 md:p-16 text-center shadow-soft relative overflow-hidden">
        {/* Decorative elements */}
        <Sparkles className="absolute top-8 left-8 w-6 h-6 text-brand-gold opacity-50" />
        <Sparkles className="absolute bottom-8 right-8 w-8 h-8 text-brand-gold opacity-50" />
        
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-brand-charcoal" />
        </div>
        
        <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4">
          Order Confirmed ✨
        </h1>
        
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Thank you for shopping with Treasure Trove. Your beautiful new pieces are being prepared for shipment.
        </p>

        <div className="bg-white p-6 mb-10 text-left border border-gray-200">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Order Number</p>
          <p className="font-medium text-lg mb-4">#{orderNumber}</p>
          
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Estimated Delivery</p>
          <p className="font-medium text-lg">3–5 Business Days</p>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/account/orders" className="btn-secondary w-full block text-center">
            View My Orders
          </Link>
          <Link href="/shop" className="btn-primary w-full block text-center">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-24 text-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
