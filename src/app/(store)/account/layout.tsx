"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingBag, MapPin, User, Heart, LogOut, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold-mid" />
      </div>
    );
  }

  const navLinks = [
    { name: 'Overview', href: '/account', icon: Package },
    { name: 'My Orders', href: '/account/orders', icon: ShoppingBag },
    { name: 'Addresses', href: '/account/addresses', icon: MapPin },
    { name: 'Profile', href: '/account/profile', icon: User },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
  ];

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 mt-16 md:mt-20">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'My Account' }]} />
      
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 mt-8">
        {/* Sidebar (desktop) */}
        <div className="hidden md:flex flex-col w-[280px] shrink-0 border border-gold-mid/20 bg-base-light h-fit p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-gold-mid text-white font-serif text-3xl flex items-center justify-center rounded-full mb-4">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
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
                      ? 'text-base-dark font-medium bg-gold-mid/10 border-l-2 border-gold-mid' 
                      : 'text-text-light-muted hover:text-base-dark hover:bg-gold-mid/5'
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
                    ? 'bg-gold-mid/10 text-base-dark border border-gold-mid/30' 
                    : 'text-text-light-muted border border-transparent hover:bg-gold-mid/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Content area */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
