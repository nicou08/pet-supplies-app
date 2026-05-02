import { NextResponse, type NextRequest } from "next/server";

import { getAvailableSlots } from "@/lib/availability";
import { parseYMD } from "@/lib/slots";

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
    const result = await getAvailableSlots(staffId, date);

    if (result.kind === "not_found") {
      return NextResponse.json(
        { error: "Staff member not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ slots: result.slots }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch staff availability:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
