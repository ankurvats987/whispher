import { createSlice, current } from "@reduxjs/toolkit";
import {
  followUser,
  getUserData,
  getUserFollowers,
  getUserFollowing,
  searchUser,
  unfollowUser,
  update,
} from "./userThunks";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      id: null,
      email: "",
      username: "",
      displayName: "",
      profilePicture: null,
      description: "",
      followers: [],
      following: [],
      posts: [],
      createdAt: "",
      updatedAt: "",
      followersCount: 0,
      followingCount: 0,
    },
    currentUserData: null,
    loading: {
      profile: true,
      followers: true,
      following: true,
      update: false,
      toggleFollow: false,
      searching: true,
    },
    error: {
      profile: null,
      followers: null,
      following: null,
      update: null,
      searching: null,
    },
    searchedUser: [],
  },
  reducers: {
    setProfileData: (state, action) => {
      const userData = action.payload;

      state.user = {
        id: userData._id,
        email: userData.email,
        username: userData.username,
        profilePicture: userData.profilePicture,
        displayName: userData.displayName,
        description: userData.description,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        followers: userData.followers || [],
        following: userData.following || [],
        posts: userData.post || userData.posts || [],
        followersCount: userData.followersCount,
        followingCount: userData.followingCount,
      };
    },
    clearUserData: (state) => {
      state.user = {};
    },
    reset: (state) => {
      state.loading = Object.fromEntries(
        Object.keys(state.loading).map((k) => {
          if (k === "update" || k === "toggleFollow") return [k, false];
          return [k, true];
        })
      );
      state.error = Object.fromEntries(
        Object.keys(state.error).map((k) => [k, null])
      );
      state.currentUserData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.error.profile = null;

        state.currentUserData = action.payload.user;

        // if (state.currentUserData._id === state.user.id)
        //   userSlice.caseReducers.setProfileData(state, {
        //     payload: action.payload.user,
        //   });
      })
      .addCase(getUserData.pending, (state) => {
        state.loading.profile = true;
        state.error.profile = null;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.error.profile = action.payload;
        state.loading.profile = false;
      })

      .addCase(getUserFollowers.fulfilled, (state, action) => {
        state.loading.followers = false;
        state.error.followers = null;

        const targetUser = action.payload.targetUser;
        const followers = action.payload.followers;

        if (targetUser === state.user.id) state.user.followers = followers;
        state.currentUserData.followers = followers;
      })
      .addCase(getUserFollowers.pending, (state) => {
        state.loading.followers = true;
        state.error.followers = null;
      })
      .addCase(getUserFollowers.rejected, (state, action) => {
        state.error.followers = action.payload;
        state.loading.followers = false;
      })

      .addCase(getUserFollowing.fulfilled, (state, action) => {
        state.loading.following = false;
        state.error.following = null;

        const targetUser = action.payload.targetUser;
        const following = action.payload.following;

        if (targetUser === state.user.id) state.user.following = following;
        state.currentUserData.following = following;
      })
      .addCase(getUserFollowing.pending, (state) => {
        state.loading.following = true;
        state.error.following = null;
      })
      .addCase(getUserFollowing.rejected, (state, action) => {
        state.error.following = action.payload;
        state.loading.following = false;
      })

      .addCase(followUser.fulfilled, (state, action) => {
        if (
          state.currentUserData &&
          state.currentUserData.username === state.user.username
        )
          state.currentUserData.followingCount += 1;

        const user = action.payload;

        if (
          state.currentUserData &&
          state.currentUserData.username === user.username
        )
          state.currentUserData.followersCount += 1;

        state.user.followingCount += 1;
        state.user.following.unshift(action.payload);

        state.loading.toggleFollow = false;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.error.followers = action.payload.message;
        state.loading.toggleFollow = false;
      })
      .addCase(followUser.pending, (state) => {
        state.loading.toggleFollow = true;
      })

      .addCase(unfollowUser.fulfilled, (state, action) => {
        if (
          state.currentUserData &&
          state.currentUserData.username === state.user.username
        )
          state.currentUserData.followingCount = Math.max(
            state.currentUserData.followingCount - 1,
            0
          );

        const username = action.payload;

        if (
          state.currentUserData &&
          state.currentUserData.username === username
        )
          state.currentUserData.followersCount = Math.max(
            state.currentUserData.followersCount - 1,
            0
          );

        state.user.followingCount = Math.max(state.user.followingCount - 1, 0);

        state.user.following = state.user.following.filter(
          (user) => user.username !== action.payload
        );

        state.loading.toggleFollow = false;
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.error.following = action.payload.message;
        state.loading.toggleFollow = false;
      })
      .addCase(unfollowUser.pending, (state) => {
        state.loading.toggleFollow = true;
      })

      .addCase(update.fulfilled, (state, action) => {
        state.loading.update = false;
        state.error.update = null;

        const user = action.payload.user;

        state.user.profilePicture = user.profilePicture;
        state.user.username = user.username;
        state.user.displayName = user.displayName;
        state.user.description = user.description;
      })
      .addCase(update.rejected, (state, action) => {
        state.error.update = action.payload.message;
        state.loading.update = false;
      })
      .addCase(update.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        state.searchedUser = action.payload.users;

        state.loading.searching = false;
        state.error.searching = null;

        // console.log(current(state.searchedUser));
      })
      .addCase(searchUser.rejected, (state, action) => {
        state.loading.searching = false;
        state.error.searching = action.payload;

        // console.log(current(state.searchedUser));
      })
      .addCase(searchUser.pending, (state, action) => {
        state.loading.searching = true;
        state.error.searching = null;

        // console.log(current(state.searchedUser));
      });
  },
});

export const amIFollowing = (state, user) => {
  return state.user.user.following.some((masters) => masters._id === user._id);
};

export const { setProfileData, clearUserData, reset } = userSlice.actions;
export default userSlice.reducer;
