"use client";

import { useEffect, useState } from "react";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { fetchClientSecret } from "@/actions/stripe";
import { useCart } from "@/context/CartContext";

// Environment variable checks
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("Missing Stripe publishable key");
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

// Initial module checks
if (!stripePromise) {
  throw new Error("Failed to load Stripe");
}

// Wrapper function that ensures a non-null return value
// const getFetchClientSecret = async (): Promise<string> => {
//   const clientSecret = await fetchClientSecret();
//   if (!clientSecret) {
//     throw new Error("Failed to load client secret");
//   }
//   return clientSecret;
// };

export default function Checkout() {
  const { cartItems } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getClientSecret = async () => {
      try {
        setLoading(true);
        // Get client secret using existing cart items
        const secret = await fetchClientSecret(cartItems);
        setClientSecret(secret);
      } catch (err) {
        setError("Failed to initialize checkout");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (cartItems.length > 0) {
      getClientSecret();
    } else {
      setLoading(false);
    }
  }, [cartItems]);

  if (loading) return <div>Loading checkouttt...</div>;
  if (error) return <div>{error}</div>;
  if (!clientSecret || cartItems.length === 0)
    return <div>No items to checkout</div>;

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
