import useSWR from "swr";

import fetcher from "@/lib/fetcher";
import { formatYMD } from "@/lib/slots";

interface AvailabilityResponse {
  slots: string[];
}

export const useStaffAvailability = (
  staffId: string | null | undefined,
  date: Date | null | undefined
) => {
  const key =
    staffId && date
      ? `/api/staff/${staffId}/availability?date=${formatYMD(date)}`
      : null;

  const { data, error } = useSWR<AvailabilityResponse>(key, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    slots: data?.slots ?? [],
    isLoading: Boolean(key) && !error && !data,
    isError: error,
  };
};
