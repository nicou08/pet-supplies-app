/*
  Warnings:

  - Added the required column `brandTypeId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "brandTypeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_brandTypeId_idx" ON "Product"("brandTypeId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandTypeId_fkey" FOREIGN KEY ("brandTypeId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
