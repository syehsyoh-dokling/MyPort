from pathlib import Path
from PIL import Image

logo_dir = Path(r"C:\Users\Saifuddin\Desktop\MyPort\public\assets\app-logos")

WHITE_THRESHOLD = 246
SOFT_THRESHOLD = 226

def alpha_from_pixel(r, g, b, a):
    if a == 0:
        return 0

    brightness = (r + g + b) / 3
    color_spread = max(r, g, b) - min(r, g, b)

    # Hapus putih / abu terang netral
    if r >= WHITE_THRESHOLD and g >= WHITE_THRESHOLD and b >= WHITE_THRESHOLD:
        return 0

    # Soft edge untuk pinggiran logo
    if brightness >= SOFT_THRESHOLD and color_spread < 22:
        alpha = int(255 * (WHITE_THRESHOLD - brightness) / (WHITE_THRESHOLD - SOFT_THRESHOLD))
        return max(0, min(255, alpha))

    return a

def process_image(path):
    img = Image.open(path).convert("RGBA")
    pixels = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            pixels[x, y] = (r, g, b, alpha_from_pixel(r, g, b, a))

    img.save(path, "PNG")

for file in sorted(logo_dir.glob("*.png")):
    process_image(file)
    print(f"Processed: {file.name}")

print("DONE")
