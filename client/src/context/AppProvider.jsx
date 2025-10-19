import React from "react";
import AuthContextProvider from "./AuthContextProvider";
import ProfileContextProvider from "./ProfileContextProvider";
import PostContextProvider from "./PostContextProvider";

const AppProvider = ({ children }) => {
  return (
    <AuthContextProvider>
      <ProfileContextProvider>
        <PostContextProvider>{children}</PostContextProvider>
      </ProfileContextProvider>
    </AuthContextProvider>
  );
};

export default AppProvider;
