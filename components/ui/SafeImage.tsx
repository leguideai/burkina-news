"use client";

import React, { useState, useEffect } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  alt = '',
  fallbackSrc = '/images/lead.jpeg',
  className,
  referrerPolicy = 'no-referrer',
  loading = 'lazy',
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src as string || fallbackSrc);

  useEffect(() => {
    setImgSrc(src as string || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <img
      src={imgSrc || fallbackSrc}
      alt={alt}
      referrerPolicy={referrerPolicy}
      loading={loading}
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
      className={className}
      {...props}
    />
  );
}
