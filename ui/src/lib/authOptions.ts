import GoogleProvider from "next-auth/providers/google";

const allowedUsers = [
  "kesharwaniankit80@gmail.com",
  "kesharwaniankit.com@gmail.com",
  "kmamaniya@gmail.com",
  "panchalparth417@gmail.com",
  "vaibhav.kanojia1996@gmail.com",
  "mpoojamore07@gmail.com",
  "tejalmamaniya@gmail.com",
  "23lalita@gmail.com",
  "kesharwanikartik80@gmail.com",
  "kesherwanisimran8@gmail.com",
  "bhavik.dand007@gmail.com"
];

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
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      session.user.image = token.picture;
      return session; 
    },
  },
};
