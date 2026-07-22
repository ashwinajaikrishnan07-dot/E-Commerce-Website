"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useViewportStore, useDesignStore } from "@/store";
import { REGION_TEXTURES, getTextureCategories } from "@/data/region-designs";
import { REGION_LABELS } from "@/engine/constants";
import { cn } from "@/lib/utils";

// ============================================================
// TEXTURE SELECTOR
// Shows region-specific fabric options.
// ============================================================

export function TextureSelector() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const applyTexture = useDesignStore((s) => s.applyTexture);
  const appliedDesigns = useDesignStore((s) => s.appliedDesigns);

  if (!selectedRegion) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-white/40">Select a body region to see fabrics</p>
      </div>
    );
  }

  const textures = REGION_TEXTURES[selectedRegion];
  const categories = getTextureCategories(selectedRegion);
  const currentTextureId = appliedDesigns[selectedRegion]?.textureId;

  const filtered = textures.filter((tex) => {
    const matchesSearch = tex.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "All" || tex.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-xs text-white/50">
          Fabrics for <span className="text-white/80 font-medium">{REGION_LABELS[selectedRegion]}</span>
        </span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input placeholder="Search fabrics..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={cn("px-2.5 py-1 text-xs rounded-md transition-all duration-200", selectedCategory === cat ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/30" : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent")}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {filtered.map((tex) => (
          <button key={tex.id} onClick={() => applyTexture(selectedRegion, tex.id)} className={cn("group relative rounded-xl overflow-hidden border transition-all duration-200 p-3 text-center", currentTextureId === tex.id ? "border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/5")}>
            {/* Fabric swatch placeholder */}
            <div className="h-10 w-full rounded-lg mb-2 bg-gradient-to-br from-white/10 to-white/[0.02]" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.03) 6px)` }} />
            <p className="text-[11px] font-medium text-white truncate">{tex.name}</p>
            <p className="text-[9px] text-white/30">{tex.category}</p>
            {currentTextureId === tex.id && (
              <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center">
                <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-8 text-center"><p className="text-sm text-white/40">No fabrics available</p></div>
      )}
    </div>
  );
}
