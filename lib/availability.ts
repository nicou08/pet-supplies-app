import { prisma } from "@/lib/prismadb";
import { generateSlots, hhmmToMinutes } from "@/lib/slots";

export type AvailabilityResult =
  | { kind: "ok"; slots: string[] }
  | { kind: "not_found" };

// Compute the staff member's available 30-minute slots on the given date.
// `date` must be at local midnight; all times are interpreted in the server's
// local timezone (this app intentionally does not handle timezones).
export async function getAvailableSlots(
  staffId: string,
  date: Date
): Promise<AvailabilityResult> {
  const staff = await prisma.staff.findUnique({
    where: { id: staffId },
    select: { id: true },
  });

  if (!staff) {
    return { kind: "not_found" };
  }

  const dayOfWeek = date.getDay();
  const schedule = await prisma.staffSchedule.findUnique({
    where: { staffId_dayOfWeek: { staffId, dayOfWeek } },
    select: { startMinute: true, endMinute: true },
  });

  if (!schedule) {
    return { kind: "ok", slots: [] };
  }

  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const [timeOff, bookedAppointments] = await Promise.all([
    prisma.staffTimeOff.findMany({
      where: {
        staffId,
        startsAt: { lt: endOfDay },
        endsAt: { gt: startOfDay },
      },
      select: { startsAt: true, endsAt: true },
    }),
    prisma.appointment.findMany({
      where: {
        appointmentProviderId: staffId,
        appointmentDate: { gte: startOfDay, lt: endOfDay },
      },
      select: { appointmentTime: true },
    }),
  ]);

  const bookedSet = new Set(bookedAppointments.map((a) => a.appointmentTime));

  const slots = generateSlots(schedule.startMinute, schedule.endMinute)
    .filter((slot) => !bookedSet.has(slot))
    .filter((slot) => {
      const slotStart = new Date(startOfDay);
      slotStart.setMinutes(slotStart.getMinutes() + hhmmToMinutes(slot));
      return !timeOff.some(
        (off) => off.startsAt <= slotStart && off.endsAt > slotStart
      );
    });

  return { kind: "ok", slots };
}
