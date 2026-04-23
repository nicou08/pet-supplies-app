/*
  Warnings:

  - You are about to alter the column `mainImageUrl` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.
  - You are about to alter the column `secondaryImageUrls` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.

*/
-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "mainImageUrl" SET DATA TYPE VARCHAR(2048),
ALTER COLUMN "secondaryImageUrls" SET DATA TYPE VARCHAR(2048)[];
