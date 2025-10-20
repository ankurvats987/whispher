import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createComment,
  createPost,
  getFollowedPosts,
  getPost,
  getPosts,
  likeComment,
  likePost,
  search,
  unlikeComment,
  unlikePost,
} from "../../service/postService";

export const getAllPosts = createAsyncThunk("post/all", async (_, thunkAPI) => {
  try {
    const response = await getPosts();

    return response.data.data;
  } catch (error) {
    const errMsg =
      error?.response?.data?.message ||
      "Something went wrong while fetching posts";

    console.error("Error in fetching posts:", errMsg);
    return thunkAPI.rejectWithValue(errMsg);
  }
});

export const getUserPosts = createAsyncThunk(
  "post/username",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const username = state.user.user.username;

      const response = await getFollowedPosts(username);

      return response.data.data;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while fetching user posts";

      console.error("Error in fetching user posts:", errMsg);
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);

export const getAPost = createAsyncThunk(
  "post/postId",
  async (postId, thunkAPI) => {
    try {
      const response = await getPost(postId);

      return response.data.data;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while fetching the post";

      console.error("Error in fetching the post:", errMsg);
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);

export const createAPost = createAsyncThunk(
  "post/create",
  async (content, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const user = state.user.user;

      if (!user?.id) {
        throw new Error("User ID not found in state");
      }

      const response = await createPost({ content, createdBy: user.id });

      return response.data.data;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while creating the post";

      console.error("Error in creating the post:", errMsg);
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);

export const createAComment = createAsyncThunk(
  "post/postId/comment",
  async ({ postId, comment }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const user = state.user.user;

      const response = await createComment(postId, {
        content: comment,
        createdBy: user.id,
      });

      return response.data.data;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while creating the comment";

      console.error("Error in creating the comment:", errMsg);
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);

export const likeAComment = createAsyncThunk(
  "post/comment/commentId/like",
  async (commentId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const user = state.user.user;

      const response = await likeComment(commentId, user.id);

      return response.data.data;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while liking the comment";

      console.error("Error in liking the comment:", errMsg);
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);

export const unlikeAComment = createAsyncThunk(
  "post/comment/commentId/unlike",
  async (commentId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const user = state.user.user;

      const response = await unlikeComment(commentId, user.id);

      return response.data.data;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while unliking the comment";

      console.error("Error in unliking the comment:", errMsg);
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);

export const likeAPost = createAsyncThunk(
  "post/postId/like",
  async (postId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const user = state.user.user;

      const response = await likePost(postId, user.id);

      return response.data.data;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while liking the post";

      console.error("Error in liking the post", errMsg);
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);

export const unlikeAPost = createAsyncThunk(
  "post/postId/unlike",
  async (postId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const user = state.user.user;

      const response = await unlikePost(postId, user.id);

      return response.data.data;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while unliking the post";

      console.error("Error in unliking the post", errMsg);
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);

export const searchPost = createAsyncThunk(
  "post/search/key",
  async (key, thunkAPI) => {
    try {
      const response = await search(key);

      return response.data.data;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while searching the posts";

      console.error("Error in searching the posts", errMsg);
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);
