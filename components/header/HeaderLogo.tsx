"use client";

import Image from "next/image";
import Link from "next/link";

export function HeaderLogo() {
  return (
    <div className="basis-1/4 hidden 2lg:block  justify-center items-center">
      <div className="flex h-full justify-center items-center">
        <div className="relative w-[150px] h-[60px] overflow-hidden">
          <Link href="/">
            <Image
              src="/Logo-light.png"
              className="absolute top-[41%] transform -translate-y-1/2 dark:hidden"
              width={150}
              height={150}
              alt="Pet Supplies Logo"
              priority
            />
            <Image
              src="/Logo-dark.png"
              className="absolute top-[41%] transform -translate-y-1/2 hidden dark:block"
              width={150}
              height={150}
              alt="Pet Supplies Logo"
              priority
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
