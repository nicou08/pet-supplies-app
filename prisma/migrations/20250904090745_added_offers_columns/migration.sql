-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "isClearance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNewArrival" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isOnSale" BOOLEAN NOT NULL DEFAULT false;
