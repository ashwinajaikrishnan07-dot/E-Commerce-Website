"""Static mannequin geometry: garment zone coordinates + neckline path data.

Coordinates are defined against a 400 x 600 canvas (matches the Fabric.js
canvas spec in the frontend). Each garment exposes named zones that the
frontend clips embroidery overlays to. Neckline shapes are SVG path strings
swapped into the ``zone-neckline`` region.
"""

# Neckline SVG path data (centered around the neck opening, ~x:150-250, y:70-150)
NECKLINES = {
    "Boat Neck": {
        "label": "Boat Neck",
        "path": "M150 95 Q200 78 250 95 L250 108 Q200 96 150 108 Z",
    },
    "V-Neck": {
        "label": "V-Neck",
        "path": "M158 90 L200 160 L242 90 L232 86 L200 138 L168 86 Z",
    },
    "Round Neck": {
        "label": "Round Neck",
        "path": "M162 88 A40 44 0 0 0 238 88 A40 30 0 0 1 162 88 Z",
    },
    "Sweetheart": {
        "label": "Sweetheart",
        "path": "M160 88 Q160 120 200 148 Q240 120 240 88 Q220 108 200 100 Q180 108 160 88 Z",
    },
    "Keyhole": {
        "label": "Keyhole",
        "path": "M170 88 A30 30 0 0 0 230 88 L224 90 A26 22 0 0 1 206 106 L206 150 L194 150 L194 106 A26 22 0 0 1 176 90 Z",
    },
    "Square": {
        "label": "Square",
        "path": "M162 88 L162 140 L238 140 L238 88 L228 88 L228 130 L172 130 L172 88 Z",
    },
}

# Base gender-neutral mannequin silhouette (rendered behind garment overlays).
BASE_MANNEQUIN_SVG = """
<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
  <g fill="#e9dcc9" stroke="#c9b79c" stroke-width="1.5">
    <circle cx="200" cy="52" r="34"/>
    <rect x="188" y="82" width="24" height="26" rx="10"/>
    <path d="M150 108 Q200 96 250 108 L286 190 L262 210 L250 150 L250 470 L150 470 L150 150 L138 210 L114 190 Z"/>
    <rect x="158" y="470" width="38" height="110" rx="10"/>
    <rect x="204" y="470" width="38" height="110" rx="10"/>
  </g>
</svg>
""".strip()


def _garment_zones(garment_type):
    """Return zone rectangles/paths for a garment on the 400x600 canvas."""
    common = {
        "zone-neckline": {"type": "path", "default_shape": "Round Neck"},
        "zone-sleeve": {
            "type": "rect",
            "left": [114, 250],
            "regions": [
                {"x": 114, "y": 150, "w": 40, "h": 60},
                {"x": 246, "y": 150, "w": 40, "h": 60},
            ],
        },
        "zone-hem": {"type": "rect", "regions": [{"x": 150, "y": 430, "w": 100, "h": 40}]},
        "zone-back": {"type": "rect", "regions": [{"x": 168, "y": 170, "w": 64, "h": 90}]},
        "zone-border": {"type": "rect", "regions": [{"x": 150, "y": 108, "w": 100, "h": 18}]},
    }

    presets = {
        "blouse": {"body_bottom": 300},
        "kurti": {"body_bottom": 470, "hem": {"x": 140, "y": 430, "w": 120, "h": 40}},
        "saree": {"body_bottom": 560, "drape": True},
        "frock": {"body_bottom": 500, "flared": True},
        "churidar": {"body_bottom": 560},
        "lehenga": {"body_bottom": 560, "flared": True},
    }
    preset = presets.get(garment_type.lower(), {})
    zones = dict(common)
    if "hem" in preset:
        zones["zone-hem"] = {"type": "rect", "regions": [preset["hem"]]}
    zones["_meta"] = {"garment_type": garment_type, **preset}
    return zones


GARMENTS = ["Blouse", "Kurti", "Saree", "Frock", "Churidar", "Lehenga"]


def zone_coordinates_for(garment_type):
    return {
        "canvas": {"width": 400, "height": 600},
        "necklines": NECKLINES,
        "zones": _garment_zones(garment_type),
    }
