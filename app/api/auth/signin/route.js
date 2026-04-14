import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();

    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/username and password are required' },
        { status: 400 }
      );
    }

    // ── Find by email OR username ──────────────────────────────────────────
    const isEmail = identifier.includes('@');
    const user = await User.findOne(
      isEmail
        ? { email: identifier.toLowerCase() }
        : { username: identifier.toLowerCase() }
    ).select('+password');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // ── Sign JWT and set HTTP-only cookie ──────────────────────────────────
    const token = signToken({
      id:       user._id.toString(),
      email:    user.email,
      name:     user.name,
      username: user.username,
    });

    const response = NextResponse.json({
      message: 'Signed in successfully',
      user: {
        id:       user._id,
        name:     user.name,
        username: user.username,
        email:    user.email,
      },
    });

    setAuthCookie(response, token);

    return response;

  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}