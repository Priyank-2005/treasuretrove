"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';
import { ShoppingBag, MapPin, User, Heart, Package, ArrowRight, Loader2 } from 'lucide-react';

export default function AccountPage() {
  const { user } = useAuth();
  const { wishlistCount } = useWishlist();

  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/account/orders').then(res => res.json()),
      fetch('/api/account/addresses').then(res => res.json())
    ]).then(([ordersData, addressesData]) => {
      if (ordersData.orders) setOrders(ordersData.orders);
      if (addressesData.addresses) setAddresses(addressesData.addresses);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const recentOrders = orders.slice(0, 3);
  const totalOrders = orders.length;
  const totalAddresses = addresses.length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
      case 'PAID':
        return <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">{status}</span>;
      case 'PROCESSING':
      case 'SHIPPED':
        return <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">{status}</span>;
      case 'PENDING':
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">{status}</span>;
      case 'CANCELLED':
      case 'REFUNDED':
        return <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">{status}</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-charcoal" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div>
        <h1 className="font-serif text-3xl md:text-4xl text-base-dark">
          Hello, {user?.name || 'Guest'}
        </h1>
        <p className="text-text-light-muted mt-2">
          Here's your account overview
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-base-light border border-gold-mid/20 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-gold-mid/10 flex items-center justify-center rounded-full text-gold-mid shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="font-serif text-3xl text-base-dark">{totalOrders}</div>
            <div className="text-sm text-text-light-muted">Total Orders</div>
          </div>
        </div>
        
        <div className="bg-base-light border border-gold-mid/20 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-gold-mid/10 flex items-center justify-center rounded-full text-gold-mid shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="font-serif text-3xl text-base-dark">{wishlistCount}</div>
            <div className="text-sm text-text-light-muted">Wishlist Items</div>
          </div>
        </div>
        
        <div className="bg-base-light border border-gold-mid/20 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-gold-mid/10 flex items-center justify-center rounded-full text-gold-mid shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="font-serif text-3xl text-base-dark">{totalAddresses}</div>
            <div className="text-sm text-text-light-muted">Saved Addresses</div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-base-dark">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm text-gold-mid hover:text-base-dark transition-colors flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="bg-base-light border border-gold-mid/20 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-base-dark">#{order.orderNumber}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-sm text-text-light-muted mt-1">
                    {formatDate(order.date)} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </div>
                </div>
                <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                  <div className="font-medium text-base-dark">
                    ₹{order.total.toLocaleString("en-IN")}
                  </div>
                  <Link href={`/account/orders/${order.id}`} className="text-sm text-gold-mid hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-base-light border border-gold-mid/20 p-8 text-center">
            <p className="text-text-light-muted mb-4">No orders yet</p>
            <Link href="/shop" className="btn-pill inline-flex">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
