import { z } from "zod";

export const appointmentInfoSchema = z.object({
  serviceType: z.string(),
  pet: z.object({
    name: z.string(),
    type: z.string(),
    age: z.number(),
  }),
  provider: z.object({
    id: z.string().uuid(),
    name: z.string(),
    specialty: z.array(z.string()),
  }),
  date: z.date(),
  time: z.string(),
});

// Infer the TypeScript type from the schema
export type AppointmentInfo = z.infer<typeof appointmentInfoSchema>;
