"use client";

import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const items = [
  {
    id: "food",
    label: "Food",
  },
  {
    id: "toys",
    label: "Toys",
  },
  {
    id: "cages",
    label: "Cages",
  },
  {
    id: "fish-tanks",
    label: "Fish Tanks",
  },
];

const pets = [
  {
    id: "dogs",
    label: "Dogs",
  },
  {
    id: "cats",
    label: "Cats",
  },
  {
    id: "guinea-pigs",
    label: "Guinea Pigs",
  },
  {
    id: "rabbits",
    label: "Rabbits",
  },
  {
    id: "birds",
    label: "Birds",
  },
  {
    id: "fish",
    label: "Fish",
  },
  {
    id: "exotic-pets",
    label: "Exotic Pets",
  },
];

export function FilterSideBar() {
  const [priceRange, setPriceRange] = useState([0, 100]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  return (
    <div className="col-span-1 md:col-span-1 ">
      <div className="text-xl font-bold">Type</div>

      {/* Products */}
      <div className="flex items-center pt-3 space-x-2">
        <Checkbox id="all-types" />
        <Label htmlFor="all-types" className="text-md font-medium">
          All types
        </Label>
      </div>
      {items.map((item) => (
        <div key={item.id} className="flex items-center pt-3 space-x-2">
          <Checkbox key={item.id} id={item.id} />
          <Label htmlFor={item.id} className="text-md font-medium">
            {item.label}
          </Label>
        </div>
      ))}

      {/* Pets */}
      <div className="text-xl font-bold pt-5">Pets</div>

      <div className="flex items-center pt-3 space-x-2">
        <Checkbox id="all-types" />
        <Label htmlFor="all-types" className="text-md font-medium">
          All Pets
        </Label>
      </div>
      {pets.map((item) => (
        <div key={item.id} className="flex items-center pt-3 space-x-2">
          <Checkbox key={item.id} id={item.id} />
          <Label htmlFor={item.id} className="text-md font-medium">
            {item.label}
          </Label>
        </div>
      ))}

      {/* Price Range */}
      <div className="mt-4">
        <div className="text-lg font-semibold">Price Range</div>
        {/* <Slider
          min={0}
          max={500}
          step={10}
          value={priceRange}
          onValueChange={handlePriceChange}
        /> */}
        <Slider
          id="price-range"
          min={0}
          max={100}
          step={3}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mt-2"
        />
        <div className="flex justify-between text-sm mt-2">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Ratings */}
    </div>
  );
}
