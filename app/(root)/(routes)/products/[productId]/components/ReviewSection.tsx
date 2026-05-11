"use client";

import { useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useProductReviews } from "@/hooks/useProductReviews";

export function ReviewSection({
  productId,
  averageRating,
  numberOfRatings,
  onReviewSubmit,
}: {
  productId: string;
  averageRating: number;
  numberOfRatings: number;
  onReviewSubmit?: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { reviews, isLoading, isError, mutate } = useProductReviews(productId);
  const { data: session } = authClient.useSession();

  // WriteReviewForm hooks
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //console.log("Review Handle Submit called");
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/reviews", { productId, rating, review });
      setReview("");
      setRating(0);

      // onSuccess callback
      setIsDialogOpen(false);
      mutate(); // re-fetch reviews

      // Call the callback here, after successful submit
      if (onReviewSubmit) onReviewSubmit();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        {session && (
          // <Button onClick={() => setShowForm((v) => !v)}>Write a Review</Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Write your review</DialogTitle>
                  <DialogDescription>
                    Share your thoughts about this product. Your feedback is
                    valuable to us.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 mt-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Rating</Label>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => setRating(i + 1)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              i < rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="username-1">Comment</Label>
                    <Textarea
                      id="username-1"
                      name="username"
                      className="resize-none mb-6"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Write your review..."
                    />
                    {error && <div className="text-red-500 mb-2">{error}</div>}
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={loading || !rating || !review}
                  >
                    {loading ? "Submitting..." : "Submit Review"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {/* {showForm && (
        <WriteReviewForm
          productId={productId}
          onSuccess={() => {
            setShowForm(false);
            mutate(); // re-fetch reviews
          }}
        />
      )} */}
      {isLoading && <div>Loading reviews...</div>}
      {isError && <div className="text-red-500">Failed to load reviews.</div>}
      {reviews && reviews.length === 0 && (
        <div className="text-muted-foreground">No reviews yet.</div>
      )}
      <div className="flex flex-col md:flex-row space-y-6">
        {/* Rating summary section */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex flex-col items-center mr-0 sm:mr-8">
            <span className="text-5xl font-bold text-yellow-400">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-7 h-7 ${
                    i < Math.round(Number(averageRating))
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-nowrap ml-2 text-lg text-muted-foreground">
                ({numberOfRatings} review{numberOfRatings !== 1 ? "s" : ""})
              </span>
            </div>
            <span className="text-xs text-muted-foreground mt-1">Average Rating</span>
          </div>
          {/* The rest of the flex row is empty, so the summary doesn't take up half the width */}
        </div>

        <div className="w-full flex flex-col space-y-4">
          {reviews &&
            reviews.map((review) => (
              <div
                key={review.id}
                className="w-full border-b px-6 pb-4 bg-neutral-900"
              >
                <div className="flex justify-between  py-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">
                      {review.user?.name || "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center mt-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-foreground">
                  {review.review}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
