"use client";

import { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import Navbar from "./Navbar";
import SmallSection from "./SmallSection";

const LandingPage = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDark(prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <HeroSection isDark={isDark} />
      <SmallSection isDark={isDark} />
    </div>
  );
};

export default LandingPage;
