"use client";

import { useCart } from "@/context/CartContext";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Your Bag" }]} />

      <h1 className="font-serif text-4xl md:text-5xl font-medium mb-12">Your Bag</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-6 bg-brand-champagne">
          <ShoppingBag className="w-16 h-16 stroke-1 text-brand-charcoal" />
          <h2 className="font-serif text-2xl font-medium">Your jewelry box is waiting.</h2>
          <p className="text-gray-600 mb-4">Discover our collection of everyday fine jewelry.</p>
          <Link href="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items List */}
          <div className="flex-1">
            <div className="hidden md:grid grid-cols-12 text-sm font-medium tracking-wider uppercase text-gray-500 border-b border-brand-champagne pb-4 mb-6">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            <div className="flex flex-col gap-6 md:gap-8">
              {items.map((item) => (
                <div key={item.product.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-brand-champagne pb-6 md:pb-8 last:border-0">
                  <div className="md:col-span-6 flex gap-4 md:gap-6">
                    <Link href={`/product/${item.product.slug}`} className="relative w-24 h-24 md:w-32 md:h-32 bg-brand-champagne flex-shrink-0 group">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    <div className="flex flex-col justify-center gap-2">
                      <Link href={`/product/${item.product.slug}`} className="font-medium hover:text-brand-gold transition-colors text-lg">
                        {item.product.name}
                      </Link>
                      <span className="text-sm text-gray-500">{item.product.category}</span>
                      <span className="md:hidden font-serif text-lg">₹{item.product.price}</span>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-sm text-gray-400 hover:text-red-500 self-start mt-2 flex items-center gap-1 transition-colors"
                      >
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="md:col-span-3 flex md:justify-center items-center">
                    <div className="flex items-center border border-gray-300">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-3 py-2 text-gray-600 hover:bg-brand-champagne transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-4 py-1 text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-3 py-2 text-gray-600 hover:bg-brand-champagne transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="hidden md:block md:col-span-3 text-right">
                    <span className="font-serif text-xl font-medium">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-brand-champagne p-8 sticky top-24">
              <h2 className="font-serif text-2xl font-medium mb-6">Order Summary</h2>
              
              <div className="flex flex-col gap-4 mb-6 text-sm text-gray-600 border-b border-gray-300 pb-6">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-medium text-brand-charcoal">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  <span className="font-medium text-brand-charcoal">{subtotal > 999 ? "FREE" : "₹99"}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="font-medium text-lg">Total</span>
                <span className="font-serif text-2xl font-medium text-brand-charcoal">
                  ₹{(subtotal + (subtotal > 999 ? 0 : 99)).toLocaleString('en-IN')}
                </span>
              </div>
              
              <Link href="/checkout" className="btn-primary w-full block text-center">
                Proceed to Checkout
              </Link>
              
              <p className="text-center text-xs text-gray-500 mt-4">
                Secure checkout. 14-day returns.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
