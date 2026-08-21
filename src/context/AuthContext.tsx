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

const DEMO_USER = {
  id: "CUST-001",
  name: "Ayushi Sainani",
  email: "ayushi@example.com",
  phone: "+91 9876543210",
  joinedDate: "2023-01-15",
  password: "demo123"
};

const AUTH_KEY = "treasuretrove_auth";
const USERS_KEY = "treasuretrove_users";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { showToast } = useToast();

  // Temporary state for registration/reset before OTP
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [resetEmail, setResetEmail] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedAuth = localStorage.getItem(AUTH_KEY);
      if (storedAuth) {
        setUser(JSON.parse(storedAuth));
      }
      
      const storedUsers = localStorage.getItem(USERS_KEY);
      if (!storedUsers) {
        localStorage.setItem(USERS_KEY, JSON.stringify([DEMO_USER]));
      } else {
        // Ensure the demo user is always present and up-to-date
        const users = JSON.parse(storedUsers);
        const demoIndex = users.findIndex((u: any) => u.id === DEMO_USER.id);
        if (demoIndex === -1) {
          users.push(DEMO_USER);
        } else {
          users[demoIndex] = { ...users[demoIndex], ...DEMO_USER };
        }
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    } catch (error) {
      console.error("Failed to load auth from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (user) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    }
  }, [user, isMounted]);

  const getUsers = () => {
    if (typeof window === "undefined") return [DEMO_USER];
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [DEMO_USER];
    } catch {
      return [DEMO_USER];
    }
  };

  const saveUsers = (users: any[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  };

  const login = async (email: string, password: string) => {
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      setTimeout(() => {
        const users = getUsers();
        const foundUser = users.find((u: any) => u.email === email && u.password === password);

        if (foundUser) {
          const authUser = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            phone: foundUser.phone,
            joinedDate: foundUser.joinedDate,
          };
          setUser(authUser);
          showToast("Logged in successfully");
          resolve({ success: true });
        } else {
          resolve({ success: false, error: "Invalid email or password" });
        }
      }, 500);
    });
  };

  const register = async (data: { name: string; email: string; phone: string; password: string }) => {
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      setTimeout(() => {
        const users = getUsers();
        if (users.some((u: any) => u.email === data.email)) {
          resolve({ success: false, error: "Email already registered" });
          return;
        }
        
        setPendingUser({
          ...data,
          id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
          joinedDate: new Date().toISOString().split("T")[0]
        });
        showToast("OTP sent to your email");
        resolve({ success: true });
      }, 500);
    });
  };

  const verifyOtp = async (otp: string) => {
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      setTimeout(() => {
        if (otp.length === 6) {
          if (pendingUser) {
            const users = getUsers();
            users.push(pendingUser);
            saveUsers(users);
            
            const authUser = {
              id: pendingUser.id,
              name: pendingUser.name,
              email: pendingUser.email,
              phone: pendingUser.phone,
              joinedDate: pendingUser.joinedDate,
            };
            setUser(authUser);
            setPendingUser(null);
            showToast("Registration successful");
            resolve({ success: true });
          } else {
            resolve({ success: true });
          }
        } else {
          resolve({ success: false, error: "Invalid OTP. Must be 6 digits." });
        }
      }, 1000);
    });
  };

  const logout = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser(null);
        showToast("Logged out successfully");
        resolve();
      }, 200);
    });
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (user) {
          const updatedUser = { ...user, ...data };
          setUser(updatedUser);
          
          const users = getUsers();
          const userIndex = users.findIndex((u: any) => u.id === user.id);
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...data };
            saveUsers(users);
          }
          
          showToast("Profile updated successfully");
        }
        resolve();
      }, 500);
    });
  };

  const requestPasswordReset = async (email: string) => {
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      setTimeout(() => {
        const users = getUsers();
        if (users.some((u: any) => u.email === email)) {
          setResetEmail(email);
          showToast("Password reset OTP sent");
          resolve({ success: true });
        } else {
          resolve({ success: false, error: "Email not found" });
        }
      }, 500);
    });
  };

  const resetPassword = async (otp: string, newPassword: string) => {
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      setTimeout(() => {
        if (otp.length === 6) {
          if (resetEmail) {
            const users = getUsers();
            const userIndex = users.findIndex((u: any) => u.email === resetEmail);
            if (userIndex !== -1) {
              users[userIndex].password = newPassword;
              saveUsers(users);
              setResetEmail(null);
              showToast("Password reset successfully");
              resolve({ success: true });
            } else {
              resolve({ success: false, error: "User not found" });
            }
          } else {
            resolve({ success: false, error: "No reset request pending" });
          }
        } else {
          resolve({ success: false, error: "Invalid OTP. Must be 6 digits." });
        }
      }, 1000);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: isMounted ? user : null,
        isAuthenticated: isMounted ? !!user : false,
        isLoading: isMounted ? isLoading : true,
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
