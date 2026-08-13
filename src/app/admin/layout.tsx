import { Inter } from "next/font/google";
import "../globals.css"; // Ensure this still applies the font variables if needed, though they are in layout
import { AdminProvider } from "@/context/AdminContext";
import { ToastProvider } from "@/context/ToastContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Treasure Trove Admin",
  description: "Store Management Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-[#f8f9fa] text-gray-900 antialiased h-screen flex overflow-hidden`}>
        <ToastProvider>
          <AdminProvider>
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <AdminHeader />
              <main className="flex-1 overflow-y-auto p-4 md:p-8 hide-scrollbar">
                {children}
              </main>
            </div>
          </AdminProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
