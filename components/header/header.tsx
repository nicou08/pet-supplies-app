"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { User, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeaderUtilityButtons } from "./HeaderUtilityButtons";
import { MainNavigationMenu } from "./MainNavigationMenu";

export default function Header() {
  const { theme } = useTheme();

  return (
    <div>
      <div className="w-full h-20 flex flex-row bg-[#e1e1e1] dark:bg-neutral-950">
        {/* Logo */}
        <div className="basis-1/4 hidden lg:block  justify-center items-center">
          <div className="flex h-full justify-center items-center">
            <div className="relative w-[150px] h-[60px] overflow-hidden">
              <Link href="/">
                <Image
                  src={theme === "dark" ? "/Logo-dark.png" : "/Logo-light.png"}
                  className="absolute top-[41%] transform -translate-y-1/2"
                  width={150}
                  height={150}
                  alt="Pet Supplies Logo"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="text-black basis-1/2 flex items-center justify-start">
          <div className="w-5/6 bg-[#e1e1e1] dark:bg-neutral-900 rounded-none border border-stone-400 dark:border-neutral-800 shadow-md hover:border hover:border-black">
            <Input
              type="text"
              placeholder="Search for products"
              className="h-12 rounded-none placeholder-gray-500 dark:gray-900 dark:caret-stone-200 dark:text-stone-100"
            />
          </div>
        </div>

        {/* Utility Butttons */}
        {/* <div className="text-black basis-1/4 flex flex-row items-center justify-end gap-2">
          <IconButton icon={<User />} />
          <IconButton icon={<ShoppingCart />} />
          <ModeToggle />
        </div> */}
        <HeaderUtilityButtons />
      </div>

      <div className="h-2"></div>

      {/* Bottom Navigation */}
      <div className="z-50 w-full h-12 px-14 flex justify-start items-center bg-[#e1e1e1] dark:bg-[#e1e1e1c8] text-white dark:text-black">
        <Button className="bg-neutral-700 hover:bg-neutral-500">
          <Link href="/pets">Shop by pet</Link>
        </Button>

        <div className="w-10" />

        <MainNavigationMenu />
      </div>
    </div>
  );
}
