import api from "./axiosInstance";

export const getUser = async (username) => {
  return await api.get(`/user/${username}/profile`);
};

export const getFollowers = async (username) => {
  return await api.get(`/user/${username}/followers`);
};

export const getFollowing = async (username) => {
  return await api.get(`/user/${username}/following`);
};

export const follow = async (username, followedBy) => {
  return await api.post(`/user/${username}/follow`, { followedBy });
};

export const unfollow = async (username, followedBy) => {
  return await api.post(`/user/${username}/unfollow`, { followedBy });
};

export const updateProfile = async (username, data) => {
  return await api.patch(`/user/${username}/profile/update`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const notifications = async (username) => {
  return await api.get(`/user/notification/${username}`);
};

export const markNotifications = async (username) => {
  return await api.post(`/user/notification/${username}/mark-all`);
};

export const search = async (key, signal) => {
  return signal
    ? await api.get(`/user/search/${key}`, { signal })
    : await api.get(`/user/search/${key}`);
};
