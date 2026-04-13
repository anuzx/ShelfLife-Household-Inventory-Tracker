import mongoose, { Schema } from "mongoose"

const HouseholdSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: [3, "name must be atleast 3 characters long"],
    max: 30
  },
  inviteCode: {
    type: String
  },
  members: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  wasteScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, { timestamps: true })

export const Household = mongoose.model("Household", HouseholdSchema)
