"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";
import ValentineCard from "@/components/ValentineCard";

// Dynamically import Three.js background to avoid SSR issues
const CloudBackground = dynamic(() => import("@/components/CloudBackground"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#FDF2F5]" />,
});

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [isAccepted, setIsAccepted] = useState(false);

  // Generate fewer "love me" strings for mobile performance, more for desktop
  const loveMeArray = Array.from({ length: 150 }, (_, i) => "love me");

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <LoadingScreen key="loader" onFinish={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {/* Persistent Background Scene */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CloudBackground />
      </div>

      <div className="relative z-10 w-full h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth no-scrollbar">
        {/* Hero Section */}
        <section className="h-screen relative w-full flex flex-col items-center justify-center snap-start">
          {/* Translucent Valentine Card Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="relative z-10 w-[90%] max-w-[380px] sm:max-w-[450px] md:max-w-[500px] h-[650px] sm:h-[700px] md:h-[750px] flex-shrink-0"
          >
            <ValentineCard />
          </motion.div>

          <div className="fixed inset-0 z-20 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
        </section>

        {/* Text Coverage Section (Single Screen Height) */}
        <section className="h-screen relative w-full snap-start flex items-center justify-center overflow-hidden">
          <div className="w-screen h-screen select-none overflow-hidden p-4 flex items-center justify-center">
            <div className="flex flex-wrap gap-x-4 gap-y-4 md:gap-x-12 md:gap-y-12 justify-center content-center w-full max-w-[95vw] md:max-w-[90vw] mx-auto py-10 md:py-20">
              {loveMeArray.map((_, i) => (
                <div
                  key={i}
                  className="group relative cursor-default h-8 md:h-12 flex items-center justify-center min-w-[100px] md:min-w-[160px]"
                >
                  {/* The "Love Me" (Default) */}
                  <span className="text-xl sm:text-2xl md:text-5xl font-display font-black text-red-600 uppercase tracking-tight opacity-70 group-hover:opacity-0 transition-all duration-300 whitespace-nowrap">
                    love me
                  </span>

                  {/* The "Love You" (Hover State) */}
                  <span className="absolute text-xl sm:text-2xl md:text-5xl font-display font-black text-brand-maroon uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none">
                    love you
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Subtle overlay for the second section */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_50px_100px_rgba(0,0,0,0.02)]" />
        </section>

        {/* Final Proposal Section */}
        <section className="h-screen relative w-full snap-start flex flex-col items-center justify-center overflow-hidden p-6">
          {/* Comic Style Floating Question */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [-1, 1, -1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-center space-y-12 relative z-10 will-change-transform"
          >
            <h2 className="text-6xl sm:text-7xl md:text-8xl font-cursive text-red-600 tracking-tight drop-shadow-[0_0_15px_rgba(255,46,46,0.3)] px-4">
              Will you be my Valentine?
            </h2>

            <div className="flex items-center justify-center gap-12 sm:gap-24">
              {/* Yes Button (Floating Text) */}
              <motion.button
                whileHover={{ scale: 1.15, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAccepted(true)}
                className="text-4xl sm:text-6xl font-accent font-bold text-brand-maroon hover:text-red-500 transition-all duration-300"
              >
                Yes
              </motion.button>

              {/* No Button (Floating Text) */}
              <motion.button
                onMouseEnter={(e) => {
                  const range = window.innerWidth < 640 ? 200 : 500;
                  const x = (Math.random() - 0.5) * range;
                  const y = (Math.random() - 0.5) * range;
                  e.currentTarget.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                }}
                onClick={(e) => {
                  const range = window.innerWidth < 640 ? 200 : 500;
                  const x = (Math.random() - 0.5) * range;
                  const y = (Math.random() - 0.5) * range;
                  e.currentTarget.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                }}
                className="text-4xl sm:text-6xl font-accent font-bold text-red-300 transition-transform duration-300 cursor-default will-change-transform"
              >
                No
              </motion.button>
            </div>
          </motion.div>

          {/* Background Decorative Hearts */}
          <div className="absolute inset-0 z-0 flex items-center justify-center select-none pointer-events-none overflow-hidden">
            <motion.span
              animate={{
                color: isAccepted ? "#dc2626" : "#fecaca",
                opacity: isAccepted ? 0.4 : 0.1,
                scale: isAccepted ? 1.2 : 1,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-[25rem] sm:text-[40rem] md:text-[50rem] leading-none"
            >
              ❤️
            </motion.span>
          </div>
        </section>
      </div>
    </>
  );
}
