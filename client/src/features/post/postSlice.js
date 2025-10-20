import { createSlice } from "@reduxjs/toolkit";
import {
  createAComment,
  createAPost,
  getAllPosts,
  getAPost,
  getUserPosts,
  likeAComment,
  likeAPost,
  unlikeAComment,
  unlikeAPost,
} from "./postThunks";
import { act } from "react";

// Each post in allPosts:
/*
{
  _id: String,
  content: String,
  createdBy: {
    _id: String,
    username: String,
    displayName: String,
    profilePicture: String | null,
  },
  likesCount: Number,
  shareCount: Number,
  commentsCount: Number,
  createdAt: ISODateString,
  likedBy: [],
}
*/

// Format of currentPost:
/*
{
  _id: String,
  content: String,
  createdBy: {
    _id: String,
    displayName: String,
    username: String,
    profilePicture: String,
  },
  shareCount: Number,
  likesCount: Number,
  comments: [
    {
      _id: String,
      content: String,
      createdBy: [Object],
      likedBy: [],
      likesCount: 0,
      createdAt: ISODateString,
      updatedAt: ISODateString,
    }
  ],
  createdAt: ISODateString,
  updatedAt: ISODateString,
  likedBy: [],
}
*/

const toggleCommentLike = (state, action, isLike) => {
  const commentId = action.payload.commentId;
  const likedBy = action.payload.likedBy;
  const updatedLikesCount = action.payload.likesCount;

  if (state.currentPost) {
    const commentIndex = state.currentPost.comments.findIndex(
      (comment) => comment._id === commentId
    );

    if (commentIndex !== -1) {
      state.currentPost.comments[commentIndex].likesCount = updatedLikesCount;

      if (isLike) {
        state.currentPost.comments[commentIndex].likedBy.push(likedBy);
      } else {
        state.currentPost.comments[commentIndex].likedBy =
          state.currentPost.comments[commentIndex].likedBy.filter(
            (userId) => userId !== likedBy
          );
      }
    }
  }
};

// Handle duplicacy
const updateLikeList = (arr, userId, isLike) =>
  isLike
    ? arr.includes(userId)
      ? arr
      : [...arr, userId]
    : arr.filter((id) => id !== userId);

const togglePostLike = (state, action, isLike) => {
  const postId = action.payload.postId;
  const likedBy = action.payload.likedBy;
  const updatedLikesCount = action.payload.likesCount;

  const postIndex = state.posts.findIndex((post) => post._id === postId);

  if (postIndex !== -1) {
    const post = state.posts[postIndex];

    post.likesCount = updatedLikesCount;
    post.likedBy = updateLikeList(post.likedBy, likedBy, isLike);
  }

  if (state.currentPost && state.currentPost._id === postId) {
    state.currentPost.likesCount = updatedLikesCount;
    state.currentPost.likedBy = updateLikeList(
      state.currentPost.likedBy,
      likedBy,
      isLike
    );
  }
};

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    currentPost: null,
    loading: true,
    error: null,
    createCommentLoading: false,
    createPostLoading: false,
  },
  reducers: {
    cleanUp: (state, action) => {
      state.error = null;
      state.loading = true;

      state.createCommentLoading = false;
      state.createPostLoading = false;

      if (action.payload?.clearCurrentPost) {
        state.currentPost = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Getting the whole list of posts
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.posts = action.payload.posts;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Getting user's posts
      .addCase(getUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.posts = action.payload.posts;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Getting a single post
      .addCase(getAPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAPost.fulfilled, (state, action) => {
        state.currentPost = action.payload.post;
        state.loading = false;
        state.error = null;
      })

      .addCase(getAPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(likeAComment.fulfilled, (state, action) => {
        toggleCommentLike(state, action, true);
      })
      .addCase(unlikeAComment.fulfilled, (state, action) => {
        toggleCommentLike(state, action, false);
      })
      .addCase(likeAPost.fulfilled, (state, action) => {
        togglePostLike(state, action, true);
      })
      .addCase(unlikeAPost.fulfilled, (state, action) => {
        togglePostLike(state, action, false);
      })
      .addCase(createAComment.fulfilled, (state, action) => {
        const comment = action.payload.comment;

        if (state.currentPost) {
          state.currentPost.comments.unshift(comment);
        }

        state.createCommentLoading = false;
      })
      .addCase(createAComment.pending, (state) => {
        state.createCommentLoading = true;
      })
      .addCase(createAPost.fulfilled, (state, action) => {
        const post = action.payload;

        state.posts.unshift(post);

        state.createPostLoading = false;
      })
      .addCase(createAPost.pending, (state) => {
        state.createPostLoading = true;
      });
    builder
      .addCase(createAPost.rejected, () => {})

      .addCase(createAComment.rejected, () => {})
      .addCase(likeAPost.rejected, () => {});
  },
});

export const { cleanUp } = postSlice.actions;
export default postSlice.reducer;
