import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative h-[85vh] min-h-[600px] w-full bg-brand-champagne overflow-hidden">
      <Image
        src="/images/banners/hero.jpg"
        alt="Treasure Trove Everyday Jewelry, Elevated"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-xl text-white">
            <h1 className="font-serif text-5xl md:text-7xl font-medium leading-tight mb-6 tracking-wide">
              Everyday Jewelry, Elevated.
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-md font-light leading-relaxed">
              Anti-tarnish. Water-resistant. Skin-friendly. Designed to stay beautiful through every moment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop?filter=new" className="bg-white text-brand-charcoal px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-brand-champagne transition-colors text-center">
                Shop New Arrivals
              </Link>
              <Link href="/shop?filter=best-seller" className="bg-transparent border border-white text-white px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-white hover:text-brand-charcoal transition-colors text-center flex items-center justify-center gap-2">
                Explore Best Sellers
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
