import { Breadcrumb } from "@/components/ui/Breadcrumb";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Our Story" }]} />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-6xl font-medium mb-8 text-center leading-tight">
          Jewelry Made for Everyday.
        </h1>
        
        <div className="relative aspect-video w-full mb-16 overflow-hidden">
          <Image src="/images/banners/hero.jpg" alt="Our story" fill className="object-cover" />
        </div>
        
        <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed max-w-2xl text-center md:text-left">
          <p className="mb-6">
            Treasure Trove was born out of a simple desire: to create beautiful, modern jewelry that doesn't tarnish after a few wears or irritate sensitive skin. We believe that everyday luxury shouldn't come with a premium price tag or require high maintenance.
          </p>
          <p className="mb-6">
            We noticed a gap in the market. On one end, there was expensive fine jewelry reserved for special occasions. On the other, cheap fashion jewelry that quickly lost its shine. We wanted something in the middle.
          </p>
          <h2 className="font-serif text-3xl text-brand-charcoal mt-12 mb-6">Our Commitment</h2>
          <p className="mb-6">
            Every piece we design is water-resistant, anti-tarnish, and hypoallergenic. We use high-quality materials, primarily 18K gold plated stainless steel and 14K gold filled, ensuring your pieces can withstand life's everyday moments—from morning showers to evening workouts.
          </p>
          <p>
            This is thoughtful jewelry designed to keep up with you, not the other way around.
          </p>
        </div>
      </div>
    </div>
  );
}
