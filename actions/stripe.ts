"use server";

import { headers } from "next/headers";

import { prisma } from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

export interface CheckoutItemInput {
  id: string;
  quantity: number;
}

function normalizeCheckoutItems(items: CheckoutItemInput[]) {
  if (items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const quantitiesByProductId = new Map<string, number>();

  for (const item of items) {
    if (!item.id || typeof item.id !== "string") {
      throw new Error("Cart contains an invalid product.");
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error("Cart contains an invalid quantity.");
    }

    const accumulated = (quantitiesByProductId.get(item.id) ?? 0) + item.quantity;
    if (accumulated > 999) {
      throw new Error("Cart quantity exceeds the maximum allowed (999 per item).");
    }
    quantitiesByProductId.set(item.id, accumulated);
  }

  return Array.from(quantitiesByProductId, ([id, quantity]) => ({
    id,
    quantity,
  }));
}

export async function fetchClientSecret(items: CheckoutItemInput[]) {
  const normalizedItems = normalizeCheckoutItems(items);

  const headersList = await headers();
  const origin =
    headersList.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: normalizedItems.map((item) => item.id),
      },
    },
    select: {
      id: true,
      name: true,
      price: true,
      inStock: true,
      mainImageUrl: true,
    },
  });

  const productsById = new Map(products.map((product) => [product.id, product]));

  for (const item of normalizedItems) {
    const product = productsById.get(item.id);

    if (!product) {
      throw new Error("One or more cart items are no longer available.");
    }

    if (!product.inStock) {
      throw new Error(`${product.name} is out of stock.`);
    }
  }

  const lineItems = normalizedItems.map((item) => {
    const product = productsById.get(item.id)!;

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: product.mainImageUrl ? [product.mainImageUrl] : [],
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: item.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: lineItems,
    mode: "payment",
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.client_secret) {
    throw new Error("Failed to initialize checkout.");
  }

  return session.client_secret;
}
