import mongoose from "mongoose";
import { Post } from "./post.model.js";

const likesSchema = new mongoose.Schema(
  {
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postLiked: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

likesSchema.index({ likedBy: 1, postLiked: 1 }, { unique: true });

// Logic for liking the post
likesSchema.post("save", async function (doc, next) {
  try {
    const post = await Post.findById(doc.postLiked);

    if (post) {
      post.likesCount += 1;
      await post.save();
    }

    next();
  } catch (error) {
    console.error("Error updating likesCount on save:", error.message);
    next(error);
  }
});

// Logic for unliking the post
likesSchema.post("findOneAndDelete", async function (doc) {
  try {
    if (doc) {
      const post = await Post.findById(doc.postLiked);

      if (post && post.likesCount > 0) {
        post.likesCount -= 1;
        await post.save();
      }
    }
  } catch (error) {
    console.error("Error updating likesCount on delete:", error.message);
  }
});

export const Likes = mongoose.model("Likes", likesSchema);
