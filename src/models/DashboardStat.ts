import mongoose, { Schema, models } from "mongoose";

const DashboardStatSchema = new Schema(
  {
    type: { type: String, required: true },
    data: { type: Array, required: true },
  },
  { timestamps: true }
);

export default models.DashboardStat ||
  mongoose.model("DashboardStat", DashboardStatSchema);
