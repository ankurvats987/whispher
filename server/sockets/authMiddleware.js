import jwt from "jsonwebtoken";

export default function authMiddleware(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));

      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (!user) return next(new Error("Invalid or expired token"));

      socket.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return next(new Error("Token Expired"));
      } else {
        return next(new Error("Invalid token"));
      }
    }
  });
}
