"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export function HomeCarousel() {
  const [api, setApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (api) {
      api.reInit({ loop: true });
    }
  }, [api]);

  const pluginn = useRef(Autoplay({ delay: 10000, stopOnInteraction: true }));

  const handleMouseEnter = () => {
    if (pluginn.current) {
      pluginn.current.stop();
      //console.log("Mouse enter");
    }
  };

  const handleMouseLeave = () => {
    if (pluginn.current) {
      pluginn.current.play();
      //console.log("Mouse leave");
    }
  };

  return (
    <Carousel
      className="w-full bg-red-300"
      setApi={setApi}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      plugins={[pluginn.current]}
    >
      <CarouselContent className="-ml-0">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="pl-0">
            <div className="">
              <Card className="rounded-none">
                <CardContent className="flex h-[600px] items-center justify-center">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-16" />
      <CarouselNext className="mr-16" />
    </Carousel>
  );
}
