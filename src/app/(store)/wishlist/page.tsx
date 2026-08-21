"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { Heart, X, Package, ShoppingBag, MapPin, User, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { name: "Overview", href: "/account", icon: Package },
    { name: "My Orders", href: "/account/orders", icon: ShoppingBag },
    { name: "Addresses", href: "/account/addresses", icon: MapPin },
    { name: "Profile", href: "/account/profile", icon: User },
    { name: "Wishlist", href: "/wishlist", icon: Heart },
  ];

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    router.push("/");
  };

  const wishlistContent = (
    <>
      <h1 className="font-serif text-3xl md:text-4xl font-medium mb-8">Your Wishlist</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-6 bg-base-light border border-gold-mid/20">
          <Heart className="w-16 h-16 stroke-1 text-gold-mid opacity-50" />
          <h2 className="font-serif text-2xl font-medium text-text-light">Your wishlist is empty</h2>
          <p className="text-text-light-muted mb-4">Save your favorite pieces here.</p>
          <Link href="/shop" className="btn-pill">
            Explore Collection
          </Link>
        </div>
      ) : (
        <ProductGrid columns={isAuthenticated ? 3 : 4}>
          {items.map((product) => (
            <div key={product.id} className="group flex flex-col relative">
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white text-base-dark shadow-sm hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] bg-base-light mb-4 block border border-gold-mid/10">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
              </Link>
              
              <Link href={`/product/${product.slug}`}>
                <h3 className="font-medium text-text-light group-hover:text-gold-mid transition-colors line-clamp-1 mb-1">
                  {product.name}
                </h3>
              </Link>
              <div className="font-serif text-lg text-text-light mb-4">₹{product.price}</div>
              
              <button
                onClick={() => addToCart(product)}
                className="btn-pill-light w-full"
              >
                Move to Cart
              </button>
            </div>
          ))}
        </ProductGrid>
      )}
    </>
  );

  // When authenticated, show the account sidebar
  if (isAuthenticated) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-12 mt-16 md:mt-20">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Account", href: "/account" }, { label: "Wishlist" }]} />

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 mt-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:flex flex-col w-[280px] shrink-0 border border-gold-mid/20 bg-base-light h-fit p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-gold-mid text-white font-serif text-3xl flex items-center justify-center rounded-full mb-4">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <h2 className="font-serif text-xl text-base-dark text-center">{user?.name}</h2>
              <p className="text-sm text-text-light-muted mt-1">{user?.email}</p>
            </div>

            <div className="border-t border-gold-mid/20 my-4"></div>

            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      isActive
                        ? "text-base-dark font-medium bg-gold-mid/10 border-l-2 border-gold-mid"
                        : "text-text-light-muted hover:text-base-dark hover:bg-gold-mid/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                );
              })}

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 transition-colors text-left w-full"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden flex overflow-x-auto pb-4 gap-2 no-scrollbar">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm ${
                    isActive
                      ? "bg-gold-mid/10 text-base-dark border border-gold-mid/30"
                      : "text-text-light-muted border border-transparent hover:bg-gold-mid/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1">
            {wishlistContent}
          </div>
        </div>
      </div>
    );
  }

  // When not authenticated, show simple layout with proper top spacing
  return (
    <div className="container mx-auto px-4 md:px-8 py-12 mt-16 md:mt-20">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      {wishlistContent}
    </div>
  );
}
