"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS, Product } from "@/data/products";
import Link from "next/link";
import Image from "next/image";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (query.length > 2) {
      const q = query.toLowerCase();
      const filtered = PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      );
      setResults(filtered.slice(0, 4)); // Show top 4
    } else {
      setResults([]);
    }
  }, [query]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-brand-ivory/95 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl flex flex-col h-full">
            <div className="flex justify-between items-center mb-12">
              <div className="relative w-full max-w-2xl mx-auto flex items-center border-b-2 border-brand-charcoal">
                <Search className="w-6 h-6 text-brand-charcoal absolute left-0" />
                <input
                  type="text"
                  placeholder="Search for jewelry, collections..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent py-4 pl-12 pr-4 text-xl md:text-2xl font-serif focus:outline-none placeholder:text-gray-400"
                />
              </div>
              <button
                onClick={onClose}
                className="absolute top-8 right-8 md:right-16 p-2 rounded-full hover:bg-brand-champagne transition-colors"
              >
                <X className="w-8 h-8 text-brand-charcoal" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar">
              {query.length > 2 && results.length === 0 ? (
                <div className="text-center text-gray-500 mt-12 text-lg">
                  No pieces found matching "{query}".
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {results.map((product) => (
                    <Link
                      href={`/product/${product.slug}`}
                      key={product.id}
                      onClick={onClose}
                      className="group cursor-pointer flex flex-col"
                    >
                      <div className="relative aspect-[4/5] bg-brand-champagne mb-4 overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <h4 className="font-medium text-sm md:text-base group-hover:text-brand-gold transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-gray-500 text-sm mt-1">₹{product.price}</p>
                    </Link>
                  ))}
                </div>
              )}
              {query.length <= 2 && (
                <div className="mt-8 text-center text-gray-500">
                  <p>Popular Searches:</p>
                  <div className="flex flex-wrap justify-center gap-4 mt-6">
                    {["Hoops", "Tennis Bracelet", "Pearl", "Anti-Tarnish"].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:border-brand-charcoal transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
