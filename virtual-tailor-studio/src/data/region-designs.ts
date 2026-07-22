import type { BodyRegion } from "@/types";

// ============================================================
// REGION-SPECIFIC DESIGN CATALOGS
// Each body region has its own curated set of design options.
// No neck designs in sleeves, no sleeve designs in skirt, etc.
// ============================================================

export interface DesignOption {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface TextureOption {
  id: string;
  name: string;
  category: string;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface EmbroideryOption {
  id: string;
  name: string;
  category: string;
}

/** Region-specific component designs */
export const REGION_COMPONENTS: Record<BodyRegion, DesignOption[]> = {
  neck: [
    { id: "neck-1", name: "Round Neckline", category: "Classic" },
    { id: "neck-2", name: "V-Neck", category: "Modern" },
    { id: "neck-3", name: "Sweetheart", category: "Bridal" },
    { id: "neck-4", name: "Halter", category: "Modern" },
    { id: "neck-5", name: "Square Neck", category: "Classic" },
    { id: "neck-6", name: "Keyhole", category: "Designer" },
  ],
  collar: [
    { id: "collar-1", name: "Mandarin Collar", category: "Traditional" },
    { id: "collar-2", name: "Peter Pan", category: "Vintage" },
    { id: "collar-3", name: "Band Collar", category: "Minimalist" },
    { id: "collar-4", name: "Collared V", category: "Fusion" },
    { id: "collar-5", name: "High Collar", category: "Royal" },
    { id: "collar-6", name: "Ruffle Collar", category: "Designer" },
  ],
  chest: [
    { id: "chest-1", name: "Fitted Blouse", category: "Traditional" },
    { id: "chest-2", name: "Peplum Blouse", category: "Modern" },
    { id: "chest-3", name: "Corset Style", category: "Designer" },
    { id: "chest-4", name: "Draped Front", category: "Indo-Western" },
    { id: "chest-5", name: "Embroidered Panel", category: "Bridal" },
    { id: "chest-6", name: "Mirror Work", category: "Traditional" },
  ],
  shoulders: [
    { id: "shoulder-1", name: "Cap Sleeve", category: "Subtle" },
    { id: "shoulder-2", name: "Off-Shoulder", category: "Modern" },
    { id: "shoulder-3", name: "Cold Shoulder", category: "Trendy" },
    { id: "shoulder-4", name: "Puff Shoulder", category: "Vintage" },
    { id: "shoulder-5", name: "Epaulette", category: "Designer" },
    { id: "shoulder-6", name: "Drop Shoulder", category: "Casual" },
  ],
  sleeves: [
    { id: "sleeve-1", name: "Full Length", category: "Traditional" },
    { id: "sleeve-2", name: "Three-Quarter", category: "Classic" },
    { id: "sleeve-3", name: "Bell Sleeves", category: "Boho" },
    { id: "sleeve-4", name: "Puff Sleeves", category: "Vintage" },
    { id: "sleeve-5", name: "Flared Sleeves", category: "Elegant" },
    { id: "sleeve-6", name: "Bishop Sleeves", category: "Royal" },
    { id: "sleeve-7", name: "Slit Sleeves", category: "Modern" },
    { id: "sleeve-8", name: "Sleeveless", category: "Minimal" },
  ],
  waist: [
    { id: "waist-1", name: "Gold Belt", category: "Traditional" },
    { id: "waist-2", name: "Kamarband", category: "Bridal" },
    { id: "waist-3", name: "Pearl Chain", category: "Elegant" },
    { id: "waist-4", name: "Broad Band", category: "Modern" },
    { id: "waist-5", name: "Pleated Tuck", category: "Classic" },
    { id: "waist-6", name: "Embroidered Belt", category: "Designer" },
  ],
  skirt: [
    { id: "skirt-1", name: "A-Line Flare", category: "Classic" },
    { id: "skirt-2", name: "Mermaid", category: "Modern" },
    { id: "skirt-3", name: "Full Circle", category: "Bridal" },
    { id: "skirt-4", name: "Layered Tiers", category: "Designer" },
    { id: "skirt-5", name: "Straight Cut", category: "Minimalist" },
    { id: "skirt-6", name: "Panelled", category: "Classic" },
    { id: "skirt-7", name: "Fishtail", category: "Elegant" },
  ],
  legs: [
    { id: "legs-1", name: "Floor Length", category: "Traditional" },
    { id: "legs-2", name: "Ankle Length", category: "Modern" },
    { id: "legs-3", name: "High-Low Hem", category: "Trendy" },
    { id: "legs-4", name: "Train Back", category: "Bridal" },
    { id: "legs-5", name: "Slit Front", category: "Bold" },
    { id: "legs-6", name: "Asymmetric Hem", category: "Designer" },
  ],
  dupatta: [
    { id: "dup-1", name: "Classic Drape", category: "Traditional" },
    { id: "dup-2", name: "Over-Head", category: "Bridal" },
    { id: "dup-3", name: "One Shoulder", category: "Modern" },
    { id: "dup-4", name: "Double Drape", category: "Royal" },
    { id: "dup-5", name: "Cape Style", category: "Fusion" },
    { id: "dup-6", name: "No Dupatta", category: "Minimal" },
  ],
  back: [
    { id: "back-1", name: "Deep V Back", category: "Modern" },
    { id: "back-2", name: "Dori / Lace-up", category: "Traditional" },
    { id: "back-3", name: "Keyhole Back", category: "Elegant" },
    { id: "back-4", name: "Full Coverage", category: "Classic" },
    { id: "back-5", name: "Sheer Panel", category: "Designer" },
    { id: "back-6", name: "Buttoned Back", category: "Vintage" },
  ],
  front: [
    { id: "front-1", name: "Center Panel", category: "Classic" },
    { id: "front-2", name: "Overlap Wrap", category: "Fusion" },
    { id: "front-3", name: "Button Down", category: "Indo-Western" },
    { id: "front-4", name: "Embroidered Yoke", category: "Bridal" },
    { id: "front-5", name: "Plain Front", category: "Minimalist" },
    { id: "front-6", name: "Sequin Panel", category: "Party" },
  ],
};

/** Region-specific fabric options */
export const REGION_TEXTURES: Record<BodyRegion, TextureOption[]> = {
  neck: [
    { id: "ntex-1", name: "Silk", category: "Premium" },
    { id: "ntex-2", name: "Net", category: "Sheer" },
  ],
  collar: [
    { id: "ctex-1", name: "Brocade", category: "Rich" },
    { id: "ctex-2", name: "Velvet", category: "Royal" },
    { id: "ctex-3", name: "Zari Work", category: "Traditional" },
  ],
  chest: [
    { id: "chtex-1", name: "Banarasi Silk", category: "Silk" },
    { id: "chtex-2", name: "Raw Silk", category: "Silk" },
    { id: "chtex-3", name: "Velvet", category: "Rich" },
    { id: "chtex-4", name: "Brocade", category: "Rich" },
    { id: "chtex-5", name: "Organza", category: "Sheer" },
  ],
  shoulders: [
    { id: "stex-1", name: "Sheer Net", category: "Sheer" },
    { id: "stex-2", name: "Silk", category: "Premium" },
    { id: "stex-3", name: "Lace", category: "Delicate" },
  ],
  sleeves: [
    { id: "sltex-1", name: "Net", category: "Sheer" },
    { id: "sltex-2", name: "Chiffon", category: "Sheer" },
    { id: "sltex-3", name: "Silk", category: "Premium" },
    { id: "sltex-4", name: "Lace", category: "Delicate" },
    { id: "sltex-5", name: "Organza", category: "Sheer" },
    { id: "sltex-6", name: "Velvet", category: "Rich" },
  ],
  waist: [
    { id: "wtex-1", name: "Metal", category: "Jewelry" },
    { id: "wtex-2", name: "Silk Band", category: "Fabric" },
    { id: "wtex-3", name: "Bead Work", category: "Ornate" },
  ],
  skirt: [
    { id: "sktex-1", name: "Banarasi Silk", category: "Silk" },
    { id: "sktex-2", name: "Chanderi", category: "Cotton" },
    { id: "sktex-3", name: "Georgette", category: "Sheer" },
    { id: "sktex-4", name: "Velvet", category: "Rich" },
    { id: "sktex-5", name: "Art Silk", category: "Affordable" },
    { id: "sktex-6", name: "Jacquard", category: "Woven" },
  ],
  legs: [
    { id: "ltex-1", name: "Same as Skirt", category: "Match" },
    { id: "ltex-2", name: "Contrast Fabric", category: "Designer" },
    { id: "ltex-3", name: "Net Overlay", category: "Sheer" },
  ],
  dupatta: [
    { id: "dtex-1", name: "Net", category: "Sheer" },
    { id: "dtex-2", name: "Chiffon", category: "Light" },
    { id: "dtex-3", name: "Organza", category: "Light" },
    { id: "dtex-4", name: "Silk", category: "Premium" },
    { id: "dtex-5", name: "Georgette", category: "Light" },
  ],
  back: [
    { id: "btex-1", name: "Same as Front", category: "Match" },
    { id: "btex-2", name: "Sheer Net", category: "Sheer" },
    { id: "btex-3", name: "Brocade", category: "Rich" },
  ],
  front: [
    { id: "ftex-1", name: "Banarasi Silk", category: "Silk" },
    { id: "ftex-2", name: "Velvet", category: "Rich" },
    { id: "ftex-3", name: "Brocade", category: "Rich" },
    { id: "ftex-4", name: "Zardozi Base", category: "Embroidery" },
  ],
};

/** Region-specific embroidery options */
export const REGION_EMBROIDERY: Record<BodyRegion, EmbroideryOption[]> = {
  neck: [
    { id: "nemb-1", name: "Stone Work", category: "Light" },
    { id: "nemb-2", name: "Thread Border", category: "Light" },
  ],
  collar: [
    { id: "cemb-1", name: "Zardozi Collar", category: "Heavy" },
    { id: "cemb-2", name: "Mirror Border", category: "Medium" },
    { id: "cemb-3", name: "Pearl Studded", category: "Bridal" },
  ],
  chest: [
    { id: "chemb-1", name: "Full Zardozi", category: "Heavy" },
    { id: "chemb-2", name: "Aari Work", category: "Medium" },
    { id: "chemb-3", name: "Sequin Scatter", category: "Light" },
    { id: "chemb-4", name: "Chikankari", category: "Light" },
    { id: "chemb-5", name: "Gota Patti", category: "Medium" },
    { id: "chemb-6", name: "Cutdana", category: "Heavy" },
  ],
  shoulders: [
    { id: "semb-1", name: "Tassel Drops", category: "Ornate" },
    { id: "semb-2", name: "Pearl Lines", category: "Elegant" },
    { id: "semb-3", name: "None", category: "Minimal" },
  ],
  sleeves: [
    { id: "slemb-1", name: "Border Only", category: "Light" },
    { id: "slemb-2", name: "Full Coverage", category: "Heavy" },
    { id: "slemb-3", name: "Scattered Motif", category: "Medium" },
    { id: "slemb-4", name: "Cuff Detail", category: "Light" },
    { id: "slemb-5", name: "None", category: "Minimal" },
  ],
  waist: [
    { id: "wemb-1", name: "Stone Studded", category: "Heavy" },
    { id: "wemb-2", name: "Kundan Work", category: "Bridal" },
    { id: "wemb-3", name: "Plain Gold", category: "Classic" },
  ],
  skirt: [
    { id: "skemb-1", name: "Heavy Border", category: "Bridal" },
    { id: "skemb-2", name: "All-Over Jaal", category: "Heavy" },
    { id: "skemb-3", name: "Scattered Buti", category: "Medium" },
    { id: "skemb-4", name: "Panel Work", category: "Medium" },
    { id: "skemb-5", name: "Minimal Motif", category: "Light" },
    { id: "skemb-6", name: "Gota Border", category: "Traditional" },
  ],
  legs: [
    { id: "lemb-1", name: "Heavy Hem Border", category: "Bridal" },
    { id: "lemb-2", name: "Light Border", category: "Classic" },
    { id: "lemb-3", name: "None", category: "Minimal" },
  ],
  dupatta: [
    { id: "demb-1", name: "Four-Side Border", category: "Classic" },
    { id: "demb-2", name: "Corner Motifs", category: "Elegant" },
    { id: "demb-3", name: "Heavy Pallu", category: "Bridal" },
    { id: "demb-4", name: "Scattered Stars", category: "Light" },
    { id: "demb-5", name: "Gota Work", category: "Traditional" },
  ],
  back: [
    { id: "bemb-1", name: "Dori Tassel", category: "Traditional" },
    { id: "bemb-2", name: "Lace Panel", category: "Elegant" },
    { id: "bemb-3", name: "None", category: "Minimal" },
  ],
  front: [
    { id: "femb-1", name: "Center Motif", category: "Classic" },
    { id: "femb-2", name: "Full Panel", category: "Heavy" },
    { id: "femb-3", name: "Yoke Only", category: "Medium" },
    { id: "femb-4", name: "Minimal Lines", category: "Light" },
  ],
};

/** Get unique categories for a region's components */
export function getComponentCategories(region: BodyRegion): string[] {
  const components = REGION_COMPONENTS[region];
  const categories = new Set(components.map((c) => c.category));
  return ["All", ...Array.from(categories)];
}

/** Get unique categories for a region's textures */
export function getTextureCategories(region: BodyRegion): string[] {
  const textures = REGION_TEXTURES[region];
  const categories = new Set(textures.map((t) => t.category));
  return ["All", ...Array.from(categories)];
}

/** Get unique categories for a region's embroidery */
export function getEmbroideryCategories(region: BodyRegion): string[] {
  const embroidery = REGION_EMBROIDERY[region];
  const categories = new Set(embroidery.map((e) => e.category));
  return ["All", ...Array.from(categories)];
}
