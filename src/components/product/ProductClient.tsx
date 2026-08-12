"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Accordion } from "@/components/ui/Accordion";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { ProductCard } from "@/components/ui/ProductCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Heart, Star, CheckCircle2 } from "lucide-react";
import { POLICIES } from "@/data/categories";

export function ProductClient({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const accordionItems = [
    {
      title: "Description",
      content: product.description,
    },
    {
      title: "Materials",
      content: product.material,
    },
    {
      title: "Care Instructions",
      content: product.careInstructions,
    },
    {
      title: "Shipping & Returns",
      content: (
        <div className="space-y-4">
          <p><strong>Shipping:</strong> {POLICIES.shipping.content}</p>
          <p><strong>Returns:</strong> {POLICIES.returns.content}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.category, href: `/shop/${product.category.toLowerCase()}` },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mb-24">
        {/* Left: Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[4/5] bg-brand-champagne overflow-hidden">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-20 h-24 flex-shrink-0 bg-brand-champagne ${
                  selectedImage === idx ? "ring-2 ring-brand-charcoal" : "opacity-70 hover:opacity-100"
                } transition-all`}
              >
                <Image src={img} alt={`${product.name} view ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          {product.badge && (
            <span className="inline-block bg-brand-charcoal text-white text-[10px] px-2 py-1 tracking-widest font-medium self-start mb-4">
              {product.badge}
            </span>
          )}
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) ? "fill-brand-gold text-brand-gold" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 underline cursor-pointer">
              {product.reviewCount} reviews
            </span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="font-serif text-2xl text-brand-charcoal">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
            )}
            {product.discount && (
              <span className="text-sm font-medium text-red-600">Save {product.discount}%</span>
            )}
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {product.shortDescription}
          </p>

          <div className="flex flex-col gap-4 mb-10">
            <div className="flex gap-4 h-12">
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => setQuantity(q => q + 1)}
                onDecrease={() => setQuantity(q => q > 1 ? q - 1 : 1)}
              />
              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 btn-primary"
              >
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-12 border flex items-center justify-center transition-colors ${
                  isWishlisted ? "bg-brand-charcoal border-brand-charcoal text-white" : "border-brand-charcoal text-brand-charcoal hover:bg-brand-champagne"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
            </div>
            <button
              onClick={() => {
                addToCart(product, quantity);
                window.location.href = "/checkout";
              }}
              className="btn-secondary w-full"
            >
              Buy it Now
            </button>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-medium tracking-wide uppercase text-gray-600 mb-10 border-y border-brand-champagne py-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-gold" /> Anti-Tarnish
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-gold" /> Water Resistant
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-gold" /> Skin Friendly
            </div>
          </div>

          <Accordion items={accordionItems} />
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-brand-champagne pt-24">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl mb-4">You May Also Like</h2>
          </div>
          <ProductGrid>
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ProductGrid>
        </section>
      )}
    </div>
  );
}
