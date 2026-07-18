"""Extract the single gown from 4231.jpg (knock out dark background, auto-crop,
resize for web) and generate recoloured variants as selectable dress options.
"""
import os

import numpy as np
from PIL import Image

SRC = r"C:\Users\HP\Desktop\Ashwina\Armaan\Dress\4231.jpg"
OUT = r"C:\Users\HP\Desktop\Ashwina\Armaan\frontend\public\dresses"
os.makedirs(OUT, exist_ok=True)

img = Image.open(SRC).convert("RGB")
arr = np.asarray(img).astype(np.int16)
bg = arr[0, 0]

# Alpha = content far from dark background.
dist = np.sqrt(((arr - bg) ** 2).sum(axis=2))
alpha = (dist > 60).astype(np.uint8) * 255

rgba = np.dstack([np.asarray(img).astype(np.uint8), alpha])

# Auto-crop to content bounding box.
ys, xs = np.where(alpha > 0)
y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
rgba = rgba[y0 : y1 + 1, x0 : x1 + 1]

base = Image.fromarray(rgba, "RGBA")
# Resize to a web-friendly height.
target_h = 900
w = int(base.width * target_h / base.height)
base = base.resize((w, target_h), Image.LANCZOS)
base.save(os.path.join(OUT, "dress_ivory.png"))
print(f"base gown: {base.width}x{base.height}")

data = np.asarray(base).astype(np.float32)
rgb = data[:, :, :3] / 255.0
a = data[:, :, 3:4]
# Luminance of the gown (preserves folds/shading).
lum = (0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2])[:, :, None]

VARIANTS = {
    "maroon": (0.63, 0.11, 0.24),
    "emerald": (0.12, 0.48, 0.35),
    "royal": (0.15, 0.27, 0.56),
    "gold": (0.72, 0.53, 0.04),
    "rose": (0.79, 0.42, 0.53),
    "teal": (0.18, 0.44, 0.42),
}

for name, tint in VARIANTS.items():
    tint = np.array(tint, dtype=np.float32)
    shaded = tint[None, None, :] * (0.28 + 0.72 * lum)  # keep folds
    out = np.clip(shaded * 255, 0, 255)
    out = np.dstack([out, a]).astype(np.uint8)
    Image.fromarray(out, "RGBA").save(os.path.join(OUT, f"dress_{name}.png"))
    print(f"  dress_{name}.png")

# Clean up the earlier partial extraction if present.
for f in ("dress_1.png",):
    p = os.path.join(OUT, f)
    if os.path.exists(p):
        os.remove(p)

print("done")
