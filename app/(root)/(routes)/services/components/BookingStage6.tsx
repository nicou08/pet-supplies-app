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
      <div className="font-bold text-white">{bookingInfoTitle}</div>
      <div className="text-xl text-white">{bookingInfoData}</div>
    </div>
  );
};

export function BookingStage6({
  bookingData,
}: {
  bookingData: AppointmentInfo;
}) {
  return (
    <div>
      <div className="text-2xl font-medium pb-10">Appointment Summary</div>
      <div className="grid grid-cols-2 gap-10 bg-neutral-900 p-8 rounded-lg">
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

      <div className="text-xl pb-2 pl-2">Additional Notes</div>
      <Textarea
        placeholder="Add any special instructions or notes for the provider..."
        className="w-full h-32"
      />
    </div>
  );
}
