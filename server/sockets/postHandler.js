import { Notification } from "../models/notification.model.js";

let io = null;
let socket = null;
let userSocketMap = null;

export const setPostHandler = (ioObj, socketObj, userSocketMapObj) => {
  io = ioObj;
  socket = socketObj;
  userSocketMap = userSocketMapObj;
};

export const sendPostMentionNotification = async (post, sender, reciever) => {
  try {
    const targetSocket = userSocketMap.get(reciever._id.toString());

    const notification = await Notification.create({
      reciever: reciever._id,
      sender: sender._id,
      type: "post-mention",
      post: post._id,
      message: `@${sender.username} mentioned you in a post.`,
    });

    await notification.populate([
      { path: "reciever", select: "_id username displayName profilePicture" },
      { path: "sender", select: "_id username displayName profilePicture" },
    ]);

    if (io && targetSocket) {
      io.to(targetSocket).emit("notification", notification);
    }
  } catch (error) {
    console.error("Failed to create post mention notification:", error);
  }
};
