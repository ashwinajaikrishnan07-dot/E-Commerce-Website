"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useViewportStore, useDesignStore } from "@/store";
import { cn } from "@/lib/utils";

// ============================================================
// TEXTURE SELECTOR
// Grid of available fabric textures for the selected region.
// Supports filtering by fabric type and material.
// ============================================================

/** Mock fabric data — in production fetched from API */
const MOCK_TEXTURES = [
  { id: "tex-1", name: "Banarasi Silk", category: "Silk", thumbnail: "/textures/thumb/banarasi.jpg" },
  { id: "tex-2", name: "Raw Silk", category: "Silk", thumbnail: "/textures/thumb/raw-silk.jpg" },
  { id: "tex-3", name: "Chanderi", category: "Cotton", thumbnail: "/textures/thumb/chanderi.jpg" },
  { id: "tex-4", name: "Organza", category: "Sheer", thumbnail: "/textures/thumb/organza.jpg" },
  { id: "tex-5", name: "Velvet", category: "Rich", thumbnail: "/textures/thumb/velvet.jpg" },
  { id: "tex-6", name: "Georgette", category: "Sheer", thumbnail: "/textures/thumb/georgette.jpg" },
  { id: "tex-7", name: "Brocade", category: "Rich", thumbnail: "/textures/thumb/brocade.jpg" },
  { id: "tex-8", name: "Chiffon", category: "Sheer", thumbnail: "/textures/thumb/chiffon.jpg" },
  { id: "tex-9", name: "Jacquard", category: "Woven", thumbnail: "/textures/thumb/jacquard.jpg" },
  { id: "tex-10", name: "Cotton Khadi", category: "Cotton", thumbnail: "/textures/thumb/khadi.jpg" },
  { id: "tex-11", name: "Tussar Silk", category: "Silk", thumbnail: "/textures/thumb/tussar.jpg" },
  { id: "tex-12", name: "Net Fabric", category: "Sheer", thumbnail: "/textures/thumb/net.jpg" },
];

const FABRIC_CATEGORIES = ["All", "Silk", "Cotton", "Sheer", "Rich", "Woven"];

export function TextureSelector() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const applyTexture = useDesignStore((s) => s.applyTexture);
  const appliedDesigns = useDesignStore((s) => s.appliedDesigns);

  const currentTextureId = selectedRegion
    ? appliedDesigns[selectedRegion]?.textureId
    : null;

  const filteredTextures = MOCK_TEXTURES.filter((tex) => {
    const matchesSearch = tex.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || tex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (textureId: string) => {
    if (selectedRegion) {
      applyTexture(selectedRegion, textureId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input
          placeholder="Search fabrics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1.5">
        {FABRIC_CATEGORIES.map((cat) => (
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

      {/* Texture grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {filteredTextures.map((tex) => (
          <button
            key={tex.id}
            onClick={() => handleSelect(tex.id)}
            className={cn(
              "group relative rounded-xl overflow-hidden border transition-all duration-200 aspect-[4/5]",
              currentTextureId === tex.id
                ? "border-violet-500 ring-2 ring-violet-500/30"
                : "border-white/10 hover:border-white/20"
            )}
          >
            {/* Texture thumbnail placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02]">
              {/* Simulated fabric pattern */}
              <div className="absolute inset-0 opacity-30">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)`,
                  }}
                />
              </div>
            </div>

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-[10px] font-medium text-white truncate">
                {tex.name}
              </p>
            </div>

            {/* Selected indicator */}
            {currentTextureId === tex.id && (
              <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-violet-500 flex items-center justify-center">
                <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {filteredTextures.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-white/40">No fabrics found</p>
        </div>
      )}
    </div>
  );
}
