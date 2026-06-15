import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * Manual sales seeder.
 *
 * Since the app has no admin UI, define sales here and run:
 *
 *   npm run db:seed-sales
 *
 * Each entry creates (or updates, by `name`) one Sale and links it to the given
 * product IDs via the ProductSale junction. The app applies at most ONE active
 * sale per product, so don't link the same product to two active sales.
 *
 * Sale types:
 *   - PERCENTAGE:   set `percentOff` (1–100).
 *   - BUY_X_GET_Y:  set `buyQuantity` (pay for N) and `freeQuantity` (get M free).
 *                   "Buy 3 get the 4th free" => buyQuantity: 3, freeQuantity: 1.
 *
 * Find product IDs with:  SELECT id, name FROM "Product";
 */

type SaleSeed = {
  name: string;
  type: "PERCENTAGE" | "BUY_X_GET_Y";
  percentOff?: number;
  buyQuantity?: number;
  freeQuantity?: number;
  active?: boolean;
  startsAt?: string; // ISO date, optional
  endsAt?: string; // ISO date, optional
  productIds: string[];
};

// ─── Edit this list ──────────────────────────────────────────────────────────
const SALES: SaleSeed[] = [
  {
    // Fleece Pads — buy 4, get the 5th free.
    name: "Buy 4 Get the 5th Free",
    type: "BUY_X_GET_Y",
    buyQuantity: 4,
    freeQuantity: 1,
    active: true,
    productIds: ["c1f368fc-a201-4c09-a05d-83501c33b9fb"],
  },
  {
    // Premium Dog Food — buy 3, get the 4th free.
    name: "Buy 3 Get the 4th Free",
    type: "BUY_X_GET_Y",
    buyQuantity: 3,
    freeQuantity: 1,
    active: true,
    productIds: ["d6408ee2-a63e-4f9c-a1e7-32fe4c5958e3"],
  },
  {
    // Timothy Hay — 20% off.
    name: "20% Off Timothy Hay",
    type: "PERCENTAGE",
    percentOff: 20,
    active: true,
    productIds: ["dd86443b-2925-412f-8302-7f1f4f249266"],
  },
  {
    // Dry Dog Food — 10% off.
    name: "10% Off Dry Dog Food",
    type: "PERCENTAGE",
    percentOff: 10,
    active: true,
    productIds: ["262514ce-60fc-49e6-bfa6-187722e31fb0"],
  },
];
// ─────────────────────────────────────────────────────────────────────────────

const connectionString = process.env.DATABASE_URL_LOCAL;
if (!connectionString) {
  throw new Error("DATABASE_URL_LOCAL is not set.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  let createdLinks = 0;

  for (const sale of SALES) {
    if (sale.productIds.length === 0) {
      console.warn(`Skipping "${sale.name}" — no productIds provided.`);
      continue;
    }

    const data = {
      name: sale.name,
      type: sale.type,
      percentOff: sale.percentOff ?? null,
      buyQuantity: sale.buyQuantity ?? null,
      freeQuantity: sale.freeQuantity ?? null,
      active: sale.active ?? true,
      startsAt: sale.startsAt ? new Date(sale.startsAt) : null,
      endsAt: sale.endsAt ? new Date(sale.endsAt) : null,
    };

    // Upsert by name so re-running updates the same sale instead of duplicating.
    const existing = await prisma.sale.findFirst({ where: { name: sale.name } });
    const saved = existing
      ? await prisma.sale.update({ where: { id: existing.id }, data })
      : await prisma.sale.create({ data });

    for (const productId of sale.productIds) {
      await prisma.productSale.upsert({
        where: { productId_saleId: { productId, saleId: saved.id } },
        create: { productId, saleId: saved.id },
        update: {},
      });
      createdLinks++;
    }

    console.log(`Saved sale "${sale.name}" → ${sale.productIds.length} product(s).`);
  }

  console.log(`Done. ${createdLinks} product link(s) ensured.`);
}

void main()
  .catch((error) => {
    console.error("Sales seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
