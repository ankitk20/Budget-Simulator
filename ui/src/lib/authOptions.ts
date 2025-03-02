import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: { token: any; user: any; account?: any }) {
      if (account) {
        if (!user?.email) {
          throw new Error("Unauthorized");
        }
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.picture = user?.image || user?.picture || "";
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      delete session.accessToken;
      delete session.idToken;
      return session;
    },
    events: {
      async signIn({ token }: { token: any }) {
        if (!token.idToken) return;
        console.log(token.idToken);
        await storeTokenAsHttpOnlyCookie(token.idToken);
      },
    },
  },
};

// Function to set HttpOnly cookie
async function storeTokenAsHttpOnlyCookie(idToken: string) {
  const res = await fetch("/api/set-cookie", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
    credentials: "include",
  });
}