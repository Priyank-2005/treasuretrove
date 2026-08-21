"use client";

import { useState, useEffect } from "react";
import { Plus, Tag, Loader2, X } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    type: "PERCENTAGE",
    usageLimit: "",
  });

  const fetchCoupons = () => {
    fetch('/api/admin/coupons')
      .then(res => res.json())
      .then(data => {
        if (data.coupons) setCoupons(data.coupons);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.discount) return;
    
    await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: formData.code.toUpperCase(),
        discount: Number(formData.discount),
        type: formData.type,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null
      })
    });
    
    setIsModalOpen(false);
    setFormData({ code: "", discount: "", type: "PERCENTAGE", usageLimit: "" });
    fetchCoupons();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Coupons</h1>
          <p className="text-gray-500 mt-1">Manage discount codes and promotions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-900 text-white hover:bg-gray-800 transition-colors rounded-md text-sm font-medium px-4 py-2 flex items-center gap-2"
        >
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
                  </td>
                  <td className="px-6 py-4">
                    {coupon.usageCount} / {coupon.usageLimit}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={coupon.status} />
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {coupon.expiryDate === 'Never' ? 'Never' : new Date(coupon.expiryDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Create New Coupon</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                <input 
                  type="text" 
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-charcoal focus:border-brand-charcoal uppercase" 
                  placeholder="e.g. SUMMER20" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-charcoal focus:border-brand-charcoal"
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FLAT">Flat Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount/Percent</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-charcoal focus:border-brand-charcoal" 
                    placeholder={formData.type === 'PERCENTAGE' ? "20" : "500"} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit (Optional)</label>
                <input 
                  type="number" 
                  min="1"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-charcoal focus:border-brand-charcoal" 
                  placeholder="e.g. 100" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
