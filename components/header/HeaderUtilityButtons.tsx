"use client";

import { User, ShoppingCart } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ui/theme-toggle-2";
import { IconButton } from "./icon-button";

export function HeaderUtilityButtons() {
  return (
    <div className="text-black basis-1/4 flex flex-row items-center justify-end gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none  w-11 h-11 rounded-full flex justify-center items-center shadow-none bg-transparent text-black hover:bg-neutral-300 data-[state=open]:bg-neutral-300 dark:text-white cursor-pointer  dark:hover:bg-neutral-900 transition-shadow duration-200">
          <User />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Account</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet>
        <SheetTrigger className="focus:outline-none  w-11 h-11 rounded-full flex justify-center items-center shadow-none bg-transparent text-black hover:bg-neutral-300 data-[state=open]:bg-neutral-300 dark:text-white cursor-pointer  dark:hover:bg-neutral-900 transition-shadow duration-200">
          <ShoppingCart />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <ModeToggle />
    </div>
  );
}
