// apps/web/services/utils/image-helpers.ts
export function ensureCorrectImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return '';

  // If already an absolute URL, return it
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  const baseUrl = process.env.NEXT_PUBLIC_LEARNHOUSE_MEDIA_URL ||
                  process.env.NEXT_PUBLIC_LEARNHOUSE_BACKEND_URL ||
                  'http://4.240.102.85/';

  // Ensure baseUrl has trailing slash
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  // Remove leading slash from path if exists
  const normalizedPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;

  return `${normalizedBaseUrl}${normalizedPath}`;
}