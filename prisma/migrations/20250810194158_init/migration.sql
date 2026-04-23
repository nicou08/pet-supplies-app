-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_petTypeId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "petTypeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_petTypeId_fkey" FOREIGN KEY ("petTypeId") REFERENCES "PetType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
