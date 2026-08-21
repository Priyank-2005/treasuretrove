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
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-base-light text-base-dark z-50 shadow-2xl flex flex-col border-l border-gold-mid/20"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gold-mid/20">
              <h2 className="font-serif text-3xl font-light tracking-wide">Your Bag ({items.length})</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gold-mid/10 transition-colors rounded-full">
                <X className="w-5 h-5 text-base-dark" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 text-text-light-muted">
                  <ShoppingBag className="w-12 h-12 stroke-1 text-gold-mid" />
                  <p className="font-sans text-sm">Your jewelry box is waiting.</p>
                  <button onClick={() => setIsDrawerOpen(false)} className="btn-pill mt-4 w-full">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 border-b border-gold-mid/10 pb-6 last:border-0">
                    <div className="relative w-24 h-24 bg-gold-mid/10 flex-shrink-0 border border-gold-mid/20">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between gap-2">
                        <Link href={`/product/${item.product.slug}`} onClick={() => setIsDrawerOpen(false)} className="font-serif text-lg hover:text-gold-mid transition-colors">
                          {item.product.name}
                        </Link>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-base-dark/40 hover:text-base-dark">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-sans text-xs text-text-light-muted uppercase tracking-wider">{item.product.category}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-gold-mid/30">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-1 text-base-dark hover:bg-gold-mid/10 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-1 text-sm font-sans">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-1 text-base-dark hover:bg-gold-mid/10 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-sans text-sm font-medium">₹{item.product.price}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gold-mid/20 bg-base-light/95 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-sans text-sm uppercase tracking-widest text-text-light-muted">Subtotal</span>
                  <span className="font-sans font-medium text-lg">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-xs text-center font-sans text-text-light-muted mb-6">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="flex flex-col gap-3">
                  <Link href="/cart" onClick={() => setIsDrawerOpen(false)} className="btn-pill-light w-full">
                    View Cart
                  </Link>
                  <Link href="/checkout" onClick={() => setIsDrawerOpen(false)} className="btn-pill w-full">
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
