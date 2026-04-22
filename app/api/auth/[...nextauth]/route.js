import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
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

export const authOptions = {
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

                    const dummyPassword = Math.random().toString(36).slice(-10) + "A1@";

                    await User.create({
                        name: user.name || "User",
                        username,
                        email,
                        password: dummyPassword,
                        gender: "",
                        dob: null,
                        avatar: user.image || "",
                    });
                }

                return true;
            } catch (error) {
                console.error("OAuth signIn callback error:", error);
                return `/signin?error=${encodeURIComponent(error.message || "Database Error")}`;
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };