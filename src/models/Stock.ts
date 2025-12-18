import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema(
  {
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    minAlert: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

// สร้าง compound index เพื่อหลีกเลี่ยง duplicate
stockSchema.index({ warehouseId: 1, itemId: 1 }, { unique: true });

export default mongoose.models.Stock || mongoose.model('Stock', stockSchema);
