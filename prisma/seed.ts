import "dotenv/config";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL_LOCAL;

if (!connectionString) {
  throw new Error("DATABASE_URL_LOCAL is not set.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type SeedSnapshot = {
  petTypes: Array<{
    id: string;
    name: string;
    displayName: string | null;
    petImageUrl: string | null;
    popularity: number;
  }>;
  productTypes: Array<{
    id: string;
    name: string;
    displayName: string | null;
    description: string | null;
    icon: string | null;
  }>;
  brands: Array<{ id: string; name: string }>;
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    inStock: boolean;
    mainImageUrl: string;
    secondaryImageUrls: string[];
    offersType: string | null;
    isFeatured: boolean;
    isOnSale: boolean;
    isClearance: boolean;
    isNewArrival: boolean;
    productTypeId: string;
    petTypeId: string | null;
    brandId: string;
    averageRating: number;
    numberOfRatings: number;
    createdAt: string;
    updatedAt: string;
  }>;
  productPetTypes: Array<{ id: string; productId: string; petTypeId: string }>;
  staff: Array<{
    id: string;
    name: string;
    role: string[];
    createdAt: string;
    updatedAt: string;
  }>;
  staffSchedules: Array<{
    id: string;
    staffId: string;
    dayOfWeek: number;
    startMinute: number;
    endMinute: number;
    createdAt: string;
    updatedAt: string;
  }>;
  staffTimeOff: Array<{
    id: string;
    staffId: string;
    startsAt: string;
    endsAt: string;
    reason: string | null;
    createdAt: string;
  }>;
};

function loadSnapshot(): SeedSnapshot {
  const dataPath = path.join(process.cwd(), "prisma", "seed-data.json");

  if (!existsSync(dataPath)) {
    throw new Error(
      `Missing ${dataPath}. Run "npm run db:dump-seed" against a database with the data you want to seed from.`
    );
  }

  return JSON.parse(readFileSync(dataPath, "utf-8")) as SeedSnapshot;
}

async function main() {
  const snapshot = loadSnapshot();

  for (const petType of snapshot.petTypes) {
    await prisma.petType.upsert({
      where: { id: petType.id },
      create: petType,
      update: {
        name: petType.name,
        displayName: petType.displayName,
        petImageUrl: petType.petImageUrl,
        popularity: petType.popularity,
      },
    });
  }

  for (const productType of snapshot.productTypes) {
    await prisma.productType.upsert({
      where: { id: productType.id },
      create: productType,
      update: {
        name: productType.name,
        displayName: productType.displayName,
        description: productType.description,
        icon: productType.icon,
      },
    });
  }

  for (const brand of snapshot.brands) {
    await prisma.brand.upsert({
      where: { id: brand.id },
      create: brand,
      update: { name: brand.name },
    });
  }

  for (const member of snapshot.staff) {
    await prisma.staff.upsert({
      where: { id: member.id },
      create: {
        id: member.id,
        name: member.name,
        role: member.role,
        createdAt: new Date(member.createdAt),
        updatedAt: new Date(member.updatedAt),
      },
      update: { name: member.name, role: member.role },
    });
  }

  for (const schedule of snapshot.staffSchedules) {
    await prisma.staffSchedule.upsert({
      where: { id: schedule.id },
      create: {
        id: schedule.id,
        staffId: schedule.staffId,
        dayOfWeek: schedule.dayOfWeek,
        startMinute: schedule.startMinute,
        endMinute: schedule.endMinute,
        createdAt: new Date(schedule.createdAt),
        updatedAt: new Date(schedule.updatedAt),
      },
      update: {
        dayOfWeek: schedule.dayOfWeek,
        startMinute: schedule.startMinute,
        endMinute: schedule.endMinute,
      },
    });
  }

  for (const timeOff of snapshot.staffTimeOff) {
    await prisma.staffTimeOff.upsert({
      where: { id: timeOff.id },
      create: {
        id: timeOff.id,
        staffId: timeOff.staffId,
        startsAt: new Date(timeOff.startsAt),
        endsAt: new Date(timeOff.endsAt),
        reason: timeOff.reason,
        createdAt: new Date(timeOff.createdAt),
      },
      update: {
        startsAt: new Date(timeOff.startsAt),
        endsAt: new Date(timeOff.endsAt),
        reason: timeOff.reason,
      },
    });
  }

  for (const product of snapshot.products) {
    const productData = {
      name: product.name,
      description: product.description,
      price: product.price,
      inStock: product.inStock,
      mainImageUrl: product.mainImageUrl,
      secondaryImageUrls: product.secondaryImageUrls,
      offersType: product.offersType,
      isFeatured: product.isFeatured,
      isOnSale: product.isOnSale,
      isClearance: product.isClearance,
      isNewArrival: product.isNewArrival,
      productTypeId: product.productTypeId,
      petTypeId: product.petTypeId,
      brandId: product.brandId,
      averageRating: product.averageRating,
      numberOfRatings: product.numberOfRatings,
    };

    await prisma.product.upsert({
      where: { id: product.id },
      create: {
        id: product.id,
        ...productData,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt),
      },
      update: productData,
    });
  }

  if (snapshot.productPetTypes.length > 0) {
    await prisma.productPetType.createMany({
      data: snapshot.productPetTypes.map((entry) => ({
        id: entry.id,
        productId: entry.productId,
        petTypeId: entry.petTypeId,
      })),
      skipDuplicates: true,
    });
  }

  console.log(
    `Seeded ${snapshot.products.length} products, ${snapshot.staff.length} staff, ${snapshot.petTypes.length} pet types.`
  );
}

void main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
