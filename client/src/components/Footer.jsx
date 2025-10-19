import React from "react";
import { Logo } from "./Logo";

export const Footer = () => {
  return (
    <footer className="px-6 py-8 mt-16">
      <div className="max-w-7xl mx-auto border-t border-gray-200 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <Logo />
          <div className="flex items-center space-x-8">
            <a
              href="/about"
              class="text-gray-600 hover:text-gray-800 transition-colors"
            >
              About
            </a>
            <a
              href="/terms"
              class="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Terms
            </a>
            <a
              href="/contact"
              class="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
