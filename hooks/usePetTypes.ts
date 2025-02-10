import useSWR from "swr";

import fetcher from "@/lib/fetcher";

export const usePetTypes = () => {
  const { data, error } = useSWR("/api/pet-types", fetcher);

  return {
    petTypes: data,
    isLoading: !error && !data,
    isError: error,
  };
};
