import User from "../models/User.js";

// Get all workers
export const getWorkers = async (req, res) => {
  try {
    const workers = await User.find({ role: "worker" })
      .select("-password"); // hide password

    res.status(200).json({
      success: true,
      count: workers.length,
      workers,
    });

  } catch (error) {
    console.log("Get Workers Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch workers",
    });
  }
};