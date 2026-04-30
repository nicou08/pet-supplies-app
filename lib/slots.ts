// Booking slot helpers.
// All appointments are 30 minutes long. If that ever changes, every consumer of
// SLOT_DURATION_MINUTES needs to be revisited (slot generation, conflict checks,
// the StaffSchedule subdivision, and the BookingStage5 grid layout).
export const SLOT_DURATION_MINUTES = 30;

// Convert minutes-since-midnight (e.g. 570) to canonical "HH:mm" (e.g. "09:30").
export function minutesToHHMM(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

// Convert canonical "HH:mm" to minutes-since-midnight.
export function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

// "09:30" -> "9:30 AM", "14:00" -> "2:00 PM". For UI display only.
export function formatSlotLabel(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour}:${m.toString().padStart(2, "0")} ${period}`;
}

// Generate every 30-min slot in [startMinute, endMinute) as "HH:mm" strings.
export function generateSlots(
  startMinute: number,
  endMinute: number
): string[] {
  const slots: string[] = [];
  for (let m = startMinute; m < endMinute; m += SLOT_DURATION_MINUTES) {
    slots.push(minutesToHHMM(m));
  }
  return slots;
}

// Format a Date as "YYYY-MM-DD" in local time. Used for SWR keys and query params.
export function formatYMD(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Parse "YYYY-MM-DD" into a Date at local midnight. Returns null if malformed.
export function parseYMD(ymd: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  if (
    date.getFullYear() !== Number(y) ||
    date.getMonth() !== Number(m) - 1 ||
    date.getDate() !== Number(d)
  ) {
    return null;
  }
  return date;
}
