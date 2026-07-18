import numpy as np
from PIL import Image

for name in ["dress_maroon.png", "dress_ivory.png"]:
    p = rf"C:\Users\HP\Desktop\Ashwina\Armaan\frontend\public\dresses\{name}"
    img = Image.open(p)
    print(f"\n=== {name} mode={img.mode} size={img.size} ===")
    rgba = img.convert("RGBA")
    arr = np.asarray(rgba)
    alpha = arr[:, :, 3]
    print("has transparency:", bool((alpha < 250).any()), "| transparent frac:", round(float((alpha < 20).mean()), 2))
    # content = opaque & not near-white
    rgb = arr[:, :, :3].astype(int)
    opaque = alpha > 40
    H, W = alpha.shape
    vis = opaque & (np.abs(rgb - 255).sum(axis=2) > 40)
    GW, GH = 56, 24
    gx = np.linspace(0, W, GW + 1).astype(int)
    gy = np.linspace(0, H, GH + 1).astype(int)
    chars = " .:-=+*#%@"
    for i in range(GH):
        line = ""
        for j in range(GW):
            v = vis[gy[i]:gy[i+1], gx[j]:gx[j+1]].mean()
            line += chars[min(len(chars)-1, int(v*(len(chars)-1)))]
        print(line)
