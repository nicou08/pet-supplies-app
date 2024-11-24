import Image from "next/image";
import {
  PersonIcon,
  HeartIcon,
  StarIcon,
  MagnifyingGlassIcon,
  BackpackIcon,
  ExitIcon,
} from "@radix-ui/react-icons";

import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/theme-toggle-2";

export default function Header() {
  return (
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
        <div className="w-5/6 bg-[#e1e1e1] dark:bg-neutral-900 rounded-full border border-stone-200 dark:border-neutral-800 shadow-md hover:border hover:border-black">
          <Input
            type="text"
            placeholder="Search for products"
            className="rounded-full placeholder-gray-500 dark:gray-900"
          />
        </div>
      </div>
      <div className="text-black basis-1/4 flex flex-row items-center justify-center gap-2">
        <div className="w-11 h-11 rounded-full flex justify-center items-center cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-900 transition-shadow duration-200">
          <PersonIcon className="h-7 w-7 dark:text-white" />
        </div>
        <div className="w-11 h-11 rounded-full flex justify-center items-center cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-900 transition-shadow duration-200">
          <StarIcon className="h-7 w-7 dark:text-white" />
        </div>
        <div className="w-11 h-11 rounded-full flex justify-center items-center cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-900 transition-shadow duration-200">
          <BackpackIcon className="h-7 w-7 dark:text-white" />
        </div>
        <ModeToggle />
      </div>
    </div>
  );
}
