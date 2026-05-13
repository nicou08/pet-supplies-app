import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

import { auth } from "@/auth";
import { getAvailableSlots } from "@/lib/availability";
import { prisma } from "@/lib/prismadb";
import {
  appointmentDisplaySchema,
  createAppointmentSchema,
} from "@/types";

function normalizeAppointmentPayload(body: unknown) {
  if (typeof body !== "object" || body === null) {
    return body;
  }

  const payload = body as Record<string, unknown>;

  return {
    ...payload,
    appointmentDate:
      typeof payload.appointmentDate === "string" ||
      typeof payload.appointmentDate === "number" ||
      payload.appointmentDate instanceof Date
        ? new Date(payload.appointmentDate)
        : payload.appointmentDate,
  };
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.email) {
      console.error("!session.user.email: Unauthorized or invalid session");
      return NextResponse.json(
        { error: "Unauthorized or invalid session" },
        { status: 401 }
      );
    }

    // 2. Method check
    if (request.method !== "POST") {
      return NextResponse.json(
        { error: "Method Not Allowed" },
        { status: 405 }
      );
    }

    // 3. Parse and validate body
    let body: unknown;

    try {
      body = await request.json();
    } catch (error) {
      console.error("Invalid appointment request body:", error);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parsedBody = createAppointmentSchema.safeParse(
      normalizeAppointmentPayload(body)
    );

    if (!parsedBody.success) {
      console.error(
        "Invalid appointment payload:",
        parsedBody.error.errors
      );
      return NextResponse.json(
        {
          error: "Invalid appointment payload",
          details: parsedBody.error.errors,
        },
        { status: 400 }
      );
    }

    const {
      petTypeId,
      petName,
      petAge,
      appointmentDate,
      appointmentTime,
      appointmentType,
      appointmentStatus,
      appointmentNotes,
      appointmentProviderId,
    } = parsedBody.data;

    // 4. Find the current user
    const currentUser = await prisma.user.findUnique({
      select: {
        id: true,
      },
      where: {
        email: session.user.email,
      },
    });

    if (!currentUser) {
      console.error("!currentUser: User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Re-validate the requested slot against the canonical availability list
    // for this provider/date. UI-side validation is not authoritative.
    const dateAtMidnight = new Date(appointmentDate);
    dateAtMidnight.setHours(0, 0, 0, 0);

    const availability = await getAvailableSlots(
      appointmentProviderId,
      dateAtMidnight
    );

    if (availability.kind === "not_found") {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    if (!availability.slots.includes(appointmentTime)) {
      return NextResponse.json(
        { error: "Selected time slot is not available" },
        { status: 400 }
      );
    }

    // The composite unique constraint on (appointmentProviderId, appointmentDate,
    // appointmentTime) is the authoritative race-condition guard — if two
    // requests both pass the availability check above, only one create() wins.
    try {
      const newAppointment = await prisma.appointment.create({
        data: {
          userId: currentUser.id,
          petTypeId,
          petName,
          petAge,
          appointmentDate: dateAtMidnight,
          appointmentTime,
          appointmentType,
          appointmentStatus,
          appointmentNotes,
          appointmentProviderId,
        },
      });

      return NextResponse.json(newAppointment, { status: 201 });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return NextResponse.json(
          { error: "That time slot was just booked. Please pick another." },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Failed to create appointment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 1. Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.email) {
      console.error("!session.user.email: Unauthorized or invalid session");
      return NextResponse.json(
        { error: "Unauthorized or invalid session" },
        { status: 401 }
      );
    }

    // 2. Method check
    if (request.method !== "GET") {
      return NextResponse.json(
        { error: "Method Not Allowed" },
        { status: 405 }
      );
    }

    // 3. Find the current user
    const currentUser = await prisma.user.findUnique({
      select: {
        id: true,
      },
      where: {
        email: session.user.email,
      },
    });

    if (!currentUser) {
      console.error("!currentUser: User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Fetch appointments for the current user
    const rawAppointments = await prisma.appointment.findMany({
      where: {
        userId: currentUser.id,
      },
      select: {
        id: true,
        userId: true,
        petType: {
          select: {
            id: true,
            displayName: true,
          },
        },
        petName: true,
        petAge: true,
        appointmentDate: true,
        appointmentTime: true,
        appointmentType: true,
        appointmentStatus: true,
        appointmentNotes: true,
        appointmentProvider: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        appointmentDate: "asc",
      },
    });

    // 5. Validate each appointment against the schema
    const validatedAppointments = rawAppointments.map((appointment) => {
      try {
        return appointmentDisplaySchema.parse(appointment);
      } catch (validationError) {
        console.error("Appointment validation failed:", validationError);
        throw new Error(`Invalid appointment data for ID: ${appointment.id}`);
      }
    });

    // 6. Return the validated appointments
    return NextResponse.json(validatedAppointments, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
