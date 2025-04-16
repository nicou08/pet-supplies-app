"use client";

import { useState, useEffect } from "react";

import { Calendar } from "@/components/ui/calendar";

interface BookingStage4Props {
  onUpdateBookingData: (field: string, value: any) => void;
}

export function BookingStage4({ onUpdateBookingData }: BookingStage4Props) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    console.log("Selected Date:", date);
    if (date) {
      // Call the function to update booking data
      onUpdateBookingData("date", date);
    }
  }, [date]);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col">
        <div className="font-bold text-lg pb-7">Select a Date</div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border shadow"
        />
      </div>
    </div>
  );
}
