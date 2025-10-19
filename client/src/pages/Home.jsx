import React from "react";
import { NavBar } from "../components/NavBar";
import { HeroSection } from "../components/HeroSection";
import { Footer } from "../components/Footer";

export const Home = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <HeroSection />
      <Footer />
    </div>
  );
};
