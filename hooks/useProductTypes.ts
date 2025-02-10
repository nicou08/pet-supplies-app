import useSWR from "swr";

import fetcher from "@/lib/fetcher";

export const useProductTypes = () => {
  const { data, error } = useSWR("/api/product-types", fetcher);

  return {
    productTypes: data,
    isLoading: !error && !data,
    isError: error,
  };
};
