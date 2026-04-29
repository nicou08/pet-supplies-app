import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/auth";
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
  // const session = await auth();

  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  // if (!session.user?.email) {
  //   return NextResponse.json({ error: "User not found" }, { status: 404 });
  // }
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user?.email) {
      console.error("!session.user.email: Unauthorized or invalid session");
      return NextResponse.json(
        { error: "Unauthorized or invalid session" },
        { status: 401 }
      );
    }

    if (session) {
      console.log("Session user email:", session.user.email);
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

    console.log("Received body:", body);

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

    // Check if the appointment already exists
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        petTypeId,
        appointmentDate,
        appointmentTime,
        userId: currentUser.id,
      },
    });

    if (existingAppointment) {
      console.error("existingAppointment: Appointment already exists");
      return NextResponse.json(
        { error: "Appointment already exists" },
        { status: 409 }
      );
    }

    // Create a new appointment
    const newAppointment = await prisma.appointment.create({
      data: {
        userId: currentUser.id,
        petTypeId,
        petName,
        petAge,
        appointmentDate,
        appointmentTime,
        appointmentType,
        appointmentStatus,
        appointmentNotes,
        appointmentProviderId,
      },
    });

    return NextResponse.json(newAppointment, { status: 201 });
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
    const session = await auth();
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
    console.log("Validated appointments");

    // 6. Return the validated appointments
    if (validatedAppointments.length === 0) {
      return NextResponse.json(
        { message: "No appointments found" },
        { status: 404 }
      );
    }
    return NextResponse.json(validatedAppointments, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
