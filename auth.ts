// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),   // <-- yeh line missing thi
  providers: [Google],
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
  },
});