export function optimizedAssetPath(src: string | undefined) {
  if (!src) return src;

  if (!src.startsWith("/assets/")) {
    return src;
  }

  return src.replace(/\.(png|jpe?g)$/i, ".webp");
}
