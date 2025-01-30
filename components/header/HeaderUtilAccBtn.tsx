"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderUtilAccBtnProps {
  isLoggedIn: boolean;
  name?: string;
  email?: string;
  image?: string;
}

export function HeaderUtilAccBtn({
  isLoggedIn,
  name,
  email,
  image,
}: HeaderUtilAccBtnProps) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none w-11 h-11 rounded-full flex justify-center items-center shadow-none bg-transparent text-black hover:bg-neutral-300 data-[state=open]:bg-neutral-300 dark:text-white cursor-pointer dark:hover:bg-neutral-900 transition-shadow duration-200">
          {isLoggedIn ? (
            <Avatar>
              <AvatarImage src={image} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ) : (
            <User />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            {isLoggedIn ? (
              <div>
                <div>{email}</div>
              </div>
            ) : (
              <div>Sign In</div>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Appointments</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          {isLoggedIn ? (
            <DropdownMenuItem
              className="p-0"
              onClick={() => signOut({ redirectTo: "/" })}
            >
              <div className="bp-0 m-0 cursor-pointer h-full w-full px-2 py-1.5 rounded-sm">
                Sign Out
              </div>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem className="p-0">
              <Link
                href="/sign-in"
                className="cursor-pointer h-full w-full px-2 py-1.5 rounded-sm"
              >
                Sign In
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
