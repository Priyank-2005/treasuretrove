"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Menu } from "lucide-react";
import Link from "next/link";

export function AdminHeader() {
  const pathname = usePathname();
  
  if (pathname === "/admin/login") return null;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-500 hover:text-gray-900">
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-md w-96 focus-within:ring-2 focus-within:ring-gray-200 transition-shadow">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products, orders, customers..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-sm font-medium text-gray-900 leading-none mb-1">Priyank</span>
            <span className="text-xs text-gray-500 leading-none">Administrator</span>
          </div>
          <div className="w-8 h-8 bg-brand-charcoal text-white rounded-full flex items-center justify-center text-sm font-medium">
            P
          </div>
        </div>
      </div>
    </header>
  );
}
