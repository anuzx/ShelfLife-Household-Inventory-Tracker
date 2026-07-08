import mongoose from "mongoose";

export const connectDB = async (url: string) => {

  try {
    await mongoose.connect(url)
    console.log("mongoDB connected")
  } catch (error) {
    console.error("Unable to connect to mongoDB", error)
  }
}
