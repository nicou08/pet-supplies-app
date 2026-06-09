import useSWR from "swr";

import fetcher from "@/lib/fetcher";

export interface FavouriteProduct {
  id: string;
  name: string;
  price: number;
  mainImageUrl: string;
}

export function useFavourites() {
  const { data, error } = useSWR<FavouriteProduct[]>("/api/favourites", fetcher);

  return {
    favourites: data ?? [],
    isLoading: !error && !data,
    isError: error,
  };
}
