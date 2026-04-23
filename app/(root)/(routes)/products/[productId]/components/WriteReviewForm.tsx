"use client";

import { useProductReviews } from "@/hooks/useProductReviews";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function WriteReviewForm({
  productId,
  onSuccess,
}: {
  productId: string;
  onSuccess: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, review }),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      setReview("");
      setRating(0);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-4 border rounded bg-gray-50 dark:bg-neutral-900"
    >
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => setRating(i + 1)}
            className="focus:outline-none"
          >
            <Star
              className={`w-6 h-6 ${
                i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
      <textarea
        className="w-full p-2 rounded border mb-2"
        rows={3}
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review..."
        required
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <Button type="submit" disabled={loading || !rating || !review}>
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
