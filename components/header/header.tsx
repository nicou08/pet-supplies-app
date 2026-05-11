import Link from "next/link";

import { Button } from "@/components/ui/button";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderUtilityButtons } from "./HeaderUtilityButtons";
import { HeaderNavHamburg, MainNavigationMenu } from "./HeaderClientNav";

export default function Header() {
  return (
    <div className="pb-0 sm:pb-2 bg-background border-b border-border">
      {/* Top Header Section */}
      <div className="w-full h-20 flex flex-row bg-background">
        {/* Hamburger Menu */}
        <HeaderNavHamburg />

        {/* Logo */}
        <HeaderLogo />

        {/* Utility functions */}
        <HeaderUtilityButtons />
      </div>

      <div className="h-0 sm:h-2"></div>

      {/* Bottom Header Section */}
      <div className="z-50 w-full h-12 px-0 2lg:px-4 hidden sm:flex justify-start items-center bg-background">
        <Button
          asChild
          className="bg-primary text-primary-foreground hover:bg-primary/80"
        >
          <Link href="/shop">Shop All</Link>
        </Button>

        <div className="w-10" />

        <MainNavigationMenu />
      </div>
    </div>
  );
}
