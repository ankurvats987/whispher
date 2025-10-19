import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import { authenticate } from "./middlewares/authenticate.middleware.js";
import postRouter from "./routes/post.route.js";
import { Follows } from "./models/follows.model.js";
import { upload } from "./middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "./utils/cloudinary_uploader.js";
import { User } from "./models/user.model.js";
import { getFollowedPosts } from "./controllers/post.controller.js";

dotenv.config({
  path: "./.env",
});

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", authenticate, postRouter);
// app.get("/followed-posts", getFollowedPosts);

export { app };
