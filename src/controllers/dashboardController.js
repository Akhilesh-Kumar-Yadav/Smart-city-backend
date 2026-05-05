import Complaint from "../models/Complaint.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Total counts
    const total = await Complaint.countDocuments();

    const pending = await Complaint.countDocuments({ status: "pending" });
    const inProgress = await Complaint.countDocuments({ status: "in-progress" });
    const resolved = await Complaint.countDocuments({ status: "resolved" });

    // Priority stats
    const priorityStats = await Complaint.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    // 🗂 Category stats
    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    // 📍 Area stats (optional but powerful)
    const areaStats = await Complaint.aggregate([
      {
        $group: {
          _id: "$location.area",
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent complaints
    const recentComplaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name");

    res.json({
      total,
      status: {
        pending,
        inProgress,
        resolved,
      },
      priorityStats,
      categoryStats,
      areaStats,
      recentComplaints,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};