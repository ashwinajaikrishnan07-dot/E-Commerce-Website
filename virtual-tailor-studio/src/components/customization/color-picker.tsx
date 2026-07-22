"use client";

import { useState, useCallback } from "react";
import { useViewportStore, useDesignStore } from "@/store";
import { cn } from "@/lib/utils";

// ============================================================
// COLOR PICKER
// Premium color selection with swatches, categories,
// and a custom hex input for precise control.
// ============================================================

interface ColorCategory {
  name: string;
  colors: { id: string; name: string; hex: string }[];
}

/** Curated color palette for Indian traditional wear */
const COLOR_CATEGORIES: ColorCategory[] = [
  {
    name: "Royal",
    colors: [
      { id: "royal-1", name: "Deep Maroon", hex: "#800020" },
      { id: "royal-2", name: "Imperial Purple", hex: "#4B0082" },
      { id: "royal-3", name: "Maharani Gold", hex: "#D4AF37" },
      { id: "royal-4", name: "Navy Silk", hex: "#1B2A4A" },
      { id: "royal-5", name: "Emerald Dynasty", hex: "#046307" },
      { id: "royal-6", name: "Sapphire Blue", hex: "#0F52BA" },
    ],
  },
  {
    name: "Bridal",
    colors: [
      { id: "bridal-1", name: "Auspicious Red", hex: "#CC0000" },
      { id: "bridal-2", name: "Sindoor", hex: "#E34234" },
      { id: "bridal-3", name: "Rose Pink", hex: "#FF007F" },
      { id: "bridal-4", name: "Coral Dream", hex: "#FF6F61" },
      { id: "bridal-5", name: "Peach Blush", hex: "#FFCBA4" },
      { id: "bridal-6", name: "Champagne", hex: "#F7E7CE" },
    ],
  },
  {
    name: "Pastel",
    colors: [
      { id: "pastel-1", name: "Lavender Mist", hex: "#E6E6FA" },
      { id: "pastel-2", name: "Mint Cream", hex: "#B2DFDB" },
      { id: "pastel-3", name: "Baby Blue", hex: "#89CFF0" },
      { id: "pastel-4", name: "Blush", hex: "#FFB6C1" },
      { id: "pastel-5", name: "Ivory", hex: "#FFFFF0" },
      { id: "pastel-6", name: "Powder Yellow", hex: "#FFFACD" },
    ],
  },
  {
    name: "Earth",
    colors: [
      { id: "earth-1", name: "Terracotta", hex: "#E2725B" },
      { id: "earth-2", name: "Mustard", hex: "#FFDB58" },
      { id: "earth-3", name: "Olive", hex: "#6B8E23" },
      { id: "earth-4", name: "Rust", hex: "#B7410E" },
      { id: "earth-5", name: "Burnt Sienna", hex: "#E97451" },
      { id: "earth-6", name: "Chocolate", hex: "#7B3F00" },
    ],
  },
];

export function ColorPicker() {
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [customHex, setCustomHex] = useState("");

  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const applyColor = useDesignStore((s) => s.applyColor);
  const appliedDesigns = useDesignStore((s) => s.appliedDesigns);

  const currentColorId = selectedRegion
    ? appliedDesigns[selectedRegion]?.colorId
    : null;

  const handleColorSelect = useCallback(
    (colorId: string) => {
      if (selectedRegion) {
        applyColor(selectedRegion, colorId);
      }
    },
    [selectedRegion, applyColor]
  );

  const handleCustomColor = useCallback(() => {
    if (selectedRegion && /^#[0-9A-Fa-f]{6}$/.test(customHex)) {
      applyColor(selectedRegion, `custom-${customHex}`);
    }
  }, [selectedRegion, customHex, applyColor]);

  const activeCategory = COLOR_CATEGORIES[selectedCategoryIdx];

  return (
    <div className="space-y-5">
      {/* Category tabs */}
      <div className="flex gap-1.5">
        {COLOR_CATEGORIES.map((cat, idx) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategoryIdx(idx)}
            className={cn(
              "px-2.5 py-1 text-xs rounded-md transition-all duration-200",
              selectedCategoryIdx === idx
                ? "bg-violet-600/30 text-violet-300 border border-violet-500/30"
                : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Color swatches */}
      <div className="grid grid-cols-6 gap-3">
        {activeCategory.colors.map((color) => (
          <button
            key={color.id}
            onClick={() => handleColorSelect(color.id)}
            className={cn(
              "group relative aspect-square rounded-full transition-all duration-200",
              currentColorId === color.id
                ? "ring-2 ring-white ring-offset-2 ring-offset-black/80 scale-110"
                : "hover:scale-110"
            )}
            style={{ backgroundColor: color.hex }}
            aria-label={color.name}
            title={color.name}
          >
            {/* Selection checkmark */}
            {currentColorId === color.id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-white drop-shadow-md"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Color name */}
      {currentColorId && (
        <p className="text-xs text-white/50 text-center">
          {activeCategory.colors.find((c) => c.id === currentColorId)?.name}
        </p>
      )}

      {/* Custom hex input */}
      <div className="pt-2 border-t border-white/10">
        <label className="text-xs text-white/50 mb-2 block">Custom Color</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">
              #
            </span>
            <input
              type="text"
              value={customHex.replace("#", "")}
              onChange={(e) => setCustomHex(`#${e.target.value}`)}
              placeholder="FF5733"
              maxLength={6}
              className="w-full h-9 pl-7 pr-3 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono"
            />
          </div>
          {customHex.length === 7 && (
            <div
              className="h-9 w-9 rounded-lg border border-white/20"
              style={{ backgroundColor: customHex }}
            />
          )}
          <button
            onClick={handleCustomColor}
            disabled={!/^#[0-9A-Fa-f]{6}$/.test(customHex)}
            className="h-9 px-3 text-xs font-medium text-white bg-violet-600 rounded-lg disabled:opacity-40 hover:bg-violet-500 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
