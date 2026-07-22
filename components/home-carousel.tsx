"use client";

import Image from "next/image";
import Link from "next/link";
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

  const slides = [
    {
      src: "/carousel-dog-1-v2-2x1.png",
      href: "/products/d6408ee2-a63e-4f9c-a1e7-32fe4c5958e3",
      alt: "Shop the featured dog product on sale",
    },
    {
      src: "/carousel-gp-1-v3-2x1.png",
      href: `/pets/${encodeURIComponent("Guinea Pig")}`,
      alt: "Shop guinea pig supplies",
    },
    {
      src: "/carousel-dog-haircut-1-v4-2x1.png",
      href: "/services?serviceType=grooming",
      alt: "Book a grooming appointment",
    },
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
        {slides.map((slide, index) => (
          <CarouselItem key={index} className="pl-0">
            <Link href={slide.href} className="block">
              <div className="relative w-full h-[600px]">
                <Card className="rounded-none">
                  <CardContent className="flex h-[600px] items-center justify-center">
                    <div>
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-16" />
      <CarouselNext className="mr-16" />
    </Carousel>
  );
}
