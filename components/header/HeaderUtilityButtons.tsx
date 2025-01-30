import { auth } from "@/auth";

import { HeaderUtilSearch } from "./HeaderUtilSearch";
import { HeaderUtilAccBtn } from "./HeaderUtilAccBtn";
import { HeaderUtilCartBtn } from "./HeaderUtilCartBtn";
import { ModeToggle } from "@/components/ui/theme-toggle-2";

export async function HeaderUtilityButtons() {
  const session = await auth();
  const isSignedIn = !!session;
  let user_name: string | undefined = undefined;
  let user_email: string | undefined = undefined;
  let user_image: string | undefined = undefined;

  if (session) {
    user_name = session.user?.name ?? undefined;
    user_email = session.user?.email ?? undefined;
    user_image = session.user?.image ?? undefined;
  } else {
    console.log("No session yet");
  }

  return (
    <div className="basis-full 2lg:basis-3/4 flex flex-row items-center gap-2 justify-end sm:justify-start px-3 sm:px-0">
      <HeaderUtilSearch />

      <div className="2lg:basis-1/4 sm:min-w-44 flex flex-row items-center gap-2 justify-end">
        <HeaderUtilAccBtn
          isLoggedIn={isSignedIn}
          name={user_name}
          email={user_email}
          image={user_image}
        />

        <HeaderUtilCartBtn />

        <ModeToggle />
      </div>
    </div>
  );
}
