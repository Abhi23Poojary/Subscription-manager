import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Subscription name is required'],
      trim: true,
    },
    cost: {
      type: Number,
      required: [true, 'Cost is required'],
      min: [0, 'Cost cannot be negative'],
    },
    billingCycle: {
      type: String,
<<<<<<< HEAD
      enum: ['weekly', 'monthly', 'yearly'],
=======
      enum: ['monthly', 'yearly'],
>>>>>>> 36a897d4c084dd9b8fa6f8b63d371a9133886098
      default: 'monthly',
    },
    category: {
      type: String,
      enum: ['Entertainment', 'Productivity', 'Health', 'Education', 'Finance', 'Shopping', 'Other'],
      default: 'Other',
    },
    nextBillingDate: {
      type: Date,
      required: [true, 'Next billing date is required'],
    },
    externalLink: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'paused'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);