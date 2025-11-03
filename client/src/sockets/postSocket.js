export const setupPostListeners = (socket) => {
  socket.on("notification:post-mention", ({ post, sender, receiver }) => {
    console.log(
      `User ${sender.displayName} mentioned you in the post ${post._id}`
    );
  });
};
