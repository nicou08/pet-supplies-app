import useSWR from "swr";

import fetcher from "@/lib/fetcher";
import { AppointmentDisplay } from "@/types";

export const useAppointments = (petId: string) => {
  const { data: appointments, error: appointmentsError } = useSWR<
    AppointmentDisplay[]
  >(
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
