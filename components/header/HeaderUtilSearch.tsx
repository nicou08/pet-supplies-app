"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchResult = {
  id: string;
  name: string;
  price?: number;
  mainImageUrl?: string;
};

export function HeaderUtilSearch() {
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Clear results when searchValue is empty
  useEffect(() => {
    if (searchValue == "") {
      setResults([]);
      setHasSearched(false);
    }
  }, [searchValue]);

  // Hide dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show dropdown when searchValue changes and is not empty
  useEffect(() => {
    if (searchValue) setShowDropdown(true);
    else setShowDropdown(false);
  }, [searchValue]);

  // Function to handle search
  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    setLoading(true);

    console.log("HANDLESEARCH Search query:", searchValue);

    // Make API call
    try {
      const response = await axios.get(
        `/api/search?q=${encodeURIComponent(searchValue)}`
      );

      setResults(response.data || []);
      setHasSearched(true);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Show dropdown when input is focused and has value
  const handleInputFocus = () => {
    if (searchValue) setShowDropdown(true);
  };

  return (
    <>
      {/* Search Bar */}
      <div className="hidden sm:flex w-full h-full items-center justify-start ">
        <div
          ref={containerRef}
          className="hidden sm:flex w-full flex-col items-center justify-start relative"
        >
          <div className="w-full bg-[#e1e1e1] dark:bg-neutral-900 rounded-none border border-stone-400 dark:border-neutral-800 shadow-md flex items-center relative">
            <Input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onFocus={handleInputFocus}
              placeholder="Search for products"
              className="h-12 rounded-none placeholder-gray-500 dark:gray-900 dark:caret-stone-200 dark:text-stone-100 text-sm pr-20 flex-1"
            />
            {/* X (clear) button, appears left of search button */}
            {searchValue && (
              <button
                type="button"
                onClick={() => {
                  setSearchValue("");
                  setResults([]);
                }}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-stone-200 focus:outline-none"
                aria-label="Clear search"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 6L14 14M14 6L6 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
            {/* Magnifying glass search button at far right */}
            <button
              type="button"
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-neutral-900 dark:hover:text-[#e1e1e1] focus:outline-none p-1"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          {/* Search Results Dropdown */}
          {showDropdown && (
            <div className="absolute z-20 left-0 top-full w-full bg-[#e1e1e1] dark:bg-neutral-900 border border-stone-400 dark:border-neutral-800 shadow-lg mt-1 rounded-b-md">
              {loading ? (
                <div className="p-4 py-10 text-center text-gray-500">
                  <div className="flex justify-center">
                    <div className="loader3" />
                  </div>
                </div>
              ) : results.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-neutral-800">
                  {results.map((result) => (
                    <li key={result.id}>
                      <Link
                        href={`/products/${result.id}`}
                        onClick={() => { setShowDropdown(false); setSearchValue(""); }}
                        className="flex items-center gap-3 p-3 hover:bg-neutral-300 dark:hover:bg-neutral-800 cursor-pointer"
                      >
                        <Image
                          src={result.mainImageUrl || "/placeholder.svg"}
                          alt={result.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium">{result.name}</div>
                          <div className="text-sm text-gray-500">
                            ${result.price?.toFixed(2)}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                hasSearched && (
                  <div className="p-4 text-center text-gray-500">
                    No results found.
                  </div>
                )
              )}
            </div>
          )}
        </div>
        {/* Removed standalone Send button, now integrated as icon in search bar */}
      </div>
      {/* Search Icon (mobile) */}
      <Button
        onClick={handleSearch}
        className="sm:hidden focus:outline-none w-11 h-11 rounded-full flex justify-center items-center shadow-none bg-transparent text-black dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-900"
      >
        <Search />
      </Button>
    </>
  );
}
