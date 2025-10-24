import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  sizes?: string;
  srcSet?: string;
  onLoad?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  sizes,
  srcSet,
  onLoad,
}) => {
  // Generate WebP srcSet if not provided
  const generateSrcSet = (originalSrc: string): string => {
    if (srcSet) return srcSet;

    // For now, just return the original src
    // In a real implementation, you'd generate multiple sizes
    return originalSrc;
  };

  return (
    <picture>
      {/* WebP source with fallback */}
      <source
        srcSet={generateSrcSet(src)}
        type="image/webp"
        sizes={sizes}
      />
      {/* Fallback image */}
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        onLoad={onLoad}
        sizes={sizes}
      />
    </picture>
  );
};

export default OptimizedImage;
