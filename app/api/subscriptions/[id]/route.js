import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
<<<<<<< HEAD
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
=======
import { getSessionUser } from '@/lib/auth';

// Helper to verify ownership
async function getOwnedSubscription(id, userId) {
  const sub = await Subscription.findById(id);
  if (!sub) return null;
  if (sub.userId.toString() !== userId) return null;
  return sub;
}

// GET single subscription
export async function GET(request, { params }) {
  try {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const sub = await getOwnedSubscription(params.id, session.id);
    if (!sub) return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });

    return NextResponse.json({ subscription: sub });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update subscription
export async function PUT(request, { params }) {
  try {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const sub = await getOwnedSubscription(params.id, session.id);
    if (!sub) return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });

    const body = await request.json();
    const { name, cost, billingCycle, category, nextBillingDate, externalLink, status } = body;

    if (name !== undefined) sub.name = name;
    if (cost !== undefined) sub.cost = parseFloat(cost);
    if (billingCycle !== undefined) sub.billingCycle = billingCycle;
    if (category !== undefined) sub.category = category;
    if (nextBillingDate !== undefined) sub.nextBillingDate = new Date(nextBillingDate);
    if (externalLink !== undefined) sub.externalLink = externalLink;
    if (status !== undefined) sub.status = status;

    await sub.save();
    return NextResponse.json({ subscription: sub });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE subscription
export async function DELETE(request, { params }) {
  try {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const sub = await getOwnedSubscription(params.id, session.id);
    if (!sub) return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });

    await sub.deleteOne();
    return NextResponse.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
>>>>>>> 36a897d4c084dd9b8fa6f8b63d371a9133886098
  }
}