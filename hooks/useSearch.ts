import useSWR from "swr";

import fetcher from "@/lib/fetcher";

export function useSearch(query: string) {
  const { data, error } = useSWR(`/api/search?q=${query}`, fetcher);

  return {
    data,
    error,
    isLoading: !error && !data,
  };
}
