import api from "./axiosInstance";

export const getPosts = async () => {
  return await api.get("/post/all");
};

export const getFollowedPosts = async (username) => {
  return await api.get(`/post/user/${username}`);
};

export const getPost = async (postId) => {
  return await api.get(`/post/${postId}`);
};

export const createPost = async (postData) => {
  return await api.post("/post/create", postData);
};

export const createComment = async (postId, commentData) => {
  return await api.post(`/post/${postId}/comment`, commentData);
};

export const likeComment = async (commentId, likedBy) => {
  return await api.post(`/post/comment/${commentId}/like`, { likedBy });
};

export const unlikeComment = async (commentId, likedBy) => {
  return await api.post(`/post/comment/${commentId}/unlike`, { likedBy });
};

export const likePost = async (postId, likedBy) => {
  return await api.post(`/post/${postId}/like`, { likedBy });
};

export const unlikePost = async (postId, likedBy) => {
  return await api.post(`/post/${postId}/unlike`, { likedBy });
};
