/**
 * BookingStage6 — step 6 of the booking wizard: review and notes.
 *
 * Displays a read-only summary of all choices made in stages 1-5 (service
 * type, date/time, pet, provider) and exposes the only still-editable field
 * at this stage: optional free-text notes for the provider. Submitting the
 * form from this stage triggers `onConfirmBooking` in `BookingForm`.
 */
"use client";

import { Textarea } from "@/components/ui/textarea";

import { formatSlotLabel } from "@/lib/slots";
import { AppointmentInfo, BookingDataUpdater } from "@/types";

/**
 * Private display component for a single label/value row in the summary grid.
 * Not exported — only used within this file.
 *
 * @param bookingInfoTitle - Bold label shown above the value.
 * @param bookingInfoData - Plain-text value to display.
 */
const BookingInfoSection = ({
  bookingInfoTitle,
  bookingInfoData,
}: {
  bookingInfoTitle: string;
  bookingInfoData: string;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="font-bold text-foreground">
        {bookingInfoTitle}
      </div>
      <div className="text-md text-foreground">
        {bookingInfoData}
      </div>
    </div>
  );
};

/**
 * Renders the appointment summary and optional notes textarea for booking stage 6.
 *
 * @param bookingData - Complete booking state accumulated across all prior stages.
 * @param onUpdateBookingData - Shared updater from `BookingForm`; used only for `notes`.
 */
export function BookingStage6({
  bookingData,
  onUpdateBookingData,
}: {
  bookingData: AppointmentInfo;
  onUpdateBookingData: BookingDataUpdater;
}) {
  return (
    <div>
      <div className="text-xl font-bold pb-10">Appointment Summary</div>
      <div className="grid grid-cols-2 gap-10 bg-muted p-8 rounded-lg">
        <BookingInfoSection
          bookingInfoTitle="Appointment Type"
          bookingInfoData={bookingData.serviceType}
        />
        {/* `formatSlotLabel` converts the "HH:MM" slot string to a readable label (e.g. "9:00 AM"). */}
        <BookingInfoSection
          bookingInfoTitle="Date & Time"
          bookingInfoData={`${bookingData.date.toDateString()} at ${formatSlotLabel(
            bookingData.time
          )}`}
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
        className="bg-muted text-foreground placeholder:text-muted-foreground w-full h-32 resize-none"
        spellCheck={false}
        value={bookingData.notes}
        onChange={(e) => onUpdateBookingData("notes", e.target.value)}
      />
    </div>
  );
}
