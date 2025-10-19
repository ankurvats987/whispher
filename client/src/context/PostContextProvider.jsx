import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import mockPosts from "../data/mockPosts";
import PostContext from "./PostContext";

const PostContextProvider = ({ children }) => {
  const [posts, setPosts] = useState(mockPosts);

  const getAllPosts = () => {
    return posts;
  };

  const getAPost = (postId) => {
    return posts.find((post) => post.postId === postId);
  };

  const getUserPosts = (userId) => {
    return posts.filter((post) => post.createdBy === userId);
  };

  const getCommentObj = () => {
    return {
      commentId: uuidv4(),
      createdBy: null,
      createdAt: Date.now(),
      desc: "",
      likesCount: 0,
      likedBy: [],
    };
  };

  const getPostObj = () => {
    return {
      postId: uuidv4(),
      createdBy: null,
      createdAt: Date.now(),
      desc: "",
      likesCount: 0,
      shareCount: 0,
      comments: [],
      likedBy: [],
      getCommentsCount() {
        return this.comments.length;
      },
    };
  };

  const addPost = (userId, desc) => {
    const post = getPostObj();

    post.createdBy = userId;
    post.desc = desc;

    setPosts((prevPosts) => [...prevPosts, post]);
  };

  const likePost = (postId, userId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.postId === postId) {
          return {
            ...post,
            likesCount: post.likesCount + 1,
            likedBy: [...post.likedBy, userId],
          };
        }

        return post;
      })
    );
  };

  const unlikePost = (postId, userId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.postId === postId) {
          return {
            ...post,
            likesCount: post.likesCount - 1,
            likedBy: post.likedBy.filter((id) => id !== userId),
          };
        }

        return post;
      })
    );
  };

  const likeComment = (postId, commentId, userId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.postId === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.commentId === commentId) {
                return {
                  ...comment,
                  likesCount: comment.likesCount + 1,
                  likedBy: [...comment.likedBy, userId],
                };
              }

              return comment;
            }),
          };
        }

        return post;
      })
    );
  };

  const unlikeComment = (postId, commentId, userId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.postId === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.commentId === commentId) {
                return {
                  ...comment,
                  likesCount: comment.likesCount - 1,
                  likedBy: comment.likedBy.filter((id) => id !== userId),
                };
              }

              return comment;
            }),
          };
        }

        return post;
      })
    );
  };

  const addComment = (postId, userId, desc) => {
    const commentObj = getCommentObj();

    commentObj.createdBy = userId;
    commentObj.desc = desc;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.postId === postId) {
          return {
            ...post,
            comments: [...post.comments, commentObj],
          };
        }

        return post;
      })
    );
  };

  const sharePost = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.postId === postId) {
          return {
            ...post,
            shareCount: post.shareCount + 1,
          };
        }

        return post;
      })
    );
  };

  const getPostsCount = (userId) => {
    let count = 0;

    posts.forEach((post) => post.createdBy === userId && count++);

    return count;
  };

  return (
    <PostContext.Provider
      value={{
        getAllPosts,
        addPost,
        likePost,
        unlikePost,
        addComment,
        sharePost,
        getUserPosts,
        getAPost,
        getPostsCount,
        likeComment,
        unlikeComment,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export default PostContextProvider;
