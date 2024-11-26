"use client";

import { EmblaOptionsType } from "embla-carousel";

import { HomeCarousel } from "@/components/home-carousel";
import EmblaCarousel from "@/components/home-carousel-2";

export default function HomePage() {
  const OPTIONS: EmblaOptionsType = { loop: true };
  const SLIDE_COUNT = 5;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
  return (
    <div>
      Hello
      <div className="w-full flex justify-center">
        <HomeCarousel />
      </div>
    </div>
  );
}
