import dotenv from "dotenv";
import mongoose from "mongoose";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";

dotenv.config({ path: "../.env" });

const removeComments = async (postId, commentId) => {
  try {
    const posts = await Post.findById(postId).lean();

    if (!posts) {
      console.error("Post does not exist.");
      return;
    }

    await Promise.all(
      posts.comments.map(async (comment) => {
        console.log(
          `Deleting commentId: ${comment._id} text: ${comment.content}`
        );

        await Comment.findByIdAndDelete(comment._id);

        await Post.findByIdAndUpdate(
          postId,
          { $pull: { comments: comment._id } },
          { new: true }
        );

        console.log("Comment Deleted successfully");
      })
    );

    console.log("Comments removed successfully");
  } catch (error) {
    console.error("Error removing comments.", error?.message);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

await mongoose
  .connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
  .then(() => {
    console.log("Connected to MongoDB");
    removeComments("6901f4e9767a6dedc145b040", "6901f572767a6dedc145b07");
  })
  .catch((err) => {
    console.error("Connection to MongoDB failed.", err?.message);
  });
