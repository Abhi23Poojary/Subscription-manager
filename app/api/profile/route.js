import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// Helper to reliably extract the token from cookies or headers
function getToken(req) {
  const cookieNames = ['token', 'auth_token', 'jwt', 'session', 'next-auth.session-token'];
  for (const name of cookieNames) {
    const val = req.cookies.get(name)?.value;
    if (val) return val;
  }
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.split(' ')[1];
  return null;
}

// Fetch user profile
export async function GET(req) {
  try {
    await connectDB();
    
    const token = getToken(req);
    if (!token) return NextResponse.json({ error: "Unauthorized - No token found in cookies" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
    
    const userId = decoded?.userId || decoded?.id || decoded?._id || decoded?.sub;
    if (!userId) return NextResponse.json({ error: "Unauthorized - Missing User ID" }, { status: 401 });

    const user = await User.findById(userId).select('-password');
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Update user profile
export async function PUT(req) {
  try {
    await connectDB();
    
    const token = getToken(req);
    if (!token) return NextResponse.json({ error: "Unauthorized - No token found in cookies" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
    
    const userId = decoded?.userId || decoded?.id || decoded?._id || decoded?.sub;
    if (!userId) return NextResponse.json({ error: "Unauthorized - Missing User ID" }, { status: 401 });

    const body = await req.json();
    const { name, username, email, avatar } = body;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, username, email, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json({ user: updatedUser, message: "Profile updated" }, { status: 200 });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json({ error: `This ${field} is already in use.` }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Server error or validation failed" }, { status: 500 });
  }
}
