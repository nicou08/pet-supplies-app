// import { NextResponse } from "next/server";
// import { headers } from "next/headers";

// import { stripe } from "@/lib/stripe";

// export async function POST() {
//   try {
//     const headersList = await headers();
//     const origin = headersList.get("origin");

//     // Create Checkout Sessions from body params.
//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         {
//           // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//           price: "{{PRICE_ID}}",
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${origin}/?canceled=true`,
//     });

//     // Check if session.url exists before redirecting
//     if (!session.url) {
//       return NextResponse.json(
//         { error: "Failed to create checkout session URL" },
//         { status: 500 }
//       );
//     }

//     return NextResponse.redirect(session.url, 303);
//   } catch (err) {
//     // Properly type and handle the error
//     const error = err as { message?: string; statusCode?: number };

//     return NextResponse.json(
//       { error: error.message },
//       { status: error.statusCode || 500 }
//     );
//   }
// }
