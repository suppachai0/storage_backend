import mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    managerName: String,
    phone: String,
  },
  { timestamps: true }
);

export default mongoose.models.Warehouse ||
  mongoose.model('Warehouse', warehouseSchema);
