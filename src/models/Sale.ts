import mongoose, { Schema, models } from "mongoose";

const SaleSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Sale || mongoose.model("Sale", SaleSchema);
