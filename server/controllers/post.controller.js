import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Follows } from "../models/follows.model.js";
import { Likes } from "../models/likes.model.js";
import { Notification } from "../models/notification.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import {
  sendCommentLikeNotification,
  sendCommentMentionNotification,
  sendCommentNotification,
} from "../sockets/commentHandler.js";
import {
  sendPostLikeNotification,
  sendPostMentionNotification,
} from "../sockets/postHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary_uploader.js";
import { APIResponse } from "../utils/res_handler.js";

const getAllPost = async (_, res) => {
  try {
    // const posts = await Post.find().sort({ createdAt: -1 }).withMoreInfo();

    const posts = await Post.find().sort({ createdAt: -1 });

    return APIResponse.success(
      "Posts retrieved successfully!",
      { posts },
      200
    ).send(res);
  } catch (error) {
    console.error("errorfsfsfs");
    return APIResponse.error("Failed to retrieve posts.").send(res);
  }
};

const getPost = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!postId) {
      return APIResponse.error("Post Id is required!", null, 404).send(res);
    }

    // const post = await Post.findById(postId).withMoreInfo();

    const post = await Post.findById(postId);

    if (!post) {
      return APIResponse.error("Post is not found!", null, 404).send(res);
    }

    return APIResponse.success(
      "Successfully retrieved the post!",
      { post },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error(
      error?.message || "Failed to retreive the post"
    ).send(res);
  }
};

const getFollowedPosts = async (req, res) => {
  try {
    const username = req.params.username;

    if (!username || !username.trim())
      return APIResponse.error("Username is missing", null, 404).send(res);

    const user = await User.findOne({ username });
    if (!user) return APIResponse.error("User not found", null, 404).send(res);

    const followed = await Follows.getFollowing(user._id);

    const userIds = followed.map((user) => user._id);

    const postsOfFollowing = await Post.find({
      createdBy: { $in: userIds },
    }).sort({ createdAt: -1 });

    return APIResponse.success(
      "Followed Users",
      { posts: postsOfFollowing },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error("Something went wrong", null, 400).send(res);
  }
};

const createPost = async (req, res) => {
  const { content, createdBy } = req.body;

  if (!content?.trim() || !createdBy) {
    return APIResponse.error(
      "Content and User Id are required!",
      null,
      404
    ).send(res);
  }

  try {
    const images = req.files || [];
    let urls = [];

    if (images.length > 0) {
      urls = (
        await Promise.all(
          images.map(async (image) => {
            const filePath = image.path;

            if (filePath) {
              const imageObj = await uploadOnCloudinary(filePath);
              return imageObj?.url || null;
            }
          })
        )
      ).filter(Boolean);
    }
    const newPost = await Post.create({ content, createdBy, images: urls });

    const post = await Post.findById(newPost._id);

    const parts = content.split(/(@\w+)/g);

    await Promise.all(
      parts.map(async (part) => {
        if (part.startsWith("@")) {
          const username = part.substring(1);
          const user = await User.findOne({ username });

          sendPostMentionNotification(post, post.createdBy, user);
        }
      })
    );

    return APIResponse.success("Post created successfully!", post, 200).send(
      res
    );
  } catch (error) {
    return APIResponse.error(error?.message || "Failed to create post").send(
      res
    );
  }
};

const likePost = async (req, res) => {
  const { likedBy } = req.body;
  const postLiked = req.params.id;

  if (!likedBy || !postLiked) {
    return APIResponse.error("Invalid post or user data", null, 400).send(res);
  }

  try {
    const likedByUser = await User.findById(likedBy);

    if (!likedByUser) {
      return APIResponse.error("User not found", null, 400).send(res);
    }

    await Likes.create({ likedBy, postLiked });

    const post = await Post.findById(postLiked);

    if (!likedByUser._id.equals(post.createdBy._id)) {
      sendPostLikeNotification(post, likedByUser, post.createdBy);
    }

    return APIResponse.success(
      "Post liked successfully!",
      { postId: postLiked, likedBy, likesCount: post.likesCount },
      200
    ).send(res);
  } catch (err) {
    if (err.code === 11000) {
      return APIResponse.error(
        "Post already liked by this user",
        null,
        409
      ).send(res);
    }
    return APIResponse.error(err?.message || "Failed to like post").send(res);
  }
};

const unlikePost = async (req, res) => {
  const { likedBy } = req.body;
  const postLiked = req.params.id;

  if (!likedBy || !postLiked) {
    return APIResponse.error("Invalid post or user data", null, 404).send(res);
  }

  try {
    const like = await Likes.findOneAndDelete({ likedBy, postLiked });
    if (!like) {
      return APIResponse.error("Like not found", null, 404).send(res);
    }

    const post = await Post.findById(postLiked);

    const notfOptions = {
      sender: new mongoose.Types.ObjectId(likedBy),
      type: "like-post",
      post: post._id,
    };

    const notf = await Notification.findOne(notfOptions);
    if (notf) {
      await Notification.findOneAndDelete(notfOptions);
    }

    return APIResponse.success(
      "Post unliked successfully!",
      { postId: postLiked, likedBy, likesCount: post.likesCount },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error(error?.message || "Failed to unlike post").send(
      res
    );
  }
};

const createComment = async (req, res) => {
  try {
    const { content, createdBy } = req.body;
    const postId = req.params.id;

    if (!content || !content.trim() || !createdBy || !postId) {
      return APIResponse.error("Comment data required!", null, 400).send(res);
    }

    const comment = await Comment.create({ content, createdBy });
    await comment.populate(
      "createdBy",
      "_id username displayName profilePicture"
    );

    const post = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: comment._id } },
      { new: true }
    );

    if (!post) {
      return APIResponse.error("Post not found", null, 404).send(res);
    }

    if (!post.createdBy._id.equals(comment.createdBy._id))
      sendCommentNotification(comment.createdBy, post, comment);

    const parts = content.split(/(@\w+)/g);

    await Promise.all(
      parts.map(async (part) => {
        if (part.startsWith("@")) {
          const username = part.substring(1);
          const user = await User.findOne({ username });

          if (!comment.createdBy._id.equals(user._id)) {
            sendCommentMentionNotification(
              post,
              comment.createdBy,
              user,
              comment
            );
          }
        }
      })
    );

    return APIResponse.success(
      "Comment successfully created!",
      { comment },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error(
      error?.message || "Failed to create comment under the post"
    ).send(res);
  }
};

const likeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { likedBy } = req.body;

    if (!commentId || !likedBy) {
      return APIResponse.error("Comment data is required!", null, 404).send(
        res
      );
    }

    const likedByUser = await User.findById(likedBy);

    if (!likedByUser) {
      return APIResponse.error("User not found", null, 400).send(res);
    }

    const comment = await Comment.getComment(commentId);

    if (!comment) {
      return APIResponse.error("Comment not found", null, 404).send(res);
    }

    await comment.like(likedBy);

    const parentPost = await Post.findOne({ comments: comment._id });

    if (!likedByUser._id.equals(comment.createdBy._id)) {
      sendCommentLikeNotification(
        parentPost,
        likedByUser,
        comment.createdBy,
        comment
      );
    }

    return APIResponse.success(
      "Comment liked successfully!",
      { commentId, likedBy, likesCount: comment.likesCount },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error(
      error?.message || "Failed to like the comment"
    ).send(res);
  }
};

const unlikeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { likedBy } = req.body;

    if (!commentId || !likedBy) {
      return APIResponse.error("Comment data is required!", null, 404).send(
        res
      );
    }

    const comment = await Comment.getComment(commentId);

    if (!comment) {
      return APIResponse.error("Comment not found", null, 404).send(res);
    }

    await comment.unlike(likedBy);

    const notfOptions = {
      sender: new mongoose.Types.ObjectId(likedBy),
      type: "like-comment",
      comment: comment._id,
    };

    const notf = await Notification.findOne(notfOptions);
    if (notf) {
      await Notification.findOneAndDelete(notfOptions);
    }

    return APIResponse.success(
      "Comment unliked successfully!",
      { commentId, likedBy, likesCount: comment.likesCount },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error(
      error?.message || "Failed to unlike the comment"
    ).send(res);
  }
};

const searchPost = async (req, res) => {
  try {
    const key = req.params.key || "";

    const posts = await Post.find().sort({ createdAt: -1 }).lean();

    let searchedPosts = [];

    posts.forEach((post) => {
      if (post.content.includes(key)) {
        searchedPosts.push(post);
      }
    });

    return APIResponse.success(
      "Posts retrieved",
      { posts: searchedPosts },
      200
    ).send(res);
  } catch (error) {
    console.error("Search post error:", error);
    return APIResponse.error("Search post error", error, 500).send(res);
  }
};

const deletePost = async (req, res) => {
  const postId = req.params.id || "";

  if (!postId) return APIResponse.error("PostId is empty", null, 400).send(res);

  try {
    const post = await Post.findById(postId);

    if (!post) return APIResponse.error("Post not found", null, 400).send(res);

    // Clear Notifications related to that post
    const notf = await Notification.find({ post: post._id });
    if (notf.length > 0) {
      await Notification.deleteMany({ post: post._id });
    }

    // Delete all comments under that post
    if (post.comments?.length > 0) {
      await Comment.deleteMany({ _id: { $in: post.comments } });
    }

    // Finallly, delete the post
    await Post.findByIdAndDelete(post._id);

    return APIResponse.success(
      "Post deleted succcessfully",
      { postId: post._id },
      200
    ).send(res);
  } catch (error) {
    console.error("Delete post error:", error);
    return APIResponse.error("Delete post error:", error, 500).send(res);
  }
};

const deleteComment = async (req, res) => {
  const commentId = req.params.id || "";

  if (!commentId) {
    return APIResponse.error("CommentId is empty!", null, 400).send(res);
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return APIResponse.error("Comment not found", null, 400).send(res);
    }

    // Delete notifications related to that comment
    const notf = await Notification.find({ comment: comment._id });
    if (notf.length > 0) {
      await Notification.deleteMany({ comment: comment._id });
    }

    // Delete comment reference from it's parent post
    const parentPost = await Post.findOne({ comments: comment._id });
    await Post.updateOne(
      { _id: parentPost._id },
      { $pull: { comments: comment._id } }
    );

    // Finally, delete comment
    await Comment.findByIdAndDelete(comment._id);

    return APIResponse.success(
      "Comment deleted succcessfully",
      { postId: parentPost._id, commentId: comment._id },
      200
    ).send(res);
  } catch (error) {
    console.error("Delete comment error:", error);
    return APIResponse.error("Delete comment error:", error, 500).send(res);
  }
};

export {
  createComment,
  createPost,
  getAllPost,
  getPost,
  getFollowedPosts,
  likeComment,
  likePost,
  unlikeComment,
  unlikePost,
  searchPost,
  deletePost,
  deleteComment,
};
