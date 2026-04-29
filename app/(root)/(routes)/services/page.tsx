import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BookingForm } from "./components/BookingForm";

export default async function ServicesPage() {
  const session = await auth();
  //const isSignedIn = !!session;

  if (!session) {
    redirect("/sign-in");
    // return (
    //   <Alert>
    //     <Terminal className="h-4 w-4" />
    //     <AlertTitle>You need to sign-in first!</AlertTitle>
    //     <AlertDescription>Sign-in to book an appointment.</AlertDescription>
    //   </Alert>
    // );
  }

  return (
    <div>
      <div className="h-5"></div>
      <BookingForm />
    </div>
  );
}
