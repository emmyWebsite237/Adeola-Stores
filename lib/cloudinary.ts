/**
 * Cloudinary Image Helper & Dynamic URL Generator
 * Handles auto-format (f_auto), responsive sizing (w_auto), quality optimization (q_auto),
 * and client-side unsigned media uploads for store products.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

/**
 * Optimizes an image URL via Cloudinary transformations
 * If given a full Cloudinary URL or public ID, returns the optimized version.
 * If given a local or external URL, safely returns it or wraps with fetch proxy.
 */
export function getOptimizedImageUrl(
  imagePathOrUrl: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'scale' | 'thumb' | 'fit';
    quality?: 'auto' | number;
  } = {}
): string {
  if (!imagePathOrUrl) return '/images/product-placeholder.svg';

  const { width = 600, height, crop = 'fill', quality = 'auto' } = options;

  // If already a Cloudinary URL
  if (imagePathOrUrl.includes('res.cloudinary.com')) {
    const parts = imagePathOrUrl.split('/upload/');
    if (parts.length === 2) {
      const transform = [
        `w_${width}`,
        height ? `h_${height}` : '',
        `c_${crop}`,
        `q_${quality}`,
        'f_auto',
      ]
        .filter(Boolean)
        .join(',');
      return `${parts[0]}/upload/${transform}/${parts[1]}`;
    }
  }

  // If it's a Cloudinary public ID without full URL
  if (!imagePathOrUrl.startsWith('http') && !imagePathOrUrl.startsWith('/')) {
    const transform = [
      `w_${width}`,
      height ? `h_${height}` : '',
      `c_${crop}`,
      `q_${quality}`,
      'f_auto',
    ]
      .filter(Boolean)
      .join(',');
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}/${imagePathOrUrl}`;
  }

  // Fallback to local or direct URL
  return imagePathOrUrl;
}

/**
 * Uploads an image file directly from the browser to Cloudinary
 * using an unsigned upload preset (no backend secrets exposed).
 */
export async function uploadImageToCloudinary(file: File): Promise<{
  url: string;
  secure_url: string;
  public_id: string;
  error?: string;
}> {
  if (!CLOUD_NAME || CLOUD_NAME === 'demo' || !UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'adeola_stores/products');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary');
  }

  return response.json();
}
