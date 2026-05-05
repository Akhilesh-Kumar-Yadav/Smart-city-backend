import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,

  isVerified: {
    type: Boolean,
    default: false,
  },

  otp: String,
  otpExpiry: Date,

  resetOtp: String,
  resetOtpExpiry: Date,

  role: {
    type: String,
    enum: ["user", "admin", "worker"],
    default: "user",
  },
});

export default mongoose.model("User", userSchema);