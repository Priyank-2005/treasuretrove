"use client";

import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export function CartDrawer() {
  const { isDrawerOpen, setIsDrawerOpen, items, removeFromCart, updateQuantity, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-brand-ivory z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-brand-champagne">
              <h2 className="font-serif text-2xl">Your Bag ({items.length})</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-brand-champagne transition-colors rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 text-gray-500">
                  <ShoppingBag className="w-12 h-12 stroke-1" />
                  <p>Your jewelry box is waiting.</p>
                  <button onClick={() => setIsDrawerOpen(false)} className="btn-primary mt-4">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 border-b border-brand-champagne pb-6 last:border-0">
                    <div className="relative w-24 h-24 bg-brand-champagne flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between gap-2">
                        <Link href={`/product/${item.product.slug}`} onClick={() => setIsDrawerOpen(false)} className="font-medium hover:text-brand-gold transition-colors">
                          {item.product.name}
                        </Link>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-gray-400 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">{item.product.category}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-gray-300">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-brand-champagne"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-1 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-brand-champagne"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-medium">₹{item.product.price}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-brand-champagne bg-brand-ivory">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-serif text-xl font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-xs text-center text-gray-500 mb-4">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="flex flex-col gap-3">
                  <Link href="/cart" onClick={() => setIsDrawerOpen(false)} className="btn-secondary text-center">
                    View Cart
                  </Link>
                  <Link href="/checkout" onClick={() => setIsDrawerOpen(false)} className="btn-primary text-center">
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
