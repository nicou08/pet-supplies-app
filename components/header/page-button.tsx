"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PageButtonProps {
  dropdownTitle: string;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export function PageButton({
  dropdownTitle,
  isOpen,
  onToggle,
}: PageButtonProps) {
  return (
    <DropdownMenu open={isOpen} onOpenChange={onToggle}>
      <DropdownMenuTrigger asChild>
        <div
          className="flex justify-center items-center h-full bg-transparent rounded-none border-0 pl-4 pr-2 hover:bg-neutral-500"
          onClick={() => onToggle(!isOpen)}
        >
          {dropdownTitle}
          <ChevronDown />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-none -mt-1">
        <DropdownMenuItem>Dog Grooming</DropdownMenuItem>
        <DropdownMenuItem>Cat Grooming</DropdownMenuItem>
        <DropdownMenuItem>Veterinary</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
