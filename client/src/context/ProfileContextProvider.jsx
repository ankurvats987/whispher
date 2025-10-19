import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import mockUsers from "../data/mockUsers.js";
import ProfileContext from "./ProfileContext";

const ProfileContextProvider = ({ children }) => {
  const [profiles, setProfile] = useState(mockUsers);

  const getUserObj = () => {
    return {
      userId: uuidv4(),
      profilePicture: null,
      displayName: "",
      handle: "",
      description: "",
      followersCount: 0,
      followingCount: 0,
      joinedAt: Date.now(),
      followers: [],
      following: [],
    };
  };

  const addProfile = () => {
    // Database Integration
  };

  const getAllProfiles = () => {
    return profiles;
  };

  const followUser = (targetUserId, followerUserId) => {
    setProfile((prevUsers) =>
      prevUsers.map((user) => {
        if (user.userId === targetUserId) {
          return {
            ...user,
            followersCount: user.followersCount + 1,
            followers: [...user.followers, followerUserId],
          };
        }

        if (user.userId === followerUserId) {
          return {
            ...user,
            followingCount: user.followingCount + 1,
            following: [...user.following, targetUserId],
          };
        }

        return user;
      })
    );
  };

  const unfollowUser = (targetUserId, unfollowerUserId) => {
    setProfile((prevUsers) =>
      prevUsers.map((user) => {
        if (user.userId === targetUserId) {
          return {
            ...user,
            followersCount: user.followersCount - 1,
            followers: user.followers.filter((id) => id !== unfollowerUserId),
          };
        }

        if (user.userId === unfollowerUserId) {
          return {
            ...user,
            followingCount: user.followingCount - 1,
            following: user.following.filter((id) => id !== targetUserId),
          };
        }

        return user;
      })
    );
  };

  const getAProfile = (userId) => {
    return profiles.find((profile) => profile.userId === userId);
  };

  const amIFollowing = (myUserId, targetUserId) => {
    const myProfile = getAProfile(myUserId);

    return myProfile.following.includes(targetUserId);
  };

  return (
    <ProfileContext.Provider
      value={{
        followUser,
        unfollowUser,
        getAProfile,
        amIFollowing,
        getAllProfiles,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContextProvider;
