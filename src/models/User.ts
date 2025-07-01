import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["admin", "manager", "staff"],
      default: "staff",
    },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
