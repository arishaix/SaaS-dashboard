import mongoose, { Schema, models } from "mongoose";

const StatsSchema = new Schema({
  date: { type: Date, required: true },
  sales: { type: Number, required: true },
  users: { type: Number, required: true },
  revenue: { type: Number, required: true },
});

export default models.Stats || mongoose.model("Stats", StatsSchema);
