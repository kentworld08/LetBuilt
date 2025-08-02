"use client";
import Image from "next/image";
import { useState } from "react";

interface Props {
  alt: string;
  url: string;
  fallback: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function FallbackImage({
  alt,
  url,
  fallback,
  width = 600,
  height = 400,
  className = "rounded-lg shadow-2xl w-full h-auto",
}: Props) {
  const [src, setSrc] = useState(url);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setSrc(fallback)}
    />
  );
}
