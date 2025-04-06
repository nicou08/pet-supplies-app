import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderNavHamburg } from "./HeaderNavHamburg";
import { HeaderUtilityButtons } from "./HeaderUtilityButtons";
import { MainNavigationMenu } from "./MainNavigationMenu";

export default function Header() {
  return (
    <div className="pb-2 bg-[#e1e1e1] dark:bg-neutral-950 border-b border-neutral-700">
      {/* Top Header Section */}
      <div className="w-full h-20 flex flex-row bg-[#e1e1e1] dark:bg-neutral-950">
        {/* Hamburger Menu */}
        <HeaderNavHamburg />

        {/* Logo */}
        <HeaderLogo />

        {/* Utility functions */}
        <HeaderUtilityButtons />
      </div>

      <div className="h-2"></div>

      {/* Bottom Header Section */}
      <div className="z-50 w-full h-12 px-0 2lg:px-4 hidden sm:flex justify-start items-center bg-[#e1e1e1] dark:bg-neutral-950">
        <Button className="bg-neutral-900 dark:bg-[#e1e1e1] hover:bg-neutral-500 dark:hover:dark:bg-[#e1e1e1d7]">
          <Link href="/shop">Shop All</Link>
        </Button>

        <div className="w-10" />

        <MainNavigationMenu />
      </div>
    </div>
  );
}
