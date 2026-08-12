"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { Heart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />

      <h1 className="font-serif text-4xl md:text-5xl font-medium mb-12">Your Wishlist</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-6 bg-brand-champagne">
          <Heart className="w-16 h-16 stroke-1 text-brand-charcoal" />
          <h2 className="font-serif text-2xl font-medium">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-4">Save your favorite pieces here.</p>
          <Link href="/shop" className="btn-primary">
            Explore Collection
          </Link>
        </div>
      ) : (
        <ProductGrid columns={4}>
          {items.map((product) => (
            <div key={product.id} className="group flex flex-col relative">
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white text-brand-charcoal shadow-sm hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] bg-brand-champagne mb-4 block">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
              </Link>
              
              <Link href={`/product/${product.slug}`}>
                <h3 className="font-medium text-brand-charcoal group-hover:text-brand-gold transition-colors line-clamp-1 mb-1">
                  {product.name}
                </h3>
              </Link>
              <div className="font-serif text-lg text-brand-charcoal mb-4">₹{product.price}</div>
              
              <button
                onClick={() => addToCart(product)}
                className="btn-secondary w-full"
              >
                Move to Cart
              </button>
            </div>
          ))}
        </ProductGrid>
      )}
    </div>
  );
}
