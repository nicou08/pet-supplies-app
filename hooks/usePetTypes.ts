import useSWR from "swr";

import fetcher from "@/lib/fetcher";
import { PetTypeOption } from "@/types";

export const usePetTypes = (top?: number) => {
  const url =
    typeof top === "number" ? `/api/pet-types?top=${top}` : "/api/pet-types";

  const { data, error } = useSWR<PetTypeOption[]>(url, fetcher);

  //if (data) console.log("USEPETTYPES Fetched pet types from database:", data);

  return {
    petTypes: data,
    isLoading: !error && !data,
    isError: error,
  };
};
