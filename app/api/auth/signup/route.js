import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
<<<<<<< HEAD
=======
import { signToken, setAuthCookie } from '@/lib/auth';
>>>>>>> 36a897d4c084dd9b8fa6f8b63d371a9133886098

export async function POST(request) {
  try {
    await connectDB();
<<<<<<< HEAD
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
=======

    const { name, username, email, password, dob, gender } = await request.json();

    // ── Validate required fields ───────────────────────────────────────────
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: 'Name, username, email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    // ── Check for duplicate email ──────────────────────────────────────────
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // ── Check for duplicate username ───────────────────────────────────────
    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return NextResponse.json(
        { error: 'This username is already taken' },
        { status: 409 }
      );
    }

    // ── Create user ────────────────────────────────────────────────────────
    const user = await User.create({
      name:     name.trim(),
      username: username.trim().toLowerCase(),
      email:    email.trim().toLowerCase(),
      password,
      dob:      dob ? new Date(dob) : null,
      gender:   gender || '',
    });

    // ── Sign JWT and set HTTP-only cookie ──────────────────────────────────
    const token = signToken({
      id:       user._id.toString(),
      email:    user.email,
      name:     user.name,
      username: user.username,
    });

    const response = NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id:       user._id,
          name:     user.name,
          username: user.username,
          email:    user.email,
          gender:   user.gender,
          dob:      user.dob,
        },
      },
      { status: 201 }
    );

    setAuthCookie(response, token);

    return response;

  } catch (error) {
    console.error('Signup error:', error);

    // Mongoose duplicate key error (race condition fallback)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `This ${field} is already registered` },
        { status: 409 }
      );
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)[0].message;
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
>>>>>>> 36a897d4c084dd9b8fa6f8b63d371a9133886098
  }
}