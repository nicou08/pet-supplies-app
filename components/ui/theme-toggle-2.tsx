"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div
      onClick={toggleTheme}
      className="w-11 h-11 rounded-full flex justify-center items-center cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-900 transition-shadow duration-200"
    >
      {theme === "light" ? (
        <SunIcon className="h-7 w-7 text-black dark:text-white" />
      ) : (
        <MoonIcon className="h-7 w-7 text-black dark:text-white" />
      )}
    </div>
  );
}
