"use client";

import { useMemo } from "react";

import { Calendar } from "@/components/ui/calendar";
import { BookingDataUpdater, StaffSchedule } from "@/types";

interface BookingStage4Props {
  onUpdateBookingData: BookingDataUpdater;
  date: Date | undefined;
  schedules: StaffSchedule[];
}

export function BookingStage4({
  onUpdateBookingData,
  date,
  schedules,
}: BookingStage4Props) {
  const workingDaysSet = useMemo(
    () => new Set(schedules.map((s) => s.dayOfWeek)),
    [schedules]
  );

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
          disabled={(calendarDate) =>
            calendarDate <= new Date() ||
            !workingDaysSet.has(calendarDate.getDay())
          }
          className="rounded-md border shadow"
          classNames={{
            selected: "bg-blue-600 text-white",
          }}
        />
      </div>
    </div>
  );
}
