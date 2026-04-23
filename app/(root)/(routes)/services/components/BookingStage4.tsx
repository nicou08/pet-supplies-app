"use client";

import { useState, useEffect } from "react";

import { Calendar } from "@/components/ui/calendar";

interface BookingStage4Props {
  onUpdateBookingData: (field: string, value: any) => void;
  date: Date | undefined;
}

export function BookingStage4({
  onUpdateBookingData,
  date,
}: BookingStage4Props) {
  //const [date, setDate] = useState<Date | undefined>(new Date());

  // useEffect(() => {
  //   console.log("Selected Date:", date);
  //   // if (date) {
  //   //   // Call the function to update booking data
  //   //   onUpdateBookingData("date", date);
  //   // }
  // }, [date]);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col">
        <div className="font-bold text-lg pb-7">Select a Date</div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => onUpdateBookingData("date", selectedDate)}
          disabled={(date) => date <= new Date()}
          className="rounded-md border shadow"
          classNames={{
            day_selected: "bg-blue-600 text-white",
          }}
        />
      </div>
    </div>
  );
}
