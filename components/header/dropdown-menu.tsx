"use client";

import { useState } from "react";

interface CustomDropdownMenuProps {
  trigger: React.ReactNode;
  items: string[];
}

export function CustomDropdownMenu({
  trigger,
  items,
}: CustomDropdownMenuProps) {
  const [open, setOpen] = useState(false);

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  return (
    <div
      className="relative h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`cursor-pointer flex h-full items-center pl-5 pr-3 ${
          open ? "bg-neutral-500" : "hover:bg-neutral-500"
        }`}
      >
        {trigger}
      </div>
      {open && (
        <div className="z-50 text-black absolute left-0 w-48 rounded-none shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          {items.map((item, index) => (
            <div
              key={index}
              className="py-3 px-4 cursor-pointer hover:bg-neutral-300"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
