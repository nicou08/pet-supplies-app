"use client";

import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";

type StaffInfo = {
  id: string;
  name: string;
  role: string[];
};

interface BookingStage3Props {
  serviceType: string;
  isLoading: boolean;
  isError: boolean;
  staff: StaffInfo[];
  onUpdateBookingData: (field: string, value: any) => void;
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
  const [selectedStaff, setSelectedStaff] = useState("");

  // Filter staff based on the selected service type
  const filteredStaff = useMemo(() => {
    if (!staff || isLoading || isError) return [];

    if (serviceType === "Veterinary") {
      return staff.filter((staffMember) =>
        staffMember.role.includes("Veterinarian")
      );
    }
    if (serviceType === "Grooming") {
      return staff.filter((staffMember) =>
        staffMember.role.includes("Groomer")
      );
    }
    if (serviceType === "Training") {
      return staff.filter((staffMember) =>
        staffMember.role.includes("Trainer")
      );
    }
    return staff.filter((staffMember) =>
      staffMember.role.includes(serviceType)
    );
  }, [serviceType]);

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
                ? "bg-neutral-500 hover:bg-neutral-500"
                : "bg-neutral-700 hover:bg-neutral-700"
            }  active:scale-95 transition-transform duration-100`}
            onClick={() => (
              console.log("Selected Staff Member:", member.name),
              //setSelectedStaff(member.id),
              onUpdateBookingData("provider", {
                id: member.id,
                name: member.name,
                specialty: member.role,
              })
            )}
          >
            <div className="text-xl font-semibold text-white pb-2">
              {member.name}
            </div>
            <div className="text-md font-normal text-gray-100 text-left text-wrap">
              {member.role.join(", ")}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
