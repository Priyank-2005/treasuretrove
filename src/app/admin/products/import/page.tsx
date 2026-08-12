"use client";

import { useState } from "react";
import { Upload, FileSpreadsheet, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import Papa from "papaparse";
import { useAdmin } from "@/context/AdminContext";
import { Product } from "@/data/products";

export default function ImportProductsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [status, setStatus] = useState<"idle" | "parsing" | "preview" | "success">("idle");
  const { importProducts } = useAdmin();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    
    setFile(uploadedFile);
    setStatus("parsing");

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setPreview(results.data);
        setStatus("preview");
      },
      error: (error) => {
        console.error(error);
        alert("Failed to parse CSV file");
        setStatus("idle");
      }
    });
  };

  const handleImport = () => {
    // Convert parsed CSV rows to Product objects (Mock mapping)
    const newProducts: Product[] = preview.map((row, index) => ({
      id: `IMP-${Date.now()}-${index}`,
      name: row.name || `Imported Product ${index}`,
      slug: row.slug || `imported-product-${index}`,
      category: row.category || "Earrings",
      price: Number(row.price) || 999,
      stock: Number(row.stock) || 10,
      description: row.description || "Imported description",
      shortDescription: row.shortDescription || "Imported short description",
      images: ["/images/products/e1-1.png", "/images/products/e1-2.png"],
      material: row.material || "Stainless steel",
      careInstructions: row.careInstructions || "Wipe clean",
      features: ["Anti-Tarnish"],
      isNew: true,
      isBestSeller: false,
      isFeatured: false,
      rating: 5,
      reviewCount: 0,
    }));

    importProducts(newProducts);
    setStatus("success");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Import Products</h1>
          <p className="text-gray-500 mt-1">Upload a CSV file to add multiple products at once.</p>
        </div>
      </div>

      {status === "idle" || status === "parsing" ? (
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
          <div className="max-w-md mx-auto">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:bg-gray-50 transition-colors relative">
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm font-medium text-gray-900">Click to upload CSV file</p>
              <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
            </div>
            
            <div className="mt-8 flex items-center justify-between p-4 bg-blue-50 rounded-md border border-blue-100 text-left">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Need a template?</h4>
                  <p className="text-xs text-blue-700 mt-1">Download our sample CSV to see the required format.</p>
                </div>
              </div>
              <button className="text-sm font-medium text-blue-700 hover:underline">Download</button>
            </div>
          </div>
        </div>
      ) : null}

      {status === "preview" && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Import Preview</h2>
              <p className="text-sm text-gray-500 mt-1">{preview.length} products detected in {file?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setStatus("idle")} className="btn-secondary px-4 py-2 text-sm">Cancel</button>
              <button onClick={handleImport} className="btn-primary px-4 py-2 text-sm">Import {preview.length} Products</button>
            </div>
          </div>
          
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 border-b border-gray-200 shadow-sm">
                <tr>
                  {Object.keys(preview[0] || {}).map((key) => (
                    <th key={key} className="px-6 py-4 font-medium">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {preview.slice(0, 10).map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    {Object.values(row).map((val: any, j) => (
                      <td key={j} className="px-6 py-4 truncate max-w-xs">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {preview.length > 10 && (
            <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
              Showing first 10 rows. {preview.length - 10} more rows will be imported.
            </div>
          )}
        </div>
      )}

      {status === "success" && (
        <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Import Successful!</h2>
          <p className="text-gray-500 mb-8">
            Successfully imported {preview.length} products into your catalog.
          </p>
          <Link href="/admin/products" className="btn-primary">
            View Products
          </Link>
        </div>
      )}
    </div>
  );
}
