import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authOptions } from "./api/auth/[...nextauth]/route";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authOptions,
});

export type { Session } from "next-auth";

// Use this to protect server components
export const getSession = async () => {
  const session = await auth();
  return session;
};

// Helper to get the current user in server components
export const getCurrentUser = async () => {
  const session = await getSession();
  
  if (!session?.user?.email) {
    return null;
  }
  
  const currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email as string,
    },
  });

  if (!currentUser) {
    return null;
  }

  return currentUser;
};