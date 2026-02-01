"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const lyrics = [
  { text: "You know, I will adore you 'til eternity", duration: 4000 },
  { text: "So won't you, please (be my, be my baby)", duration: 3500 },
  {
    text: "Be my little baby? (My one, and only baby)",
    duration: 4000,
    highlight: true,
  },
  { text: "Say you'll be my darlin' (be my, be my baby)", duration: 4000 },
  { text: "Be my baby now (my one, and only baby)", duration: 4500 },
  { text: "Whoa, oh, oh, oh, oh", duration: 3500 },
];

export default function ValentineCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [particles, setParticles] = useState([]);

  // Floating Hearts Particle Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now() + Math.random();
      const newParticle = {
        id,
        left: Math.random() * 100,
        size: Math.random() * 25 + 10,
        duration: Math.random() * 5 + 5,
        rotate: Math.random() * 360,
      };
      setParticles((prev) => [...prev, newParticle]);

      // Cleanup particle after its animation
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 10000);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Simplified Lyric Logic
  useEffect(() => {
    const lyric = lyrics[currentIndex];
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev < lyrics.length - 1 ? prev + 1 : 0));
    }, lyric.duration + 1000);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Background Hearts Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: "110vh", opacity: 0.3, rotate: 0 }}
            animate={{ y: "-20vh", opacity: 0, rotate: p.rotate }}
            transition={{ duration: p.duration, ease: "linear" }}
            className="absolute text-red-400/30 select-none"
            style={{ left: `${p.left}%`, fontSize: `${p.size}px` }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      <motion.div
        animate={{
          y: [0, -15, 0], // Reduced amplitude for smoother float
          rotate: [0, 0.5, 0],
        }}
        transition={{
          duration: 8, // Slower duration for more "weight"
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="z-10 w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      >
        {/* Lyrics Display */}
        <div className="relative w-full h-56 md:h-64 flex items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(10px)", y: -10 }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
              className={`w-full text-red-600 selection:bg-red-100 selection:text-red-500 will-change-transform ${
                lyrics[currentIndex].highlight
                  ? "font-cursive text-5xl sm:text-6xl md:text-7xl drop-shadow-[0_0_25px_rgba(255,193,213,0.8)] leading-tight px-4"
                  : "font-accent text-3xl sm:text-4xl md:text-5xl px-4 drop-shadow-[0_0_15px_rgba(255,193,213,0.6)]"
              }`}
            >
              {currentIndex < lyrics.length ? lyrics[currentIndex].text : ""}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sticky Footer */}
        <div className="absolute bottom-8 text-red-900/40 text-xl font-accent tracking-wide">
          Forever Yours
        </div>
      </motion.div>
    </div>
  );
}
