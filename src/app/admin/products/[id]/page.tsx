"use client";

import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";
import { use, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : (data.products || []);
        const found = arr.find((p: any) => p.id === resolvedParams.id);
        if (found) {
          setProduct(found);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-charcoal" />
      </div>
    );
  }

  if (error || !product) {
    notFound();
  }

  return <ProductForm initialProduct={product} />;
}
