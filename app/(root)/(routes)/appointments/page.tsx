import { redirect } from "next/navigation";

export default function AppointmentsPage() {
  redirect("/settings?tab=appointments");
}
