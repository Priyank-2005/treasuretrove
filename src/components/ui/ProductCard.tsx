"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/data/products";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group flex flex-col cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-brand-champagne mb-4 overflow-hidden">
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 bg-brand-charcoal text-white text-[10px] px-2 py-1 tracking-widest font-medium">
            {product.badge}
          </span>
        )}
        
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >
          <Heart
            className={cn("w-4 h-4 transition-colors", isWishlisted ? "fill-brand-charcoal text-brand-charcoal" : "text-brand-charcoal")}
          />
        </button>

        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            className="object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={`${product.name} alternate view`}
              fill
              className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Quick Add Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="absolute bottom-0 left-0 w-full bg-brand-charcoal/90 backdrop-blur-sm text-white py-3 text-xs tracking-widest uppercase font-medium translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          Add to Cart
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-brand-charcoal group-hover:text-brand-gold transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg text-brand-charcoal">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}
