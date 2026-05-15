/**
 * BookingStage5 — step 5 of the booking wizard: time-slot selection.
 *
 * Fetches available slots for the chosen provider and date via
 * `useStaffAvailability`, then splits them into Morning / Afternoon sections
 * using a noon threshold (720 minutes). Slots are "HH:MM" strings;
 * `hhmmToMinutes` converts them for numeric comparison and `formatSlotLabel`
 * renders them as human-readable labels (e.g. "09:00" → "9:00 AM").
 *
 * Three early-return states (loading, error, empty) are shown before the
 * slot grid so the user always gets meaningful feedback.
 */
"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { useStaffAvailability } from "@/hooks/useStaffAvailability";
import { formatSlotLabel, hhmmToMinutes } from "@/lib/slots";
import { BookingDataUpdater } from "@/types";

/**
 * @param onUpdateBookingData - Shared updater from `BookingForm` state.
 * @param selectedTime - Currently chosen "HH:MM" slot; drives the highlight.
 * @param providerId - ID of the provider selected in stage 3.
 * @param date - Date selected in stage 4; combined with `providerId` to fetch slots.
 */
interface BookingStage5Props {
  onUpdateBookingData: BookingDataUpdater;
  selectedTime: string;
  providerId: string;
  date: Date | undefined;
}

/** Noon expressed in minutes; threshold for splitting slots into AM / PM groups. */
const NOON_MINUTES = 12 * 60;

export function BookingStage5({
  onUpdateBookingData,
  selectedTime,
  providerId,
  date,
}: BookingStage5Props) {
  // `providerId` can be an empty string (falsy) before stage 3 completes;
  // `date` can be undefined before stage 4 completes. Both are coerced to null
  // so the hook can distinguish "not yet selected" from a real value.
  const { slots, isLoading, isError } = useStaffAvailability(
    providerId || null,
    date ?? null
  );

  // Single pass over slots to avoid iterating the array twice.
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

  // Helper (not a component) used by both morning and afternoon grids to avoid
  // duplicating the button markup. The `key` prop is set here so the caller's
  // `.map(renderSlot)` still gets stable reconciliation keys.
  const renderSlot = (slot: string) => (
    <Button
      key={slot}
      className={`${
        selectedTime === slot
          ? "bg-slate-300 hover:bg-slate-300 dark:bg-neutral-500 dark:hover:bg-neutral-500"
          : "bg-slate-100 hover:bg-slate-200 dark:bg-neutral-700 dark:hover:bg-neutral-700"
      } active:scale-95 transition-transform duration-100`}
      onClick={() => {
        onUpdateBookingData("time", slot);
      }}
    >
      <div className="text-xl text-black dark:text-white font-normal">
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

      {/* Spacer only rendered when both sections are visible to avoid extra whitespace. */}
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
