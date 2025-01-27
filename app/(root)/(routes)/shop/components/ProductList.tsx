import { ChevronDown } from "lucide-react";

import { ProductCard } from "./ProductCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const dummyProducts = [
  {
    image:
      "https://s3-pet-supplies-app-v1.s3.ca-west-1.amazonaws.com/donkey1.jpg",
    name: "Product 1",
    description: "Product 1 description",
    price: 100,
    rating: 4.1,
  },
  {
    image:
      "https://s3-pet-supplies-app-v1.s3.ca-west-1.amazonaws.com/donkey1.jpg",
    name: "Product 2",
    description: "Product 2 description",
    price: 200,
    rating: 3,
  },
  {
    image:
      "https://s3-pet-supplies-app-v1.s3.ca-west-1.amazonaws.com/donkey1.jpg",
    name: "Product 3",
    description: "Product 3 description",
    price: 300,
    rating: 5,
  },
  {
    image:
      "https://s3-pet-supplies-app-v1.s3.ca-west-1.amazonaws.com/donkey1.jpg",
    name: "Product 3",
    description: "Product 4 description",
    price: 300,
    rating: 5,
  },
  {
    image:
      "https://s3-pet-supplies-app-v1.s3.ca-west-1.amazonaws.com/donkey1.jpg",
    name: "Product 3",
    description: "Product 5 description",
    price: 300,
    rating: 5,
  },
  {
    image:
      "https://s3-pet-supplies-app-v1.s3.ca-west-1.amazonaws.com/donkey1.jpg",
    name: "Product 3",
    description: "Product 6 description",
    price: 300,
    rating: 2.4,
  },
  {
    image:
      "https://s3-pet-supplies-app-v1.s3.ca-west-1.amazonaws.com/donkey1.jpg",
    name: "Product 3",
    description: "Product 7 description",
    price: 300,
    rating: 5,
  },
  {
    image:
      "https://s3-pet-supplies-app-v1.s3.ca-west-1.amazonaws.com/donkey1.jpg",
    name: "Product 3",
    description: "Product 8 description",
    price: 300,
    rating: 5,
  },
  {
    image:
      "https://s3-pet-supplies-app-v1.s3.ca-west-1.amazonaws.com/donkey1.jpg",
    name: "Product 3",
    description: "Product 9 description",
    price: 300,
    rating: 5,
  },
  {
    image:
      "https://s3-pet-supplies-app-v1.s3.ca-west-1.amazonaws.com/donkey1.jpg",
    name: "Donkey",
    description: "Product 10 description",
    price: 30.0,
    rating: 5,
  },
  {
    image:
      "https://s3-pet-supplies-app-v1.s3.ca-west-1.amazonaws.com/donkey1.jpg",
    name: "Product 1",
    description: "Product 1 description",
    price: 100,
    rating: 2.9,
  },
  {
    image:
      "https://s3-pet-supplies-app-v1.s3.ca-west-1.amazonaws.com/donkey1.jpg",
    name: "Product 1",
    description: "Product 1 description",
    price: 100,
    rating: 3.3,
  },
  {
    image:
      "https://s3-pet-supplies-app-v1.s3.ca-west-1.amazonaws.com/donkey1.jpg",
    name: "Product 1",
    description: "Product 1 description",
    price: 100.0,
    rating: 4.1,
  },
  {
    image:
      "https://s3-pet-supplies-app-v1.s3.ca-west-1.amazonaws.com/donkey1.jpg",
    name: "Product 1",
    description: "Product 1 description",
    price: 69.99,
    rating: 4.4,
  },
  {
    image:
      "https://s3-pet-supplies-app-v1.s3.ca-west-1.amazonaws.com/donkey1.jpg",
    name: "Product 1",
    description: "Product 1 description",
    price: 109.99,
    rating: 3.7,
  },
  {
    image:
      "https://s3-pet-supplies-app-v1.s3.ca-west-1.amazonaws.com/donkey1.jpg",
    name: "Product 1",
    description: "Product 1 description",
    price: 69.99,
    rating: 4.4,
  },
];

export function ProductList() {
  return (
    <div className="col-span-3 w-full grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div className="col-span-4 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Best Match <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Best Match</DropdownMenuItem>
            <DropdownMenuItem>Price Low-High</DropdownMenuItem>
            <DropdownMenuItem>Price High-Low</DropdownMenuItem>
            <DropdownMenuItem>Highest Rated</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {dummyProducts.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
}
