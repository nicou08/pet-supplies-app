"use client";

import { HomeCarousel } from "@/components/home-carousel";
import { ProductRow } from "@/components/product-row";
import { InteractiveRow } from "@/components/interactive-row";

export default function HomePage() {
  return (
    <div className="overflow-y-auto">
      <div className="h-10" />

      <div className="w-full flex justify-center">
        <HomeCarousel />
      </div>

      <div className="h-10" />

      <InteractiveRow />

      <div className="h-10" />

      <ProductRow />

      <div className="h-10" />
      <div className="h-[1000px]"></div>
    </div>
  );
}
