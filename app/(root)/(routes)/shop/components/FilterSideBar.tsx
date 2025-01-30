"use client";

import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

const items = [
  { id: "food", label: "Food" },
  { id: "toys", label: "Toys" },
  { id: "cages", label: "Cages" },
  { id: "fish-tanks", label: "Fish Tanks" },
];

const pets = [
  { id: "dogs", label: "Dogs" },
  { id: "cats", label: "Cats" },
  { id: "guinea-pigs", label: "Guinea Pigs" },
  { id: "rabbits", label: "Rabbits" },
  { id: "birds", label: "Birds" },
  { id: "fish", label: "Fish" },
  { id: "exotic-pets", label: "Exotic Pets" },
];

const offers = [
  { id: "on-sale", label: "On Sale" },
  { id: "new-arrivals", label: "New Arrivals" },
  { id: "clearance", label: "Clearance" },
];

type FilterState = {
  petType: string[];
  productType: string[];
};

type FilterType = keyof FilterState;

interface FilterSideBarProps {
  filters: FilterState;
  onFilterChange: (filterType: FilterType, value: string[]) => void;
}

export function FilterSideBar({ filters, onFilterChange }: FilterSideBarProps) {
  // Filter Change Checkboxes
  const handleCheckboxChange = (filterType: FilterType, value: string) => {
    const newValues = filters[filterType].includes(value)
      ? filters[filterType].filter((item) => item !== value)
      : [...filters[filterType], value];
    onFilterChange(filterType, newValues);
  };

  // Price Range
  const [priceRange, setPriceRange] = useState([0, 100]);
  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  return (
    <div className="col-span-1 md:col-span-1">
      {/* Status */}
      <div className="flex items-center pt-0 pb-3 space-x-3">
        <Switch id="all-types" />
        <Label htmlFor="all-types" className="text-md font-medium">
          In-Stock
        </Label>
      </div>

      {/* Offers */}
      <div className="py-3">
        <div className="text-xl font-bold">Current Offers</div>
        {offers.map((item) => (
          <div key={item.id} className="flex items-center pt-3 space-x-2">
            <Checkbox key={item.id} id={item.id} />
            <Label htmlFor={item.id} className="text-md font-medium">
              {item.label}
            </Label>
          </div>
        ))}
      </div>

      {/* Products Type */}
      <div className="py-3">
        <div className="text-xl font-bold">Shop by Types</div>
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
      </div>

      {/* Pets */}
      <div className="py-3">
        <div className="text-xl font-bold">Pets</div>
        <div className="grid grid-cols-2">
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
        </div>
      </div>

      {/* Price Range */}
      <div className="py-3 w-11/12">
        <div className="text-lg font-semibold">Price Range</div>
        <Slider
          id="price-range"
          min={0}
          max={100}
          step={5}
          value={priceRange}
          onValueChange={handlePriceChange}
          className="pt-6"
          minStepsBetweenThumbs={1}
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
