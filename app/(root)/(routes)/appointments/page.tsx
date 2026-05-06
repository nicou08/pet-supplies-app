import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppointmentListing } from "./components/AppointmentListing";

export default async function AppointmentsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div>
      <div className="h-14" />
      <AppointmentListing />
    </div>
  );
}
