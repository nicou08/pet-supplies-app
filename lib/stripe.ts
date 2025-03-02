import "server-only";

import Stripe from "stripe";

// Check if the Stripe secret key is defined
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing Stripe secret key");
}

// TypeScript type assertion to tell TypeScript that we've already checked the variable exists
const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;

export const stripe = new Stripe(stripeSecretKey);
