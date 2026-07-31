/**
 * Browser-safe Cloudinary URL transformer utilities (No Node.js SDK / 'fs' dependencies)
 */

export function getOptimizedCloudinaryUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'crop';
    quality?: 'auto' | 'auto:good' | 'auto:best' | 'auto:eco' | number;
    format?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg';
    blur?: number;
  } = {}
): string {
  if (!url) return '';

  // If it's already a Cloudinary URL, insert transformations
  if (url.includes('res.cloudinary.com')) {
    const { width, height, crop = 'fill', quality = 'auto', format = 'auto', blur } = options;
    const transformParts = [`f_${format}`, `q_${quality}`];

    if (width) transformParts.push(`w_${width}`);
    if (height) transformParts.push(`h_${height}`);
    if (width || height) transformParts.push(`c_${crop}`);
    if (blur) transformParts.push(`e_blur:${blur}`);

    const transformString = transformParts.join(',');

    // Insert transformation string after /upload/
    if (url.includes('/upload/') && !url.includes('/upload/f_auto')) {
      return url.replace('/upload/', `/upload/${transformString}/`);
    }
  }

  return url;
}

export function getBlurPlaceholderUrl(url: string): string {
  return getOptimizedCloudinaryUrl(url, {
    width: 30,
    quality: 'auto:eco',
    blur: 1000,
    format: 'auto',
  });
}

export function getResponsiveSrcSet(url: string): {
  mobile: string;
  tablet: string;
  desktop: string;
} {
  return {
    mobile: getOptimizedCloudinaryUrl(url, { width: 480, quality: 'auto', format: 'auto' }),
    tablet: getOptimizedCloudinaryUrl(url, { width: 800, quality: 'auto', format: 'auto' }),
    desktop: getOptimizedCloudinaryUrl(url, { width: 1200, quality: 'auto', format: 'auto' }),
  };
}
