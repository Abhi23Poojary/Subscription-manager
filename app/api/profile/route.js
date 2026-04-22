import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getSessionUser } from '@/lib/auth';

// GET profile
export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const user = await User.findById(session.id).select('-password');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update profile
export async function PUT(request) {
  try {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { name, email, currentPassword, newPassword } = await request.json();

    const user = await User.findById(session.id).select('+password');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Update name
    if (name) user.name = name.trim();

    // Update email
    if (email && email !== user.email) {
      const exists = await User.findOne({ email: email.toLowerCase() });
      if (exists) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      user.email = email.toLowerCase();
    }

    // Update password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required to set a new one' }, { status: 400 });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
      }
      user.password = newPassword;
    }

    await user.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}