import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";


// CREATE WORKER
export const createWorker = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Worker already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create worker
    const worker = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "worker",
      isVerified: true,
    });

    //  Remove password before sending
    const { password: _, ...workerData } = worker.toObject();

    res.status(201).json({
      success: true,
      message: "Worker created successfully",
      worker: workerData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error.message",
    });
  }
};

export const deleteWorker = async (req, res) => {
  try {
    const { id } = req.params;

    //  Check if worker exists
    const worker = await User.findById(id);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    //  Prevent deleting non-worker
    if (worker.role !== "worker") {
      return res.status(400).json({
        success: false,
        message: "This user is not a worker",
      });
    }

    //  Delete worker
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Worker deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
