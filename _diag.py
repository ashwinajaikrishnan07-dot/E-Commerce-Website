import numpy as np
from PIL import Image

SRC = r"C:\Users\HP\Desktop\Ashwina\Armaan\Dress\4231.jpg"
img = Image.open(SRC).convert("RGB")
arr = np.asarray(img).astype(np.int16)
H, W, _ = arr.shape
bg = arr[0, 0]
mask = np.sqrt(((arr - bg) ** 2).sum(axis=2)) > 60
bars = "▁▂▃▄▅▆▇█"

def band(y0, y1, label):
    sub = mask[int(H*y0):int(H*y1)]
    col = sub.sum(axis=0) / sub.shape[0]
    step = W // 64
    line = "".join(bars[min(7, int(col[i*step:(i+1)*step].mean()*8))] for i in range(64))
    print(f"{label:>10}: {line}")

for (a, b) in [(0.05,0.20),(0.20,0.35),(0.35,0.55),(0.55,0.75),(0.75,0.95)]:
    band(a, b, f"{int(a*100)}-{int(b*100)}%")
