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
      enum: ['piece', 'box', 'pack', 'kg', 'liter', 'กิโลกรัม', 'แพ็ค', 'กล่อง', 'ชิ้น', 'ผืน', 'ขวด', 'หลอด', 'อัน', 'ห่อ', 'ม้วน', 'ก้อน', 'กระป๋อง'],
      default: 'piece',
    },
    description: String,
  },
  { timestamps: true }
);

export default mongoose.models.Item || mongoose.model('Item', itemSchema);
