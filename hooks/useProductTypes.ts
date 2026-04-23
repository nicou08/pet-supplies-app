import useSWR from "swr";

import fetcher from "@/lib/fetcher";

export const useProductTypes = () => {
  const { data, error } = useSWR("/api/product-types", fetcher);

  // if (data)
  //   console.log("USEPRODUCTTYPES Fetched product types from database:", data);

  return {
    productTypes: data,
    isLoading: !error && !data,
    isError: error,
  };
};
