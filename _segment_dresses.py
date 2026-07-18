"""Segment the dress sheet into individual transparent dress PNGs using
connected-component labeling on a downscaled mask (robust to faint bridges).
"""
import os

import numpy as np
from PIL import Image
from scipy import ndimage

SRC = r"C:\Users\HP\Desktop\Ashwina\Armaan\Dress\4231.jpg"
OUT = r"C:\Users\HP\Desktop\Ashwina\Armaan\frontend\public\dresses"
os.makedirs(OUT, exist_ok=True)

img = Image.open(SRC).convert("RGB")
full = np.asarray(img).astype(np.int16)
H, W, _ = full.shape
bg = full[0, 0]

# Work on a downscaled mask for speed + to erode faint bridges.
SCALE = 8
sw, sh = W // SCALE, H // SCALE
small = np.asarray(img.resize((sw, sh))).astype(np.int16)
dist = np.sqrt(((small - bg) ** 2).sum(axis=2))
mask = dist > 60

# Erode to break thin connections, then label.
mask = ndimage.binary_erosion(mask, iterations=2)
mask = ndimage.binary_dilation(mask, iterations=1)
labels, n = ndimage.label(mask)
print(f"raw components: {n}")

# Keep sizeable components and get their bounding boxes (scaled back up).
slices = ndimage.find_objects(labels)
boxes = []
for i, sl in enumerate(slices, start=1):
    if sl is None:
        continue
    area = (labels[sl] == i).sum()
    if area < (sw * sh * 0.01):  # ignore tiny specks
        continue
    ys, xs = sl
    boxes.append((xs.start * SCALE, ys.start * SCALE, xs.stop * SCALE, ys.stop * SCALE))

# Sort left-to-right and crop from the full-res image.
boxes.sort(key=lambda b: b[0])
print(f"kept regions: {len(boxes)}")

pad = 24
count = 0
for (x0, y0, x1, y1) in boxes:
    x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
    x1, y1 = min(W, x1 + pad), min(H, y1 + pad)
    crop = np.asarray(img.crop((x0, y0, x1, y1)).convert("RGBA")).copy()
    cdist = np.sqrt(((crop[:, :, :3].astype(np.int16) - bg) ** 2).sum(axis=2))
    crop[cdist <= 60, 3] = 0
    count += 1
    Image.fromarray(crop).save(os.path.join(OUT, f"dress_{count}.png"))
    print(f"  dress_{count}.png  ({x1-x0}x{y1-y0})")

print(f"Saved {count} dresses -> {OUT}")
