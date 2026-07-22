"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useViewportStore, useDesignStore } from "@/store";
import { REGION_COMPONENTS, getComponentCategories } from "@/data/region-designs";
import { REGION_LABELS } from "@/engine/constants";
import { cn } from "@/lib/utils";

// ============================================================
// COMPONENT SELECTOR
// Shows region-specific design options. Each body region gets
// its own curated catalog of relevant clothing components.
// ============================================================

export function ComponentSelector() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const applyComponent = useDesignStore((s) => s.applyComponent);
  const appliedDesigns = useDesignStore((s) => s.appliedDesigns);

  if (!selectedRegion) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-white/40">Select a body region to see designs</p>
      </div>
    );
  }

  const components = REGION_COMPONENTS[selectedRegion];
  const categories = getComponentCategories(selectedRegion);
  const currentComponentId = appliedDesigns[selectedRegion]?.componentId;

  const filtered = components.filter((comp) => {
    const matchesSearch = comp.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "All" || comp.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-4">
      {/* Region label */}
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-violet-500" />
        <span className="text-xs text-white/50">
          Designs for <span className="text-white/80 font-medium">{REGION_LABELS[selectedRegion]}</span>
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input placeholder={`Search ${REGION_LABELS[selectedRegion].toLowerCase()} designs...`} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={cn("px-2.5 py-1 text-xs rounded-md transition-all duration-200", selectedCategory === cat ? "bg-violet-600/30 text-violet-300 border border-violet-500/30" : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent")}>
            {cat}
          </button>
        ))}
      </div>

      {/* Design grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((comp) => (
          <button key={comp.id} onClick={() => applyComponent(selectedRegion, comp.id)} className={cn("group relative rounded-xl overflow-hidden border transition-all duration-200 p-4 text-left", currentComponentId === comp.id ? "border-violet-500 ring-2 ring-violet-500/30 bg-violet-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/5")}>
            <p className="text-sm font-medium text-white">{comp.name}</p>
            <p className="text-[10px] text-white/40 mt-0.5">{comp.category}</p>
            {currentComponentId === comp.id && (
              <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-violet-500 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-white/40">No designs found</p>
        </div>
      )}
    </div>
  );
}
