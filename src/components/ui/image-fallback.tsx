/* eslint-disable @next/next/no-img-element */
"use client";

export function ImageFallback({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={(e) => {
        if (e.currentTarget.parentElement) {
          e.currentTarget.parentElement.style.display = "none";
        }
      }}
    />
  );
}
