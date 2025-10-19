import express from "express";
import {
  createUser,
  follow,
  getFollowers,
  getFollowing,
  getUserData,
  loginUser,
  logoutUser,
  refreshToken,
  resetPassword,
  unfollow,
  updatePassword,
  updateProfile,
  verifyResetToken,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { checkAuthenticated } from "../middlewares/checkAuthenticated.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
checkAuthenticated;

const userRouter = express.Router();

userRouter.route("/register").post(upload.single("avatar"), createUser);
userRouter.route("/login").post(checkAuthenticated, loginUser);
userRouter.route("/logout").post(logoutUser);
userRouter.route("/refresh").post(refreshToken);

userRouter.route("/:username/profile").get(authenticate, getUserData);
userRouter.route("/:username/followers").get(authenticate, getFollowers);
userRouter.route("/:username/following").get(authenticate, getFollowing);
userRouter.route("/:username/follow").post(authenticate, follow);
userRouter.route("/:username/unfollow").post(authenticate, unfollow);
userRouter
  .route("/:username/profile/update")
  .patch(authenticate, upload.single("avatar"), updateProfile);

userRouter.route("/reset").post(resetPassword);
userRouter.route("/reset/verify").post(verifyResetToken);
userRouter.route("/reset/update").post(updatePassword);

export default userRouter;
