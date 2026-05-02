"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { useStaffAvailability } from "@/hooks/useStaffAvailability";
import { formatSlotLabel, hhmmToMinutes } from "@/lib/slots";
import { BookingDataUpdater } from "@/types";

interface BookingStage5Props {
  onUpdateBookingData: BookingDataUpdater;
  selectedTime: string;
  providerId: string;
  date: Date | undefined;
}

const NOON_MINUTES = 12 * 60;

export function BookingStage5({
  onUpdateBookingData,
  selectedTime,
  providerId,
  date,
}: BookingStage5Props) {
  const { slots, isLoading, isError } = useStaffAvailability(
    providerId || null,
    date ?? null
  );

  const { morning, afternoon } = useMemo(() => {
    const morning: string[] = [];
    const afternoon: string[] = [];
    for (const slot of slots) {
      if (hhmmToMinutes(slot) < NOON_MINUTES) {
        morning.push(slot);
      } else {
        afternoon.push(slot);
      }
    }
    return { morning, afternoon };
  }, [slots]);

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="font-bold text-lg pb-7">Select a time</div>
        <div>Loading available times...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col">
        <div className="font-bold text-lg pb-7">Select a time</div>
        <div className="text-red-500">
          Could not load available times. Please try again.
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="font-bold text-lg pb-7">Select a time</div>
        <div>No times are available for the selected date.</div>
      </div>
    );
  }

  const renderSlot = (slot: string) => (
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
      <div className="text-xl text-white font-normal">
        {formatSlotLabel(slot)}
      </div>
    </Button>
  );

  return (
    <div className="flex flex-col">
      <div className="font-bold text-lg pb-7">Select a time</div>

      {morning.length > 0 && (
        <>
          <div className="pb-2 font-semibold">Morning</div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {morning.map(renderSlot)}
          </div>
        </>
      )}

      {morning.length > 0 && afternoon.length > 0 && <div className="h-10" />}

      {afternoon.length > 0 && (
        <>
          <div className="pb-2 font-semibold">Afternoon</div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {afternoon.map(renderSlot)}
          </div>
        </>
      )}
    </div>
  );
}
