import { useState } from "react";
import AuthContext from "./AuthContext";
const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState("1");

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
