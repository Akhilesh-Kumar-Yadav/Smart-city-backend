import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["garbage", "road", "water", "electricity", "other"],
      required: true,
    },

    images: [
      {
        type: String, // image path or URL
      },
    ],

    location: {
      address: {
        type: String,

      },
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
      area: {
        type: String,
      },
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "rejected"],
      default: "pending",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // worker/admin
    },

    department: {
      type: String, // sanitation, electricity etc.
    },

    isDuplicate: {
      type: Boolean,
      default: false,
    },

    resolutionProof: {
      image: {
        type: String,
      },
      note: {
        type: String,
      },
    },

    rejectionReason: {
      type: String,
    },

    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// 🔥 Indexes for performance (important for scaling)
complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ "location.area": 1 });
complaintSchema.index({ priority: -1 });

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;