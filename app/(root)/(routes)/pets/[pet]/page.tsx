import Image from "next/image";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { PetContent } from "./components/PetContent";

export default async function PetPage({ params }: { params: { pet: string } }) {
  const { pet } = await params;

  let petData = null;

  try {
    // Get protocol and host for absolute URL
    const host = (await headers()).get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const url = `${protocol}://${host}/api/pet-types?name=${encodeURIComponent(
      pet
    )}`;

    console.log("Fetchingg pet data from:", url);

    const response = await fetch(url, { cache: "no-store" }); // or "force-cache" if you want caching
    if (response.ok) {
      petData = await response.json();
      if (!petData) {
        redirect("/404");
      }
    } else {
      redirect("/404");
    }
  } catch (error) {
    console.log("PETPAGE Error fetching pet info:", error);
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
