import "dotenv/config";

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

const productImageBase =
  "https://s3-pet-supplies-app-v1.s3.ca-west-1.amazonaws.com/donkey1.jpg";

const petTypes = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "dog",
    displayName: "Dog",
    petImageUrl: "/pets/dog1_square_v1.png",
    popularity: 1,
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "cat",
    displayName: "Cat",
    petImageUrl: "/pets/cat2_square_v1.png",
    popularity: 2,
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "bird",
    displayName: "Bird",
    petImageUrl: "/pets/bird1_square_v1.png",
    popularity: 3,
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    name: "fish",
    displayName: "Fish",
    petImageUrl: "/pets/fish1_square_v1.png",
    popularity: 4,
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    name: "rabbit",
    displayName: "Rabbit",
    petImageUrl: "/pets/rabbit1_square_v1.png",
    popularity: 5,
  },
  {
    id: "66666666-6666-6666-6666-666666666666",
    name: "guinea-pig",
    displayName: "Guinea Pig",
    petImageUrl: "/pets/guinea2_square_v1.png",
    popularity: 6,
  },
] as const;

const productTypes = [
  {
    id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
    name: "food",
    displayName: "Food",
    description: "Meals, treats, and daily nutrition.",
    icon: "utensils",
  },
  {
    id: "aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
    name: "toys",
    displayName: "Toys",
    description: "Playtime products for enrichment and exercise.",
    icon: "bone",
  },
  {
    id: "aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3",
    name: "habitats",
    displayName: "Habitats",
    description: "Tanks, cages, and habitat accessories.",
    icon: "house",
  },
  {
    id: "aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaa4",
    name: "grooming",
    displayName: "Grooming",
    description: "Bathing and coat care essentials.",
    icon: "scissors",
  },
  {
    id: "aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaa5",
    name: "accessories",
    displayName: "Accessories",
    description: "Travel and everyday gear.",
    icon: "shopping-bag",
  },
  {
    id: "aaaaaaa6-aaaa-aaaa-aaaa-aaaaaaaaaaa6",
    name: "health",
    displayName: "Health",
    description: "Supplements and wellness support.",
    icon: "heart-pulse",
  },
] as const;

const brands = [
  {
    id: "bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1",
    name: "Pawsitive Wellness",
  },
  {
    id: "bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2",
    name: "Happy Tails Outfitters",
  },
  {
    id: "bbbbbbb3-bbbb-bbbb-bbbb-bbbbbbbbbbb3",
    name: "AquaFun Comforts",
  },
  {
    id: "bbbbbbb4-bbbb-bbbb-bbbb-bbbbbbbbbbb4",
    name: "WildBites",
  },
  {
    id: "bbbbbbb5-bbbb-bbbb-bbbb-bbbbbbbbbbb5",
    name: "FeatherNest Homes",
  },
  {
    id: "bbbbbbb6-bbbb-bbbb-bbbb-bbbbbbbbbbb6",
    name: "Gregarious Co.",
  },
] as const;

const products = [
  {
    id: "c1111111-1111-4111-8111-111111111111",
    name: "WildBites Grain-Free Dog Kibble",
    description:
      "Protein-rich dry food with chicken, pumpkin, and brown rice for everyday dog nutrition.",
    price: 54.99,
    inStock: true,
    offersType: "New Arrivals",
    isFeatured: true,
    averageRating: 4.8,
    numberOfRatings: 146,
    productTypeName: "food",
    brandName: "WildBites",
    petTypeNames: ["dog"],
    mainImageUrl: `${productImageBase}?item=dog-kibble-main`,
    secondaryImageUrls: [
      `${productImageBase}?item=dog-kibble-side`,
      `${productImageBase}?item=dog-kibble-bag`,
    ],
  },
  {
    id: "c2222222-2222-4222-8222-222222222222",
    name: "Pawsitive Salmon Cat Treats",
    description:
      "Soft salmon bites for cats with added omega oils and a resealable pouch.",
    price: 12.49,
    inStock: true,
    offersType: "On Sale",
    isFeatured: true,
    averageRating: 4.6,
    numberOfRatings: 93,
    productTypeName: "food",
    brandName: "Pawsitive Wellness",
    petTypeNames: ["cat"],
    mainImageUrl: `${productImageBase}?item=cat-treats-main`,
    secondaryImageUrls: [
      `${productImageBase}?item=cat-treats-open`,
      `${productImageBase}?item=cat-treats-back`,
    ],
  },
  {
    id: "c3333333-3333-4333-8333-333333333333",
    name: "Happy Tails Rope Tug Toy",
    description:
      "A durable tug toy made with thick woven rope for fetch, tug, and supervised chew sessions.",
    price: 18.99,
    inStock: true,
    offersType: "Clearance",
    isFeatured: true,
    averageRating: 4.2,
    numberOfRatings: 58,
    productTypeName: "toys",
    brandName: "Happy Tails Outfitters",
    petTypeNames: ["dog"],
    mainImageUrl: `${productImageBase}?item=rope-toy-main`,
    secondaryImageUrls: [
      `${productImageBase}?item=rope-toy-closeup`,
      `${productImageBase}?item=rope-toy-packaging`,
    ],
  },
  {
    id: "c4444444-4444-4444-8444-444444444444",
    name: "FeatherNest Cedar Perch Set",
    description:
      "Natural cedar perches in mixed sizes to help birds exercise their feet and stay engaged.",
    price: 24.99,
    inStock: true,
    offersType: "New Arrivals",
    isFeatured: true,
    averageRating: 4.5,
    numberOfRatings: 37,
    productTypeName: "habitats",
    brandName: "FeatherNest Homes",
    petTypeNames: ["bird"],
    mainImageUrl: `${productImageBase}?item=bird-perch-main`,
    secondaryImageUrls: [
      `${productImageBase}?item=bird-perch-detail`,
      `${productImageBase}?item=bird-perch-box`,
    ],
  },
  {
    id: "c5555555-5555-4555-8555-555555555555",
    name: "AquaFun Freshwater Starter Kit",
    description:
      "A beginner aquarium kit with LED hood, filter, and setup guide for small freshwater fish.",
    price: 89.99,
    inStock: true,
    offersType: "On Sale",
    isFeatured: true,
    averageRating: 4.7,
    numberOfRatings: 81,
    productTypeName: "habitats",
    brandName: "AquaFun Comforts",
    petTypeNames: ["fish"],
    mainImageUrl: `${productImageBase}?item=aquarium-kit-main`,
    secondaryImageUrls: [
      `${productImageBase}?item=aquarium-kit-front`,
      `${productImageBase}?item=aquarium-kit-lifestyle`,
    ],
  },
  {
    id: "c6666666-6666-4666-8666-666666666666",
    name: "Pawsitive Calm Coat Shampoo",
    description:
      "Gentle oatmeal shampoo for dogs and cats with a fresh scent and moisturizing finish.",
    price: 16.99,
    inStock: true,
    offersType: null,
    isFeatured: true,
    averageRating: 4.4,
    numberOfRatings: 64,
    productTypeName: "grooming",
    brandName: "Pawsitive Wellness",
    petTypeNames: ["dog", "cat"],
    mainImageUrl: `${productImageBase}?item=shampoo-main`,
    secondaryImageUrls: [
      `${productImageBase}?item=shampoo-bottle`,
      `${productImageBase}?item=shampoo-label`,
    ],
  },
  {
    id: "c7777777-7777-4777-8777-777777777777",
    name: "Gregarious Adventure Carrier",
    description:
      "Structured carrier backpack with breathable panels for short cat and rabbit outings.",
    price: 64.99,
    inStock: true,
    offersType: "New Arrivals",
    isFeatured: true,
    averageRating: 4.3,
    numberOfRatings: 41,
    productTypeName: "accessories",
    brandName: "Gregarious Co.",
    petTypeNames: ["cat", "rabbit"],
    mainImageUrl: `${productImageBase}?item=carrier-main`,
    secondaryImageUrls: [
      `${productImageBase}?item=carrier-open`,
      `${productImageBase}?item=carrier-side`,
    ],
  },
  {
    id: "c8888888-8888-4888-8888-888888888888",
    name: "WildBites Timothy Hay Blend",
    description:
      "High-fiber timothy hay mix for rabbits and guinea pigs, packed for daily feeding.",
    price: 21.5,
    inStock: true,
    offersType: null,
    isFeatured: false,
    averageRating: 4.9,
    numberOfRatings: 110,
    productTypeName: "food",
    brandName: "WildBites",
    petTypeNames: ["rabbit", "guinea-pig"],
    mainImageUrl: `${productImageBase}?item=timothy-hay-main`,
    secondaryImageUrls: [
      `${productImageBase}?item=timothy-hay-bag`,
      `${productImageBase}?item=timothy-hay-closeup`,
    ],
  },
  {
    id: "c9999999-9999-4999-8999-999999999999",
    name: "Gregarious Daily Vitamin Drops",
    description:
      "Easy-mix vitamin supplement formulated for small pets and birds during routine care.",
    price: 14.25,
    inStock: false,
    offersType: "On Sale",
    isFeatured: false,
    averageRating: 4.1,
    numberOfRatings: 22,
    productTypeName: "health",
    brandName: "Gregarious Co.",
    petTypeNames: ["guinea-pig", "bird"],
    mainImageUrl: `${productImageBase}?item=vitamin-drops-main`,
    secondaryImageUrls: [
      `${productImageBase}?item=vitamin-drops-open`,
      `${productImageBase}?item=vitamin-drops-box`,
    ],
  },
] as const;

type SeedPetType = (typeof petTypes)[number];
type SeedProductType = (typeof productTypes)[number];
type SeedBrand = (typeof brands)[number];

async function ensurePetType(petType: SeedPetType) {
  const existing = await prisma.petType.findFirst({
    where: { name: petType.name },
    select: { id: true },
  });

  if (existing) {
    await prisma.petType.update({
      where: { id: existing.id },
      data: {
        displayName: petType.displayName,
        petImageUrl: petType.petImageUrl,
        popularity: petType.popularity,
      },
    });

    return existing.id;
  }

  await prisma.petType.create({ data: petType });
  return petType.id;
}

async function ensureProductType(productType: SeedProductType) {
  const existing = await prisma.productType.findFirst({
    where: { name: productType.name },
    select: { id: true },
  });

  if (existing) {
    await prisma.productType.update({
      where: { id: existing.id },
      data: {
        displayName: productType.displayName,
        description: productType.description,
        icon: productType.icon,
      },
    });

    return existing.id;
  }

  await prisma.productType.create({ data: productType });
  return productType.id;
}

async function ensureBrand(brand: SeedBrand) {
  const existing = await prisma.brand.findFirst({
    where: { name: brand.name },
    select: { id: true },
  });

  if (existing) {
    return existing.id;
  }

  await prisma.brand.create({ data: brand });
  return brand.id;
}

// Default working hours given to any Staff row that has no schedule yet.
// Mon-Fri, 09:00-17:00 in minutes-since-midnight.
const DEFAULT_STAFF_SCHEDULE = {
  weekdays: [1, 2, 3, 4, 5],
  startMinute: 9 * 60,
  endMinute: 17 * 60,
} as const;

async function ensureDefaultStaffSchedules() {
  const staffWithoutSchedules = await prisma.staff.findMany({
    where: { schedules: { none: {} } },
    select: { id: true },
  });

  if (staffWithoutSchedules.length === 0) {
    return;
  }

  const rows = staffWithoutSchedules.flatMap(({ id }) =>
    DEFAULT_STAFF_SCHEDULE.weekdays.map((dayOfWeek) => ({
      staffId: id,
      dayOfWeek,
      startMinute: DEFAULT_STAFF_SCHEDULE.startMinute,
      endMinute: DEFAULT_STAFF_SCHEDULE.endMinute,
    }))
  );

  await prisma.staffSchedule.createMany({ data: rows, skipDuplicates: true });

  console.log(
    `Seeded default Mon-Fri 9-5 schedules for ${staffWithoutSchedules.length} staff member(s).`
  );
}

async function main() {
  const petTypeIdByName = new Map<string, string>();
  const productTypeIdByName = new Map<string, string>();
  const brandIdByName = new Map<string, string>();

  for (const petType of petTypes) {
    petTypeIdByName.set(petType.name, await ensurePetType(petType));
  }

  for (const productType of productTypes) {
    productTypeIdByName.set(
      productType.name,
      await ensureProductType(productType)
    );
  }

  for (const brand of brands) {
    brandIdByName.set(brand.name, await ensureBrand(brand));
  }

  await ensureDefaultStaffSchedules();

  const existingProducts = await prisma.product.count();

  if (existingProducts > 0) {
    console.log(
      `Skipping catalog seed because the database already has ${existingProducts} product(s).`
    );
    return;
  }

  for (const product of products) {
    const primaryPetTypeName = product.petTypeNames[0];
    const productTypeId = productTypeIdByName.get(product.productTypeName);
    const brandId = brandIdByName.get(product.brandName);
    const primaryPetTypeId = petTypeIdByName.get(primaryPetTypeName);

    if (!productTypeId || !brandId || !primaryPetTypeId) {
      throw new Error(`Missing reference data for product "${product.name}".`);
    }

    await prisma.$transaction(async (tx) => {
      await tx.product.create({
        data: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          inStock: product.inStock,
          mainImageUrl: product.mainImageUrl,
          secondaryImageUrls: [...product.secondaryImageUrls],
          offersType: product.offersType,
          isFeatured: product.isFeatured,
          isOnSale: product.offersType === "On Sale",
          isClearance: product.offersType === "Clearance",
          isNewArrival: product.offersType === "New Arrivals",
          productTypeId,
          petTypeId: primaryPetTypeId,
          brandId,
          averageRating: product.averageRating,
          numberOfRatings: product.numberOfRatings,
        },
      });

      await tx.productPetType.createMany({
        data: product.petTypeNames.map((petTypeName) => {
          const petTypeId = petTypeIdByName.get(petTypeName);

          if (!petTypeId) {
            throw new Error(
              `Missing pet type "${petTypeName}" for product "${product.name}".`
            );
          }

          return {
            productId: product.id,
            petTypeId,
          };
        }),
        skipDuplicates: true,
      });
    });
  }

  console.log(`Seeded ${products.length} products into the catalog.`);
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
