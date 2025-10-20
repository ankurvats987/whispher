import React from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/Button";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-gradient-to-br from-purple-50 via-rose-50 to-teal-50">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* 404 Number */}
        <div className="space-y-4">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-500 leading-relaxed max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been
            moved or deleted.
          </p>
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-purple-300"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-rose-300 to-purple-300 opacity-60 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            extraStyle="bg-gradient-to-r from-rose-400 to-purple-400 hover:from-rose-500 hover:to-purple-500 text-white rounded-full px-8 py-3 text-lg"
            title="Go Home"
            onClick={() => navigate("/")}
          />
          <Button
            extraStyle="bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-50 rounded-full px-8 py-3 text-lg"
            title="Go Back"
            onClick={() => navigate(-1)}
          />
        </div>

        <div className="pt-8">
          <p className="text-sm text-gray-400">
            Error Code: 404 | Page Not Found
          </p>
        </div>
      </div>
    </main>
  );
};
