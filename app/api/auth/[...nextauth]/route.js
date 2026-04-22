import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
<<<<<<< HEAD
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
=======
import AppleProvider from "next-auth/providers/apple";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const providers = [];

// Google
if (
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    );
}

// Apple (only if configured)
if (
    process.env.APPLE_ID &&
    process.env.APPLE_TEAM_ID &&
    process.env.APPLE_PRIVATE_KEY &&
    process.env.APPLE_KEY_ID
) {
    providers.push(
        AppleProvider({
            clientId: process.env.APPLE_ID,
            clientSecret: {
                appleId: process.env.APPLE_ID,
                teamId: process.env.APPLE_TEAM_ID,
                privateKey: process.env.APPLE_PRIVATE_KEY,
                keyId: process.env.APPLE_KEY_ID,
            },
        })
    );
}

const handler = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers,

    callbacks: {
        async signIn({ user }) {
            try {
                await connectDB();

                if (!user?.email) return false;

                const email = user.email.toLowerCase();
                let existingUser = await User.findOne({ email });

                if (!existingUser) {
                    const baseUsername = email
                        .split("@")[0]
                        .replace(/[^a-z0-9]/gi, "")
                        .toLowerCase();

                    let username = baseUsername;
                    let count = 0;

                    while (await User.findOne({ username })) {
                        count++;
                        username = `${baseUsername}${count}`;
                    }

                    await User.create({
                        name: user.name || "User",
                        username,
                        email,
                        password: `oauth_${Date.now()}`,
                        gender: "",
                        dob: null,
                        avatar: user.image || "",
                    });
                }

                return true;
            } catch (error) {
                console.error("OAuth signIn callback error:", error);

                // TEMPORARY: still allow login
                return true;
            }
        },

        async jwt({ token }) {
            try {
                if (token?.email) {
                    await connectDB();
                    const dbUser = await User.findOne({
                        email: token.email.toLowerCase(),
                    });

                    if (dbUser) {
                        token.id = dbUser._id.toString();
                        token.username = dbUser.username;
                        token.avatar = dbUser.avatar;
                    }
                }
            } catch (error) {
                console.error("JWT callback error:", error);
            }

            return token;
        },

        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.avatar = token.avatar;
            }

            return session;
        },
    },

    pages: {
        signIn: "/signin",
        error: "/signin",
    },

    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60,
    },
});

>>>>>>> 36a897d4c084dd9b8fa6f8b63d371a9133886098
export { handler as GET, handler as POST };