"use client";

import { Button } from "@/components/ui/button";
import { BookingDataUpdater } from "@/types";

interface BookingStage5Props {
  onUpdateBookingData: BookingDataUpdater;
  selectedTime: string;
}

const generateTimeSlots = () => {
  const slots: string[] = [];
  const start = new Date();
  start.setHours(6, 0, 0, 0);

  for (let i = 0; i < 24; i++) {
    const hours = start.getHours();
    const minutes = start.getMinutes();
    const period = hours >= 12 ? " PM" : " AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    slots.push(`${formattedHours}:${formattedMinutes}${period}`);
    start.setMinutes(start.getMinutes() + 30);
  }

  return slots;
};

export function BookingStage5({
  onUpdateBookingData,
  selectedTime,
}: BookingStage5Props) {
  const timeSlots = generateTimeSlots();

  return (
    <div className="flex flex-col">
      <div className="font-bold text-lg pb-7">Select a time</div>

      <div className="pb-2 font-semibold">Morning</div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {timeSlots.slice(0, 12).map((slot) => (
          <Button
            key={slot}
            className={`${
              selectedTime === slot
                ? "bg-neutral-500 hover:bg-neutral-500"
                : "bg-neutral-700 hover:bg-neutral-700"
            } active:scale-95 transition-transform duration-100`}
            onClick={() => {
              onUpdateBookingData("time", slot);
            }}
          >
            <div className="text-xl text-white font-normal">{slot}</div>
          </Button>
        ))}
      </div>

      <div className="h-10" />

      <div className="pb-2 font-semibold">Afternoon</div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {timeSlots.slice(14).map((slot) => (
          <Button
            key={slot}
            className={`${
              selectedTime === slot
                ? "bg-neutral-500 hover:bg-neutral-500"
                : "bg-neutral-700 hover:bg-neutral-700"
            } active:scale-95 transition-transform duration-100`}
            onClick={() => {
              onUpdateBookingData("time", slot);
            }}
          >
            <div className="text-xl text-white font-normal">{slot}</div>
          </Button>
        ))}
      </div>
    </div>
  );
}
