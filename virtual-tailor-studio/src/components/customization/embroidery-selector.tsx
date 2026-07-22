"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useViewportStore, useDesignStore } from "@/store";
import { REGION_EMBROIDERY, getEmbroideryCategories } from "@/data/region-designs";
import { REGION_LABELS } from "@/engine/constants";
import { cn } from "@/lib/utils";

// ============================================================
// EMBROIDERY SELECTOR
// Shows region-specific embroidery patterns with thread colors.
// ============================================================

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

export function EmbroiderySelector() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [threadColor, setThreadColor] = useState("gold");

  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const applyEmbroidery = useDesignStore((s) => s.applyEmbroidery);
  const appliedDesigns = useDesignStore((s) => s.appliedDesigns);

  if (!selectedRegion) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-white/40">Select a region first</p>
      </div>
    );
  }

  const embroidery = REGION_EMBROIDERY[selectedRegion];
  const categories = getEmbroideryCategories(selectedRegion);
  const currentId = appliedDesigns[selectedRegion]?.embroideryId;

  const filtered = embroidery.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "All" || e.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleSelect = (id: string) => {
    const hex = THREAD_COLORS.find((c) => c.id === threadColor)?.hex || "#D4AF37";
    applyEmbroidery(selectedRegion, id, hex);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-amber-500" />
        <span className="text-xs text-white/50">
          Embroidery for <span className="text-white/80 font-medium">{REGION_LABELS[selectedRegion]}</span>
        </span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input placeholder="Search patterns..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={cn("px-2.5 py-1 text-xs rounded-md transition-all duration-200", selectedCategory === cat ? "bg-amber-600/30 text-amber-300 border border-amber-500/30" : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent")}>
            {cat}
          </button>
        ))}
      </div>

      {/* Thread color */}
      <div>
        <label className="text-xs text-white/50 mb-2 block">Thread Color</label>
        <div className="flex gap-2">
          {THREAD_COLORS.map((c) => (
            <button key={c.id} onClick={() => setThreadColor(c.id)} className={cn("h-6 w-6 rounded-full border transition-all", threadColor === c.id ? "ring-2 ring-white ring-offset-1 ring-offset-black/80 scale-110 border-white/40" : "border-white/10 hover:scale-110")} style={{ backgroundColor: c.hex }} title={c.name} aria-label={c.name} />
          ))}
        </div>
      </div>

      {/* Pattern grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {filtered.map((emb) => (
          <button key={emb.id} onClick={() => handleSelect(emb.id)} className={cn("group relative rounded-xl border transition-all duration-200 p-3 text-left", currentId === emb.id ? "border-amber-500 ring-2 ring-amber-500/30 bg-amber-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/5")}>
            <p className="text-sm font-medium text-white">{emb.name}</p>
            <p className="text-[10px] text-white/40 mt-0.5">{emb.category}</p>
            {currentId === emb.id && (
              <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-amber-500 flex items-center justify-center">
                <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-8 text-center"><p className="text-sm text-white/40">No patterns available</p></div>
      )}
    </div>
  );
}
