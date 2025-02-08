import NextAuth from "next-auth";
import authConfig from "./auth.config";

import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prismadb";
import Github from "next-auth/providers/github";

//const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [Github],
  debug: true,
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session?.user?.name;
      return token;
    },
  },
});
