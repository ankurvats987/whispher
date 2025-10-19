import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  logout,
  refreshToken,
  register,
  reset,
  updatePwd,
} from "../../service/authService";
import { clearUserData, setProfileData } from "../user/userSlice";
import { clearAuth } from "./authSlice";

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, thunkAPI) => {
    try {
      const response = await refreshToken();

      thunkAPI.dispatch(setProfileData(response.data.data.user));

      return response.data.data;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while refreshing access token!";

      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await logout();
    } catch (error) {
      console.warn(
        "Logout API failed (possibly due to missing/expired token). Proceeding to clean up."
      );
    }

    thunkAPI.dispatch(clearUserData());
    thunkAPI.dispatch(clearAuth());
    window.location.replace("/login");
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await login({ username, password });

      thunkAPI.dispatch(setProfileData(response.data.data.user));

      return response.data.data;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while logging in!";

      console.log("Login Failed: ", errMsg);

      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, thunkAPI) => {
    try {
      const response = await register(formData);

      // Set user profile data after successful registration
      thunkAPI.dispatch(setProfileData(response.data.data.user));

      console.log(response);
      return response.data.data;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while registration!";
      console.log("Registration Failed:", errMsg);
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "/user/reset",
  async (email, thunkAPI) => {
    try {
      await reset(email);
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while resetting the password";

      console.error("Error in reset password", errMsg);
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "/user/reset/update",
  async ({ password, token }, thunkAPI) => {
    try {
      const response = await updatePwd({ password, token });

      thunkAPI.dispatch(setProfileData(response.data.data.user));

      return response.data.data;
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong while updating the password";

      console.error("Error in update password", errMsg);
      return thunkAPI.rejectWithValue(errMsg);
    }
  }
);
