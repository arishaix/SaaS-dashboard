import mongoose, { Schema, models } from "mongoose";

const ExportHistorySchema = new Schema(
  {
    type: { type: String, required: true },
    date: { type: Date, required: true },
    format: { type: String, required: true },
    link: { type: String, required: true },
    user: { type: String },
  },
  { timestamps: true }
);

export default models.ExportHistory ||
  mongoose.model("ExportHistory", ExportHistorySchema);
