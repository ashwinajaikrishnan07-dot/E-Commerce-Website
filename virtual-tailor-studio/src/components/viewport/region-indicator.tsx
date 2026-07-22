"use client";

import { useViewportStore } from "@/store";
import { REGION_LABELS } from "@/engine/constants";
import { Badge } from "@/components/ui/badge";

/**
 * RegionIndicator
 * Displays the currently hovered/selected body region name
 * as a floating badge in the viewport.
 */
export function RegionIndicator() {
  const hoveredRegion = useViewportStore((s) => s.hoveredRegion);
  const selectedRegion = useViewportStore((s) => s.selectedRegion);

  const activeRegion = hoveredRegion || selectedRegion;

  if (!activeRegion) return null;

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <Badge
        variant={selectedRegion ? "default" : "secondary"}
        className="px-4 py-1.5 text-sm font-medium backdrop-blur-sm animate-in fade-in-0 slide-in-from-top-2 duration-200"
      >
        {REGION_LABELS[activeRegion]}
      </Badge>
    </div>
  );
}
