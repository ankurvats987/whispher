import { io } from "socket.io-client";
import { store } from "../app/store.js";
import { refreshAccessToken } from "../features/auth/authThunks.js";
import { jwtDecode } from "jwt-decode";
import { setupCommentListeners } from "./commentSocket.js";
import { setupPostListeners } from "./postSocket.js";
import { setupListeners } from "./listener.js";

let socket = null;
let refreshTokenTimer = null;

export const initializeSocket = (token) => {
  if (socket) {
    socket.disconnect();
    clearRefreshTokenTimer();
  }

  socket = io(import.meta.env.VITE_BASE_URL, {
    auth: { token },
    withCredentials: true,
  });

  socket.emit("register", store.getState().user.user.id);

  socket.on("connect", () => {
    console.log("Socket Connected");

    startRefreshTokenTimer(token);
    // setupCommentListeners(socket, store);
    // setupPostListeners(socket, store);

    setupListeners(socket, store);
  });

  socket.on("connect_error", async (error) => {
    console.error("Socket connection error:", error.message);

    if (error.message === "invalid token" || error.message === "unauthorized") {
      console.log("Socket recieved invalid token. Refreshing...");

      try {
        await store.dispatch(refreshAccessToken()).unwrap();
        const newToken = store.getState().auth.token;

        if (socket) {
          socket.auth = { token: newToken };

          socket.disconnect().connect();
        }
      } catch (error) {
        console.log("Failed to refresh token for Socket.IO", error);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
    clearRefreshTokenTimer();
  });
};

const startRefreshTokenTimer = (token) => {
  const decoded = jwtDecode(token);
  const expiresIn = decoded.exp * 1000 - Date.now();

  const refreshTime = expiresIn - 5 * 60 * 1000;

  refreshTokenTimer = setTimeout(async () => {
    console.log("Proactively refreshing access token for Socket.IO");
    try {
      await store.dispatch(refreshAccessToken()).unwrap();
      const newToken = store.getState().auth.token;

      if (socket) {
        socket.auth = { token: newToken };

        socket.disconnect().connect();
      }
    } catch (error) {
      console.error("Token refresh failed.", error);
    }
  }, Math.max(refreshTime, 0));
};

const clearRefreshTokenTimer = () => {
  if (refreshTokenTimer) {
    clearTimeout(refreshTokenTimer);
    refreshTokenTimer = null;
  }
};

export const getSocket = () => socket;
