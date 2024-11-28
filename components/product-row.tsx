import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface ProductRowItemProps {
  id: string;
  name: string;
  image: string;
  price: number;
}

function ProductRowItem({ id, name, image, price }: ProductRowItemProps) {
  const handleItemClick = () => {
    console.log("Product clicked");
  };

  const handleAddToCart = () => {
    console.log("Add to cart clicked");
  };

  return (
    <div className="h-72 w-[200px] flex-shrink-0 bg-white rounded-lg">
      <div className="w-full h-44 flex justify-center">
        <Image
          src={image}
          alt="Product"
          width={150}
          height={150}
          className="object-contain"
        />
      </div>
      <div className="w-full px-3">
        <div className="font-normal text-stone-950  flex justify-start">
          {name}
        </div>
        <div className="font-bold text-black pt-1 text-lg flex justify-start">
          ${price}
        </div>
        <div className="pt-1">
          <Button
            onClick={handleAddToCart}
            className="w-full h-8 bg-yellow-300 hover:bg-yellow-300 text-stone-950 rounded-full py-5"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProductRow() {
  return (
    <div className="bg-zinc-300 w-full rounded-lg h-[390px]">
      <div className="text-3xl font-medium py-5 px-5  text-gray-800">
        Top Sellers
      </div>
      <div className="flex flex-row gap-4 overflow-x-auto px-5">
        <ProductRowItem
          id="1"
          name="Small Pet Pellets"
          image="/small-pet-pellets-1.jpg"
          price={69.99}
        />
        <ProductRowItem
          id="1"
          name="Small Pet Pellets"
          image="/small-pet-pellets-1.jpg"
          price={69.99}
        />
        <ProductRowItem
          id="1"
          name="Cat food"
          image="/cat-food-1.jpg"
          price={69.99}
        />
        <ProductRowItem
          id="1"
          name="Small Pet Pellets"
          image="/small-pet-pellets-1.jpg"
          price={69.99}
        />
        <ProductRowItem
          id="1"
          name="Small Pet Pellets"
          image="/small-pet-pellets-1.jpg"
          price={69.99}
        />
        <ProductRowItem
          id="1"
          name="Small Pet Pellets"
          image="/small-pet-pellets-1.jpg"
          price={69.99}
        />
        <ProductRowItem
          id="1"
          name="Small Pet Pellets"
          image="/small-pet-pellets-1.jpg"
          price={69.99}
        />
      </div>
    </div>
  );
}
