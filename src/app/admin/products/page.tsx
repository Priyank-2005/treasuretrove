"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Plus, Upload, MoreHorizontal, ChevronLeft, ChevronRight, Edit2, Trash2, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import Link from "next/link";
import Image from "next/image";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data.products) {
          setProducts(data.products);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editField, setEditField] = useState<"price" | "stock" | null>(null);
  const [editValue, setEditValue] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.slug.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const updateProductAPI = async (id: string, data: any) => {
    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    fetchProducts();
  };

  const deleteProductAPI = async (id: string) => {
    await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE'
    });
    fetchProducts();
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) return;
    
    switch (action) {
      case "delete":
        if (confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
          for (const id of selectedIds) {
            await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
          }
          setSelectedIds([]);
          fetchProducts();
        }
        break;
      case "activate":
      case "deactivate":
        alert(`${selectedIds.length} products ${action}d successfully (Simulated)`);
        setSelectedIds([]);
        break;
      case "update_price":
        const newPrice = prompt("Enter new price for selected products:");
        if (newPrice && !isNaN(Number(newPrice))) {
          for (const id of selectedIds) {
            await fetch(`/api/admin/products/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ price: Number(newPrice) })
            });
          }
          setSelectedIds([]);
          fetchProducts();
        }
        break;
      case "update_stock":
        const newStock = prompt("Enter new stock for selected products:");
        if (newStock && !isNaN(Number(newStock))) {
          for (const id of selectedIds) {
            await fetch(`/api/admin/products/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ stock: Number(newStock) })
            });
          }
          setSelectedIds([]);
          fetchProducts();
        }
        break;
    }
  };

  const saveInlineEdit = (product: any) => {
    if (editField === "price") {
      updateProductAPI(product.id, { ...product, price: Number(editValue) });
    } else if (editField === "stock") {
      updateProductAPI(product.id, { ...product, stock: Number(editValue) });
    }
    setEditingId(null);
    setEditField(null);
  };

  const startInlineEdit = (product: any, field: "price" | "stock") => {
    setEditingId(product.id);
    setEditField(field);
    setEditValue(product[field].toString());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-charcoal" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your jewelry catalog.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products/import" className="btn-secondary flex items-center gap-2 py-2 px-4">
            <Upload className="w-4 h-4" /> Import Products
          </Link>
          <Link href="/admin/products/new" className="bg-brand-charcoal text-white hover:bg-gray-800 transition-colors rounded-md text-sm font-medium px-4 py-2 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-md w-full sm:w-80 focus-within:ring-2 focus-within:ring-gray-200">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none focus:outline-none text-sm w-full"
            />
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{selectedIds.length} selected</span>
              <select 
                onChange={(e) => handleBulkAction(e.target.value)}
                className="text-sm border-gray-300 rounded-md shadow-sm focus:border-brand-charcoal focus:ring-brand-charcoal"
                value=""
              >
                <option value="" disabled>Bulk Actions</option>
                <option value="update_price">Update Price</option>
                <option value="update_stock">Update Stock</option>
                <option value="activate">Activate</option>
                <option value="deactivate">Deactivate</option>
                <option value="delete">Delete</option>
              </select>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-brand-charcoal focus:ring-brand-charcoal"
                    checked={paginatedProducts.length > 0 && selectedIds.length === paginatedProducts.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-brand-charcoal focus:ring-brand-charcoal"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => handleSelectOne(product.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative rounded border border-gray-200 overflow-hidden bg-white flex-shrink-0">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <Link href={`/admin/products/${product.id}`} className="font-medium text-brand-charcoal hover:underline">
                          {product.name}
                        </Link>
                        <p className="text-xs text-gray-500">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">
                    {editingId === product.id && editField === "price" ? (
                      <input 
                        type="number" 
                        value={editValue} 
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => saveInlineEdit(product)}
                        onKeyDown={(e) => e.key === 'Enter' && saveInlineEdit(product)}
                        autoFocus
                        className="w-24 px-2 py-1 text-sm border-gray-300 rounded focus:ring-brand-charcoal"
                      />
                    ) : (
                      <span 
                        className="cursor-pointer border-b border-dashed border-gray-400 hover:text-brand-gold transition-colors"
                        onClick={() => startInlineEdit(product, "price")}
                      >
                        ₹{product.price}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === product.id && editField === "stock" ? (
                      <input 
                        type="number" 
                        value={editValue} 
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => saveInlineEdit(product)}
                        onKeyDown={(e) => e.key === 'Enter' && saveInlineEdit(product)}
                        autoFocus
                        className="w-20 px-2 py-1 text-sm border-gray-300 rounded focus:ring-brand-charcoal"
                      />
                    ) : (
                      <span 
                        className="cursor-pointer border-b border-dashed border-gray-400 hover:text-brand-gold transition-colors"
                        onClick={() => startInlineEdit(product, "stock")}
                      >
                        {product.stock}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={product.stock > 0 ? "Active" : "Archived"} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${product.id}`} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => {
                          if (confirm(`Delete ${product.name}?`)) deleteProductAPI(product.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {paginatedProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
