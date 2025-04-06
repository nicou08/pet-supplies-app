import useSWR from "swr";

import fetcher from "@/lib/fetcher";

export const usePetName = (petName: string) => {
  const { data: petId, error: petError } = useSWR<string>(
    `/api/pet-types?name=${petName}`,
    fetcher
  );

  const isLoading = !petError && !petId;
  const isError = !!petError;

  return {
    petId,
    isLoading,
    isError,
    notFound: petError?.status === 404, // Custom flag for 404 errors
  };
};
