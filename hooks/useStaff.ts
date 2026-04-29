import useSWR from "swr";

import fetcher from "@/lib/fetcher";
import { StaffInfo } from "@/types";

export const useStaff = () => {
  const { data, error } = useSWR<StaffInfo[]>("/api/staff", fetcher, {
    revalidateOnFocus: false,
  });

  //if (data) console.log("USESTAFF Fetched staff from database:", data);

  return {
    staff: data,
    isLoading: !error && !data,
    isError: error,
  };
};
