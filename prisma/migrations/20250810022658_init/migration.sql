-- CreateTable
CREATE TABLE "ProductPetType" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "petTypeId" TEXT NOT NULL,

    CONSTRAINT "ProductPetType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductPetType_productId_idx" ON "ProductPetType"("productId");

-- CreateIndex
CREATE INDEX "ProductPetType_petTypeId_idx" ON "ProductPetType"("petTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductPetType_productId_petTypeId_key" ON "ProductPetType"("productId", "petTypeId");

-- AddForeignKey
ALTER TABLE "ProductPetType" ADD CONSTRAINT "ProductPetType_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPetType" ADD CONSTRAINT "ProductPetType_petTypeId_fkey" FOREIGN KEY ("petTypeId") REFERENCES "PetType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
