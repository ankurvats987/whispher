import React from "react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { useNavigate } from "react-router";

export const NavBar = () => {
  const navigate = useNavigate();
  return (
    <header className="px-6 py-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Logo />

        <div className="flex items-center space-x-4">
          <Button
            extraStyle="hover:bg-accent h-10 px-4 py-2 text-gray-600 hover:text-gray-800"
            title={"Login"}
            onClick={() => navigate("/login")}
          />

          <Button
            extraStyle={
              "bg-primary hover:bg-primary/90 h-10 py-2 bg-gradient-to-r from-rose-400 to-purple-400 hover:from-rose-500 hover:to-purple-500 text-white rounded-full px-6"
            }
            title={"Sign Up"}
            onClick={() => navigate("/register")}
          />
        </div>
      </div>
    </header>
  );
};
