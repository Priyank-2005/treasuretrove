"use client";

import { useAdmin } from "@/context/AdminContext";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";
import { use } from "react";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { products } = useAdmin();
  
  const product = products.find(p => p.id === resolvedParams.id);

  if (!product) {
    notFound();
  }

  return <ProductForm initialProduct={product} />;
}
