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

  const writeReviewDialog = (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Write a Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your thoughts about this product. Your feedback helps other
              shoppers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-6">
            <div className="grid gap-3">
              <Label>Rating</Label>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setRating(i + 1)}
                    className="focus:outline-none"
                    aria-label={`Rate ${i + 1} star${i + 1 !== 1 ? "s" : ""}`}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        i < rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="review-comment">Comment</Label>
              <Textarea
                id="review-comment"
                className="resize-none"
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="What did you think of this product?"
              />
              {error && <div className="text-sm text-red-500">{error}</div>}
            </div>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading || !rating || !review}>
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="mt-16 w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left panel: rating summary */}
        <div className="flex-shrink-0 flex flex-col items-center md:items-start w-full md:w-48 md:border-r md:border-border md:pr-8">
          <span className="text-6xl font-bold text-yellow-400 leading-none">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex items-center gap-0.5 mt-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(Number(averageRating))
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground mt-2">
            {numberOfRatings} {numberOfRatings !== 1 ? "reviews" : "review"}
          </span>
        </div>

        {/* Right panel: review list */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-muted-foreground">
              {isLoading
                ? "Loading reviews..."
                : reviews
                ? `${reviews.length} ${reviews.length !== 1 ? "reviews" : "review"}`
                : ""}
            </span>
            {session && writeReviewDialog}
          </div>

          {isError && (
            <div className="text-sm text-red-500">Failed to load reviews.</div>
          )}

          {!isLoading && !isError && reviews && reviews.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border border-dashed rounded-lg">
              <Star className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-base font-medium">No reviews yet</p>
              {session ? (
                <p className="text-sm mt-1">Be the first to share your thoughts!</p>
              ) : (
                <p className="text-sm mt-1">Sign in to leave the first review.</p>
              )}
            </div>
          )}

          <div className="flex flex-col divide-y divide-border">
            {reviews &&
              reviews.map((review) => (
                <div key={review.id} className="py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {review.user?.name || "Anonymous"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-foreground leading-relaxed">
                    {review.review}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
