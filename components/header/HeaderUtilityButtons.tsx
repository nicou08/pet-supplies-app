import { auth } from "@/auth";

import { HeaderUtilAccBtn } from "./HeaderUtilAccBtn";
import { HeaderUtilCartBtn } from "./HeaderUtilCartBtn";
import { ModeToggle } from "@/components/ui/theme-toggle-2";

export async function HeaderUtilityButtons() {
  const session = await auth();
  const isSignedIn = !!session;

  if (session) {
    console.log("There is a session");
  } else {
    console.log("No session yet");
  }

  return (
    <div className="text-black basis-1/4 flex flex-row items-center justify-end gap-2">
      <HeaderUtilAccBtn isLoggedIn={isSignedIn} />

      <HeaderUtilCartBtn />

      <ModeToggle />
    </div>
  );
}
