"use client";
import { motion } from "motion/react";

export function AnimatedBackground() {
  return (
    <motion.div className="absolute inset-0 overflow-hidden">
      <div
        className="fixed top-[-120px] left-[-100px] w-[400px] h-[400px] bg-gradient-to-tr from-gray-200 to-gray-300 opacity-20 blur-lg rounded-full"
        style={{ clipPath: "circle(60% at 50% 50%)" }}
      />
      <div
        className="fixed bottom-[-120px] left-[50vw] w-[400px] h-[400px] bg-gradient-to-tr from-gray-300 to-gray-400 opacity-20 blur-lg rounded-full"
        style={{ clipPath: "circle(60% at 50% 50%)" }}
      />
      <div
        className="fixed top-[-120px] right-0 w-[400px] h-[400px] bg-gradient-to-tr from-gray-300 to-gray-400 opacity-20 blur-lg rounded-full"
        style={{ clipPath: "circle(60% at 50% 50%)" }}
      />
    </motion.div>
  );
}
