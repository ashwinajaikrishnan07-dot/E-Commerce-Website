"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useViewportStore, useDesignStore } from "@/store";
import { cn } from "@/lib/utils";

// ============================================================
// EMBROIDERY SELECTOR
// Browse and apply embroidery patterns to the selected region.
// Includes pattern preview and thread color selection.
// ============================================================

const MOCK_EMBROIDERY = [
  { id: "emb-1", name: "Zardozi", category: "Heavy", thumbnail: "/embroidery/thumb/zardozi.jpg" },
  { id: "emb-2", name: "Chikankari", category: "Light", thumbnail: "/embroidery/thumb/chikankari.jpg" },
  { id: "emb-3", name: "Aari Work", category: "Medium", thumbnail: "/embroidery/thumb/aari.jpg" },
  { id: "emb-4", name: "Mirror Work", category: "Heavy", thumbnail: "/embroidery/thumb/mirror.jpg" },
  { id: "emb-5", name: "Sequin Spray", category: "Medium", thumbnail: "/embroidery/thumb/sequin.jpg" },
  { id: "emb-6", name: "Thread Work", category: "Light", thumbnail: "/embroidery/thumb/thread.jpg" },
  { id: "emb-7", name: "Cutdana", category: "Heavy", thumbnail: "/embroidery/thumb/cutdana.jpg" },
  { id: "emb-8", name: "Resham", category: "Medium", thumbnail: "/embroidery/thumb/resham.jpg" },
  { id: "emb-9", name: "Gota Patti", category: "Medium", thumbnail: "/embroidery/thumb/gota.jpg" },
];

const THREAD_COLORS = [
  { id: "gold", hex: "#D4AF37", name: "Gold" },
  { id: "silver", hex: "#C0C0C0", name: "Silver" },
  { id: "rose-gold", hex: "#B76E79", name: "Rose Gold" },
  { id: "copper", hex: "#B87333", name: "Copper" },
  { id: "ivory", hex: "#FFFFF0", name: "Ivory" },
  { id: "white", hex: "#FFFFFF", name: "White" },
  { id: "maroon", hex: "#800000", name: "Maroon" },
  { id: "navy", hex: "#000080", name: "Navy" },
];

const EMBROIDERY_CATEGORIES = ["All", "Light", "Medium", "Heavy"];

export function EmbroiderySelector() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedThreadColor, setSelectedThreadColor] = useState("gold");

  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const applyEmbroidery = useDesignStore((s) => s.applyEmbroidery);
  const appliedDesigns = useDesignStore((s) => s.appliedDesigns);

  const currentEmbroideryId = selectedRegion
    ? appliedDesigns[selectedRegion]?.embroideryId
    : null;

  const filteredEmbroidery = MOCK_EMBROIDERY.filter((emb) => {
    const matchesSearch = emb.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || emb.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (embroideryId: string) => {
    if (selectedRegion) {
      const threadHex =
        THREAD_COLORS.find((c) => c.id === selectedThreadColor)?.hex || "#D4AF37";
      applyEmbroidery(selectedRegion, embroideryId, threadHex);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input
          placeholder="Search embroidery..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1.5">
        {EMBROIDERY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-2.5 py-1 text-xs rounded-md transition-all duration-200",
              selectedCategory === cat
                ? "bg-violet-600/30 text-violet-300 border border-violet-500/30"
                : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Thread color selection */}
      <div>
        <label className="text-xs text-white/50 mb-2 block">Thread Color</label>
        <div className="flex gap-2">
          {THREAD_COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedThreadColor(color.id)}
              className={cn(
                "h-6 w-6 rounded-full transition-all duration-200 border",
                selectedThreadColor === color.id
                  ? "ring-2 ring-white ring-offset-1 ring-offset-black/80 scale-110 border-white/40"
                  : "border-white/10 hover:scale-110"
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={color.name}
            />
          ))}
        </div>
      </div>

      {/* Embroidery grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {filteredEmbroidery.map((emb) => (
          <button
            key={emb.id}
            onClick={() => handleSelect(emb.id)}
            className={cn(
              "group relative rounded-xl overflow-hidden border transition-all duration-200 aspect-square",
              currentEmbroideryId === emb.id
                ? "border-violet-500 ring-2 ring-violet-500/30"
                : "border-white/10 hover:border-white/20"
            )}
          >
            {/* Pattern placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center">
                  <span className="text-[10px] text-white/30">✦</span>
                </div>
              </div>
            </div>

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-[10px] font-medium text-white truncate">
                {emb.name}
              </p>
            </div>

            {currentEmbroideryId === emb.id && (
              <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-violet-500 flex items-center justify-center">
                <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {filteredEmbroidery.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-white/40">No patterns found</p>
        </div>
      )}
    </div>
  );
}
