import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import { sendNotification } from "../services/notificationService.js";

export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, address, lat, lng } = req.body;

    const image = req.file ? req.file.path : null;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      images: image ? [image] : [],
      location: {
        address,
        lat,
        lng,
      },
      user: req.user._id,
    });

    res.status(201).json(complaint);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      priority,
      search,
      area,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    // 🔎 Build filter object
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (area) filter["location.area"] = area;

    // Search (title + description)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // 👤 Role-based filtering
    if (req.user.role === "user") {
      filter.user = req.user._id;
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sort] = order === "asc" ? 1 : -1;

    //  Pagination
    const skip = (page - 1) * limit;

    const complaints = await Complaint.find(filter)
      .populate("user", "name email")
      .populate("assignedTo", "name")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Complaint.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      count: complaints.length,
      data: complaints,
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignComplaint = async (req, res) => {
  try {
    const { complaintId, workerId } = req.body;

    //  Validate input
    if (!complaintId || !workerId) {
      return res.status(400).json({
        message: "Complaint ID and Worker ID are required",
      });
    }

    //  Check complaint exists
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    //  Prevent assigning resolved/rejected complaints
    if (["resolved", "rejected"].includes(complaint.status)) {
      return res.status(400).json({
        message: "Cannot assign completed complaint",
      });
    }

    //  Already assigned check
    if (complaint.assignedTo) {
      return res.status(400).json({
        message: "Complaint already assigned",
      });
    }

    //  Check worker exists
    const worker = await User.findById(workerId);

    if (!worker || worker.role !== "worker") {
      return res.status(400).json({ message: "Invalid worker" });
    }

    //  Assign complaint
    complaint.assignedTo = workerId;
    complaint.status = "in-progress";

    await complaint.save();

    //  Send notification to worker
    await sendNotification(
      workerId,
      `New complaint assigned: ${complaint.title}`,
      "assign"
    );

    res.json({
      message: "Complaint assigned successfully",
      complaint,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId, status, note, reason } = req.body;

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Not found" });
    }

    // Only assigned worker
    if (complaint.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    //  Update status
    complaint.status = status;

    if (status === "resolved") {
      complaint.resolutionProof = {
        image: req.file?.path,
        note,
      };

      complaint.rejectionReason = undefined;
      complaint.resolvedAt = new Date();
    }

    if (status === "rejected") {
      complaint.rejectionReason = reason;

      complaint.resolutionProof = undefined;
      complaint.resolvedAt = null;
    }

    if (status === "in-progress") {
      complaint.resolutionProof = undefined;
      complaint.rejectionReason = undefined;
    }

    await complaint.save();

    res.json({ message: "Updated", complaint });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};