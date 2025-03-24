"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface SafeImageProps {
  src: string | null | undefined;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  quality?: number;
  fallbackClassName?: string;
  onError?: (error: Error) => void;
}

export const SafeImage = ({ 
  src, 
  alt = "Image", 
  width = 500,
  height = 300,
  className,
  style,
  fallbackClassName,
  priority,
  quality,
  onError 
}: SafeImageProps) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError || !src) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-100 dark:bg-gray-800",
          fallbackClassName,
          className
        )}
        style={{
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : '100%',
          minHeight: '80px',
          ...style
        }}
      >
        <ImageOff className="text-gray-400" size={24} />
      </div>
    );
  }
  
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      priority={priority}
      quality={quality}
      onError={(e) => {
        setHasError(true);
        if (onError) onError(e as unknown as Error);
      }}
    />
  );
}; 