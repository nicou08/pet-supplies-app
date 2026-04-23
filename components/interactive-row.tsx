"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import {
  PawPrint,
  Bone,
  Scissors,
  CircleDollarSign,
  ShoppingBasket,
  Stethoscope,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface InteractiveItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

function InteractiveItem({
  title,
  description,
  icon,
  route,
}: InteractiveItemProps) {
  return (
    <Button
      asChild
      className="h-auto lg:h-32 w-full bg-stone-300 hover:bg-stone-200 dark:hover:bg-stone-400 px-0 cursor-pointer rounded-sm flex text-lg text-stone-800 items-stretch"
    >
      <Link href={route} className="flex w-full h-full">
        <div className="flex flex-col justify-center w-3/4 min-w-0 px-6">
          <div className="font-bold text-lg lg:text-2xl whitespace-normal">
            {title}
          </div>
          <div className="font-normal py-1 text-base md:text-lg break-words whitespace-normal min-w-0">
            {description}
          </div>
        </div>
        <div className="flex items-center justify-center w-1/4 pr-2">
          {icon}
        </div>
      </Link>
    </Button>
  );
}

function InteractiveItemSignIn() {
  return (
    <Button
      asChild
      className="h-auto lg:h-32 w-full bg-neutral-700 hover:bg-neutral-600 px-0 cursor-pointer rounded-sm flex text-lg text-white items-stretch"
    >
      <Link href="/sign-in" className="flex w-full h-full">
        <div className="flex flex-col justify-center w-3/4 min-w-0 px-6">
          <div className="font-bold text-lg lg:text-2xl truncate">Sign In</div>
          <div className="font-normal py-1 text-base md:text-lg break-words whitespace-normal min-w-0">
            To earn savings, rewards, and more!
          </div>
        </div>
        <div className="flex items-center justify-center w-1/4 pr-2">
          <Bone className="!w-8 !h-8 md:!w-12 md:!h-12" />
        </div>
      </Link>
    </Button>
  );
}

function InteractiveItemConsultVet() {
  return (
    <Button
      asChild
      className="h-auto lg:h-32 w-full bg-blue-800 hover:bg-blue-700 dark:hover:bg-blue-900 px-0 cursor-pointer rounded-sm flex text-lg text-stone-800 items-stretch"
    >
      <Link
        href="/services?serviceType=veterinary"
        className="flex w-full h-full"
      >
        <div className="flex flex-col justify-center w-3/4 min-w-0 px-6 text-blue-50">
          <div className="font-bold text-lg lg:text-2xl whitespace-normal">
            Consult a Vet
          </div>
          <div className="font-normal py-1 text-base md:text-lg break-words whitespace-normal min-w-0">
            Get expert advice for your pet
          </div>
        </div>
        <div className="flex items-center justify-center w-1/4 pr-2">
          <Stethoscope className="!w-8 !h-8 md:!w-12 md:!h-12 text-blue-50" />
        </div>
      </Link>
    </Button>
  );
}

export function InteractiveRow() {
  const { data: session } = useSession();
  return (
    <div className="px-4 md:px-0 grid grid-cols-2 2xl:grid-cols-4 gap-2 md:gap-6">
      {session ? <InteractiveItemConsultVet /> : <InteractiveItemSignIn />}
      <InteractiveItem
        title="Book Grooming"
        description="Trim ya dawg"
        icon={<Scissors className="!w-8 !h-8 md:!w-12 md:!h-12" />}
        route="/services?serviceType=grooming"
      />
      <InteractiveItem
        title="New Arrivals"
        description="View our latest products"
        icon={<ShoppingBasket className="!w-8 !h-8 md:!w-12 md:!h-12" />}
        route="/new-arrivals"
      />
      <InteractiveItem
        title="Sales"
        description="Get the best deals"
        icon={<CircleDollarSign className="!w-8 !h-8 md:!w-12 md:!h-12" />}
        route="/sales"
      />
    </div>
  );
}
