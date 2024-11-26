"use client";

import Image from "next/image";
import Link from "next/link";
import {
  PersonIcon,
  HeartIcon,
  StarIcon,
  MagnifyingGlassIcon,
  BackpackIcon,
  ExitIcon,
} from "@radix-ui/react-icons";
import { User, ShoppingCart, Heart, Moon, Sun } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/theme-toggle-2";

import { IconButton } from "./icon-button";
import { PageButton } from "./page-button";

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
        <div className="text-black basis-1/2 flex items-center justify-center">
          <div className="w-5/6 bg-[#e1e1e1] dark:bg-neutral-900 rounded-full border border-stone-400 dark:border-neutral-800 shadow-md hover:border hover:border-black">
            <Input
              type="text"
              placeholder="Search for products"
              className="rounded-full placeholder-gray-500 dark:gray-900 dark:caret-stone-200 dark:text-stone-100"
            />
          </div>
        </div>
        <div className="text-black basis-1/4 flex flex-row items-center justify-end gap-2">
          <IconButton icon={<User />} />
          <IconButton icon={<ShoppingCart />} />
          <ModeToggle />
        </div>
      </div>
      <div className="w-full bg-[#e1e1e1] dark:bg-neutral-950">
        <div className="h-2"></div>
        <div className="w-full h-6 flex justify-center items-center bg-neutral-700 dark:bg-[#e1e1e1c8] text-white dark:text-black">
          <div className="pr-7 pl-7 cursor-pointer hover:bg-neutral-500">
            <div>HOME</div>
          </div>
          <div className="pr-7 pl-7 cursor-pointer hover:bg-neutral-500">
            <div>CATEGORIES</div>
          </div>
          <div className="pr-7 pl-7 cursor-pointer hover:bg-neutral-500">
            <div>DOG</div>
          </div>
          <div className="pr-7 pl-7 cursor-pointer hover:bg-neutral-500">
            <div>CAT</div>
          </div>
          <div className="pr-7 pl-7 cursor-pointer hover:bg-neutral-500">
            <div>SMALL PETS</div>
          </div>
          <div className="pr-7 pl-7 cursor-pointer hover:bg-neutral-500">
            <div>FISH</div>
          </div>
          <div className="pr-7 pl-7 cursor-pointer hover:bg-neutral-500">
            <div>SERVICES</div>
          </div>
        </div>
      </div>
    </div>
  );
}
