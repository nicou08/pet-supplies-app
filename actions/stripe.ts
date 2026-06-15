"use server";

import { headers } from "next/headers";

import { prisma } from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { computeLinePrice } from "@/lib/pricing";
import { activeSaleSelect, mapActiveSale } from "@/lib/queries/sales";

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
      sales: activeSaleSelect,
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

  // Line items stay at full price; discounts (percentage or buy-x-get-y) are
  // applied as a single session-level coupon so the customer still sees the
  // true per-unit price on each line.
  let totalDiscountCents = 0;

  const lineItems = normalizedItems.map((item) => {
    const product = productsById.get(item.id)!;
    const sale = mapActiveSale(product.sales);
    const { discountAmount } = computeLinePrice(
      product.price,
      item.quantity,
      sale
    );
    totalDiscountCents += Math.round(discountAmount * 100);

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

  // Stripe coupons must be < the order total, so cap the discount just below it.
  const subtotalCents = lineItems.reduce(
    (sum, line) => sum + line.price_data.unit_amount * line.quantity,
    0
  );
  const amountOff = Math.min(totalDiscountCents, Math.max(0, subtotalCents - 1));

  let discounts: Array<{ coupon: string }> | undefined;
  if (amountOff > 0) {
    const coupon = await stripe.coupons.create({
      amount_off: amountOff,
      currency: "usd",
      duration: "once",
      name: "Sale discount",
    });
    discounts = [{ coupon: coupon.id }];
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: lineItems,
    mode: "payment",
    ...(discounts ? { discounts } : {}),
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.client_secret) {
    throw new Error("Failed to initialize checkout.");
  }

  return session.client_secret;
}
