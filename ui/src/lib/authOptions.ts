import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: { token: any; user: any; account?: any }) {
      // When signing in, store access token, ID token, and expiry time
      if (account) {
        if (!user?.email) {
          throw new Error("Unauthorized");
        }
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token; // Needed for refreshing access token
        token.expiresAt = Date.now() + (account.expires_in || 3600) * 1000; // Expiry timestamp
        token.picture = user?.image || user?.picture || "";
      }

      // Check if the access token has expired
      if (Date.now() > token.expiresAt) {
        return await refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      session.user.image = token.picture;
      session.expires = new Date(token.expiresAt).toISOString(); // Convert to ISO format
      return session; 
    },
  },
};

// Function to refresh access token
async function refreshAccessToken(token: any) {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }
    console.log("Refresh token success");

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000, // Update expiry
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}
