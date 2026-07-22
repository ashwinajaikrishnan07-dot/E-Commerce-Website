"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useViewportStore, useDesignStore } from "@/store";
import { cn } from "@/lib/utils";

// ============================================================
// COMPONENT SELECTOR
// Grid of available clothing components for the selected region.
// Supports search, categories, and preview thumbnails.
// ============================================================

/** Mock component data — in production this comes from the API */
const MOCK_COMPONENTS = [
  { id: "comp-1", name: "Classic Round", category: "Traditional", thumbnail: "/thumbnails/classic-round.jpg" },
  { id: "comp-2", name: "V-Neck Deep", category: "Modern", thumbnail: "/thumbnails/v-neck-deep.jpg" },
  { id: "comp-3", name: "Sweetheart", category: "Designer", thumbnail: "/thumbnails/sweetheart.jpg" },
  { id: "comp-4", name: "Boat Neck", category: "Western", thumbnail: "/thumbnails/boat-neck.jpg" },
  { id: "comp-5", name: "Mandarin Collar", category: "Traditional", thumbnail: "/thumbnails/mandarin.jpg" },
  { id: "comp-6", name: "Peter Pan", category: "Vintage", thumbnail: "/thumbnails/peter-pan.jpg" },
  { id: "comp-7", name: "Keyhole Back", category: "Designer", thumbnail: "/thumbnails/keyhole.jpg" },
  { id: "comp-8", name: "Off Shoulder", category: "Modern", thumbnail: "/thumbnails/off-shoulder.jpg" },
];

const CATEGORIES = ["All", "Traditional", "Modern", "Designer", "Western", "Vintage"];

export function ComponentSelector() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const applyComponent = useDesignStore((s) => s.applyComponent);
  const appliedDesigns = useDesignStore((s) => s.appliedDesigns);

  const currentComponentId = selectedRegion
    ? appliedDesigns[selectedRegion]?.componentId
    : null;

  const filteredComponents = MOCK_COMPONENTS.filter((comp) => {
    const matchesSearch = comp.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || comp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (componentId: string) => {
    if (selectedRegion) {
      applyComponent(selectedRegion, componentId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input
          placeholder="Search designs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
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

      {/* Component grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredComponents.map((comp) => (
          <button
            key={comp.id}
            onClick={() => handleSelect(comp.id)}
            className={cn(
              "group relative rounded-xl overflow-hidden border transition-all duration-200 aspect-square",
              currentComponentId === comp.id
                ? "border-violet-500 ring-2 ring-violet-500/30 shadow-lg shadow-violet-500/10"
                : "border-white/10 hover:border-white/20 hover:shadow-md"
            )}
          >
            {/* Placeholder thumbnail */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] group-hover:from-white/10 group-hover:to-white/5 transition-all duration-300" />

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-xs font-medium text-white truncate">
                {comp.name}
              </p>
              <p className="text-[10px] text-white/40">{comp.category}</p>
            </div>

            {/* Selected indicator */}
            {currentComponentId === comp.id && (
              <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-violet-500 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {filteredComponents.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-white/40">No designs found</p>
        </div>
      )}
    </div>
  );
}
