import authMiddleware from "./authMiddleware";

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    authMiddleware();
    console.log("Server: Connection Established. ");
  });
};

export default setupSocket;
