"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "upi",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    // Simulate order placement
    clearCart();
    router.push("/order-success");
  };

  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  // Protect checkout route if cart is empty
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-3xl mb-4">Your bag is empty</h1>
        <p className="text-gray-500 mb-8">You need items in your bag to proceed to checkout.</p>
        <button onClick={() => router.push("/shop")} className="btn-primary">Return to Shop</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <Breadcrumb items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />

      <h1 className="font-serif text-4xl md:text-5xl font-medium mb-12">Checkout</h1>
      
      <div className="bg-brand-gold-light/30 border border-brand-gold/30 text-brand-charcoal p-4 mb-8 text-sm text-center">
        <p className="font-medium">Demo checkout — payment processing will be connected in the production version.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Checkout Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            {/* Contact Info */}
            <section>
              <h2 className="text-xl font-medium mb-6 uppercase tracking-wider border-b border-brand-champagne pb-2">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="p-3 border border-gray-300 focus:outline-none focus:border-brand-charcoal bg-transparent" />
                <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="p-3 border border-gray-300 focus:outline-none focus:border-brand-charcoal bg-transparent" />
                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="p-3 border border-gray-300 focus:outline-none focus:border-brand-charcoal bg-transparent md:col-span-2" />
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Mobile Number" className="p-3 border border-gray-300 focus:outline-none focus:border-brand-charcoal bg-transparent md:col-span-2" />
              </div>
            </section>

            {/* Delivery Address */}
            <section>
              <h2 className="text-xl font-medium mb-6 uppercase tracking-wider border-b border-brand-champagne pb-2">Delivery Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" className="p-3 border border-gray-300 focus:outline-none focus:border-brand-charcoal bg-transparent md:col-span-2" />
                <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="p-3 border border-gray-300 focus:outline-none focus:border-brand-charcoal bg-transparent" />
                <select required name="state" value={formData.state} onChange={handleChange} className="p-3 border border-gray-300 focus:outline-none focus:border-brand-charcoal bg-transparent text-gray-500">
                  <option value="" disabled>State / Province</option>
                  <option value="MH">Maharashtra</option>
                  <option value="KA">Karnataka</option>
                  <option value="DL">Delhi</option>
                  <option value="TN">Tamil Nadu</option>
                  <option value="OTHER">Other</option>
                </select>
                <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="PIN Code" className="p-3 border border-gray-300 focus:outline-none focus:border-brand-charcoal bg-transparent" />
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-xl font-medium mb-6 uppercase tracking-wider border-b border-brand-champagne pb-2">Payment Method</h2>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 p-4 border border-gray-300 cursor-pointer hover:bg-brand-champagne transition-colors">
                  <input type="radio" name="paymentMethod" value="upi" checked={formData.paymentMethod === "upi"} onChange={handleChange} className="w-4 h-4 accent-brand-charcoal" />
                  <span className="font-medium">UPI (GPay, PhonePe, Paytm)</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-gray-300 cursor-pointer hover:bg-brand-champagne transition-colors">
                  <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === "card"} onChange={handleChange} className="w-4 h-4 accent-brand-charcoal" />
                  <span className="font-medium">Credit / Debit Card</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-gray-300 cursor-pointer hover:bg-brand-champagne transition-colors">
                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleChange} className="w-4 h-4 accent-brand-charcoal" />
                  <span className="font-medium">Cash on Delivery (COD)</span>
                </label>
              </div>
            </section>

            <button type="submit" className="btn-primary py-4 text-base w-full mt-4">
              Place Order - ₹{total.toLocaleString('en-IN')}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-brand-champagne p-6 md:p-8 sticky top-24">
            <h2 className="font-serif text-2xl font-medium mb-6">Order Summary</h2>
            
            <div className="flex flex-col gap-4 mb-6 max-h-80 overflow-y-auto hide-scrollbar border-b border-gray-300 pb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="relative w-16 h-16 bg-white flex-shrink-0">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    <span className="absolute -top-2 -right-2 bg-brand-charcoal text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                    <p className="text-gray-500 text-xs">{item.product.category}</p>
                    <p className="font-medium text-sm mt-1">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 text-sm text-gray-600 mb-6">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-medium text-brand-charcoal">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping</span>
                <span className="font-medium text-brand-charcoal">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-6 border-t border-gray-300">
              <span className="font-medium text-lg text-brand-charcoal">Total</span>
              <span className="font-serif text-2xl font-medium text-brand-charcoal">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
