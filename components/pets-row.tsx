"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { usePetTypes } from "@/hooks/usePetTypes";

// const pets = [
//   { name: "dog", image: "/pets/dog1_square_v1.png" },
//   { name: "cat", image: "/pets/cat2_square_v1.png" },
//   { name: "bird", image: "/pets/bird1_square_v1.png" },
//   { name: "Guinea Pig", image: "/pets/guinea2_square_v1.png" },
//   { name: "rabbit", image: "/pets/rabbit1_square_v1.png" },
//   { name: "reptile", image: "/pets/fish1_square_v1.png" },
// ];

export function PetRow() {
  const router = useRouter();
  const { petTypes, isLoading: loading, isError: error } = usePetTypes(6);

  useEffect(() => {
    if (!petTypes) return;
    petTypes.forEach((pet) => {
      router.prefetch(`/pets/${encodeURIComponent(pet.name)}`);
    });
  }, [petTypes, router]);

  if (error) {
    return <div>Error loading pet types</div>;
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!petTypes || petTypes.length === 0) {
    return <div>No pet types available</div>;
  }

  return (
    <div className="w-full flex flex-col items-center py-8">
      <h2 className="text-2xl sm:text-3xl font-bold pb-10 lg:pb-20 text-center">
        Shop by Pet
      </h2>
      <div
        className="grid grid-cols-1 xxs:grid-cols-2 2md:grid-cols-3 1.5xl:grid-cols-6 gap-y-10 gap-x-5 xs:gap-x-20 2md:gap-x-40 1.5xl:gap-x-20 px-3"
        //style={{ maxWidth: 1200 }}
      >
        {petTypes.map((pet) => (
          <Link
            key={pet.id}
            href={`/pets/${encodeURIComponent(pet.name)}`}
            className="flex flex-col items-center group"
            // w-24 h-24 sm:w-28 sm:h-28 md:w-40 md:h-40
          >
            <div className="w-40 h-40 flex items-center justify-center bg-white shadow-md rounded-full overflow-hidden border-4 border-stone-300 group-hover:border-blue-400 transition">
              <Image
                src={pet.petImageUrl || "/placeholder.svg"}
                alt={pet.name}
                width={128}
                height={128}
                className="object-cover w-full h-full"
                priority={pet.name === "dog"}
              />
            </div>
            <span className="mt-3 text-base sm:text-lg font-medium capitalize text-stone-800 dark:text-stone-100 group-hover:text-blue-500 transition">
              {pet.displayName}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
