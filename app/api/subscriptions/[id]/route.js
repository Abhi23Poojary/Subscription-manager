import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

async function getUserId() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId || decoded.id;
  } catch (error) {
    return null;
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const userId = await getUserId();
    const { id } = await params;
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const deletedSub = await Subscription.findOneAndDelete({ _id: id, userId });
    if (!deletedSub) return NextResponse.json({ message: 'Subscription not found' }, { status: 404 });
    return NextResponse.json({ message: 'Subscription deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const userId = await getUserId();
    const { id } = await params;
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    const updatedSub = await Subscription.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
    
    if (!updatedSub) return NextResponse.json({ message: 'Subscription not found' }, { status: 404 });
    return NextResponse.json({ subscription: updatedSub }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}