"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Logo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const src =
    mounted && resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-light.png";

  return (
    <div
      className="relative flex items-center justify-center rounded-full"
      style={{ width: "204px", height: "204px" }}
    >
      <Image
        src={src}
        alt="Pet Supplies"
        width={160}
        height={160}
        priority
        className="h-auto w-36 select-none"
      />
      <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#FFF1EA]" />
    </div>
  );
}
