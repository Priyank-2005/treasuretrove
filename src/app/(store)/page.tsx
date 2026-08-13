import { HeroSection } from "@/components/home/HeroSection";
import { TrustSection } from "@/components/home/TrustSection";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { Newsletter } from "@/components/ui/Newsletter";
import { PRODUCTS } from "@/data/products";
import { REVIEWS } from "@/data/categories";
import { ReviewCard } from "@/components/ui/ReviewCard";
import Link from "next/link";
import Image from "next/image";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Home() {
  const newArrivals = PRODUCTS.filter((p) => p.isNew).slice(0, 4);
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <>
      <HeroSection />
      <TrustSection />

      {/* New Arrivals */}
      <section className="py-24 bg-brand-ivory">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="font-serif text-4xl mb-4">New Arrivals</h2>
            <p className="text-gray-600 max-w-md">Fresh pieces you'll want to wear on repeat.</p>
          </div>
          <ProductGrid>
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
          <div className="mt-16 flex justify-center">
            <Link href="/shop?filter=new" className="btn-secondary">
              View All New
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 bg-brand-champagne">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="font-serif text-4xl mb-4">Loved By Her</h2>
            <p className="text-gray-600 max-w-md">Our most-loved everyday essentials.</p>
          </div>
          <ProductGrid>
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
          <div className="mt-16 flex justify-center">
            <Link href="/shop?filter=best-seller" className="btn-secondary">
              Shop Best Sellers
            </Link>
          </div>
        </div>
      </section>

      <CategoryShowcase />

      {/* Editorial Banner */}
      <section className="relative py-32 bg-brand-charcoal overflow-hidden text-center flex flex-col items-center justify-center">
        <div className="relative z-10 max-w-2xl px-4 text-white">
          <h2 className="font-serif text-4xl md:text-5xl mb-6">Made to Stay. Made to Shine.</h2>
          <p className="text-gray-300 text-lg mb-10 leading-relaxed">
            Thoughtfully designed jewelry that keeps up with your everyday. Water-resistant, anti-tarnish, and gentle on the skin.
          </p>
          <Link href="/about" className="btn-primary border border-white hover:bg-white hover:text-brand-charcoal">
            Discover Our Story
          </Link>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-24 bg-brand-ivory">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="font-serif text-4xl mb-4">Real Love</h2>
            <p className="text-gray-600 max-w-md">What our community is saying.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.slice(0, 3).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* Instagram / Social */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center mb-12 text-center">
            <h2 className="font-serif text-3xl mb-4">Follow the Glow</h2>
            <a href="https://instagram.com/treasure.trove" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-brand-gold hover:text-brand-charcoal transition-colors">
              <InstagramIcon className="w-5 h-5" />
              <span className="font-medium tracking-widest uppercase">@treasure.trove</span>
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Using product images as dummy instagram posts */}
            {PRODUCTS.slice(0, 4).map((p) => (
              <div key={p.id} className="relative aspect-square group cursor-pointer overflow-hidden bg-brand-champagne">
                <Image src={p.images[0]} alt="Instagram post" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <InstagramIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
