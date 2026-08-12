"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      showToast("Thank you for subscribing!");
      setEmail("");
    }
  };

  return (
    <section className="bg-brand-champagne py-24">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <h2 className="text-3xl md:text-4xl font-serif mb-4">
          A little sparkle in your inbox.
        </h2>
        <p className="text-gray-600 mb-8">
          Sign up for new arrivals, exclusive drops and special offers.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="flex-1 px-6 py-3 bg-white border border-transparent focus:border-brand-charcoal focus:outline-none placeholder:text-gray-400"
          />
          <button type="submit" className="btn-primary">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
