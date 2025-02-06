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
    // authorized({ request, auth }) {
    //   const { pathname } = request.nextUrl
    //   if (pathname === "/middleware-example") return !!auth
    //   return true
    // },
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session?.user?.name;
      return token;
    },
  },
  // callbacks: {
  //   // signIn: async () => {
  //   //   console.log("Sign in callback");
  //   //   return true;
  //   // }
  //   async signIn({ user }) {
  //     /**
  //      * Check if user is in the database
  //      */
  //     console.log("Sign in callback");

  //     // Checking if user is valid
  //     // if (!user || !user.email) {
  //     //   return false;
  //     //   // throw new Error("Invalid email");
  //     // }

  //     // const { email } = user;

  //     // const existingUser = await prisma.user.findUnique({
  //     //   where: {
  //     //     email: email,
  //     //   },
  //     // });

  //     // if (!existingUser) {
  //     //   console.log("Callback: User not found in database");

  //     //   if (!user.name || !user.image) {
  //     //     return false;
  //     //   }

  //     //   const { name, image } = user;
  //     //   await prisma.user.create({
  //     //     data: {
  //     //       email: email,
  //     //       name: name,
  //     //       image: image,
  //     //     },
  //     //   });
  //     // }

  //     return true;
  //   },
  // },
});
