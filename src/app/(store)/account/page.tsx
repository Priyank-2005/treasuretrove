"use client";

import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { CUSTOMER_ORDERS } from '@/data/customer/orders';
import { MOCK_ADDRESSES } from '@/data/customer/addresses';
import Link from 'next/link';
import { ShoppingBag, MapPin, User, Heart, Package, ArrowRight } from 'lucide-react';

export default function AccountPage() {
  const { user } = useAuth();
  const { wishlistCount } = useWishlist();

  // Get recent orders
  const recentOrders = CUSTOMER_ORDERS.slice(0, 3);
  const totalOrders = CUSTOMER_ORDERS.length;
  const totalAddresses = MOCK_ADDRESSES.length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
      case 'Paid':
        return <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">{status}</span>;
      case 'Processing':
      case 'Shipped':
        return <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">{status}</span>;
      case 'Pending':
        return <span className="px-2.5 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">{status}</span>;
      case 'Cancelled':
      case 'Refunded':
        return <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">{status}</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

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
                    <span className="font-medium text-base-dark">#{order.id}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-sm text-text-light-muted mt-1">
                    {formatDate(order.date)} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </div>
                </div>
                <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                  <div className="font-medium text-base-dark">
                    ${order.total.toFixed(2)}
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
            <Link href="/" className="btn-pill inline-flex">
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-serif text-2xl text-base-dark mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/account/orders" className="bg-base-light border border-gold-mid/20 p-6 flex flex-col items-center justify-center gap-3 hover:shadow-soft transition-all text-center group">
            <div className="w-12 h-12 bg-gold-mid/10 flex items-center justify-center rounded-full text-gold-mid group-hover:bg-gold-mid group-hover:text-white transition-colors">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="font-medium text-base-dark">My Orders</div>
          </Link>
          
          <Link href="/account/addresses" className="bg-base-light border border-gold-mid/20 p-6 flex flex-col items-center justify-center gap-3 hover:shadow-soft transition-all text-center group">
            <div className="w-12 h-12 bg-gold-mid/10 flex items-center justify-center rounded-full text-gold-mid group-hover:bg-gold-mid group-hover:text-white transition-colors">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="font-medium text-base-dark">Addresses</div>
          </Link>
          
          <Link href="/account/profile" className="bg-base-light border border-gold-mid/20 p-6 flex flex-col items-center justify-center gap-3 hover:shadow-soft transition-all text-center group">
            <div className="w-12 h-12 bg-gold-mid/10 flex items-center justify-center rounded-full text-gold-mid group-hover:bg-gold-mid group-hover:text-white transition-colors">
              <User className="w-6 h-6" />
            </div>
            <div className="font-medium text-base-dark">Profile</div>
          </Link>
          
          <Link href="/wishlist" className="bg-base-light border border-gold-mid/20 p-6 flex flex-col items-center justify-center gap-3 hover:shadow-soft transition-all text-center group">
            <div className="w-12 h-12 bg-gold-mid/10 flex items-center justify-center rounded-full text-gold-mid group-hover:bg-gold-mid group-hover:text-white transition-colors">
              <Heart className="w-6 h-6" />
            </div>
            <div className="font-medium text-base-dark">Wishlist</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
