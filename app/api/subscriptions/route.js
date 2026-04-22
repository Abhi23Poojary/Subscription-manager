import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Helper function to securely extract the User ID from the HTTP-Only cookie
async function getUserId() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId || decoded.id; // Handles both sync-user and signin token formats
  } catch (error) {
    return null;
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const subscriptions = await Subscription.find({ userId }).sort({ nextBillingDate: 1 });
    return NextResponse.json({ subscriptions }, { status: 200 });
  } catch (error) {
    console.error('Fetch Subscriptions Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const newSubscription = await Subscription.create({ ...data, userId });
    return NextResponse.json({ subscription: newSubscription }, { status: 201 });
  } catch (error) {
    console.error('Create Subscription Error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}