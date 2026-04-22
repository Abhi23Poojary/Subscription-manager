import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Determine if the user is logging in with an email or username
    const isEmail = identifier.includes('@');
    const query = isEmail ? { email: identifier.toLowerCase() } : { username: identifier.toLowerCase() };

    // We must explicitly select the password field because it is set to select: false in the schema
    const user = await User.findOne(query).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signToken({ id: user._id, email: user.email, username: user.username });

    const response = NextResponse.json({ message: 'Logged in successfully' }, { status: 200 });
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Signin Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}