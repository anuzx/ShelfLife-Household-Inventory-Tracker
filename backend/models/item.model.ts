import mongoose, { Schema } from "mongoose";

const ItemSchema = new Schema({
  householdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Household",
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["produce", "dairy", "meat", "pantry", "frozen", "other"]
  },
  quantity: {
    type: Number,
    default: 1
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["fresh", "expiring-soon", "expired", "used", "wasted"]
  }
}, { timestamps: true })


export const Item = mongoose.model("Item", ItemSchema)
