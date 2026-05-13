import { z } from "zod";

export const appointmentInfoSchema = z.object({
  serviceType: z.string(),
  pet: z.object({
    name: z.string(),
    type: z.string(),
    typeId: z.string().uuid(),
    age: z.number(),
  }),
  provider: z.object({
    id: z.string().uuid(),
    name: z.string(),
    specialty: z.array(z.string()),
  }),
  date: z.date(),
  time: z.string(),
  notes: z.string(),
});

// Schema for API request to create appointment
export const createAppointmentSchema = z.object({
  //userId: z.string().uuid(),
  petTypeId: z.string().uuid(),
  petName: z.string(),
  petAge: z.number(),
  appointmentDate: z.date(),
  appointmentTime: z.string(),
  appointmentType: z.string(),
  appointmentStatus: z.string().default("pending"),
  appointmentNotes: z.string().optional(),
  appointmentProviderId: z.string(),
});

export const appointmentDisplaySchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  petType: z.object({
    id: z.string().uuid(),
    displayName: z.string().nullable(),
  }),
  petName: z.string(),
  petAge: z.number(),
  appointmentDate: z.date(),
  appointmentTime: z.string(),
  appointmentType: z.string(),
  appointmentStatus: z.string().default("pending"),
  appointmentNotes: z.string().nullish(),
  appointmentProvider: z.object({
    id: z.string().uuid(),
    name: z.string(),
    role: z.array(z.string()),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().min(5).max(500),
  productId: z.string().uuid(),
  userId: z.string(),
});

// Infer the TypeScript type from the schema
export type AppointmentInfo = z.infer<typeof appointmentInfoSchema>;
export type CreateAppointmentInfo = z.infer<typeof createAppointmentSchema>;
export type AppointmentDisplay = z.infer<typeof appointmentDisplaySchema>;
export type CreateReviewInfo = z.infer<typeof createReviewSchema>;

export type BookingDataUpdater = <K extends keyof AppointmentInfo>(
  field: K,
  value: AppointmentInfo[K]
) => void;

export type StaffSchedule = {
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
};

export type StaffInfo = {
  id: string;
  name: string;
  role: string[];
  schedules: StaffSchedule[];
};

export type PetTypeOption = {
  id: string;
  name: string;
  displayName: string;
  petImageUrl?: string;
};

export type ProductTypeOption = {
  id: string;
  name: string;
  displayName: string;
};

export type ProductReview = {
  id: string;
  rating: number;
  review: string;
  createdAt: Date | string;
  user: {
    name: string | null;
  } | null;
};
