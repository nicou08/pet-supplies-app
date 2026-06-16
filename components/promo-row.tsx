import Link from "next/link";

import { Tag, Crown, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

function SalesButton() {
  return (
    <Button
      asChild
      className="group relative h-auto lg:h-44 w-full overflow-hidden bg-red-600 hover:bg-red-700 px-0 cursor-pointer rounded-xl flex text-white items-stretch shadow-md"
    >
      <Link href="/sales" className="flex w-full h-full">
        <div className="flex flex-col justify-center w-3/4 min-w-0 px-6 lg:px-8 py-6">
          <div className="text-yellow-300 font-extrabold text-3xl lg:text-5xl leading-none tracking-tight">
            UP TO 50% OFF
          </div>
          <div className="text-yellow-300/90 font-bold text-lg lg:text-2xl uppercase tracking-wide whitespace-normal">
            Sales
          </div>
          <div className="mt-2 flex items-center gap-2 font-medium text-base md:text-lg text-yellow-100 whitespace-normal">
            Click to view all deals
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
        <div className="flex items-center justify-center w-1/4 pr-4">
          <Tag className="!w-12 !h-12 md:!w-20 md:!h-20 text-yellow-300 -rotate-12" />
        </div>
      </Link>
    </Button>
  );
}

function PetPlusButton() {
  return (
    <Button
      asChild
      className="group relative h-auto lg:h-44 w-full overflow-hidden bg-blue-900 hover:bg-blue-950 px-0 cursor-pointer rounded-xl flex text-white items-stretch shadow-md"
    >
      <Link href="/pet-plus" className="flex w-full h-full">
        <div className="flex flex-col justify-center w-3/4 min-w-0 px-6 lg:px-8 py-6">
          <div className="font-extrabold text-3xl lg:text-5xl leading-none tracking-tight">
            Pet+
          </div>
          <div className="mt-1 font-bold text-lg lg:text-2xl whitespace-normal">
            Subscribe for more benefits
          </div>
          <div className="mt-2 flex items-center gap-2 font-medium text-base md:text-lg text-blue-100 whitespace-normal">
            Free delivery, exclusive deals &amp; more
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
        <div className="flex items-center justify-center w-1/4 pr-4">
          <Crown className="!w-12 !h-12 md:!w-20 md:!h-20 text-white" />
        </div>
      </Link>
    </Button>
  );
}

export function PromoRow() {
  return (
    <div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <SalesButton />
      <PetPlusButton />
    </div>
  );
}
