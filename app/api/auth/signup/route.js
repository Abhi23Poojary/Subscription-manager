import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email is already registered' }, { status: 409 });
    }

    // Auto-generate a username to satisfy the User model 
    // without needing to add an extra input field to the UI.
    const username = email.split('@')[0] + Math.floor(Math.random() * 10000);

    await User.create({
      name,
      email,
      username,
      password,
    });

    return NextResponse.json({ message: 'Account created successfully' }, { status: 201 });
    
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}