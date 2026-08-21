"use client";

import { Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { SortDropdown, SortOption } from "@/components/shop/SortDropdown";
import { useState, useMemo, useEffect } from "react";
import { Loader2 } from "lucide-react";

function ShopContent({ initialCategory }: { initialCategory: string }) {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([initialCategory]);
  
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    initialFilter === "new" ? ["New"] : initialFilter === "best-seller" ? ["Best Seller"] : []
  );
  
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category.toLowerCase()));
    }

    if (selectedFeatures.length > 0) {
      result = result.filter((p) => {
        const hasFeatures = selectedFeatures.filter(f => f !== "New" && f !== "Best Seller").every(f => p.features.includes(f));
        const hasNew = selectedFeatures.includes("New") ? p.isNew : true;
        const hasBestSeller = selectedFeatures.includes("Best Seller") ? p.isBestSeller : true;
        return hasFeatures && hasNew && hasBestSeller;
      });
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
      case "best-selling":
        result.sort((a, b) => (a.isBestSeller === b.isBestSeller ? 0 : a.isBestSeller ? -1 : 1));
        break;
      case "featured":
      default:
        result.sort((a, b) => (a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1));
        break;
    }

    return result;
  }, [products, selectedCategories, selectedFeatures, sortBy]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold-mid mx-auto" />
        <p className="text-gray-500 mt-4">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1) }]} />
      
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-4">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl font-medium mb-2">
            {initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1)}
          </h1>
          <p className="text-gray-500">Everyday pieces designed to shine longer. ({filteredProducts.length} items)</p>
        </div>
        
        <SortDropdown value={sortBy} onChange={setSortBy} />
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-64 flex-shrink-0">
          <ProductFilters
            selectedCategories={selectedCategories}
            selectedFeatures={selectedFeatures}
            onCategoryToggle={handleCategoryToggle}
            onFeatureToggle={handleFeatureToggle}
            isOpen={isMobileFiltersOpen}
            setIsOpen={setIsMobileFiltersOpen}
          />
        </aside>

        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <ProductGrid columns={3}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductGrid>
          ) : (
            <div className="text-center py-24 text-gray-500">
              <p className="text-lg">No pieces found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedFeatures([]);
                }}
                className="btn-secondary mt-6"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-24 text-center">Loading...</div>}>
      <ShopContent initialCategory={resolvedParams.category} />
    </Suspense>
  );
}
