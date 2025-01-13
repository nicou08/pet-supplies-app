"use client";

import Image from "next/image";
import Link from "next/link";
import { User, ShoppingCart, ChevronDown } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/theme-toggle-2";
import { IconButton } from "./icon-button";
import { MainNavigationMenu } from "./navigation-menu";
import { CustomDropdownMenu } from "./dropdown-menu";
import { PageButton } from "./page-button";
import { Main } from "next/document";

export default function Header() {
  return (
    <div>
      <div className="w-full h-20 flex flex-row bg-[#e1e1e1] dark:bg-neutral-950">
        <div className="basis-1/4 hidden lg:block  justify-center items-center">
          <div className="flex justify-center">
            <Image
              src="/Pet-Supplies-Logo-3-dark.png"
              className="pt-2"
              width={150}
              height={80}
              alt="Pet Supplies Logo"
            />
          </div>
        </div>
        <div className="text-black basis-1/2 flex items-center justify-start">
          <div className="w-5/6 bg-[#e1e1e1] dark:bg-neutral-900 rounded-none border border-stone-400 dark:border-neutral-800 shadow-md hover:border hover:border-black">
            <Input
              type="text"
              placeholder="Search for products"
              className="h-12 rounded-none placeholder-gray-500 dark:gray-900 dark:caret-stone-200 dark:text-stone-100"
            />
          </div>
        </div>
        <div className="text-black basis-1/4 flex flex-row items-center justify-end gap-2">
          <IconButton icon={<User />} />
          <IconButton icon={<ShoppingCart />} />
          <ModeToggle />
        </div>
      </div>
      <div className="h-2"></div>
      <div className="z-50 w-full h-12 px-14 flex justify-start items-center bg-[#e1e1e1] dark:bg-[#e1e1e1c8] text-white dark:text-black">
        <Button className="bg-red-300">Shop by pet</Button>

        <div className="w-10" />

        {/* <CustomDropdownMenu
          trigger={
            <div className="flex items-center">
              Shop <ChevronDown />
            </div>
          }
          items={["Food", "Toys", "Cages", "Fish Tanks"]}
        />

        <CustomDropdownMenu
          trigger={
            <div className="flex items-center">
              Services <ChevronDown />
            </div>
          }
          items={["Grooming", "Training", "Dog Training", "Vet Consultations"]}
        />

        <CustomDropdownMenu
          trigger={
            <div className="flex items-center">
              Deals <ChevronDown />
            </div>
          }
          items={["Discounts", "Special Offers", "Clearance Items"]}
        />

        <CustomDropdownMenu
          trigger={
            <div className="flex items-center">
              New Arrivals <ChevronDown />
            </div>
          }
          items={["Latest Products", "Trending", "Just In"]}
        /> */}

        <MainNavigationMenu />
      </div>
    </div>
  );
}
