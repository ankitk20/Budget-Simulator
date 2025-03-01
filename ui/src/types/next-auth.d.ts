import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string; // Add accessToken to the session
    idToken?: string;     // Add idToken to the session
    user: {
      id: string;
      email: string;
      image: string;
      name: string;
    };
  }

  interface JWT {
    accessToken?: string; // Add accessToken to JWT
    idToken?: string;     // Add idToken to JWT
    picture?: string;     // Add picture to JWT
  }
}
