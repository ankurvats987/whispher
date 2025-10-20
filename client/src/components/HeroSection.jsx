import React from "react";
import { Button } from "./Button";
import { useNavigate } from "react-router";

export const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <main className="px-6 py-16">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 class="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Speak Your Mind.{" "}
              <span class="bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
                Instantly.
              </span>
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              Share your thoughts, connect with others, and discover amazing
              conversations in a beautiful, distraction-free environment
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              extraStyle=" bg-primary hover:bg-primary/90 h-11 bg-gradient-to-r from-rose-400 to-purple-400 hover:from-rose-500 hover:to-purple-500 text-white rounded-full px-8 py-3 text-lg"
              title={"Get Started Free"}
              onClick={() => navigate("/register")}
            />
            <Button
              extraStyle="bg-white hover:text-accent-foreground h-11 border-2 border-purple-200 text-purple-600 hover:bg-purple-50 rounded-full px-8 py-3 text-lg"
              title={"Log In"}
              onClick={() => navigate("/login")}
            />
          </div>
          <div className="flex items-center space-x-8 pt-8">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-message-circle w-5 h-5 text-teal-400"
              >
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
              </svg>
              <span class="text-sm text-gray-600">Quick conversations</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-users w-5 h-5 text-rose-400"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span class="text-sm text-gray-600">Connect instantly</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-zap w-5 h-5 text-purple-400"
              >
                <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
              </svg>
              <span class="text-sm text-gray-600">Share thoughts</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="relative z-10">
            <div className="text-card-foreground p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"></div>
                  <div>
                    <div className="w-20 h-3 bg-gray-200 rounded-full"></div>
                    <div className="w-16 h-2 bg-gray-100 rounded-full mt-1"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-gray-100 rounded-full"></div>
                  <div className="w-3/4 h-3 bg-gray-100 rounded-full"></div>
                </div>
                <div className="flex space-x-4 pt-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100"></div>
                  <div className="w-8 h-8 rounded-full bg-purple-100"></div>
                  <div className="w-8 h-8 rounded-full bg-teal-100"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-r from-rose-200 to-purple-200 opacity-60 rounded-full "></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-teal-200 to-cyan-200 opacity-60 rounded-full"></div>
        </div>
      </div>
    </main>
  );
};
