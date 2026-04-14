import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import { getSessionUser } from '@/lib/auth';

// GET all subscriptions for logged-in user
export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const subscriptions = await Subscription.find({ userId: session.id }).sort({ nextBillingDate: 1 });

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('GET /api/subscriptions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create a new subscription
export async function POST(request) {
  try {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await request.json();
    const { name, cost, billingCycle, category, nextBillingDate, externalLink } = body;

    if (!name || cost === undefined || !nextBillingDate) {
      return NextResponse.json({ error: 'name, cost, and nextBillingDate are required' }, { status: 400 });
    }

    const subscription = await Subscription.create({
      userId: session.id,
      name,
      cost: parseFloat(cost),
      billingCycle: billingCycle || 'monthly',
      category: category || 'Other',
      nextBillingDate: new Date(nextBillingDate),
      externalLink: externalLink || '',
    });

    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error) {
    console.error('POST /api/subscriptions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}