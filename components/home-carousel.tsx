"use client";

import Image from "next/image";
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

  const imageUrls = [
    "/carousel-dog-2.png",
    "/carousel-dog-haircut-1-v3.png",
    "/carousel-gp-1-v2.png",
  ];

  return (
    <Carousel
      className="w-full bg-red-300"
      setApi={setApi}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      plugins={[pluginn.current]}
    >
      <CarouselContent className="-ml-0">
        {imageUrls.map((url, index) => (
          <CarouselItem key={index} className="pl-0">
            <div className="relative w-full h-[600px]">
              <Card className="rounded-none">
                <CardContent className="flex h-[600px] items-center justify-center">
                  <div>
                    <Image
                      src={url}
                      alt={`Carousel Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
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
