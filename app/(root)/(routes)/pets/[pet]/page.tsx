import Image from "next/image";
import { redirect } from "next/navigation";

import { getPetTypeByName } from "@/lib/queries/pet-types";
import { PetContent } from "./components/PetContent";

export default async function PetPage({
  params,
}: {
  params: Promise<{ pet: string }>;
}) {
  const { pet } = await params;

  const petData = await getPetTypeByName(pet);
  if (!petData) {
    redirect("/404");
  }

  return (
    <div className="p-3">
      <div className="flex flex-col md:flex-row items-center md:items-stretch py-3 gap-6 md:gap-0 w-full max-w-5xl mx-auto">
        <div className="w-full md:w-1/2 flex justify-center items-center mb-4 md:mb-0">
          <Image
            src={`${petData.petImageUrl}`}
            width={400}
            height={400}
            className="rounded-full object-cover h-40 w-40 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-80 lg:w-80"
            alt="Pet"
          />
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center md:justify-start text-xl sm:text-2xl md:text-4xl capitalize font-thin text-center md:text-left">
          {petData.displayName}
        </div>
      </div>

      {/*

      <div className="flex justify-between w-full max-w-5xl mx-auto pt-14">
        <div className="w-80 h-80 bg-red-300"></div>
        <div className="w-80 h-80 bg-red-300"></div>
        <div className="w-80 h-80 bg-red-300"></div>
      </div>*/}

      <PetContent petId={petData.id} />
    </div>
  );
}
