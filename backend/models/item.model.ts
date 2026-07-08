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
    enum: ["fresh", "expiringSoon", "expired", "used", "wasted"]
  }
}, { timestamps: true })

ItemSchema.pre("save", function() {
  // Don't overwrite a manually set terminal status
  if (this.status === "used" || this.status === "wasted") {
    return
  }

  const now = new Date()
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

  if (this.expiryDate <= now) {
    this.status = "expired"
  } else if (this.expiryDate <= threeDaysFromNow) {
    this.status = "expiringSoon"
  } else {
    this.status = "fresh"
  }


})
export const Item = mongoose.model("Item", ItemSchema)
