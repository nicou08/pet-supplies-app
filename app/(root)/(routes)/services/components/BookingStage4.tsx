/**
 * BookingStage4 — step 4 of the booking wizard: date selection.
 *
 * Renders a single-select calendar that disables two categories of dates:
 *   1. Any date on or before today (same-day booking is not allowed).
 *   2. Days of the week on which the selected provider has no schedule entry.
 *
 * The provider's working days are derived from `schedules` (passed down from
 * `BookingForm`) and stored in a `Set` for O(1) lookup inside the per-cell
 * `disabled` callback, which the Calendar fires for every visible date cell.
 *
 * **Coupling note:** `StaffSchedule.dayOfWeek` must use the same 0-6
 * (Sunday=0) convention as `Date.prototype.getDay()`. A mismatch would
 * silently disable the wrong days.
 */
"use client";

import { useMemo } from "react";

import { Calendar } from "@/components/ui/calendar";
import { BookingDataUpdater, StaffSchedule } from "@/types";

/**
 * @param onUpdateBookingData - Shared updater from `BookingForm` state.
 * @param date - Currently selected date; `undefined` until the user picks one.
 * @param schedules - Working-day schedule for the provider chosen in stage 3.
 */
interface BookingStage4Props {
  onUpdateBookingData: BookingDataUpdater;
  date: Date | undefined;
  schedules: StaffSchedule[];
}

/** Renders the date-picker for booking stage 4. */
export function BookingStage4({
  onUpdateBookingData,
  date,
  schedules,
}: BookingStage4Props) {
  // Set gives O(1) lookup; this callback is invoked for every visible calendar
  // cell, so a linear array search would be noticeably slower on large months.
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
          // The Calendar can fire onSelect with undefined when a date is
          // deselected; guard avoids clearing a previously valid selection.
          onSelect={(selectedDate) => {
            if (selectedDate) {
              onUpdateBookingData("date", selectedDate);
            }
          }}
          // `<= new Date()` disables today as well as past dates.
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
