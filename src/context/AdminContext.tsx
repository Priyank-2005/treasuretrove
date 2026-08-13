"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, PRODUCTS as INITIAL_PRODUCTS } from "@/data/products";
import { Order, MOCK_ORDERS } from "@/data/admin/orders";
import { Customer, MOCK_CUSTOMERS } from "@/data/admin/customers";
import { Coupon, MOCK_COUPONS } from "@/data/admin/coupons";
import { Campaign, MOCK_CAMPAIGNS } from "@/data/admin/campaigns";

interface AdminContextType {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  campaigns: Campaign[];
  
  // Product actions
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  bulkUpdateProducts: (ids: string[], updates: Partial<Product>) => void;
  bulkDeleteProducts: (ids: string[]) => void;
  importProducts: (newProducts: Product[]) => void;
  
  // Order actions
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  
  // Coupon actions
  addCoupon: (coupon: Coupon) => void;
  
  // Campaign actions
  addCampaign: (campaign: Campaign) => void;
  
  resetDemoData: () => void;
  isHydrated: boolean;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedProducts = localStorage.getItem("treasuretrove_admin_products");
    const savedOrders = localStorage.getItem("treasuretrove_admin_orders");
    const savedCoupons = localStorage.getItem("treasuretrove_admin_coupons");
    const savedCampaigns = localStorage.getItem("treasuretrove_admin_campaigns");
    
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedCoupons) setCoupons(JSON.parse(savedCoupons));
    if (savedCampaigns) setCampaigns(JSON.parse(savedCampaigns));
    
    setIsHydrated(true);
  }, []);

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addProduct = (product: Product) => {
    const updated = [product, ...products];
    setProducts(updated);
    saveToStorage("treasuretrove_admin_products", updated);
  };

  const updateProduct = (product: Product) => {
    const updated = products.map((p) => (p.id === product.id ? product : p));
    setProducts(updated);
    saveToStorage("treasuretrove_admin_products", updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveToStorage("treasuretrove_admin_products", updated);
  };

  const bulkUpdateProducts = (ids: string[], updates: Partial<Product>) => {
    const updated = products.map((p) => (ids.includes(p.id) ? { ...p, ...updates } : p));
    setProducts(updated);
    saveToStorage("treasuretrove_admin_products", updated);
  };

  const bulkDeleteProducts = (ids: string[]) => {
    const updated = products.filter((p) => !ids.includes(p.id));
    setProducts(updated);
    saveToStorage("treasuretrove_admin_products", updated);
  };

  const importProducts = (newProducts: Product[]) => {
    const updated = [...newProducts, ...products];
    setProducts(updated);
    saveToStorage("treasuretrove_admin_products", updated);
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(updated);
    saveToStorage("treasuretrove_admin_orders", updated);
  };

  const addCoupon = (coupon: Coupon) => {
    const updated = [coupon, ...coupons];
    setCoupons(updated);
    saveToStorage("treasuretrove_admin_coupons", updated);
  };

  const addCampaign = (campaign: Campaign) => {
    const updated = [campaign, ...campaigns];
    setCampaigns(updated);
    saveToStorage("treasuretrove_admin_campaigns", updated);
  };

  const resetDemoData = () => {
    localStorage.removeItem("treasuretrove_admin_products");
    localStorage.removeItem("treasuretrove_admin_orders");
    localStorage.removeItem("treasuretrove_admin_coupons");
    localStorage.removeItem("treasuretrove_admin_campaigns");
    
    setProducts(INITIAL_PRODUCTS);
    setOrders(MOCK_ORDERS);
    setCoupons(MOCK_COUPONS);
    setCampaigns(MOCK_CAMPAIGNS);
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        customers,
        coupons,
        campaigns,
        addProduct,
        updateProduct,
        deleteProduct,
        bulkUpdateProducts,
        bulkDeleteProducts,
        importProducts,
        updateOrderStatus,
        addCoupon,
        addCampaign,
        resetDemoData,
        isHydrated,
        isMobileMenuOpen,
        setMobileMenuOpen,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
