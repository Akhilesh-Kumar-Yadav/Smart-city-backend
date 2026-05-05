import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  role: String, 
});

export default mongoose.model("Worker", workerSchema);