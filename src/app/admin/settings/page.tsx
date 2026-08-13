"use client";

import { useAdmin } from "@/context/AdminContext";
import { AlertTriangle, Save, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const { resetDemoData } = useAdmin();

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all demo data? This will restore the original catalog, orders, and customers and wipe any changes you made.")) {
      resetDemoData();
      alert("Demo data has been reset to original state.");
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your store preferences and system data.</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">General Information</h2>
          <p className="text-sm text-gray-500 mt-1">Basic details about your store.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input type="text" defaultValue="Treasure Trove" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-charcoal focus:border-brand-charcoal" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input type="email" defaultValue="contact@treasuretrove.demo" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-charcoal focus:border-brand-charcoal" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Description</label>
            <textarea rows={3} defaultValue="Jewelry Made for Everyday. Premium, anti-tarnish, water-resistant accessories." className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-charcoal focus:border-brand-charcoal"></textarea>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button className="btn-primary flex items-center gap-2 px-4 py-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="bg-red-50 rounded-lg border border-red-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-red-200 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <div>
            <h2 className="text-lg font-medium text-red-900">Danger Zone</h2>
            <p className="text-sm text-red-700 mt-1">Actions here can result in data loss.</p>
          </div>
        </div>
        <div className="p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Reset Demo Data</h3>
              <p className="text-sm text-gray-500 mt-1">
                Since this is a prototype, data is stored in your local browser storage. You can reset it to the original state.
              </p>
            </div>
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-700 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Reset Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
