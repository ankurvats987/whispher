import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { authenticate } from "./middlewares/authenticate.middleware.js";
import postRouter from "./routes/post.route.js";
import userRouter from "./routes/user.route.js";
import http from "http";
import setupSocket from "./sockets/index.js";
import { Server } from "socket.io";

dotenv.config({
  path: "./.env",
});

const app = express();

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
  "https://whisper-microblog.netlify.app",
  "https://whispher-microblog.onrender.com",
];

// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN || "http://localhost:5173",
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_, res) => {
  res.status(200).json({
    status: "ok",
    message: "You pinged the server!",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", authenticate, postRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

setupSocket(io);

export { server };
