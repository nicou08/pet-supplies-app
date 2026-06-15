"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import axios from "axios";
import { Star, ShoppingCart, Heart } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ReviewSection } from "./ReviewSection";
import { ProductDetailsSkeleton } from "./ProductDetailsSkeleton";
import { RecommendationCarousel } from "./RecommendationCarousel";
import { useProduct } from "@/hooks/useProduct";

import { useCart } from "@/context/CartContext";
import { computeLinePrice, saleBadgeLabel } from "@/lib/pricing";

export function ProductContent() {
  const params = useParams<{ productId: string }>();

  const { data: session } = authClient.useSession();

  const [isFavourited, setIsFavourited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { product, isLoading, isError, mutate } = useProduct(params.productId);

  useEffect(() => {
    if (!session?.user?.email) return;
    if (!product) return;
    axios
      .get(`/api/favourites?productId=${product.id}`)
      .then((res) => setIsFavourited(res.data.favourited))
      .catch(() => setIsFavourited(false));
  }, [session, product]);

  const { addToCart } = useCart();

  const images = product
    ? [product.mainImageUrl, ...(product.secondaryImageUrls || [])]
    : [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !product) {
    return <div>Error loading product details</div>;
  }

  const sale = product.sale ?? null;
  const saleLabel = saleBadgeLabel(sale);
  const { discountedUnitPrice } = computeLinePrice(product.price, 1, sale);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.mainImageUrl,
      sale,
    });
  };

  const handleFavourite = async () => {
    if (!session) return;
    setFavLoading(true);
    try {
      const res = await axios.post("/api/favourites", {
        productId: product.id,
      });
      setIsFavourited(res.data.favourited);
    } catch (e) {
      console.error("Error toggling favourite:", e);
      setIsFavourited(!isFavourited);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="relative">
      {!imageLoaded && (
        <div className="absolute inset-0 z-10 bg-background">
          <ProductDetailsSkeleton />
        </div>
      )}
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="w-full h-auto py-6 flex justify-center">
            <div className="w-full flex justify-center">
              <div className="w-full max-w-xs sm:max-w-md md:max-w-lg flex items-center h-72 sm:h-80 md:h-[550px]">
                <Image
                  src={images[selectedImageIndex] || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full rounded-lg object-contain"
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto py-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 focus:outline-none border-2 rounded-lg ${
                  selectedImageIndex === index
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
                tabIndex={0}
                aria-label={`Show image ${index + 1}`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} view ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="text-muted-foreground space-y-0">
              by {product.brand.name}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.averageRating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.numberOfRatings} reviews)
            </span>
          </div>
          <div className="space-y-1">
            {discountedUnitPrice !== null ? (
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-green-600 dark:text-green-500">
                  ${discountedUnitPrice.toFixed(2)}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
            )}
            {saleLabel && (
              <span className="inline-block rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
                {saleLabel}
              </span>
            )}
          </div>
          <div className="space-y-4 text-md">
            <div className="flex flex-col sm:flex-row">
              <div className="font-bold text-muted-foreground min-w-[100px]">
                Description:
              </div>
              <p className="text-muted-foreground break-words sm:ml-2">
                {product.description}
              </p>
            </div>
            <div className="flex ">
              <div className="font-bold text-muted-foreground">Type: &nbsp;</div>
              <p className="text-muted-foreground">{product.productType.displayName}</p>
            </div>
            <div className="flex ">
              <div className="font-bold text-muted-foreground">For: &nbsp;</div>
              <p className="text-muted-foreground">
                {product.petTypes?.length
                  ? product.petTypes.map((t) => t.petType.displayName).join(", ")
                  : product.petType?.displayName || "—"}
              </p>
            </div>
          </div>

          <div className="h-4" />

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
            <Button className="flex-1 max-w-72" onClick={handleAddToCart}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant={isFavourited ? "default" : "outline"}
              size="icon"
              onClick={handleFavourite}
              disabled={!session || favLoading}
              aria-pressed={isFavourited}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavourited ? "text-red-500 fill-red-500" : ""
                }`}
              />
              <span className="sr-only">
                {isFavourited ? "Remove from Favourites" : "Add to Favourites"}
              </span>
            </Button>
          </div>
        </div>
      </div>
      <div className="h-20" />

      <RecommendationCarousel productId={params.productId} />
      <div className="h-20" />

      <ReviewSection
        productId={params.productId}
        averageRating={product.averageRating}
        numberOfRatings={product.numberOfRatings}
        onReviewSubmit={mutate}
      />
      <div className="h-96" />
    </div>
    </div>
  );
}
