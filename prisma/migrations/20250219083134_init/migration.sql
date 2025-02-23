/*
  Warnings:

  - You are about to drop the column `brandTypeId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `brandId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_brandTypeId_fkey";

-- DropIndex
DROP INDEX "Product_brandTypeId_idx";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "brandTypeId",
ADD COLUMN     "brandId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Product_brandId_idx" ON "Product"("brandId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
