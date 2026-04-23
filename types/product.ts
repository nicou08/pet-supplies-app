import { petData } from "@/constants/petData";
import { getDisplayName } from "next/dist/shared/lib/utils";
import { number, z } from "zod";

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
  petTypes: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string().min(1),
      displayName: z.string().min(1).optional(),
    })
  ),
});

export type Product = z.infer<typeof productSchema>;

export const detailedProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  mainImageUrl: z.string().url(),
  secondaryImageUrls: z.array(z.string().url()).optional(),
  offersType: z.string().nullable(),
  inStock: z.boolean(),
  averageRating: z.number().min(0).max(5),
  numberOfRatings: z.number().int().nonnegative(),
  brand: z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
  }),
  productType: z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    displayName: z.string().min(1),
  }),
  petType: z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    displayName: z.string().min(1),
  }),
  petTypes: z.array(
    z.object({
      productId: z.string().uuid(),
      petTypeId: z.string().uuid(),
      petType: z.object({
        id: z.string().uuid(),
        name: z.string().min(1),
        displayName: z.string().min(1).optional(),
      }),
    })
  ),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type DetailedProduct = z.infer<typeof detailedProductSchema>;
