"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type Staff = {
  id: string;
  name: string;
  speciality: string[];
};

interface BookingStage3Props {
  staff: Staff[];
  onUpdateBookingData: (field: string, value: any) => void;
}

export function BookingStage3({
  staff,
  onUpdateBookingData,
}: BookingStage3Props) {
  const [selectedStaff, setSelectedStaff] = useState("");

  return (
    <div>
      <div>Stage 3</div>
      <h2 className="text-lg font-semibold">Select a Staff Member</h2>
      {staff.map((member) => (
        <Button
          key={member.id}
          className={`flex flex-col justify-start items-start h-48 py-5 px-8 gap-0 ${
            selectedStaff === member.id ? "bg-blue-200" : "bg-gray-200"
          }`}
          onClick={() => (
            console.log("Selected Staff Member:", member),
            setSelectedStaff(member.id),
            onUpdateBookingData("provider", {
              id: member.id,
              name: member.name,
              specialty: member.speciality,
            })
          )}
        >
          <div className="text-xl font-semibold pb-2">{member.name}</div>
          <div className="text-md font-normal text-gray-600 text-left text-wrap">
            {member.speciality.join(", ")}
          </div>
        </Button>
      ))}
    </div>
  );
}
