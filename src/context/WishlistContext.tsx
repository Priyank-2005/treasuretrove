"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/data/products";
import { useToast } from "./ToastContext";

interface WishlistContextType {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    
    // First try to load from API (DB)
    const loadWishlist = async () => {
      try {
        const res = await fetch('/api/wishlist');
        if (res.ok) {
          const data = await res.json();
          // If we got items from DB, use them and ignore local storage
          setItems(data.items || []);
          return;
        }
      } catch (e) {
        // Fall back to local storage
      }
      
      // Fallback to local storage if API fails or user is not logged in (empty response)
      const savedWishlist = localStorage.getItem("treasuretrove_wishlist");
      if (savedWishlist) {
        try {
          setItems(JSON.parse(savedWishlist));
        } catch (e) {
          console.error("Failed to parse wishlist", e);
        }
      }
    };
    
    loadWishlist();
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("treasuretrove_wishlist", JSON.stringify(items));
    }
  }, [items, isMounted]);

  const toggleWishlist = async (product: Product) => {
    const exists = items.some((item) => item.id === product.id);
    
    // Optimistic UI update
    setItems((prev) => {
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });

    if (exists) {
      showToast("Removed from wishlist");
      try {
        await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        });
      } catch (e) {}
    } else {
      showToast("Added to wishlist");
      try {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        });
      } catch (e) {}
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  const wishlistCount = items.length;

  return (
    <WishlistContext.Provider
      value={{ items, toggleWishlist, isInWishlist, wishlistCount }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
