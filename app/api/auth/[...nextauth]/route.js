import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          await connectDB();
          let dbUser = await User.findOne({ email: user.email });

          // Create the user if they don't exist yet
          if (!dbUser) {
            const baseUsername = user.email ? user.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "") : "user";
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            
            // Generate a random secure dummy password to satisfy any lingering database requirements
            const dummyPassword = Math.random().toString(36).slice(-10) + "A1@";

            dbUser = await User.create({
              name: user.name || "Google User",
              email: user.email,
              username: `${baseUsername}${randomNum}`,
              password: dummyPassword,
            });
          }

          return true;
        } catch (error) {
          console.error("Google Auth Error:", error);
          // Redirect to signin with the actual error message so it's not hidden
          return `/signin?error=${encodeURIComponent(error.message || "Database Error")}`;
        }
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };