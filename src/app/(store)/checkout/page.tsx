"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Tag, X, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod",
  });

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Pre-fill delivery address from user's default address
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/account/addresses')
        .then(res => res.json())
        .then((data) => {
          const addresses = data.addresses || [];
          if (addresses.length > 0) {
            const defaultAddr = addresses[0]; // sorted by isDefault desc
            setFormData(prev => ({
              ...prev,
              address: defaultAddr.address || "",
              city: defaultAddr.city || "",
              state: defaultAddr.state || "",
              pincode: defaultAddr.pincode || "",
              phone: defaultAddr.phone || prev.phone,
            }));
          }
        })
        .catch(err => console.error('Failed to load addresses:', err));
    }
  }, [isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, orderTotal: subtotal }),
      });

      const data = await res.json();

      if (data.valid) {
        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          discountAmount: data.discountAmount,
        });
        setCouponError("");
      } else {
        setCouponError(data.error || "Invalid coupon");
        setAppliedCoupon(null);
      }
    } catch (error) {
      setCouponError("Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // First validate cart stock/prices
      const validateRes = await fetch("/api/cart/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
        }),
      });

      const validateData = await validateRes.json();

      if (!validateData.valid) {
        setSubmitError(
          validateData.issues?.map((i: any) => i.message).join(". ") ||
          "Cart validation failed"
        );
        setIsSubmitting(false);
        return;
      }

      // Create order in DB (status: PENDING)
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.images[0],
          })),
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
          paymentMethod: formData.paymentMethod,
          couponCode: appliedCoupon?.code || null,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        setSubmitError(orderData.error || "Failed to place order");
        setIsSubmitting(false);
        return;
      }

      // If COD, we are done
      if (formData.paymentMethod === 'cod') {
        clearCart();
        router.push(`/order-success?order=${orderData.order.orderNumber}`);
        return;
      }

      // --- Online Payment (Razorpay) Flow ---
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setSubmitError("Failed to load payment gateway. Please check your connection.");
        setIsSubmitting(false);
        return;
      }

      // Create Razorpay order
      const rpOrderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderData.order.id }),
      });

      const rpOrderData = await rpOrderRes.json();

      if (!rpOrderData.success) {
        setSubmitError(rpOrderData.error || "Failed to initialize payment");
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: rpOrderData.amount,
        currency: rpOrderData.currency,
        name: "Treasure Trove",
        description: `Order #${rpOrderData.orderNumber}`,
        order_id: rpOrderData.razorpayOrderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.order.id,
              }),
            });

            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              clearCart();
              router.push(`/order-success?order=${rpOrderData.orderNumber}`);
            } else {
              setSubmitError("Payment verification failed. If money was deducted, it will be refunded.");
            }
          } catch (err) {
            setSubmitError("Payment verification failed.");
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#2b2b2b",
        },
        modal: {
          ondismiss: function() {
            setSubmitError("Payment cancelled. You can try again or choose COD.");
            setIsSubmitting(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setSubmitError(`Payment failed: ${response.error.description}`);
        setIsSubmitting(false);
      });
      rzp.open();

    } catch (error) {
      console.error("Checkout error:", error);
      setSubmitError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const discount = appliedCoupon?.discountAmount || 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

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

      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-8 text-sm">
          <p className="font-medium">⚠ {submitError}</p>
        </div>
      )}

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
                  <option value="GJ">Gujarat</option>
                  <option value="RJ">Rajasthan</option>
                  <option value="UP">Uttar Pradesh</option>
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
                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleChange} className="w-4 h-4 accent-brand-charcoal" />
                  <span className="font-medium">Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-gray-300 cursor-pointer hover:bg-brand-champagne transition-colors">
                  <input type="radio" name="paymentMethod" value="online" checked={formData.paymentMethod === "online"} onChange={handleChange} className="w-4 h-4 accent-brand-charcoal" />
                  <span className="font-medium">Pay Online (UPI, Cards, Netbanking)</span>
                </label>
              </div>
            </section>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary py-4 text-base w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Place Order — ₹${total.toLocaleString("en-IN")}`
              )}
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
                    <p className="font-medium text-sm mt-1">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code */}
            <div className="mb-6">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      {appliedCoupon.code} — ₹{appliedCoupon.discountAmount} off
                    </span>
                  </div>
                  <button onClick={removeCoupon} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center border border-gray-300 bg-white">
                    <Tag className="w-4 h-4 text-gray-400 ml-3" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError("");
                      }}
                      placeholder="Coupon code"
                      className="flex-1 p-3 bg-transparent focus:outline-none text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-3 bg-brand-charcoal text-white text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50"
                  >
                    {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-red-500 text-xs mt-2">{couponError}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 text-sm text-gray-600 mb-6">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-medium text-brand-charcoal">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span>Shipping</span>
                <span className="font-medium text-brand-charcoal">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-6 border-t border-gray-300">
              <span className="font-medium text-lg text-brand-charcoal">Total</span>
              <span className="font-serif text-2xl font-medium text-brand-charcoal">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
