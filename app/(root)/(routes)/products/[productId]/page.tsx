"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Star, ShoppingCart, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ReviewSection } from "./components/ReviewSection";
import { useProduct } from "@/hooks/useProduct";

import { useCart } from "@/context/CartContext";

export default function ProductDetailsPage() {
  const params = useParams<{ productId: string }>();

  const { data: session } = useSession();

  // State for favourite status
  const [isFavourited, setIsFavourited] = useState(false);

  const [favLoading, setFavLoading] = useState(false);

  // State for selected image index
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { product, isLoading, isError, mutate } = useProduct(params.productId);

  useEffect(() => {
    if (!session?.user?.email) return;
    if (!product) return;
    // Fetch user's favourites for this product (optional: you can optimize this)
    axios
      .get(`/api/favourites?productId=${product.id}`)
      .then((res) => setIsFavourited(res.data.favourited))
      .catch(() => setIsFavourited(false));
  }, [session, product]);

  const { addToCart } = useCart();

  // Combine main and secondary images
  const images = product
    ? [product.mainImageUrl, ...(product.secondaryImageUrls || [])]
    : [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !product) {
    return <div>Error loading product details</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.mainImageUrl,
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
      // Optionally show error
      console.error("Error toggling favourite:", e);
      setIsFavourited(!isFavourited); // Revert state on error
    } finally {
      setFavLoading(false);
    }
  };

  return (
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
            {/*Brand */}
            <div className="text-gray-400 space-y-0">
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
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">
              ({product.numberOfRatings} reviews)
            </span>
          </div>
          <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
          <div className="space-y-4 text-md">
            <div className="flex flex-col sm:flex-row">
              <div className="font-bold text-gray-400 min-w-[100px]">
                Description:
              </div>
              <p className="text-white break-words sm:ml-2">
                {product.description}
              </p>
            </div>
            <div className="flex ">
              <div className="font-bold text-gray-400">Type: &nbsp;</div>
              <p className="text-white">{product.productType.displayName}</p>
            </div>
            <div className="flex ">
              <div className="font-bold text-gray-400">For: &nbsp;</div>
              {product.petTypes?.length
                ? product.petTypes.map((t) => t.petType.displayName).join(", ")
                : product.petType?.displayName || "—"}
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
            {/* <Button variant="outline" size="icon">
              <Heart className="w-4 h-4" />
              <span className="sr-only">Add to Favourites</span>
            </Button> */}
          </div>
        </div>
      </div>
      <div className="h-20" />
      {/* Reviews */}

      <ReviewSection
        productId={params.productId}
        averageRating={product.averageRating}
        numberOfRatings={product.numberOfRatings}
        onReviewSubmit={mutate}
      />
      <div className="h-96" />
    </div>
  );
}
