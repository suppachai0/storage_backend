import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    unit: {
      type: String,
      enum: ['piece', 'box', 'pack', 'kg', 'liter'],
      default: 'piece',
    },
    description: String,
  },
  { timestamps: true }
);

export default mongoose.models.Item || mongoose.model('Item', itemSchema);
