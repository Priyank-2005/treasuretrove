"use client";

import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Product } from "@/data/products";
import { Upload, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductForm({ initialProduct }: { initialProduct?: any }) {
  const isEditing = !!initialProduct;
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<Product>>(initialProduct || {
    name: "",
    slug: "",
    category: "Earrings",
    price: 0,
    originalPrice: 0,
    stock: 0,
    description: "",
    shortDescription: "",
    material: "",
    careInstructions: "",
    features: [],
    images: ["/images/products/e1-1.png", "/images/products/e1-2.png"], // Default demo images
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    rating: 0,
    reviewCount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "number") {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFeatureToggle = (feature: string) => {
    const currentFeatures = formData.features || [];
    if (currentFeatures.includes(feature)) {
      setFormData(prev => ({ ...prev, features: currentFeatures.filter(f => f !== feature) }));
    } else {
      setFormData(prev => ({ ...prev, features: [...currentFeatures, feature] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && initialProduct) {
        await fetch(`/api/admin/products/${initialProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        alert("Product updated successfully!");
      } else {
        await fetch(`/api/admin/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        alert("Product created successfully!");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      alert("An error occurred while saving the product.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative pb-10">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{isEditing ? "Edit Product" : "Add New Product"}</h1>
          <p className="text-gray-500 mt-1">Fill in the details to {isEditing ? "update the" : "create a new"} product in your store.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-charcoal focus:border-brand-charcoal" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU / Slug</label>
                    <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-charcoal focus:border-brand-charcoal" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select required name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-charcoal focus:border-brand-charcoal">
                      <option>Earrings</option>
                      <option>Necklaces</option>
                      <option>Rings</option>
                      <option>Bracelets</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                  <input required type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-charcoal focus:border-brand-charcoal" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                  <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-charcoal focus:border-brand-charcoal"></textarea>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">Images</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mb-4 text-gray-400" />
                <p className="text-sm font-medium text-brand-charcoal">Click to upload or drag and drop</p>
                <p className="text-xs mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                <p className="text-xs text-amber-600 font-medium mt-4 bg-amber-50 px-2 py-1 rounded">Simulation: Default demo images are pre-filled.</p>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-4">
                {formData.images?.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-gray-200 group">
                    <img src={img} alt="preview" className="object-cover w-full h-full" />
                    <button type="button" className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">Product Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                  <input type="text" name="material" value={formData.material} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-charcoal focus:border-brand-charcoal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Care Instructions</label>
                  <input type="text" name="careInstructions" value={formData.careInstructions} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-charcoal focus:border-brand-charcoal" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Pricing & Inventory */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">Pricing & Inventory</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-charcoal focus:border-brand-charcoal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compare-at Price (₹)</label>
                  <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-charcoal focus:border-brand-charcoal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-charcoal focus:border-brand-charcoal" />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">Features</h2>
              
              <div className="flex flex-col gap-3">
                {["Anti-Tarnish", "Water Resistant", "Skin Friendly", "Lightweight"].map(feature => (
                  <label key={feature} className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={formData.features?.includes(feature) || false}
                      onChange={() => handleFeatureToggle(feature)}
                      className="w-4 h-4 text-brand-charcoal rounded border-gray-300 focus:ring-brand-charcoal" 
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status & Badges */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">Status</h2>
              
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={formData.isNew || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                    className="w-4 h-4 text-brand-charcoal rounded border-gray-300 focus:ring-brand-charcoal" 
                  />
                  <span className="text-sm text-gray-700">New Arrival</span>
                </label>
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={formData.isBestSeller || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, isBestSeller: e.target.checked }))}
                    className="w-4 h-4 text-brand-charcoal rounded border-gray-300 focus:ring-brand-charcoal" 
                  />
                  <span className="text-sm text-gray-700">Best Seller</span>
                </label>
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={formData.isFeatured || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4 text-brand-charcoal rounded border-gray-300 focus:ring-brand-charcoal" 
                  />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
              </div>
            </div>

          </div>
        </div>


        <div className="sticky bottom-0 bg-[#f8f9fa] pt-4 pb-4 border-t border-gray-200 flex justify-end gap-4 z-10 mt-6">
          <Link href="/admin/products" className="px-6 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors shadow-md">
            {isEditing ? "Update Product" : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
