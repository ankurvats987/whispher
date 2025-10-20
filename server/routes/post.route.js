import express from "express";

const postRouter = express.Router();

import {
  createPost,
  getPost,
  likePost,
  unlikePost,
  createComment,
  likeComment,
  unlikeComment,
  getAllPost,
  getFollowedPosts,
  searchPost,
} from "../controllers/post.controller.js";

postRouter.post("/create", createPost);
postRouter.get("/all", getAllPost);
postRouter.get("/:id", getPost);
postRouter.get("/search/:key", searchPost);

postRouter.get("/user/:username", getFollowedPosts);
postRouter.post("/:id/like", likePost);
postRouter.post("/:id/unlike", unlikePost);

postRouter.post("/:id/comment", createComment);
postRouter.post("/comment/:id/like", likeComment);
postRouter.post("/comment/:id/unlike", unlikeComment);

export default postRouter;
