/**
 * BookingStage3 — step 3 of the booking wizard: provider selection.
 *
 * Filters the full staff list down to members whose role array matches the
 * service type chosen in stage 1. The three named service types use slightly
 * different role strings (e.g. "Veterinary" → "Veterinarian") so they are
 * handled explicitly; any unrecognised service type falls back to a generic
 * substring match against `serviceType` itself.
 *
 * The full staff list is fetched once in `BookingForm` (via `useStaff`) and
 * passed down so this component does not trigger its own network request.
 */
"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { BookingDataUpdater, StaffInfo } from "@/types";

/**
 * @param serviceType - Appointment type from stage 1; used to filter staff by role.
 * @param isLoading - True while the staff list is being fetched.
 * @param isError - True if the staff fetch failed.
 * @param staff - Full staff list from the API.
 * @param onUpdateBookingData - Shared updater from `BookingForm` state.
 * @param selectedStaffId - ID of the currently selected staff member; drives highlight.
 */
interface BookingStage3Props {
  serviceType: string;
  isLoading: boolean;
  isError: boolean;
  staff: StaffInfo[];
  onUpdateBookingData: BookingDataUpdater;
  selectedStaffId: string;
}

/** Renders the provider selection grid for booking stage 3. */
export function BookingStage3({
  serviceType,
  isLoading,
  isError,
  staff,
  onUpdateBookingData,
  selectedStaffId,
}: BookingStage3Props) {
  // Memoised so the filter only reruns when the staff list or service type
  // actually changes, not on every parent re-render.
  const filteredStaff = useMemo(() => {
    if (!staff || isLoading || isError) return [];

    // Service type names and role strings don't share an exact naming convention
    // (e.g. "Veterinary" ≠ "Veterinarian"), so each known type is mapped
    // explicitly. The final fallback handles any future service types whose
    // role string happens to match the service type name directly.
    if (serviceType === "Veterinary") {
      return staff.filter((staffMember) =>
        staffMember.role.includes("Veterinarian")
      );
    }
    if (serviceType === "Grooming") {
      return staff.filter((staffMember) => staffMember.role.includes("Groomer"));
    }
    if (serviceType === "Training") {
      return staff.filter((staffMember) => staffMember.role.includes("Trainer"));
    }
    return staff.filter((staffMember) =>
      staffMember.role.includes(serviceType)
    );
  }, [isError, isLoading, serviceType, staff]);

  if (isLoading) {
    return <div>Loading staff...</div>;
  }

  if (isError) {
    return <div>Error loading staff. Please try again later.</div>;
  }

  return (
    <div>
      <h2 className="font-bold text-lg pb-7">Select a Staff Member</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-4">
        {filteredStaff.map((member) => (
          <Button
            key={member.id}
            className={`flex flex-col justify-start items-start w-full h-32 py-5 px-8 gap-0 ${
              selectedStaffId === member.id
                ? "bg-slate-300 hover:bg-slate-300 dark:bg-neutral-500 dark:hover:bg-neutral-500"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-neutral-700 dark:hover:bg-neutral-700"
            } active:scale-95 transition-transform duration-100`}
            onClick={() =>
              onUpdateBookingData("provider", {
                id: member.id,
                name: member.name,
                specialty: member.role,
              })
            }
          >
            <div className="text-xl font-semibold text-black dark:text-white pb-2">
              {member.name}
            </div>
            <div className="text-md font-normal text-gray-600 dark:text-gray-100 text-left text-wrap">
              {member.role.join(", ")}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
