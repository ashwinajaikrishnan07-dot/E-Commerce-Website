import type { BodyRegion } from "@/types";

// ============================================================
// DESIGN VISUALS
// Maps applied design IDs to visual properties (color, roughness,
// metalness) that change the mannequin's appearance in real-time.
// ============================================================

export interface VisualProperties {
  color: string;
  roughness: number;
  metalness: number;
  opacity?: number;
  emissiveColor?: string;
  emissiveIntensity?: number;
}

/** Color swatches the user can pick from */
export const COLOR_PALETTE: Record<string, string> = {
  "royal-1": "#800020",
  "royal-2": "#4B0082",
  "royal-3": "#D4AF37",
  "royal-4": "#1B2A4A",
  "royal-5": "#046307",
  "royal-6": "#0F52BA",
  "bridal-1": "#CC0000",
  "bridal-2": "#E34234",
  "bridal-3": "#FF007F",
  "bridal-4": "#FF6F61",
  "bridal-5": "#FFCBA4",
  "bridal-6": "#F7E7CE",
  "pastel-1": "#E6E6FA",
  "pastel-2": "#B2DFDB",
  "pastel-3": "#89CFF0",
  "pastel-4": "#FFB6C1",
  "pastel-5": "#FFFFF0",
  "pastel-6": "#FFFACD",
  "earth-1": "#E2725B",
  "earth-2": "#FFDB58",
  "earth-3": "#6B8E23",
  "earth-4": "#B7410E",
  "earth-5": "#E97451",
  "earth-6": "#7B3F00",
};

/** Texture IDs map to material roughness/metalness tweaks */
export const TEXTURE_VISUALS: Record<string, Partial<VisualProperties>> = {
  // Silk family — smooth and slightly shiny
  "ntex-1": { roughness: 0.25, metalness: 0.08 },
  "chtex-1": { roughness: 0.2, metalness: 0.1 },
  "chtex-2": { roughness: 0.3, metalness: 0.06 },
  "sltex-3": { roughness: 0.25, metalness: 0.08 },
  "sktex-1": { roughness: 0.2, metalness: 0.1 },
  "dtex-4": { roughness: 0.25, metalness: 0.08 },
  "ftex-1": { roughness: 0.2, metalness: 0.1 },
  // Velvet — soft, no shine
  "chtex-3": { roughness: 0.85, metalness: 0.0 },
  "ctex-2": { roughness: 0.85, metalness: 0.0 },
  "sltex-6": { roughness: 0.85, metalness: 0.0 },
  "sktex-4": { roughness: 0.85, metalness: 0.0 },
  "ftex-2": { roughness: 0.85, metalness: 0.0 },
  // Brocade — woven with metallic threads
  "ctex-1": { roughness: 0.35, metalness: 0.2 },
  "chtex-4": { roughness: 0.35, metalness: 0.2 },
  "sktex-6": { roughness: 0.35, metalness: 0.2 },
  "btex-3": { roughness: 0.35, metalness: 0.2 },
  "ftex-3": { roughness: 0.35, metalness: 0.2 },
  // Sheer/Net — transparent look
  "ntex-2": { roughness: 0.5, metalness: 0.0, opacity: 0.6 },
  "stex-1": { roughness: 0.5, metalness: 0.0, opacity: 0.5 },
  "sltex-1": { roughness: 0.5, metalness: 0.0, opacity: 0.5 },
  "sltex-2": { roughness: 0.45, metalness: 0.0, opacity: 0.55 },
  "sltex-5": { roughness: 0.45, metalness: 0.0, opacity: 0.5 },
  "dtex-1": { roughness: 0.5, metalness: 0.0, opacity: 0.5 },
  "dtex-2": { roughness: 0.4, metalness: 0.0, opacity: 0.6 },
  "dtex-3": { roughness: 0.45, metalness: 0.0, opacity: 0.5 },
  "ltex-3": { roughness: 0.5, metalness: 0.0, opacity: 0.5 },
  "btex-2": { roughness: 0.5, metalness: 0.0, opacity: 0.5 },
  // Georgette — flowy medium opacity
  "sktex-3": { roughness: 0.5, metalness: 0.0, opacity: 0.75 },
  "dtex-5": { roughness: 0.5, metalness: 0.0, opacity: 0.7 },
  // Lace
  "stex-3": { roughness: 0.6, metalness: 0.0, opacity: 0.7 },
  "sltex-4": { roughness: 0.6, metalness: 0.0, opacity: 0.7 },
  // Metal (waist jewelry)
  "wtex-1": { roughness: 0.15, metalness: 0.85 },
  "wtex-3": { roughness: 0.2, metalness: 0.7 },
  // Zardozi base
  "ftex-4": { roughness: 0.3, metalness: 0.3 },
  "ctex-3": { roughness: 0.3, metalness: 0.35 },
};

/** Embroidery IDs map to emissive glow (simulating gold/silver threadwork) */
export const EMBROIDERY_VISUALS: Record<string, Partial<VisualProperties>> = {
  // Heavy gold work — strong glow
  "chemb-1": { emissiveColor: "#D4AF37", emissiveIntensity: 0.15 },
  "cemb-1": { emissiveColor: "#D4AF37", emissiveIntensity: 0.15 },
  "wemb-2": { emissiveColor: "#D4AF37", emissiveIntensity: 0.18 },
  "skemb-1": { emissiveColor: "#D4AF37", emissiveIntensity: 0.12 },
  "skemb-2": { emissiveColor: "#D4AF37", emissiveIntensity: 0.12 },
  "lemb-1": { emissiveColor: "#D4AF37", emissiveIntensity: 0.12 },
  "demb-3": { emissiveColor: "#D4AF37", emissiveIntensity: 0.12 },
  "femb-2": { emissiveColor: "#D4AF37", emissiveIntensity: 0.15 },
  "chemb-6": { emissiveColor: "#D4AF37", emissiveIntensity: 0.14 },
  // Medium work
  "chemb-2": { emissiveColor: "#C0A030", emissiveIntensity: 0.08 },
  "chemb-5": { emissiveColor: "#D4AF37", emissiveIntensity: 0.08 },
  "cemb-2": { emissiveColor: "#C0C0C0", emissiveIntensity: 0.08 },
  "skemb-3": { emissiveColor: "#D4AF37", emissiveIntensity: 0.06 },
  "skemb-4": { emissiveColor: "#D4AF37", emissiveIntensity: 0.07 },
  "skemb-6": { emissiveColor: "#D4AF37", emissiveIntensity: 0.08 },
  "slemb-2": { emissiveColor: "#D4AF37", emissiveIntensity: 0.1 },
  "slemb-3": { emissiveColor: "#D4AF37", emissiveIntensity: 0.06 },
  "femb-3": { emissiveColor: "#D4AF37", emissiveIntensity: 0.08 },
  "demb-5": { emissiveColor: "#D4AF37", emissiveIntensity: 0.08 },
  // Light work — subtle shimmer
  "chemb-3": { emissiveColor: "#C0C0C0", emissiveIntensity: 0.05 },
  "chemb-4": { emissiveColor: "#FFFFFF", emissiveIntensity: 0.03 },
  "nemb-1": { emissiveColor: "#C0C0C0", emissiveIntensity: 0.05 },
  "nemb-2": { emissiveColor: "#FFFFFF", emissiveIntensity: 0.03 },
  "slemb-1": { emissiveColor: "#D4AF37", emissiveIntensity: 0.04 },
  "slemb-4": { emissiveColor: "#D4AF37", emissiveIntensity: 0.04 },
  "skemb-5": { emissiveColor: "#D4AF37", emissiveIntensity: 0.04 },
  "demb-4": { emissiveColor: "#C0C0C0", emissiveIntensity: 0.04 },
  "femb-4": { emissiveColor: "#D4AF37", emissiveIntensity: 0.03 },
  // Pearl/Bridal
  "cemb-3": { emissiveColor: "#FFFFF0", emissiveIntensity: 0.06 },
  "semb-2": { emissiveColor: "#FFFFF0", emissiveIntensity: 0.05 },
  "wemb-1": { emissiveColor: "#C0C0C0", emissiveIntensity: 0.12 },
};
