'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { getOptimizedCloudinaryUrl, getBlurPlaceholderUrl } from '@/lib/cloudinaryClient';

interface CloudinaryImageProps extends Omit<ImageProps, 'src' | 'quality'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'crop';
  cloudinaryQuality?: 'auto' | 'auto:good' | 'auto:best' | 'auto:eco' | number;
  aspectRatio?: string; // e.g. "aspect-[4/3]" or "aspect-square"
}

export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  crop = 'fill',
  cloudinaryQuality = 'auto',
  aspectRatio = 'aspect-[4/3]',
  className = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  ...props
}: CloudinaryImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const optimizedSrc = getOptimizedCloudinaryUrl(src, { width, height, crop, quality: cloudinaryQuality, format: 'auto' });
  const blurSrc = getBlurPlaceholderUrl(src);

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className} bg-cream-100`}>
      <Image
        src={optimizedSrc}
        alt={alt}
        fill={!width || !height}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={blurSrc}
        onLoad={() => setIsLoaded(true)}
        className={`object-cover transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-80 scale-105 blur-sm'
        }`}
        {...props}
      />
    </div>
  );
}
