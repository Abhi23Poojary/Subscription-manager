import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider  from "next-auth/providers/apple";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    AppleProvider({
      clientId:     process.env.APPLE_ID,
      clientSecret: {
        appleId:     process.env.APPLE_ID,
        teamId:      process.env.APPLE_TEAM_ID,
        privateKey:  process.env.APPLE_PRIVATE_KEY,
        keyId:       process.env.APPLE_KEY_ID,
      },
    }),
  ],

  callbacks: {
    // ── Called after a successful OAuth sign-in ──────────────────────────
    async signIn({ user, account }) {
      try {
        await connectDB();

        const existingUser = await User.findOne({ email: user.email.toLowerCase() });

        if (!existingUser) {
          // Auto-create account for new OAuth users
          await User.create({
            name:     user.name  || "User",
            username: user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") + Math.floor(Math.random() * 1000),
            email:    user.email.toLowerCase(),
            password: `oauth_${account.providerAccountId}_${Date.now()}`, // non-usable placeholder
            gender:   "",
            dob:      null,
            avatar:   user.image || "",
          });
        } else if (!existingUser.avatar && user.image) {
          // Update avatar if missing
          existingUser.avatar = user.image;
          await existingUser.save();
        }

        return true;
      } catch (error) {
        console.error("OAuth signIn callback error:", error);
        return false;
      }
    },

    // ── Attach our MongoDB user ID to the JWT ────────────────────────────
    async jwt({ token, user, account }) {
      if (account) {
        // First sign-in — fetch our DB user and attach their _id
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email.toLowerCase() });
          if (dbUser) {
            token.id       = dbUser._id.toString();
            token.username = dbUser.username;
            token.avatar   = dbUser.avatar;
          }
        } catch (error) {
          console.error("JWT callback error:", error);
        }
      }
      return token;
    },

    // ── Expose our fields in the session object ──────────────────────────
    async session({ session, token }) {
      if (token) {
        session.user.id       = token.id;
        session.user.username = token.username;
        session.user.avatar   = token.avatar;
      }
      return session;
    },
  },

  pages: {
    signIn:    "/signin",   // redirect here if unauthenticated
    error:     "/signin",   // redirect here on OAuth error
  },

  session: {
    strategy: "jwt",
    maxAge:   7 * 24 * 60 * 60, // 7 days
  },
});

export { handler as GET, handler as POST };