"use client";

import { useAdmin } from "@/context/AdminContext";
import { Plus, Tag } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default function CouponsPage() {
  const { coupons } = useAdmin();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Coupons</h1>
          <p className="text-gray-500 mt-1">Manage discount codes and promotions.</p>
        </div>
        <button className="bg-brand-charcoal text-white hover:bg-gray-800 transition-colors rounded-md text-sm font-medium px-4 py-2 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Discount</th>
                <th className="px-6 py-4 font-medium">Usage</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-mono font-medium text-brand-charcoal bg-gray-100 px-2 py-1 rounded w-fit">
                      <Tag className="w-3 h-3" />
                      {coupon.code}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {coupon.discountType === "Percentage" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                    <div className="text-xs text-gray-500 mt-1">Min ₹{coupon.minOrderValue}</div>
                  </td>
                  <td className="px-6 py-4">
                    {coupon.usageCount} / {coupon.usageLimit}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={coupon.status} />
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
