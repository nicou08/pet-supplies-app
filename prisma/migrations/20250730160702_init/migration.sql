-- AlterTable
ALTER TABLE "PetType" ADD COLUMN     "petImageUrl" TEXT,
ADD COLUMN     "popularity" INTEGER NOT NULL DEFAULT 0;
