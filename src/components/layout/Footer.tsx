import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/config/brand";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const PinterestIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="12" x2="12" y2="22"></line>
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.13 2.5 7.69 6.08 9.21-.08-.75-.15-1.91.03-2.73.17-.76 1.09-4.63 1.09-4.63s-.28-.56-.28-1.39c0-1.3.75-2.27 1.69-2.27.79 0 1.18.6 1.18 1.31 0 .8-.5 1.99-.77 3.1-.22.92.46 1.67 1.36 1.67 1.63 0 2.89-1.72 2.89-4.19 0-2.2-1.58-3.74-3.84-3.74-2.59 0-4.11 1.94-4.11 3.94 0 .78.3 1.61.68 2.06.07.09.08.17.06.26-.06.27-.2.83-.23.94-.03.14-.11.16-.25.1-1.04-.49-1.69-2.02-1.69-3.25 0-2.65 1.93-5.08 5.56-5.08 2.91 0 5.18 2.08 5.18 4.86 0 2.9-1.83 5.23-4.37 5.23-.85 0-1.65-.44-1.93-.97l-.52 2.02c-.19.72-.7 1.63-1.04 2.18A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"></path>
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-base-dark text-base-light pt-20 pb-10 border-t border-gold-mid/30">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          
          {/* Logo / Brand */}
          <div className="md:col-span-3">
            <Link href="/" className="block mb-6">
              <div className="relative h-20 w-48 md:h-24 md:w-56">
                <Image 
                  src="/logo.png" 
                  alt="Treasure Trove Logo" 
                  fill
                  className="object-contain object-left mix-blend-multiply"
                />
              </div>
            </Link>
            <p className="font-sans text-sm text-base-light/80 mb-8 font-medium">
              Everyday gold, elevated.
            </p>
            <div className="flex gap-5">
              <a href="#" className="text-base-light hover:text-gold-highlight transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-base-light hover:text-gold-highlight transition-colors">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-base-light hover:text-gold-highlight transition-colors">
                <PinterestIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* 3 Link Columns */}
          <div className="md:col-span-8 md:col-start-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-5">
              <span className="eyebrow text-gold-mid">Shop</span>
              <Link href="/shop/necklaces" className="font-sans text-sm hover:text-gold-highlight text-base-light transition-colors">Necklaces</Link>
              <Link href="/shop/earrings" className="font-sans text-sm hover:text-gold-highlight text-base-light transition-colors">Earrings</Link>
              <Link href="/shop/rings" className="font-sans text-sm hover:text-gold-highlight text-base-light transition-colors">Rings</Link>
              <Link href="/shop/bracelets" className="font-sans text-sm hover:text-gold-highlight text-base-light transition-colors">Bracelets</Link>
            </div>

            <div className="flex flex-col gap-5">
              <span className="eyebrow text-gold-mid">Brand</span>
              <Link href="/about" className="font-sans text-sm hover:text-gold-highlight text-base-light transition-colors">Our Story</Link>
              <Link href="/contact" className="font-sans text-sm hover:text-gold-highlight text-base-light transition-colors">Contact</Link>
              <Link href="/locations" className="font-sans text-sm hover:text-gold-highlight text-base-light transition-colors">Store Locations</Link>
              <Link href="/journal" className="font-sans text-sm hover:text-gold-highlight text-base-light transition-colors">Journal</Link>
            </div>

            <div className="flex flex-col gap-5">
              <span className="eyebrow text-gold-mid">Support</span>
              <Link href="/faq" className="font-sans text-sm hover:text-gold-highlight text-base-light transition-colors">FAQ</Link>
              <Link href="/shipping-returns" className="font-sans text-sm hover:text-gold-highlight text-base-light transition-colors">Shipping & Returns</Link>
              <Link href="/care" className="font-sans text-sm hover:text-gold-highlight text-base-light transition-colors">Jewelry Care</Link>
              <Link href="/terms" className="font-sans text-sm hover:text-gold-highlight text-base-light transition-colors">Terms of Service</Link>
            </div>
          </div>
          
        </div>

        <div className="border-t border-gold-mid/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-base-light/60">
          <p>© {new Date().getFullYear()} Treasure Trove by Gurasim. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-base-light transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-base-light transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
