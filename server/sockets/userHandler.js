import { Notification } from "../models/notification.model.js";

let io = null;
let socket = null;
let userSocketMap = null;

export const setUserHandler = (ioObj, socketObj, userSocketMapObj) => {
  io = ioObj;
  socket = socketObj;
  userSocketMap = userSocketMapObj;
};

export const sendFollowNotification = async (sender, reciever) => {
  try {
    const targetSocket = userSocketMap.get(reciever._id.toString());

    const notification = await Notification.create({
      reciever: reciever._id,
      sender: sender._id,
      type: "follow",
      message: `@${sender.username} started following you.`,
    });

    await notification.populate([
      { path: "reciever", select: "_id username displayName profilePicture" },
      { path: "sender", select: "_id username displayName profilePicture" },
    ]);

    if (io && targetSocket) {
      io.to(targetSocket).emit("notification", notification);
    }
  } catch (error) {
    console.error("Failed to create follow notification:", error);
  }
};
