"use client";

import { useMemo } from "react";
import { useDesignStore } from "@/store";
import { COLOR_PALETTE, TEXTURE_VISUALS, EMBROIDERY_VISUALS } from "@/data/design-visuals";
import type { BodyRegion } from "@/types";

// ============================================================
// USE REGION VISUALS
// Computes the final material properties for a body region
// based on all applied designs (color + texture + embroidery).
// The mannequin components use this to update their appearance.
// ============================================================

/** Default garment colors per region */
const DEFAULT_COLORS: Record<BodyRegion, string> = {
  neck: "#e8d5c4",
  collar: "#8B0000",
  chest: "#CC0000",
  shoulders: "#8B0000",
  sleeves: "#CC0000",
  waist: "#D4AF37",
  skirt: "#CC0000",
  legs: "#AA0000",
  dupatta: "#FF6B00",
  back: "#6B0000",
  front: "#CC0000",
};

export interface RegionVisuals {
  color: string;
  roughness: number;
  metalness: number;
  opacity: number;
  transparent: boolean;
  emissiveColor: string;
  emissiveIntensity: number;
}

export function useRegionVisuals(region: BodyRegion): RegionVisuals {
  const appliedDesigns = useDesignStore((s) => s.appliedDesigns);
  const design = appliedDesigns[region];

  return useMemo(() => {
    let color = DEFAULT_COLORS[region];
    let roughness = 0.45;
    let metalness = 0.05;
    let opacity = 1.0;
    let emissiveColor = "#000000";
    let emissiveIntensity = 0;

    // Apply color if selected
    if (design?.colorId) {
      // Check if it's a custom hex color
      if (design.colorId.startsWith("custom-#")) {
        color = design.colorId.replace("custom-", "");
      } else if (COLOR_PALETTE[design.colorId]) {
        color = COLOR_PALETTE[design.colorId];
      }
    }

    // Apply texture material properties
    if (design?.textureId && TEXTURE_VISUALS[design.textureId]) {
      const texVis = TEXTURE_VISUALS[design.textureId];
      if (texVis.roughness !== undefined) roughness = texVis.roughness;
      if (texVis.metalness !== undefined) metalness = texVis.metalness;
      if (texVis.opacity !== undefined) opacity = texVis.opacity;
    }

    // Apply embroidery glow
    if (design?.embroideryId && EMBROIDERY_VISUALS[design.embroideryId]) {
      const embVis = EMBROIDERY_VISUALS[design.embroideryId];
      if (embVis.emissiveColor) emissiveColor = embVis.emissiveColor;
      if (embVis.emissiveIntensity) emissiveIntensity = embVis.emissiveIntensity;
    }

    // If embroidery has a custom thread color, use that for emissive
    if (design?.embroideryColor && emissiveIntensity > 0) {
      emissiveColor = design.embroideryColor;
    }

    return {
      color,
      roughness,
      metalness,
      opacity,
      transparent: opacity < 1.0,
      emissiveColor,
      emissiveIntensity,
    };
  }, [region, design]);
}
