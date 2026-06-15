import { z } from "zod";

/** Active sale attached to a product, mirrors lib/pricing.ts SaleInfo. */
export const saleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  type: z.enum(["PERCENTAGE", "BUY_X_GET_Y"]),
  percentOff: z.number().int().nullable().optional(),
  buyQuantity: z.number().int().nullable().optional(),
  freeQuantity: z.number().int().nullable().optional(),
});

export type Sale = z.infer<typeof saleSchema>;

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
  sale: saleSchema.nullable().optional(),
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
  sale: saleSchema.nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type DetailedProduct = z.infer<typeof detailedProductSchema>;

export const paginatedProductsSchema = z.object({
  items: productSchema.array(),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
});

export type PaginatedProducts = z.infer<typeof paginatedProductsSchema>;
