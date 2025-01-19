import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderUtilityButtons } from "./HeaderUtilityButtons";
import { MainNavigationMenu } from "./MainNavigationMenu";

export default function Header() {
  return (
    <div>
      {/* Top Header Section */}
      <div className="w-full h-20 flex flex-row bg-[#e1e1e1] dark:bg-neutral-950">
        {/* Logo */}
        <HeaderLogo />

        {/* Search Bar */}
        {/* <div className="text-black basis-3/4 lg:basis-1/2 flex items-center justify-start">
          <div className="w-5/6 bg-[#e1e1e1] dark:bg-neutral-900 rounded-none border border-stone-400 dark:border-neutral-800 shadow-md">
            <Input
              type="text"
              placeholder="Search for products"
              className="h-12 rounded-none placeholder-gray-500 dark:gray-900 dark:caret-stone-200 dark:text-stone-100"
            />
          </div>
        </div> */}

        <HeaderUtilityButtons />
      </div>

      <div className="h-2"></div>

      {/* Bottom Header Section */}
      <div className="z-50 w-full h-12 px-14 flex justify-start items-center bg-[#e1e1e1] dark:bg-neutral-950 text-white dark:text-black">
        <Button className="bg-neutral-700 hover:bg-neutral-500">
          <Link href="/pets">Shop by pet</Link>
        </Button>

        <div className="w-10" />

        <MainNavigationMenu />
      </div>
    </div>
  );
}
