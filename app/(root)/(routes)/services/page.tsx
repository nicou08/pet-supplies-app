/**
 * /services — server-rendered page that guards the booking wizard.
 *
 * Auth is checked server-side before any client JS runs; unauthenticated
 * visitors are immediately redirected to /sign-in. Authenticated users see
 * the `BookingForm` client component which owns all booking state.
 */
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { BookingForm } from "./components/BookingForm";

/**
 * Server component — runs only on the server; no client bundle contribution.
 * `headers()` must be awaited in Next.js 15 because it is a dynamic API.
 */
export default async function ServicesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  //const isSignedIn = !!session;

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div>
      <div className="h-5"></div>
      <BookingForm />
    </div>
  );
}
