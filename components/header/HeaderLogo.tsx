"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

export function HeaderLogo() {
  const { theme } = useTheme();

  return (
    <div className="basis-1/4 hidden lg:block  justify-center items-center">
      <div className="flex h-full justify-center items-center">
        <div className="relative w-[150px] h-[60px] overflow-hidden">
          <Link href="/">
            <Image
              src={theme === "dark" ? "/Logo-dark.png" : "/Logo-light.png"}
              className="absolute top-[41%] transform -translate-y-1/2"
              width={150}
              height={150}
              alt="Pet Supplies Logo"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
