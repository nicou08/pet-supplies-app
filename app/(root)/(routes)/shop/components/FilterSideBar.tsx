"use client";

import { useState, useEffect } from "react";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

type FilterState = {
  petType: string[];
  productType: string[];
  offersType: string[];
  priceRange: number[];
};

type FilterType = keyof FilterState;

interface FilterSideBarProps {
  filters: FilterState;
  onFilterChange: (filterType: FilterType, value: string[] | number[]) => void;
  currentlySelectedFilters: FilterState;
}

export function FilterSideBar({
  filters,
  onFilterChange,
  currentlySelectedFilters,
}: FilterSideBarProps) {
  // Filter Change Checkboxes
  const handleCheckboxChange = (filterType: FilterType, value: string) => {
    if (filterType != "priceRange") {
      const newValues = currentlySelectedFilters[filterType].includes(value)
        ? currentlySelectedFilters[filterType].filter((item) => item !== value)
        : [...currentlySelectedFilters[filterType], value];
      onFilterChange(filterType, newValues);
    }
  };

  // Log the filters state
  useEffect(() => {
    console.log("TOTAL FILTERS  :", filters);
  }, [filters]);

  useEffect(() => {
    console.log("CURRENT FILTERS  :", currentlySelectedFilters);
  }, [currentlySelectedFilters]);

  // Price Range Filter Change
  const handlePriceChange = (value: number[]) => {
    onFilterChange("priceRange", value);
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
        {Array.isArray(filters.offersType) &&
          filters.offersType.map((item) => (
            <div key={item} className="flex items-center pt-3 space-x-2">
              <Checkbox
                id={item}
                checked={currentlySelectedFilters.offersType.includes(item)}
                onCheckedChange={() => handleCheckboxChange("offersType", item)}
              />
              <Label htmlFor={item} className="text-md font-medium">
                {item}
              </Label>
            </div>
          ))}
      </div>

      {/* Products Type */}
      <div className="py-3">
        <div className="text-xl font-bold">Shop by Types</div>
        {Array.isArray(filters.productType) &&
          filters.productType.map((item) => (
            <div key={item} className="flex items-center pt-3 space-x-2">
              <Checkbox
                id={item}
                checked={currentlySelectedFilters.productType.includes(item)}
                onCheckedChange={() =>
                  handleCheckboxChange("productType", item)
                }
              />
              <Label htmlFor={item} className="text-md font-medium">
                {item}
              </Label>
            </div>
          ))}
      </div>

      {/* Pets */}
      <div className="py-3">
        <div className="text-xl font-bold">Pets</div>
        <div className="grid grid-cols-2">
          {Array.isArray(filters.petType) &&
            filters.petType.map((item) => (
              <div key={item} className="flex items-center pt-3 space-x-2">
                <Checkbox
                  id={item}
                  checked={currentlySelectedFilters.petType.includes(item)}
                  onCheckedChange={() => handleCheckboxChange("petType", item)}
                />
                <Label htmlFor={item} className="text-md font-medium">
                  {item}
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
          min={filters.priceRange[0]}
          max={filters.priceRange[1]}
          step={5}
          value={currentlySelectedFilters.priceRange}
          onValueChange={handlePriceChange}
          className="pt-6"
          minStepsBetweenThumbs={1}
        />
        <div className="flex justify-between text-sm mt-2">
          <span>${currentlySelectedFilters.priceRange[0]}</span>
          <span>${currentlySelectedFilters.priceRange[1]}</span>
        </div>
      </div>

      {/* Ratings */}
    </div>
  );
}
