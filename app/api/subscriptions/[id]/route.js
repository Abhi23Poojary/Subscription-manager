import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
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
  }
}