"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { BookingDataUpdater, StaffInfo } from "@/types";

interface BookingStage3Props {
  serviceType: string;
  isLoading: boolean;
  isError: boolean;
  staff: StaffInfo[];
  onUpdateBookingData: BookingDataUpdater;
  selectedStaffId: string;
}

export function BookingStage3({
  serviceType,
  isLoading,
  isError,
  staff,
  onUpdateBookingData,
  selectedStaffId,
}: BookingStage3Props) {
  const filteredStaff = useMemo(() => {
    if (!staff || isLoading || isError) return [];

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
