"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { BRAND } from "@/config/brand";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "./SearchOverlay";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { name: "Shop", href: "/shop" },
  { name: "Collections", href: "/shop?filter=collections" },
  { name: "Story", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartCount, setIsDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const pathname = usePathname();
  
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparent = isHomePage && !isScrolled;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full transition-colors duration-300",
          "bg-base-light text-base-dark shadow-sm py-4"
        )}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
          
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link
              href="/"
              className="block"
            >
              <div className="relative h-12 w-28 md:h-16 md:w-36">
                <Image 
                  src="/logo.png" 
                  alt="Treasure Trove Logo" 
                  fill
                  className="object-contain object-left mix-blend-multiply"
                />
              </div>
            </Link>
          </div>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="font-sans text-sm tracking-wide transition-opacity hover:opacity-70"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right: Icons */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="transition-opacity hover:opacity-70"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/wishlist"
              className="hidden md:flex relative transition-opacity hover:opacity-70"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold-accent text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative transition-opacity hover:opacity-70"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold-accent text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
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
              className="fixed inset-0 bg-black/60 z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-base-light text-base-dark z-50 md:hidden flex flex-col p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-serif text-2xl tracking-tight">
                  TTG
                </span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col gap-8 flex-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="font-sans text-xl tracking-wide"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
