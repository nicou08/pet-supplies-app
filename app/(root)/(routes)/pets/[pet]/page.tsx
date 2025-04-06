import Image from "next/image";
import { redirect } from "next/navigation";
import axios from "axios";

import { PetContent } from "./components/PetContent";

async function getPetInfo(petName: string) {
  try {
    const url = `http://localhost:3000/api/pet-types?name=${petName}`;
    const response = await axios.get(url);
    if (response.status === 200) {
      const petData = response.data;
      return petData;
    }
  } catch (error) {
    console.log("getPetProducts Error fetching pet iddd:", error);
    return null;
  }
}

export default async function PetPage({
  params,
}: {
  params: Promise<{ pet: string }>;
}) {
  const { pet } = await params;

  const petData = await getPetInfo(pet);

  if (!petData) {
    console.log("PETPAGE Error fetching pet id");
    redirect("/404");
  }

  return (
    <div className="p-3">
      <div className="flex py-3">
        <div className="basis-1/2 flex justify-center">
          <Image
            src="/pets/dog1.JPG"
            width={500}
            height={500}
            className="rounded-full h-64 w-64 object-cover"
            alt="Pet"
          />
        </div>
        <div className="basis-1/2 flex items-center text-3xl font-bold">
          {petData.displayName} Supplies
        </div>
      </div>

      <PetContent petId={petData.id} />
    </div>
  );
}
