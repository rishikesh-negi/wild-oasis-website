import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    // Callback to check authenticated user. Returns boolean. Enforces route protection:
    authorized({ auth, request }) {
      return !!auth?.user;
    },

    // Runs before the actual sign-in process (similar to a middleware). Gets user, account, and profile data passed into it:
    async signIn({ user, account, profile }) {
      try {
        const existingGuest = await getGuest(user.email);
        if (!existingGuest)
          await createGuest({ email: user.email, fullName: user.name });

        return true;
      } catch (err) {
        return false;
      }
    },

    // Make session persistent and avoid requesting guestId from DB on every session check (for the below "session" callback):
    async jwt({ token, user }) {
      if (user) {
        const guest = await getGuest(user.email);
        token.guestId = guest.id;
      }

      return token;
    },

    // The session callback to fetch user ID and provide it to the entire app. Gets access to the current session and user. Runs after the signIn callback and after each session checkout (example: the auth() function call):
    async session({ session, token }) {
      session.user.guestId = token.guestId;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
