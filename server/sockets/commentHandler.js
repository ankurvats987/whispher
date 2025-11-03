import { Notification } from "../models/notification.model.js";

let io = null;
let socket = null;
let userSocketMap = null;

export const setCommentHandler = (ioObj, socketObj, userSocketMapObj) => {
  io = ioObj;
  socket = socketObj;
  userSocketMap = userSocketMapObj;
};

export const sendCommentNotification = async (user, post, comment) => {
  try {
    const targetUserId = post.createdBy._id;
    const targetSocket = userSocketMap.get(targetUserId.toString());

    const notification = await Notification.create({
      reciever: targetUserId,
      sender: user,
      type: "comment",
      post: post._id,
      comment: comment._id,
      message: `@${user.username} commented under your post.`,
    });

    await notification.populate([
      { path: "reciever", select: "_id username displayName profilePicture" },
      { path: "sender", select: "_id username displayName profilePicture" },
    ]);

    if (io && targetSocket) {
      io.to(targetSocket).emit("notification", notification);
    }
  } catch (error) {
    console.error("Failed to create comment notification:", error);
  }
};

export const sendCommentMentionNotification = async (
  post,
  sender,
  reciever,
  comment
) => {
  try {
    const targetSocket = userSocketMap.get(reciever._id.toString());

    const notification = await Notification.create({
      reciever: reciever._id,
      sender: sender._id,
      type: "comment-mention",
      post: post._id,
      comment: comment._id,
      message: `@${sender.username} mentioned you in a comment.`,
    });

    await notification.populate([
      { path: "reciever", select: "_id username displayName profilePicture" },
      { path: "sender", select: "_id username displayName profilePicture" },
    ]);

    if (io && targetSocket) {
      io.to(targetSocket).emit("notification", notification);
    }
  } catch (error) {
    console.error("Failed to create comment mention notification:", error);
  }
};

export const sendCommentLikeNotification = async (
  post,
  sender,
  reciever,
  comment
) => {
  try {
    const targetSocket = userSocketMap.get(reciever._id.toString());

    const notification = await Notification.create({
      reciever: reciever._id,
      sender: sender._id,
      type: "like-comment",
      post: post._id,
      comment: comment._id,
      message: `@${sender.username} liked your comment.`,
    });

    await notification.populate([
      { path: "reciever", select: "_id username displayName profilePicture" },
      { path: "sender", select: "_id username displayName profilePicture" },
    ]);

    if (io && targetSocket) {
      io.to(targetSocket).emit("notification", notification);
    }
  } catch (error) {
    console.error("Failed to create comment like notification:", error);
  }
};
