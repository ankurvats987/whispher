import jwt from "jsonwebtoken";

export default function authMiddleware(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));

    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!user) return next(new Error("Invalid or expired token"));

    socket.user = user;
    next();
  });
}
