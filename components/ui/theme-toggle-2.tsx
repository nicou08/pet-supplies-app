"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      onClick={toggleTheme}
      className="w-11 h-11 rounded-full flex justify-center items-center cursor-pointer shadow-none bg-transparent hover:bg-neutral-300 dark:hover:bg-neutral-900 transition-shadow duration-200"
    >
      {/* {theme === "light" ? (
        <SunIcon className="h-6 w-6 text-black dark:text-white" />
      ) : (
        <MoonIcon className="h-6 w-6 text-black dark:text-white" />
      )} */}
      <SunIcon className="h-6 w-6 text-black dark:text-white dark:hidden" />
      <MoonIcon className="h-6 w-6 text-black dark:text-white hidden dark:block" />
    </Button>
  );
}
