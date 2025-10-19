import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

commentSchema.statics.getComment = async function (commentId) {
  try {
    return await Comment.findById(commentId).populate(
      "createdBy",
      "displayName username profilePicture"
    );
  } catch (error) {
    console.error("Failed to retrieve the comment:", error?.message);
    return null;
  }
};

commentSchema.methods.like = async function (userId) {
  if (!this.likedBy.includes(userId)) {
    this.likesCount += 1;
    this.likedBy.push(userId);
    await this.save();
  } else {
    throw new Error("User already liked this comment!");
  }
};

commentSchema.methods.unlike = async function (userId) {
  if (this.likedBy.includes(userId)) {
    if (this.likesCount > 0) {
      this.likesCount -= 1;
      this.likedBy.pull(userId);
      await this.save();
    }
  } else {
    throw Error("User never liked this comment!");
  }
};

export const Comment = mongoose.model("Comment", commentSchema);
