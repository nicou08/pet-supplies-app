import useSWR from "swr";

import fetcher from "@/lib/fetcher";

export const useAppointments = (petId: string) => {
  const { data: appointments, error: appointmentsError } = useSWR(
    "/api/appointments",
    fetcher
  );

  const isLoading = !appointmentsError && !appointments;
  const isError = !!appointmentsError;

  return {
    appointments,
    isLoading,
    isError,
  };
};
