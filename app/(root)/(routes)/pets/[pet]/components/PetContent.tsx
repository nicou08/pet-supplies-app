"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useProductTypes } from "@/hooks/useProductTypes";
import { usePetProducts } from "@/hooks/usePetProducts";

type PetContentProps = {
  petId: string;
};

export function PetContent({ petId }: PetContentProps) {
  const {
    productTypes,
    isLoading: productTypeLoading,
    isError: productTypeError,
  } = useProductTypes();
  const {
    products,
    isLoading: petProductsLoading,
    isError: petProductsError,
    status,
  } = usePetProducts(petId);

  const [petProductTypes, setPetProductTypes] = useState([]);

  if (productTypeLoading) {
    return <div className="text-3xl">Loading...</div>;
  }

  if (productTypes) {
    //console.log("PETCONTENT Fetched product types:", productTypes);
    console.log("PETCONTENT Fetched products:", typeof productTypes);
  }

  useEffect(() => {
    if (products) {
      const uniqueProductTypes = products.reduce((acc: any, product: any) => {
        const productType = product.productType.name;
        if (!acc.includes(productType)) {
          acc.push(productType);
        }
        return acc;
      }, []);

      setPetProductTypes(uniqueProductTypes);
    }
  }, [products]);

  return (
    <div className="bg-green-700">
      <div className="bg-red-300 flex justify-center text-3xl">
        Shop by Category
      </div>
      <div className="bg-blue-600 flex justify-center gap-5">
        {productTypes.productTypes.map(
          (productType: { id: string; name: string }) => (
            <Link
              key={productType.id}
              href={`/pets/dog#${productType.name.toLocaleLowerCase()}`}
              className="text-lg"
            >
              {productType.name}
            </Link>
          )
        )}
      </div>
      {petProductTypes.length > 0 ? (
        <div className="bg-yellow-300 flex justify-center text-3xl">
          {petProductTypes.map((productType: string) => (
            <Link
              key={productType}
              href={`/pets/dog#${productType.toLocaleLowerCase()}`}
              className="text-lg"
            >
              {productType}
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-300 flex justify-center text-3xl">
          No products available for this pet type.
        </div>
      )}

      <div className="h-[2400px]"></div>
      <div id="food">Hello</div>
      <div className="h-[1400px] bg-yellow-700"></div>
    </div>
  );
}
