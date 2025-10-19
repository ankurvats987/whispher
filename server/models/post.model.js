import mongoose from "mongoose";
import { Likes } from "./likes.model.js";

const postSchema = new mongoose.Schema(
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
    shareCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

postSchema.virtual("likedBy");

postSchema.set("toObject", { virtuals: true });
postSchema.set("toJSON", { virtuals: true });

postSchema.statics.getUserPosts = async function (userId) {
  const posts = await this.find({ createdBy: userId });

  return posts;
};

postSchema.pre(/^find/, function (next) {
  this.populate(
    "createdBy",
    "_id username displayName profilePicture"
  ).populate({
    path: "comments",
    options: { sort: { createdAt: -1 } },
    populate: {
      path: "createdBy",
      select: "_id username displayName profilePicture",
    },
  });

  next();
});

postSchema.post(/^find/, async function (docs, next) {
  const addLikes = async (post) => {
    const likes = await Likes.find({ postLiked: post._id }).select(
      "likedBy -_id"
    );
    const likedBy = likes.map((like) => like.likedBy);
    post.likedBy = likedBy; // attach dynamically

    return post;
  };

  if (Array.isArray(docs)) {
    await Promise.all(docs.map(addLikes));
  } else if (docs) {
    await addLikes(docs);
  }

  next();
});

// postSchema.query.withMoreInfo = async function () {
//   const posts = await this.populate(
//     "createdBy",
//     "_id username displayName profilePicture"
//   )
//     .populate({
//       path: "comments",
//       options: { sort: { createdAt: -1 } },
//       populate: {
//         path: "createdBy",
//         select: "_id username displayName profilePicture",
//       },
//     })
//     .exec();

//   if (!posts) return null;

//   const process = async (post) => {
//     const likes = await Likes.find({ postLiked: post._id }).select(
//       "likedBy -_id"
//     );
//     const likedBy = likes.map((like) => like.likedBy);

//     return { ...post.toObject(), likedBy };
//   };

//   if (Array.isArray(posts)) {
//     return Promise.all(posts.map(process));
//   }

//   return process(posts);
// };

export const Post = mongoose.model("Post", postSchema);
