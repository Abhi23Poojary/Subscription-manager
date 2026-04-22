import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    // ── Try our own JWT cookie first (email/password login) ───────────────
    const jwtSession = await getSessionUser();
    if (jwtSession) {
      const user = await User.findById(jwtSession.id).select("-password");
      if (user) return NextResponse.json({ user });
    }

    // ── Fall back to NextAuth session (OAuth login) ───────────────────────
    const nextAuthSession = await getServerSession();
    if (nextAuthSession?.user?.email) {
      const user = await User.findOne({
        email: nextAuthSession.user.email.toLowerCase(),
      }).select("-password");
      if (user) return NextResponse.json({ user });
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error) {
    console.error("/api/auth/me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}