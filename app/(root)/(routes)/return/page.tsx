import { redirect } from "next/navigation";

import { stripe } from "@/lib/stripe";

export default async function Return({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get session_id from searchParams and ensure it's a string
  const session_id = searchParams.session_id as string;

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  // Retrieve the session from Stripe
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  // TypeScript needs this to be explicit about the structure
  const status = checkoutSession.status;
  const customerEmail = checkoutSession.customer_details?.email;

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmatio email will be sent to{" "}
          {customerEmail}. If you have any questions, please email{" "}
        </p>
        <a href="mailto:orders@example.com">orders@example.com</a>.
      </section>
    );
  }

  // Default fallback
  return redirect("/");
}
