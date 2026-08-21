"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { CheckCircle2, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const hasProfileChanged = 
    profileData.name !== user?.name || 
    profileData.email !== user?.email || 
    profileData.phone !== user?.phone;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasProfileChanged) return;
    
    if (updateProfile) {
      await updateProfile(profileData);
    }
    showToast("Profile updated successfully");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new.length < 6) {
      showToast("New password must be at least 6 characters");
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      showToast("New passwords do not match");
      return;
    }
    showToast("Password updated successfully");
    setPasswordData({ current: "", new: "", confirm: "" });
  };

  const handleDeleteAccount = () => {
    showToast("Account deleted successfully");
    // Mock logout logic here
    setShowDeleteConfirm(false);
  };

  const formattedDate = user?.joinedDate 
    ? new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : "Recently";

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-text-light mb-2">Profile Information</h1>
        <p className="text-text-light-muted">Manage your account details and security settings.</p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-light mb-2">Full Name</label>
          <input 
            type="text" 
            value={profileData.name}
            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
            className="p-3 border border-gold-mid/30 focus:border-gold-mid focus:outline-none bg-transparent w-full text-text-light"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-light mb-2">Email Address</label>
          <div className="relative">
            <input 
              type="email" 
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              className="p-3 border border-gold-mid/30 focus:border-gold-mid focus:outline-none bg-transparent w-full text-text-light pr-12"
            />
            <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-light mb-2">Phone Number</label>
          <div className="relative">
            <input 
              type="tel" 
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              className="p-3 border border-gold-mid/30 focus:border-gold-mid focus:outline-none bg-transparent w-full text-text-light pr-12"
            />
            <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-text-light-muted py-2">
          <Shield className="w-4 h-4" />
          Member since {formattedDate}
        </div>

        <div>
          <button 
            type="submit" 
            disabled={!hasProfileChanged}
            className={`btn-pill ${!hasProfileChanged ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Save Changes
          </button>
        </div>
      </form>

      <hr className="my-12 border-gold-mid/20" />

      {/* Change Password */}
      <div>
        <h2 className="font-serif text-xl text-text-light mb-6">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">Current Password</label>
            <input 
              type="password" 
              required
              value={passwordData.current}
              onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
              className="p-3 border border-gold-mid/30 focus:border-gold-mid focus:outline-none bg-transparent w-full text-text-light"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">New Password</label>
              <input 
                type="password" 
                required
                minLength={6}
                value={passwordData.new}
                onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                className="p-3 border border-gold-mid/30 focus:border-gold-mid focus:outline-none bg-transparent w-full text-text-light"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">Confirm New Password</label>
              <input 
                type="password" 
                required
                minLength={6}
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                className="p-3 border border-gold-mid/30 focus:border-gold-mid focus:outline-none bg-transparent w-full text-text-light"
              />
            </div>
          </div>

          <div>
            <button type="submit" className="btn-pill-light">
              Update Password
            </button>
          </div>
        </form>
      </div>

      <hr className="my-12 border-gold-mid/20" />

      {/* Danger Zone */}
      <div>
        <h2 className="font-serif text-xl text-red-600 mb-2">Danger Zone</h2>
        <p className="text-text-light-muted text-sm mb-6">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        
        {showDeleteConfirm ? (
          <div className="bg-red-50 border border-red-200 p-6 rounded-sm">
            <h3 className="text-red-800 font-medium mb-2">Are you absolutely sure?</h3>
            <p className="text-red-600 text-sm mb-4">This will permanently delete your account and remove your data from our servers.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-pill-light border-red-200 hover:bg-red-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-6 py-3 text-sm font-medium hover:bg-red-700 transition-colors rounded-full"
              >
                Yes, delete my account
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="border border-red-600 text-red-600 px-6 py-3 text-sm font-medium hover:bg-red-50 transition-colors rounded-full"
          >
            Delete Account
          </button>
        )}
      </div>
    </div>
  );
}
