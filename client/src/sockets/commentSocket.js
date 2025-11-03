import { store } from "../app/store";
import { addNotification } from "../features/user/userSlice";

export const setupCommentListeners = (socket) => {
  socket.on("notification:comment", (notificaiton) => {
    store.dispatch(addNotification(notificaiton));
  });

  socket.on("notification:comment-mention", (notificaiton) => {
    store.dispatch(addNotification(notificaiton));
  });
};
