"use client";

type LoaderProps = {
  src: string;
  width?: number;
  quality?: number;
};

export default function imageLoader({
  src,
  width,
  quality,
}: LoaderProps): string {
  const params = new URLSearchParams();
  if (width) params.set("w", width.toString());
  if (quality) params.set("q", quality.toString());
  return `${src}?${params.toString()}`;
}
