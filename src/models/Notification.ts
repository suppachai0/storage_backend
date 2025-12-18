import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['shelter_nearly_full', 'item_low_stock', 'request_approved', 'request_rejected'],
      required: true,
    },
    title: String,
    message: {
      type: String,
      required: true,
    },
    relatedId: mongoose.Schema.Types.ObjectId,
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model('Notification', notificationSchema);
