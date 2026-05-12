from pathlib import Path
from PIL import Image

target_folders = [Path(r"C:\Users\Saifuddin\Desktop\MyPort\public\assets\Logo-proyek"), Path(r"C:\Users\Saifuddin\Desktop\MyPort\public\assets\logo-organisasi")]

# Semakin tinggi threshold, semakin hati-hati.
# 248 hanya menghapus warna yang sangat dekat putih.
WHITE_THRESHOLD = 248
SOFT_THRESHOLD = 232
COLOR_SPREAD_LIMIT = 24

SUPPORTED = {".png", ".jpg", ".jpeg", ".webp"}

def alpha_from_pixel(r, g, b, a):
    if a == 0:
        return 0

    brightness = (r + g + b) / 3
    color_spread = max(r, g, b) - min(r, g, b)

    # Putih/abu muda netral menjadi transparan.
    if r >= WHITE_THRESHOLD and g >= WHITE_THRESHOLD and b >= WHITE_THRESHOLD:
        return 0

    # Soft edge untuk pinggiran putih/abu terang.
    if brightness >= SOFT_THRESHOLD and color_spread <= COLOR_SPREAD_LIMIT:
        alpha = int(255 * (WHITE_THRESHOLD - brightness) / (WHITE_THRESHOLD - SOFT_THRESHOLD))
        return max(0, min(255, alpha))

    return a

def process_image(path: Path):
    img = Image.open(path).convert("RGBA")
    pixels = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            pixels[x, y] = (r, g, b, alpha_from_pixel(r, g, b, a))

    # Selalu simpan sebagai PNG agar transparansi aman.
    out_path = path.with_suffix(".png")
    img.save(out_path, "PNG")

    # Kalau sumber bukan PNG, file lama dibiarkan sebagai backup lokal juga.
    return out_path

count = 0

for folder in target_folders:
    print(f"Processing folder: {folder}")

    for file in sorted(folder.rglob("*")):
        if file.is_file() and file.suffix.lower() in SUPPORTED:
            out = process_image(file)
            count += 1
            print(f"Processed: {file.name} -> {out.name}")

print(f"DONE. Processed {count} image files.")
