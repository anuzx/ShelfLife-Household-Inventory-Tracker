import mongoose, { Schema } from "mongoose"

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: [2, "username must be atleast 2 characters long"],
    max: 30
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: [6, "password must be atleast 6 characters long"]
  },
  householdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Household"
  }

}, { timestamps: true })

export const User = mongoose.model("User", UserSchema)
