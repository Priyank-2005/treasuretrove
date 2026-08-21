"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/context/ToastContext";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (otp: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // Temporary state for registration/reset before OTP
  const [pendingRegistration, setPendingRegistration] = useState<any>(null);
  const [resetEmail, setResetEmail] = useState<string | null>(null);

  // On mount, check for an existing server session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to check session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        showToast("Logged in successfully");
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (data: { name: string; email: string; phone: string; password: string }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        setPendingRegistration(result.pendingData);
        showToast("OTP sent to your email");
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Registration failed' };
      }
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const verifyOtp = async (otp: string) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp,
          pendingData: pendingRegistration,
          purpose: pendingRegistration ? 'register' : 'reset',
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.user) {
          setUser(data.user);
          setPendingRegistration(null);
          showToast("Registration successful");
        }
        return { success: true };
      } else {
        return { success: false, error: data.error || 'OTP verification failed' };
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      showToast("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      // Clear locally even if API fails
      setUser(null);
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success && result.user) {
        setUser(result.user);
        showToast("Profile updated successfully");
      }
    } catch (error) {
      console.error("Update profile error:", error);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setResetEmail(email);
        showToast("Password reset OTP sent");
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to send reset OTP' };
      }
    } catch (error) {
      console.error("Password reset request error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const resetPassword = async (otp: string, newPassword: string) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setResetEmail(null);
        showToast("Password reset successfully");
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Password reset failed' };
      }
    } catch (error) {
      console.error("Password reset error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        verifyOtp,
        logout,
        updateProfile,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
