import Link from "next/link";
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

export function Footer() {
  return (
    <footer className="bg-brand-charcoal text-brand-champagne pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="font-serif text-3xl font-semibold tracking-wider text-white">
              {BRAND.name}
            </Link>
            <p className="text-sm leading-relaxed text-gray-300 max-w-xs">
              {BRAND.tagline} {BRAND.positioning}
            </p>
          </div>

          {/* Shop */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif text-lg text-white mb-2">Shop</h4>
            <Link href="/shop?filter=new" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">New Arrivals</Link>
            <Link href="/shop/earrings" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Earrings</Link>
            <Link href="/shop/necklaces" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Necklaces</Link>
            <Link href="/shop/rings" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Rings</Link>
            <Link href="/shop/bracelets" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Bracelets</Link>
          </div>

          {/* Help */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif text-lg text-white mb-2">Help</h4>
            <Link href="/contact" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Contact Us</Link>
            <Link href="/faq" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">FAQ</Link>
            <Link href="/shipping-returns" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Shipping & Returns</Link>
            <Link href="/care" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Jewelry Care</Link>
            <Link href="/about" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Our Story</Link>
          </div>

          {/* Follow */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif text-lg text-white mb-2">Follow Us</h4>
            <div className="flex gap-4">
              <a href={`https://instagram.com/${BRAND.social.instagram}`} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-brand-gold transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href={`https://facebook.com/${BRAND.social.facebook}`} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-brand-gold transition-colors">
                <FacebookIcon className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Join our newsletter for exclusive offers and first access to new collections.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} {BRAND.name}. Demo Store.</p>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
