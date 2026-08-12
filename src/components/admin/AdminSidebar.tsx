"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, ShoppingCart, Users, Tag, Megaphone, BarChart3, Settings, LogOut, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: ShoppingBag },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Coupons", href: "/admin/coupons", icon: Tag },
  { name: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  // Hide sidebar on login page
  if (pathname === "/admin/login") return null;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col hidden md:flex h-full">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Link href="/admin" className="font-serif text-2xl font-semibold tracking-wider text-brand-charcoal">
          LUMÉRA
        </Link>
      </div>

      <div className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto hide-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-6 py-2.5 mx-3 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-gray-900" : "text-gray-400")} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200 flex flex-col gap-2">
        <button className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors w-full">
          <HelpCircle className="w-5 h-5 text-gray-400" />
          Help & Support
        </button>
        <Link href="/admin/login" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors w-full">
          <LogOut className="w-5 h-5 text-gray-400" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
