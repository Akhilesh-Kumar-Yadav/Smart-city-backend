import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

// Connect DB
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// store users
let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
  });

  socket.on("disconnect", () => {
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
      }
    }
  });
});

export { io, onlineUsers };

const PORT = process.env.PORT || 5000;

// ✅ FIXED
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
