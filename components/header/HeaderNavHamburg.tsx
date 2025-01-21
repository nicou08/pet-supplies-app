"use client";

import { useState } from "react";
import Link from "next/link";
import { AlignJustify } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function HeaderNavHamburg() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <div className="sm:hidden flex items-center px-3">
        <DrawerTrigger
          onClick={() => setIsOpen(true)}
          className="focus:outline-none w-11 h-11 rounded-full flex justify-center items-center shadow-none bg-transparent text-black hover:bg-neutral-300 data-[state=open]:bg-neutral-300 dark:text-white cursor-pointer dark:hover:bg-neutral-900 transition-shadow duration-200"
        >
          <AlignJustify />
        </DrawerTrigger>
      </div>
      <DrawerContent className="h-3/5 pt-2">
        <DrawerHeader className="h-0 p-0 m-0">
          <DrawerTitle className="h-0 p-0 m-0"></DrawerTitle>
        </DrawerHeader>
        <div className="px-4 py-3 text-lg flex flex-col gap-5 overflow-auto ">
          <Link
            href="/pets"
            className="px-2 text-gray-400"
            onClick={handleLinkClick}
          >
            Shop by Pet
          </Link>

          <div className="px-2 text-lg font-semibold pt-2">Shop</div>
          <Link
            href="/pets"
            className="px-2 text-gray-400"
            onClick={handleLinkClick}
          >
            Food
          </Link>
          <Link
            href="/"
            className="px-2 text-gray-400"
            onClick={handleLinkClick}
          >
            Toys
          </Link>
          <Link
            href="/pets"
            className="px-2 text-gray-400"
            onClick={handleLinkClick}
          >
            Cages
          </Link>
          <Link
            href="/pets"
            className="px-2 text-gray-400"
            onClick={handleLinkClick}
          >
            Fish Tanks
          </Link>

          <div className="px-2 text-lg font-semibold pt-2">Services</div>
          <Link
            href="/"
            className="px-2 text-gray-400"
            onClick={handleLinkClick}
          >
            Grooming
          </Link>
          <Link
            href="/pets"
            className="px-2 text-gray-400"
            onClick={handleLinkClick}
          >
            Dog Training
          </Link>
          <Link
            href="/pets"
            className="px-2 text-gray-400"
            onClick={handleLinkClick}
          >
            Cat Training
          </Link>
          <Link
            href="/"
            className="px-2 text-gray-400"
            onClick={handleLinkClick}
          >
            Vet Consultations
          </Link>

          <div className="px-2 text-lg font-semibold pt-2">Deals</div>
          <Link
            href="/pets"
            className="px-2 text-gray-400"
            onClick={handleLinkClick}
          >
            Special Offers
          </Link>
          <Link
            href="/pets"
            className="px-2 text-gray-400"
            onClick={handleLinkClick}
          >
            Clearance Items
          </Link>
          <Link
            href="/"
            className="px-2 text-gray-400"
            onClick={handleLinkClick}
          >
            New Arrivals
          </Link>
          <div className="p-2"></div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
