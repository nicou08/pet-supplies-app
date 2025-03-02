"use server";

import { headers } from "next/headers";

import { stripe } from "@/lib/stripe";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export async function fetchClientSecret(items: CartItem[]) {
  //const origin = (await headers()).get("origin");

  // Create Checkout Sessions from body params.
  // const session = await stripe.checkout.sessions.create({
  //   ui_mode: "embedded",
  //   line_items: [
  //     {
  //       // Provide the exact Price ID (for example, pr_1234) of
  //       // the product you want to sell
  //       price: "{{PRICE_ID}}",
  //       quantity: 1,
  //     },
  //   ],
  //   mode: "payment",
  //   return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
  // });

  const headersList = await headers();
  const origin =
    headersList.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  // Create line items from cart items
  const lineItems = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: item.imageUrl ? [item.imageUrl] : [],
      },
      unit_amount: Math.round(item.price * 100), // Stripe uses cents
    },
    quantity: item.quantity,
  }));

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: lineItems,
    mode: "payment",
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  return session.client_secret;
}
