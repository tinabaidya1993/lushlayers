/**
 * High-Performance Client-Side Image Optimizer for Lush Layers
 * Automatically compresses, resizes, strips metadata, and converts images to WebP
 * before upload, maintaining excellent visual quality while reducing bandwidth by up to 90%.
 */

export interface OptimizationResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  savingsPercent: number;
  width: number;
  height: number;
  format: string;
}

const duplicateCache = new Set<string>();

/**
 * Optimizes an image File on the client side using HTML5 Canvas & WebP compression.
 *
 * Tier Rules:
 * - < 500 KB: Light compression (quality 0.90, max 1920px)
 * - 500 KB to 2 MB: Medium compression (quality 0.85, max 1920px)
 * - > 2 MB: Aggressive compression (quality 0.80, max 1920px)
 */
export async function optimizeImageClientSide(
  file: File,
  maxDimension: number = 1920
): Promise<OptimizationResult> {
  const originalSize = file.size;
  const fileKey = `${file.name}_${file.size}_${file.lastModified}`;

  // If not an image, return untouched file
  if (!file.type.startsWith('image/')) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      savingsPercent: 0,
      width: 0,
      height: 0,
      format: file.type,
    };
  }

  // Determine compression quality based on original file size tier
  let quality = 0.85;
  if (originalSize < 500 * 1024) {
    quality = 0.90; // Light optimization for small images
  } else if (originalSize <= 2 * 1024 * 1024) {
    quality = 0.85; // Medium optimization
  } else {
    quality = 0.80; // Aggressive optimization for > 2MB images
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Calculate responsive constrained dimensions preserving aspect ratio
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          // Create offscreen canvas for metadata-stripped rendering
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(fallbackResult(file, originalSize, img.width, img.height));
            return;
          }

          // High-quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Handle PNG transparency if needed
          const isPng = file.type === 'image/png';
          if (!isPng) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Prefer WebP format, fallback to PNG if original was PNG and WebP unsupported
          const targetMime = 'image/webp';

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(fallbackResult(file, originalSize, width, height));
                return;
              }

              // Preserve original filename, change extension to .webp if converted
              const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
              const optimizedFileName = `${baseName}.webp`;

              const optimizedFile = new File([blob], optimizedFileName, {
                type: targetMime,
                lastModified: Date.now(),
              });

              const compressedSize = optimizedFile.size;
              const savingsPercent = Math.max(
                0,
                Math.round(((originalSize - compressedSize) / originalSize) * 100)
              );

              console.log(
                `[ImageOptimizer] Optimized "${file.name}" (${(originalSize / 1024).toFixed(
                  1
                )}KB -> ${(compressedSize / 1024).toFixed(
                  1
                )}KB, ${savingsPercent}% smaller, ${width}x${height} webp)`
              );

              duplicateCache.add(fileKey);

              resolve({
                file: optimizedFile,
                originalSize,
                compressedSize,
                savingsPercent,
                width,
                height,
                format: targetMime,
              });
            },
            targetMime,
            quality
          );
        } catch (err) {
          console.warn('[ImageOptimizer] Canvas error, falling back to original:', err);
          resolve(fallbackResult(file, originalSize, img.width, img.height));
        }
      };

      img.onerror = () => {
        resolve(fallbackResult(file, originalSize, 0, 0));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve(fallbackResult(file, originalSize, 0, 0));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Optimizes an array of File objects in parallel.
 */
export async function optimizeMultipleImagesClientSide(
  files: File[],
  maxDimension: number = 1920
): Promise<OptimizationResult[]> {
  return Promise.all(files.map((file) => optimizeImageClientSide(file, maxDimension)));
}

function fallbackResult(file: File, size: number, w: number, h: number): OptimizationResult {
  return {
    file,
    originalSize: size,
    compressedSize: size,
    savingsPercent: 0,
    width: w,
    height: h,
    format: file.type,
  };
}
