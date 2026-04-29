"use client";

import { Calendar } from "@/components/ui/calendar";
import { BookingDataUpdater } from "@/types";

interface BookingStage4Props {
  onUpdateBookingData: BookingDataUpdater;
  date: Date | undefined;
}

export function BookingStage4({
  onUpdateBookingData,
  date,
}: BookingStage4Props) {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col">
        <div className="font-bold text-lg pb-7">Select a Date</div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              onUpdateBookingData("date", selectedDate);
            }
          }}
          disabled={(calendarDate) => calendarDate <= new Date()}
          className="rounded-md border shadow"
          classNames={{
            selected: "bg-blue-600 text-white",
          }}
        />
      </div>
    </div>
  );
}
