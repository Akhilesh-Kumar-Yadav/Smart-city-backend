import Notification from "../models/Notification.js";
import { io, onlineUsers } from "../server.js";

// 🔔 Send Notification Function
export const sendNotification = async (userId, message, type) => {
  try {
    // ✅ 1. Save in database
    const notification = await Notification.create({
      user: userId,
      message,
      type,
    });

    // ✅ 2. Send real-time (if user is online)
    const socketId = onlineUsers[userId];

    if (socketId) {
      io.to(socketId).emit("notification", notification);
    }

    return notification;

  } catch (error) {
    console.error("Notification Error:", error.message);
  }
};