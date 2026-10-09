import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/auth/users";

export const { handlers, signIn, signOut, auth } =NextAuth({
  session: {
    strategy: "jwt",
  },
  
  providers: [
    Credentials({
      async authorize(credentials) {
        if (
          typeof credentials?.username !== "string" ||
          typeof credentials?.password !== "string"
        ) {
          return null;
        }
        const user = await verifyPassword(
          credentials.username,
          credentials.password
        );
        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.username = token.username;
      session.user.role = token.role;

      return session;
    },

  },
});