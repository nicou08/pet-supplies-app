"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

interface BookingStage5Props {
  onUpdateBookingData: (field: string, value: any) => void;
}

const generateTimeSlots = () => {
  const slots = [];
  const start = new Date();
  start.setHours(6, 0, 0, 0); // Start at 6:00am

  for (let i = 0; i < 24; i++) {
    const hours = start.getHours();
    const minutes = start.getMinutes();
    const period = hours >= 12 ? " PM" : " AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // Convert to 12-hour format
    const formattedMinutes = minutes.toString().padStart(2, "0");
    slots.push(`${formattedHours}:${formattedMinutes}${period}`);
    start.setMinutes(start.getMinutes() + 30); // Increment by 30 minutes
  }

  return slots;
};

export function BookingStage5({ onUpdateBookingData }: BookingStage5Props) {
  const timeSlots = generateTimeSlots();

  return (
    <div className="flex flex-col">
      <div className="font-bold text-lg pb-7">Select a time</div>

      <div className="pb-2 font-semibold">Morning</div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {timeSlots.slice(0, 12).map((slot, index) => (
          <Button
            key={index}
            className={``}
            onClick={() => {
              //console.log("Selected Time Slot:", slot);
              onUpdateBookingData("time", slot);
            }}
          >
            <div className="text-xl font-normal">{slot}</div>
          </Button>
        ))}
      </div>

      <div className="h-10" />

      <div className="pb-2 font-semibold">Afternoon</div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {timeSlots.slice(14).map((slot, index) => (
          <Button
            key={index}
            className={``}
            onClick={() => {
              console.log("Selected Time Slot:", slot);
              onUpdateBookingData("time", slot);
            }}
          >
            <div className="text-xl font-normal">{slot}</div>
          </Button>
        ))}
      </div>
    </div>
  );
}
