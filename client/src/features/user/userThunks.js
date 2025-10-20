import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  follow,
  getFollowers,
  getFollowing,
  getUser,
  search,
  unfollow,
  updateProfile,
} from "../../service/userService";
import { setProfileData } from "./userSlice";

export const getUserData = createAsyncThunk(
  "/user/username/profile",
  async (username, thunkAPI) => {
    try {
      const response = await getUser(username);

      return response.data.data;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while fetching user data";

      console.error("Error in fetching user data:", errMsg);
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);

export const getUserFollowers = createAsyncThunk(
  "/user/username/followers",
  async (username, thunkAPI) => {
    try {
      const response = await getFollowers(username);

      return response.data.data;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while fetching all the followers";

      console.error("Error in fetching the followers", errMsg);
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);

export const getUserFollowing = createAsyncThunk(
  "/user/username/following",
  async (username, thunkAPI) => {
    try {
      const response = await getFollowing(username);

      return response.data.data;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while fetching all the following";

      console.error("Error in fetching the following", errMsg);
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);

export const followUser = createAsyncThunk(
  "/user/username/follow",
  async (user, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const follower = state.user.user.username;

      await follow(user.username, follower);

      console.log("Followed successfully!");

      return user;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while following";

      console.error("Error in following", errMsg);
      return thunkAPI.rejectWithValue({
        username: user.username,
        message: errMsg,
      });
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "/user/username/unfollow",
  async (user, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const unfollower = state.user.user.username;

      await unfollow(user.username, unfollower);

      console.log("Unfollowed successfully!");

      return user.username;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while unfollowing";

      console.error("Error in unfollowing", errMsg);
      return thunkAPI.rejectWithValue({
        username: user.username,
        message: errMsg,
      });
    }
  }
);

export const update = createAsyncThunk(
  "/user/username/profile/update",
  async (formData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const username = state.user.user.username;

      const response = await updateProfile(username, formData);

      console.log("Profile updated successfully!");

      return response.data.data;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while updating the profile";

      console.error("Error in updating profile", errMsg);
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);

export const searchUser = createAsyncThunk(
  "/user/search",
  async (key, thunkAPI) => {
    try {
      const response = await search(key);

      return response.data.data;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while searching";

      console.error("Error in search user", errMsg);
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);
