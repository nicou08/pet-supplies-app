import { z } from "zod";

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  price: z.number().positive(),
  mainImageUrl: z.string().url(),
  offersType: z.string().nullable(),
  inStock: z.boolean(),
  averageRating: z.number().min(0).max(5),
  brand: z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
  }),
  productType: z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
  }),
  petType: z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
  }),
});

export type Product = z.infer<typeof productSchema>;
