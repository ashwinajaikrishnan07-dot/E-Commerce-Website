// Neckline shapes (SVG path data), mirrors backend mannequin_data.py.
export const NECKLINES = [
  { name: "Boat Neck", path: "M150 95 Q200 78 250 95 L250 108 Q200 96 150 108 Z" },
  { name: "V-Neck", path: "M158 90 L200 160 L242 90 L232 86 L200 138 L168 86 Z" },
  { name: "Round Neck", path: "M162 88 A40 44 0 0 0 238 88 A40 30 0 0 1 162 88 Z" },
  {
    name: "Sweetheart",
    path: "M160 88 Q160 120 200 148 Q240 120 240 88 Q220 108 200 100 Q180 108 160 88 Z",
  },
  {
    name: "Keyhole",
    path: "M170 88 A30 30 0 0 0 230 88 L224 90 A26 22 0 0 1 206 106 L206 150 L194 150 L194 106 A26 22 0 0 1 176 90 Z",
  },
  {
    name: "Square",
    path: "M162 88 L162 140 L238 140 L238 88 L228 88 L228 130 L172 130 L172 88 Z",
  },
];

// Embroidery styles with a CSS swatch (used for the picker preview) and a
// prompt fragment used when generating the texture.
export const EMBROIDERIES = [
  { name: "Zari", color: "#d4af37", swatch: "linear-gradient(135deg,#d4af37,#f6e27a,#b8860b)", prompt: "gold zari metallic thread weave" },
  { name: "Aari", color: "#c23a63", swatch: "repeating-linear-gradient(45deg,#a01c3e,#a01c3e 6px,#d46a86 6px,#d46a86 12px)", prompt: "fine aari hook floral embroidery" },
  { name: "Kasuti", color: "#2f6f6b", swatch: "repeating-linear-gradient(0deg,#2f6f6b,#2f6f6b 4px,#eae0cf 4px,#eae0cf 8px)", prompt: "kasuti running-stitch geometric embroidery" },
  { name: "Cutwork", color: "#cbb892", swatch: "radial-gradient(circle at 30% 30%,#fff,#ece3d0 60%,#cbb892)", prompt: "delicate cutwork lace pattern" },
  { name: "Thread Work", color: "#c25b8a", swatch: "repeating-linear-gradient(90deg,#c25b8a,#c25b8a 5px,#f0c9dc 5px,#f0c9dc 10px)", prompt: "colourful thread work embroidery" },
  { name: "Stone Work", color: "#9b8ec9", swatch: "radial-gradient(circle,#e6e6fa 20%,#9b8ec9 60%,#5e548e)", prompt: "sparkling stone and bead work" },
  { name: "Smocking", color: "#3a5a9c", swatch: "repeating-linear-gradient(135deg,#3a5a9c,#3a5a9c 5px,#a9bce0 5px,#a9bce0 10px)", prompt: "smocking pintuck gathered fabric texture" },
  { name: "Mirror Work", color: "#8a8aa0", swatch: "radial-gradient(circle at 50% 50%,#c0c0c0 25%,#7a7a7a 50%,#3a5a9c)", prompt: "mirror work shisha embroidery" },
];

// Provided reference mannequin photos (extracted from the design prototype).
export const REFERENCE_VIEWS = [
  { name: "Front", src: "/mannequin/front.jpg" },
  { name: "Side", src: "/mannequin/side.jpg" },
  { name: "Back", src: "/mannequin/back.jpg" },
];

// Dress design options (extracted from the Dress folder gown + recoloured
// variants) that can be "worn" on the 3D mannequin.
export const DRESS_OPTIONS = [
  { name: "Ivory", color: "#efe9dc", src: "/dresses/dress_ivory.png" },
  { name: "Maroon", color: "#a01c3e", src: "/dresses/dress_maroon.png" },
  { name: "Emerald", color: "#1f7a5a", src: "/dresses/dress_emerald.png" },
  { name: "Royal Blue", color: "#274690", src: "/dresses/dress_royal.png" },
  { name: "Gold", color: "#b8860b", src: "/dresses/dress_gold.png" },
  { name: "Dusty Rose", color: "#c96a86", src: "/dresses/dress_rose.png" },
  { name: "Teal", color: "#2f6f6b", src: "/dresses/dress_teal.png" },
];

export const GARMENTS = ["Blouse", "Kurti", "Saree", "Frock", "Churidar", "Lehenga"];

export const ZONE_LABELS = {
  "zone-neckline": "Neckline",
  "zone-border": "Neck Border",
  "zone-sleeve": "Sleeve",
  "zone-hem": "Hem",
  "zone-back": "Back Yoke",
};
