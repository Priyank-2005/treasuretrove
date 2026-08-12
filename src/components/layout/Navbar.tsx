"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { BRAND } from "@/config/brand";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "./SearchOverlay";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { name: "New Arrivals", href: "/shop?filter=new" },
  { name: "Earrings", href: "/shop/earrings" },
  { name: "Necklaces", href: "/shop/necklaces" },
  { name: "Rings", href: "/shop/rings" },
  { name: "Bracelets", href: "/shop/bracelets" },
  { name: "Best Sellers", href: "/shop?filter=best-seller" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartCount, setIsDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          isScrolled
            ? "bg-brand-ivory/90 backdrop-blur-md shadow-sm py-4"
            : "bg-brand-ivory py-6"
        )}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6 text-brand-charcoal" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-3xl md:text-4xl font-semibold tracking-wider text-brand-charcoal"
          >
            {BRAND.name}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <Link key={link.name} href={link.href} className="nav-link">
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-brand-charcoal hover:text-brand-gold transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/wishlist"
              className="hidden md:flex relative text-brand-charcoal hover:text-brand-gold transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-medium">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative text-brand-charcoal hover:text-brand-gold transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-charcoal text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-medium">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[80%] max-w-sm bg-brand-ivory z-50 md:hidden flex flex-col p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-serif text-2xl font-semibold tracking-wider">
                  {BRAND.name}
                </span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-brand-charcoal" />
                </button>
              </div>
              <div className="flex flex-col gap-6 flex-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-lg uppercase tracking-wider font-medium text-brand-charcoal"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="pt-6 border-t border-brand-champagne flex flex-col gap-4">
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 text-lg font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className="w-5 h-5" />
                  Wishlist ({wishlistCount})
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
