"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/app/(root)/(routes)/shop/components/ProductCard";
import { useProductRecommendations } from "@/hooks/useProductRecommendations";

interface RecommendationCarouselProps {
  productId: string;
}

export function RecommendationCarousel({
  productId,
}: RecommendationCarouselProps) {
  const { products, isLoading } = useProductRecommendations(productId);

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">You may also like</h2>
      <Carousel
        opts={{ align: "start", slidesToScroll: 1 }}
        className="px-8"
      >
        <CarouselContent>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <CarouselItem
                  key={i}
                  className="basis-full xs:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <div className="h-[350px] bg-muted rounded-lg animate-pulse" />
                </CarouselItem>
              ))
            : products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="basis-full xs:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </section>
  );
}
