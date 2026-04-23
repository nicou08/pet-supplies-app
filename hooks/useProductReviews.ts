import useSWR from "swr";
import fetcher from "@/lib/fetcher";

export const useProductReviews = (productId: string) => {
  const { data, error, mutate } = useSWR(
    productId ? `/api/reviews?productId=${productId}` : null,
    fetcher
  );
  return {
    reviews: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
