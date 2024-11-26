"use client";

import { Button } from "@/components/ui/button";

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function IconButton({ icon, onClick, className }: IconButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`w-11 h-11 rounded-full flex justify-center items-center shadow-none bg-transparent text-black dark:text-white cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-900 transition-shadow duration-200`}
    >
      {icon}
    </Button>
  );
}
