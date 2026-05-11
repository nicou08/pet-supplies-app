"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        aria-hidden
        className="w-11 h-11 rounded-full flex justify-center items-center cursor-pointer shadow-none bg-transparent hover:bg-accent transition-shadow duration-200"
      >
        <span className="h-6 w-6" />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      onClick={toggleTheme}
      aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="w-11 h-11 rounded-full flex justify-center items-center cursor-pointer shadow-none bg-transparent hover:bg-accent transition-shadow duration-200"
    >
      {resolvedTheme === "dark" ? (
        <Moon className="h-6 w-6 text-foreground" />
      ) : (
        <Sun className="h-6 w-6 text-foreground" />
      )}
    </Button>
  );
}
