import authMiddleware from "./authMiddleware.js";
import { setCommentHandler } from "./commentHandler.js";
import { setPostHandler } from "./postHandler.js";

export const userSocketMap = new Map();

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    authMiddleware(io);
    console.log("Server: Connection Established. ");

    socket.on("register", (userId) => {
      userSocketMap.set(userId, socket.id);
    });

    setCommentHandler(io, socket, userSocketMap);
    setPostHandler(io, socket, userSocketMap);

    socket.on("disconnect", () => {
      console.log("Server. User disconnected: ", socket.id);

      for (const [userId, id] of userSocketMap.entries()) {
        if (id === socket.id) userSocketMap.delete(userId);
      }
    });
  });
};

export default setupSocket;
