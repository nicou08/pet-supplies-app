"use client";

import { useState, useEffect } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

type FilterState = {
  petType: string[];
  productType: string[];
  offersType: string[];
  brandsType: string[];
  priceRange: number[];
  inStock: boolean;
};

type FilterType = keyof FilterState;

interface FilterSideBarProps {
  filters: FilterState;
  filterNameMap: {
    [key: string]: string;
  };
  onFilterChange: (
    filterType: FilterType,
    value: string[] | number[] | boolean
  ) => void;
  currentlySelectedFilters: FilterState;
}

export function FilterSideBar({
  filters,
  filterNameMap,
  onFilterChange,
  currentlySelectedFilters,
}: FilterSideBarProps) {
  // Filter Change Checkboxes
  const handleCheckboxChange = (filterType: FilterType, value: string) => {
    if (filterType != "priceRange" && filterType !== "inStock") {
      const newValues = currentlySelectedFilters[filterType].includes(value)
        ? currentlySelectedFilters[filterType].filter((item) => item !== value)
        : [...currentlySelectedFilters[filterType], value];
      onFilterChange(filterType, newValues);
    }
  };

  // Price Range Filter Change
  const handlePriceChange = (value: number[]) => {
    onFilterChange("priceRange", value);
  };

  // In-Stock Switch
  const handleSwitchChange = (value: boolean) => {
    onFilterChange("inStock", value);
  };

  // Log the filters state
  // useEffect(() => {
  //   console.log("TOTAL FILTERS  :", filters);
  // }, [filters]);

  // useEffect(() => {
  //   console.log("CURRENT FILTERS  :", currentlySelectedFilters);
  // }, [currentlySelectedFilters]);

  return (
    <div className="col-span-1 border-r border-neutral-700 py-5">
      {/* Status */}
      <div className="flex items-center pt-0 pb-3 pl-4 space-x-3">
        <Switch
          id="In-Stock"
          checked={currentlySelectedFilters.inStock}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="all-types" className="text-md font-medium">
          In-Stock
        </Label>
      </div>

      {/* Price Range */}
      <div className="py-3 w-full px-4">
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

      {/* New Variation Test */}
      <Accordion type="multiple" defaultValue={["offers"]}>
        {/* Offers */}
        <AccordionItem value="offers" className="px-4">
          <AccordionTrigger>
            <div className="text-xl font-bold pl-0">Current Offers</div>
          </AccordionTrigger>
          <AccordionContent className="pl-0">
            {Array.isArray(filters.offersType) &&
              filters.offersType.map((item) => (
                <div key={item} className="flex items-center pt-3 space-x-2">
                  <Checkbox
                    id={item}
                    checked={currentlySelectedFilters.offersType.includes(item)}
                    onCheckedChange={() =>
                      handleCheckboxChange("offersType", item)
                    }
                  />
                  <Label htmlFor={item} className="text-md font-medium">
                    {item}
                  </Label>
                </div>
              ))}
          </AccordionContent>
        </AccordionItem>

        {/* Products Type */}
        <AccordionItem value="productType" className="px-4">
          <AccordionTrigger>
            <div className="text-xl font-bold">Shop by Types</div>
          </AccordionTrigger>
          <AccordionContent>
            {Array.isArray(filters.productType) &&
              filters.productType.map((item) => (
                <div key={item} className="flex items-center pt-3 space-x-2">
                  <Checkbox
                    id={item}
                    checked={currentlySelectedFilters.productType.includes(
                      item
                    )}
                    onCheckedChange={() =>
                      handleCheckboxChange("productType", item)
                    }
                  />
                  <Label htmlFor={item} className="text-md font-medium">
                    {filterNameMap[item]}
                  </Label>
                </div>
              ))}
          </AccordionContent>
        </AccordionItem>

        {/* Pets */}
        <AccordionItem value="petType" className="px-4">
          <AccordionTrigger>
            <div className="text-xl font-bold">Pets</div>
          </AccordionTrigger>
          <AccordionContent>
            {Array.isArray(filters.petType) &&
              filters.petType.map((item) => (
                <div key={item} className="flex items-center pt-3 space-x-2">
                  <Checkbox
                    id={item}
                    checked={currentlySelectedFilters.petType.includes(item)}
                    onCheckedChange={() =>
                      handleCheckboxChange("petType", item)
                    }
                  />
                  <Label htmlFor={item} className="text-md font-medium">
                    {item}
                  </Label>
                </div>
              ))}
          </AccordionContent>
        </AccordionItem>

        {/* Brands */}
        <AccordionItem value="brands" className="px-4">
          <AccordionTrigger>
            <div className="text-xl font-bold">Brands</div>
          </AccordionTrigger>
          <AccordionContent>
            {Array.isArray(filters.brandsType) &&
              filters.brandsType.map((item) => (
                <div key={item} className="flex items-center pt-3 space-x-2">
                  <Checkbox
                    id={item}
                    checked={currentlySelectedFilters.brandsType.includes(item)}
                    onCheckedChange={() =>
                      handleCheckboxChange("brandsType", item)
                    }
                  />
                  <Label htmlFor={item} className="text-md font-medium">
                    {item}
                  </Label>
                </div>
              ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
