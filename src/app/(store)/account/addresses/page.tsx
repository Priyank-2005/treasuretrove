"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, MapPin } from "lucide-react";
import { MOCK_ADDRESSES, type Address } from "@/data/customer/addresses";

const INDIAN_STATES = [
  "Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Telangana", 
  "Kerala", "Uttar Pradesh", "Gujarat", "Rajasthan", "West Bengal", 
  "Punjab", "Haryana", "Other"
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/account/addresses");
      const data = await res.json();
      setAddresses(data.addresses || []);
    } catch (error) {
      showToast("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const handleOpenModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        name: address.name,
        phone: address.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: address.isDefault || false,
      });
    } else {
      setEditingAddress(null);
      setFormData({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: addresses.length === 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.phone.length !== 10) {
      showToast("Phone number must be 10 digits");
      return;
    }
    if (formData.pincode.length !== 6) {
      showToast("PIN code must be 6 digits");
      return;
    }

    setSubmitting(true);
    try {
      const method = editingAddress ? "PUT" : "POST";
      const url = editingAddress 
        ? `/api/account/addresses/${editingAddress.id}`
        : "/api/account/addresses";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(editingAddress ? "Address updated" : "Address added");
        await fetchAddresses();
        handleCloseModal();
      } else {
        showToast(data.error || "Failed to save address");
      }
    } catch (error) {
      showToast("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Address deleted");
        await fetchAddresses();
      } else {
        showToast(data.error || "Failed to delete address");
      }
    } catch (error) {
      showToast("An error occurred");
    } finally {
      setSubmitting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    const addr = addresses.find((a) => a.id === id);
    if (!addr) return;

    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...addr, isDefault: true }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Default address updated");
        await fetchAddresses();
      }
    } catch (error) {
      showToast("Failed to update default address");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="font-serif text-3xl text-text-light">Saved Addresses</h1>
        <button 
          onClick={() => handleOpenModal()} 
          className="btn-pill-light flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-gold-mid border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-base-light border border-gold-mid/20">
          <MapPin className="w-12 h-12 text-gold-mid mb-4 opacity-50" />
          <p className="text-lg font-medium text-text-light mb-2">No saved addresses</p>
          <p className="text-text-light-muted mb-6 text-sm">Add an address to make checkout faster</p>
          <button onClick={() => handleOpenModal()} className="btn-pill">
            Add your first address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="bg-base-light border border-gold-mid/20 p-6 relative flex flex-col h-full">
              {address.isDefault && (
                <span className="absolute top-4 right-4 bg-gold-mid/10 text-gold-mid text-xs px-2 py-1 tracking-wider uppercase">
                  Default
                </span>
              )}
              
              <div className="flex-1">
                <h3 className="font-medium text-lg text-text-light">{address.name}</h3>
                <p className="text-sm text-text-light-muted mt-1">{address.phone}</p>
                <div className="text-sm text-text-light-muted mt-3 space-y-1">
                  <p>{address.address}</p>
                  <p>{address.city}, {address.state} - {address.pincode}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gold-mid/10">
                <button 
                  onClick={() => handleOpenModal(address)}
                  className="flex items-center gap-1.5 text-sm text-text-light hover:text-gold-mid transition-colors"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button 
                  onClick={() => setDeleteConfirmId(address.id)}
                  className="flex items-center gap-1.5 text-sm text-text-light hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
                {!address.isDefault && (
                  <button 
                    onClick={() => handleSetDefault(address.id)}
                    className="ml-auto text-sm text-gold-mid hover:underline"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-base-light max-w-sm w-full p-6 border border-gold-mid/20">
            <h3 className="font-serif text-xl mb-2 text-text-light">Delete Address</h3>
            <p className="text-text-light-muted text-sm mb-6">Are you sure you want to delete this address? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="btn-pill-light"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)}
                className="bg-red-600 text-white px-6 py-3 text-sm font-medium hover:bg-red-700 transition-colors rounded-full"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={handleCloseModal}
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-base-light z-50 p-8 overflow-y-auto shadow-2xl border-l border-gold-mid/20"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl text-text-light">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gold-mid/10 text-text-light rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="p-3 border border-gold-mid/30 focus:border-gold-mid focus:outline-none bg-transparent w-full text-text-light"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    pattern="[0-9]{10}"
                    title="10 digit phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="p-3 border border-gold-mid/30 focus:border-gold-mid focus:outline-none bg-transparent w-full text-text-light"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Street Address</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="p-3 border border-gold-mid/30 focus:border-gold-mid focus:outline-none bg-transparent w-full text-text-light resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-2">City</label>
                    <input 
                      type="text" 
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="p-3 border border-gold-mid/30 focus:border-gold-mid focus:outline-none bg-transparent w-full text-text-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-2">PIN Code</label>
                    <input 
                      type="text" 
                      required
                      pattern="[0-9]{6}"
                      title="6 digit PIN code"
                      value={formData.pincode}
                      onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                      className="p-3 border border-gold-mid/30 focus:border-gold-mid focus:outline-none bg-transparent w-full text-text-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">State</label>
                  <select 
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="p-3 border border-gold-mid/30 focus:border-gold-mid focus:outline-none bg-transparent w-full text-text-light appearance-none"
                  >
                    <option value="" disabled>Select a state</option>
                    {INDIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                      className="w-4 h-4 text-gold-mid accent-gold-mid"
                    />
                    <span className="text-sm text-text-light">Set as default address</span>
                  </label>
                </div>

                <div className="pt-6 mt-6 border-t border-gold-mid/10">
                  <button type="submit" className="btn-pill w-full">
                    Save Address
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
