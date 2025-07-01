import mongoose, { Schema, models } from "mongoose";

const ReportSchema = new Schema(
  {
    name: { type: String, required: true },
    date: { type: String, required: true },
    activity: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Report || mongoose.model("Report", ReportSchema);
