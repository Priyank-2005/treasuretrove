"use client";

import { useAdmin } from "@/context/AdminContext";
import { Plus, Megaphone } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default function CampaignsPage() {
  const { campaigns } = useAdmin();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Campaigns</h1>
          <p className="text-gray-500 mt-1">Manage marketing campaigns and banners.</p>
        </div>
        <button className="bg-brand-charcoal text-white hover:bg-gray-800 transition-colors rounded-md text-sm font-medium px-4 py-2 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            {campaign.image ? (
              <div className="h-32 bg-gray-100 relative">
                <img src={campaign.image} alt={campaign.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-32 bg-gray-100 flex items-center justify-center text-gray-400">
                <Megaphone className="w-8 h-8 opacity-50" />
              </div>
            )}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                <StatusBadge status={campaign.status} />
              </div>
              <p className="text-sm text-brand-charcoal mb-4 font-medium">{campaign.type}</p>
              
              <div className="mt-auto space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Starts:</span>
                  <span className="text-gray-900">{new Date(campaign.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ends:</span>
                  <span className="text-gray-900">{new Date(campaign.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
