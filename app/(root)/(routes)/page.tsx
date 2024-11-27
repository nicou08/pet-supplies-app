"use client";

import { HomeCarousel } from "@/components/home-carousel";
import { ProductRow } from "@/components/product-row";

export default function HomePage() {
  return (
    <div className="overflow-y-auto">
      Hello
      <div className="w-full flex justify-center">
        <HomeCarousel />
      </div>
      <div className="h-10" />
      <div className="flex flex-row">
        <div className="h-48 w-96 bg-blue-200 rounded-sm flex justify-center items-center text-lg">
          Book Grooming
        </div>
      </div>
      <div className="h-10" />
      <ProductRow />
      <div className="h-10" />
      <div className="h-[1000px]"></div>
    </div>
  );
}
