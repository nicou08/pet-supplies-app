import "dotenv/config";

import { writeFileSync } from "node:fs";
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

async function main() {
  const sourceUrl = new URL(connectionString as string);
  console.log(
    `Dumping from PostgreSQL at ${sourceUrl.hostname}:${sourceUrl.port || 5432} (database "${sourceUrl.pathname.replace(/^\//, "")}").`
  );

  const [
    petTypes,
    productTypes,
    brands,
    products,
    productPetTypes,
    staff,
    staffSchedules,
    staffTimeOff,
  ] = await Promise.all([
    prisma.petType.findMany({ orderBy: { popularity: "asc" } }),
    prisma.productType.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.productPetType.findMany({ orderBy: { id: "asc" } }),
    prisma.staff.findMany({ orderBy: { name: "asc" } }),
    prisma.staffSchedule.findMany({ orderBy: [{ staffId: "asc" }, { dayOfWeek: "asc" }] }),
    prisma.staffTimeOff.findMany({ orderBy: [{ staffId: "asc" }, { startsAt: "asc" }] }),
  ]);

  const data = {
    petTypes,
    productTypes,
    brands,
    products,
    productPetTypes,
    staff,
    staffSchedules,
    staffTimeOff,
  };

  const outputPath = path.join(process.cwd(), "prisma", "seed-data.json");
  writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log(`\nWrote ${outputPath}`);
  console.log(`  petTypes:        ${petTypes.length}`);
  console.log(`  productTypes:    ${productTypes.length}`);
  console.log(`  brands:          ${brands.length}`);
  console.log(`  products:        ${products.length}`);
  console.log(`  productPetTypes: ${productPetTypes.length}`);
  console.log(`  staff:           ${staff.length}`);
  console.log(`  staffSchedules:  ${staffSchedules.length}`);
  console.log(`  staffTimeOff:    ${staffTimeOff.length}`);
}

void main()
  .catch((error) => {
    console.error("Dump failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
