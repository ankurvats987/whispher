import { addNotification } from "../features/user/userSlice";

export const setupListeners = (socket, store) => {
  socket.on("notification", (notification) => {
    store.dispatch(addNotification(notification));
  });
};
