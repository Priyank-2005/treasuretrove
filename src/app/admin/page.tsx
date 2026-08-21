"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/admin/StatCard";
import { SalesChart } from "@/components/admin/SalesChart";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { IndianRupee, ShoppingBag, Users, Gem, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminDashboard() {
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/orders').then(res => res.json()),
      fetch('/api/products').then(res => res.json()),
      fetch('/api/admin/customers').then(res => res.json())
    ]).then(([ordersData, productsData, customersData]) => {
      if (ordersData.orders) setDbOrders(ordersData.orders);
      if (Array.isArray(productsData)) {
        setProducts(productsData);
      } else if (productsData.products) {
        setProducts(productsData.products);
      }
      if (customersData.customers) setCustomers(customersData.customers);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load dashboard data");
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-charcoal" />
      </div>
    );
  }

  // Basic stats calculations
  const totalRevenue = dbOrders.reduce((sum, order) => sum + (order.status !== "CANCELLED" && order.status !== "REFUNDED" ? order.total : 0), 0);
  const totalOrders = dbOrders.length;
  const totalCustomers = customers.length;
  const totalProducts = products.length;

  const recentOrders = [...dbOrders].slice(0, 5);
  
  // Calculate real best sellers from orders
  const productSales: Record<string, number> = {};
  dbOrders.forEach(order => {
    if (order.status !== 'CANCELLED' && order.status !== 'REFUNDED') {
      order.items?.forEach((item: any) => {
        if (!productSales[item.productId]) productSales[item.productId] = 0;
        productSales[item.productId] += item.quantity;
      });
    }
  });

  const bestSellers = [...products]
    .map(p => ({ ...p, sold: productSales[p.id] || 0 }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);
  
  // Low stock calculation
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5).sort((a, b) => a.stock - b.stock);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Good morning, Priyank</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your store today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue" 
          value={`₹${totalRevenue.toLocaleString('en-IN')}`} 
          trend="Lifetime" 
          icon={IndianRupee} 
        />
        <StatCard 
          title="Orders" 
          value={totalOrders} 
          trend="Total" 
          icon={ShoppingBag} 
        />
        <StatCard 
          title="Customers" 
          value={totalCustomers} 
          trend="Registered" 
          icon={Users} 
        />
        <StatCard 
          title="Products" 
          value={totalProducts} 
          trend="Catalog" 
          icon={Gem} 
        />
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SalesChart orders={dbOrders} />
        
        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Low Stock
            </h2>
            <Link href="/admin/products" className="text-sm text-brand-charcoal hover:underline">View All</Link>
          </div>
          
          <div className="space-y-4">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-md border border-red-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative rounded overflow-hidden bg-white">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
                    {product.stock} left
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-sm text-gray-500">
                Inventory levels are looking good.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tables Area */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-brand-charcoal hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => {
                  const fulfillmentStatus = order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase();
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-brand-charcoal">
                        <Link href={`/admin/orders/${order.id}`} className="hover:underline">{order.orderNumber}</Link>
                      </td>
                      <td className="px-6 py-4">{order.customerName}</td>
                      <td className="px-6 py-4"><StatusBadge status={fulfillmentStatus as any} /></td>
                      <td className="px-6 py-4 text-right font-medium">₹{order.total.toLocaleString('en-IN')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Best Sellers</h2>
            <Link href="/admin/products" className="text-sm text-brand-charcoal hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-0">
            <ul className="divide-y divide-gray-200">
              {bestSellers.map((product, idx) => (
                <li key={product.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-gray-400 w-4">{idx + 1}</div>
                    <div className="w-12 h-12 relative rounded overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <Link href={`/admin/products/${product.id}`} className="text-sm font-medium text-gray-900 hover:underline line-clamp-1">
                        {product.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-medium text-gray-900">₹{product.price.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-green-600 mt-1 font-medium">{product.sold} sold</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
