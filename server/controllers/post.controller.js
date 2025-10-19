import { Comment } from "../models/comment.model.js";
import { Follows } from "../models/follows.model.js";
import { Likes } from "../models/likes.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
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

    const postsOfFollowing = (
      await Promise.all(
        followed.map(async (user) => {
          const post = await Post.find({ createdBy: user._id });

          return post;
        })
      )
    ).flat();

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
    const newPost = await Post.create({ content, createdBy });
    // const post = await Post.findById(newPost._id).withMoreInfo();

    const post = await Post.findById(newPost._id);

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
    return APIResponse.error("Invalid post or user data", null, 404).send(res);
  }

  try {
    await Likes.create({ likedBy, postLiked });

    const post = await Post.findById(postLiked);

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

    const comment = await Comment.getComment(commentId);

    if (!comment) {
      return APIResponse.error("Comment not found", null, 404).send(res);
    }

    await comment.like(likedBy);

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
};
