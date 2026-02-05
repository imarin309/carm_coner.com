const R2_BASE_URL =
  process.env.NEXT_PUBLIC_R2_BASE_URL || "https://r2.calm-corner.com";

export function getR2Url(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${R2_BASE_URL}/${cleanPath}`;
}

export function getPostImageUrl(slug: string, filename: string): string {
  return getR2Url(`posts/${slug}/${filename}`);
}
