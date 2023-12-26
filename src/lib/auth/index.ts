import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

import CredentialsProvider from "./CredentialsProvider";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [GitHub, CredentialsProvider],
  callbacks: {
    async session({ session, token }) {
      const email = token.email || session?.user?.email;
      if (!email) return session;

      const [user] = await db
        .select({
          id: usersTable.displayId,
          isCoach: usersTable.isCoach,
          username: usersTable.username,
          provider: usersTable.provider,
          email: usersTable.email,
          hasProfile: usersTable.hasProfile,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email.toLowerCase()))
        .execute();

      console.log(user);

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          isCoach: user.isCoach,
          username: user.username,
          provider: user.provider,
          email: user.email,
          hasProfile: user.hasProfile,
        },
      };
    },
    async jwt({ token, account }) {
      // Sign in with social account, e.g. GitHub, Google, etc.
      if (!account) return token;
      const { name, email } = token;
      const provider = account.provider;
      if (!name || !email || !provider) return token;

      // Check if the email has been registered
      const [existedUser] = await db
        .select({
          id: usersTable.displayId,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email.toLowerCase()))
        .execute();
      if (existedUser) return token;
      if (provider !== "github") return token;

      // Sign up
      await db.insert(usersTable).values({
        isCoach: true,
        username: name,
        email: email.toLowerCase(),
        provider,
        avatarUrl: "data:image/png;base64,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",
        hasProfile: false,
      });

      return token;
    },
  },
  pages: {
    signIn: "/",
  },
});
