import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    reciever: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "like",
        "comment",
        "follow",
        "post-mention",
        "comment-mention",
        "follow",
      ],
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: false,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.statics.getNotification = async function (userId) {
  try {
    const notificaiton = await Notification.find({ reciever: userId })
      .populate([
        { path: "reciever", select: "_id username displayName profilePicture" },
        { path: "sender", select: "_id username displayName profilePicture" },
      ])
      .sort({ createdAt: -1 })
      .limit(10);

    return notificaiton;
  } catch (error) {
    console.error("Get Notification Error:", error);
    return null;
  }
};

export const Notification = mongoose.model("Notification", notificationSchema);
