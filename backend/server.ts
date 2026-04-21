import { connectDB } from "./db/db";
import { app } from "./app";


connectDB("mongodb://localhost:27017/assignment")
  .then(() => {
    app.listen(3000, "server running at port 3000 ....")
  }).catch((err) => {
    console.log("MONGODB connection failed", err)
  })
