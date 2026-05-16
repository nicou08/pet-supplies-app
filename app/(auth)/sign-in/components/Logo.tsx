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
    <Image
      src={src}
      alt="Pet Supplies"
      width={140}
      height={140}
      priority
      className="h-auto w-32 select-none"
    />
  );
}
