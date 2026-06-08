"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

import { authClient } from "@/lib/auth-client";

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
  email,
  image,
}: HeaderUtilAccBtnProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/"),
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none w-11 h-11 rounded-full flex justify-center items-center shadow-none bg-transparent text-foreground hover:bg-accent data-[state=open]:bg-accent cursor-pointer transition-shadow duration-200">
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
          {isLoggedIn ? (
            <>
              <DropdownMenuLabel>{email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-0" asChild>
                <Link
                  href="/settings?tab=appointments"
                  className="cursor-pointer h-full w-full px-2 py-1.5 rounded-sm"
                >
                  Appointments
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0" asChild>
                <Link
                  href="/settings#billing"
                  className="cursor-pointer h-full w-full px-2 py-1.5 rounded-sm"
                >
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0" asChild>
                <Link
                  href="/settings"
                  className="cursor-pointer h-full w-full px-2 py-1.5 rounded-sm"
                >
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0" onClick={handleSignOut}>
                <div className="m-0 cursor-pointer h-full w-full px-2 py-1.5 rounded-sm">
                  Sign Out
                </div>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem className="p-0" asChild>
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
