"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function HeaderUtilSearch() {
  const handleSearch = () => {
    console.log("Search button clicked");
  };

  return (
    <>
      {/* Search Bar */}
      <div className="hidden sm:flex w-full h-full items-center justify-start">
        <div className="w-full bg-[#e1e1e1] dark:bg-neutral-900 rounded-none border border-stone-400 dark:border-neutral-800 shadow-md">
          <Input
            type="text"
            placeholder="Search for products"
            className="h-12 rounded-none placeholder-gray-500 dark:gray-900 dark:caret-stone-200 dark:text-stone-100 text-sm"
          />
        </div>
      </div>

      {/* Search Icon */}
      <Button
        onClick={handleSearch}
        className="sm:hidden focus:outline-none w-11 h-11 rounded-full flex justify-center items-center shadow-none bg-transparent text-black dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-900"
      >
        <Search />
      </Button>
    </>
  );
}
