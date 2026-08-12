"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export function QuantitySelector({ quantity, onIncrease, onDecrease }: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-gray-300">
      <button
        onClick={onDecrease}
        className="px-4 py-3 text-gray-600 hover:bg-brand-champagne transition-colors disabled:opacity-50"
        disabled={quantity <= 1}
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="px-6 py-2 font-medium">{quantity}</span>
      <button
        onClick={onIncrease}
        className="px-4 py-3 text-gray-600 hover:bg-brand-champagne transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
