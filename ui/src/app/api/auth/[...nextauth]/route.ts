import { serialize } from "cookie";
import NextAuth, { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { NextResponse } from "next/server";

const allowedUsers = [
  "kesharwaniankit80@gmail.com",
  "kesharwaniankit.com@gmail.com",
  "kmamaniya@gmail.com",
  "parthpanchal417@gmail.com",
  "vaibhav.kanojia.1996@gmail.com"
];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user: any; account?: any }) {
      if (account) {
        if (!user?.email || !allowedUsers.includes(user.email)) {
          throw new Error("Unauthorized");
        }
        token.accessToken = account.access_token; // Store access token
        token.idToken = account.id_token; // Store ID token
        token.picture = user?.image || user?.picture || "";
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      session.user.image = token.picture;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
