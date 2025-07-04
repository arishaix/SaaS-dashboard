import mongoose, { Schema, models } from "mongoose";

const RevenueSchema = new Schema(
  {
    amount: { type: Number, required: true },
    source: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Revenue || mongoose.model("Revenue", RevenueSchema);
