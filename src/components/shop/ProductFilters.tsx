"use client";

import { CATEGORIES } from "@/data/categories";
import { Check, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  selectedCategories: string[];
  selectedFeatures: string[];
  onCategoryToggle: (categoryId: string) => void;
  onFeatureToggle: (feature: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const FEATURES = ["Anti-Tarnish", "Water Resistant", "Skin Friendly", "Best Seller", "New"];

export function ProductFilters({
  selectedCategories,
  selectedFeatures,
  onCategoryToggle,
  onFeatureToggle,
  isOpen,
  setIsOpen,
}: ProductFiltersProps) {
  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center gap-2 border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-brand-champagne transition-colors w-full justify-center mb-6"
      >
        <SlidersHorizontal className="w-4 h-4" />
        {isOpen ? "Hide Filters" : "Show Filters"}
      </button>

      <div className={cn("flex flex-col gap-8", isOpen ? "block" : "hidden md:flex")}>
        {/* Categories */}
        <div>
          <h4 className="font-medium mb-4 uppercase tracking-wider text-sm border-b border-brand-champagne pb-2">
            Categories
          </h4>
          <div className="flex flex-col gap-3">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryToggle(category.id)}
                  className="flex items-center gap-3 text-left hover:text-brand-gold transition-colors"
                >
                  <div className={cn("w-4 h-4 border flex items-center justify-center transition-colors", isSelected ? "bg-brand-charcoal border-brand-charcoal" : "border-gray-300")}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 className="font-medium mb-4 uppercase tracking-wider text-sm border-b border-brand-champagne pb-2">
            Features
          </h4>
          <div className="flex flex-col gap-3">
            {FEATURES.map((feature) => {
              const isSelected = selectedFeatures.includes(feature);
              return (
                <button
                  key={feature}
                  onClick={() => onFeatureToggle(feature)}
                  className="flex items-center gap-3 text-left hover:text-brand-gold transition-colors"
                >
                  <div className={cn("w-4 h-4 border flex items-center justify-center transition-colors", isSelected ? "bg-brand-charcoal border-brand-charcoal" : "border-gray-300")}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm">{feature}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
