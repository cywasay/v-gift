"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react";

export default function LoadingScreen({ onFinish }) {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const [targetProgress, setTargetProgress] = useState(0);

  // useSpring provides butter-smooth, frame-based interpolation
  const springProgress = useSpring(0, {
    stiffness: 45,
    damping: 20,
    restDelta: 0.001,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTargetProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const step = Math.random() * 8 + 2;
        return Math.min(prev + step, 100);
      });
    }, 250);

    return () => clearInterval(timer);
  }, []);

  // Sync spring with target
  useEffect(() => {
    springProgress.set(targetProgress);
  }, [targetProgress, springProgress]);

  // Update display percentage and handle finish
  useMotionValueEvent(springProgress, "change", (latest) => {
    const rounded = Math.round(latest);
    setDisplayPercentage(rounded);
    if (latest >= 100) {
      setTimeout(onFinish, 1000);
    }
  });

  // Transform spring progress into clipPath
  const clipPath = useTransform(
    springProgress,
    (val) => `inset(${100 - val}% 0 0 0)`,
  );

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDF2F5]"
    >
      <div className="relative flex flex-col items-center justify-center w-full max-w-sm">
        {/* Heart Container */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
          {/* Base Heart (Outline/Empty) */}
          <svg
            viewBox="0 0 32 32"
            className="w-full h-full text-zinc-200 fill-current opacity-20"
          >
            <path d="M23.6,2c-3.3,0-6.2,2.7-7.6,5.6C14.7,4.7,11.8,2,8.4,2C3.8,2,0,5.8,0,10.4c0,9.4,11,15.1,16,20.9c5-5.8,16-11.5,16-20.9C32,5.8,28.2,2,23.6,2z" />
          </svg>

          {/* Filling Heart */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath }}
          >
            <svg
              viewBox="0 0 32 32"
              className="w-full h-full text-red-600 fill-current"
            >
              <path d="M23.6,2c-3.3,0-6.2,2.7-7.6,5.6C14.7,4.7,11.8,2,8.4,2C3.8,2,0,5.8,0,10.4c0,9.4,11,15.1,16,20.9c5-5.8,16-11.5,16-20.9C32,5.8,28.2,2,23.6,2z" />
            </svg>
          </motion.div>

          {/* Uncovered Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 md:mb-8 font-display font-black tracking-wide relative select-none leading-none">
              {/* Dark Ghost Text */}
              <span className="text-[#6E1F2A] opacity-10">hello there</span>

              {/* White Text Revealed by Fill */}
              <motion.div
                className="absolute inset-[-4px] whitespace-nowrap flex items-center justify-center"
                style={{ clipPath }}
              >
                <span className="text-white">hello there</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Status Text Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 flex flex-col items-center space-y-1"
        >
          <p className="text-[#6E1F2A]/30 font-body text-[10px] font-black uppercase tracking-[0.4em]">
            Stitching Love
          </p>
          <p className="text-red-700 font-display font-black text-2xl tabular-nums">
            {displayPercentage}%
          </p>
        </motion.div>
      </div>

      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
    </motion.div>
  );
}
