import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/prismadb";
import {
  generateSlots,
  hhmmToMinutes,
  parseYMD,
} from "@/lib/slots";

// GET /api/staff/[id]/availability?date=YYYY-MM-DD
// Returns the staff member's open 30-minute slots for the given date as
// canonical "HH:mm" strings. All times are interpreted in the server's local
// timezone — this app intentionally does not handle timezones.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: staffId } = await params;
  const dateParam = request.nextUrl.searchParams.get("date");

  if (!dateParam) {
    return NextResponse.json(
      { error: "Missing required 'date' query parameter (YYYY-MM-DD)." },
      { status: 400 }
    );
  }

  const date = parseYMD(dateParam);
  if (!date) {
    return NextResponse.json(
      { error: "Invalid 'date' format. Expected YYYY-MM-DD." },
      { status: 400 }
    );
  }

  // Reject past dates (today is allowed — the UI can decide whether to show
  // already-passed slots or not).
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) {
    return NextResponse.json(
      { error: "Date must not be in the past." },
      { status: 400 }
    );
  }

  try {
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: { id: true },
    });

    if (!staff) {
      return NextResponse.json(
        { error: "Staff member not found." },
        { status: 404 }
      );
    }

    const dayOfWeek = date.getDay();
    const schedule = await prisma.staffSchedule.findUnique({
      where: { staffId_dayOfWeek: { staffId, dayOfWeek } },
      select: { startMinute: true, endMinute: true },
    });

    if (!schedule) {
      return NextResponse.json({ slots: [] }, { status: 200 });
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

    const bookedSet = new Set(
      bookedAppointments.map((a) => a.appointmentTime)
    );

    const slots = generateSlots(schedule.startMinute, schedule.endMinute)
      .filter((slot) => !bookedSet.has(slot))
      .filter((slot) => {
        const slotStart = new Date(date);
        slotStart.setMinutes(slotStart.getMinutes() + hhmmToMinutes(slot));
        return !timeOff.some(
          (off) => off.startsAt <= slotStart && off.endsAt > slotStart
        );
      });

    return NextResponse.json({ slots }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch staff availability:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
