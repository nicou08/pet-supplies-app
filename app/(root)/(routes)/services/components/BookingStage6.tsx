"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { AppointmentInfo } from "@/types";

const BookingInfoSection = ({
  bookingInfoTitle,
  bookingInfoData,
}: {
  bookingInfoTitle: string;
  bookingInfoData: string;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="font-bold text-neutral-800 dark:text-white">
        {bookingInfoTitle}
      </div>
      <div className="text-md text-neutral-800 dark:text-white">
        {bookingInfoData}
      </div>
    </div>
  );
};

export function BookingStage6({
  bookingData,
  onUpdateBookingData,
}: {
  bookingData: AppointmentInfo;
  onUpdateBookingData: (field: string, value: any) => void;
}) {
  const [notes, setNotes] = useState<string>("");

  return (
    <div>
      <div className="text-xl font-bold pb-10">Appointment Summary</div>
      <div className="grid grid-cols-2 gap-10 bg-neutral-300 dark:bg-neutral-950 p-8 rounded-lg">
        <BookingInfoSection
          bookingInfoTitle="Appointment Type"
          bookingInfoData={bookingData.serviceType}
        />
        <BookingInfoSection
          bookingInfoTitle="Date & Time"
          bookingInfoData={`${bookingData.date.toDateString()} at ${
            bookingData.time
          }`}
        />
        <BookingInfoSection
          bookingInfoTitle="Pet"
          bookingInfoData={bookingData.pet.name}
        />
        <BookingInfoSection
          bookingInfoTitle="Provider"
          bookingInfoData={bookingData.provider.name}
        />
      </div>

      <div className="h-10" />

      <div className="text-lg pb-2 pl-2">Additional Notes</div>
      <Textarea
        placeholder="Add any special instructions or notes for the provider..."
        className="bg-neutral-300 dark:bg-neutral-950 text-neutral-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 w-full h-32 resize-none"
        spellCheck={false}
        value={bookingData.notes}
        onChange={(e) => onUpdateBookingData("notes", e.target.value)}
      />
    </div>
  );
}
