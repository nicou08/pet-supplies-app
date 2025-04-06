"use client";

import { useParams, useRouter } from "next/navigation";

import { usePetName } from "@/hooks/usePetName";
import { usePetProducts } from "@/hooks/usePetProducts";

type PetContentProps = {
  petId: string;
};

export function PetContent({ petId }: PetContentProps) {
  //const { products, isLoading, isError, status } = usePetProducts(petId);

  return (
    <div>
      <div>This is pet content for {}</div>
    </div>
  );
}
