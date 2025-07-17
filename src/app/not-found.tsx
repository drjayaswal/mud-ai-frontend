"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export default function NotFound() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="relative h-screen overflow-hidden transition-colors duration-500">
      {/* Fixed Colored Background */}
      <div
        className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 to-blue-50 transition-colors duration-500"
        aria-hidden="true"
      ></div>

      {/* Centered Content */}
      <div className="flex items-center justify-center h-full px-4">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 404 Number */}
          <motion.div className="relative mb-8" variants={itemVariants}>
            <motion.h1
              className="text-9xl md:text-[12rem] font-bold bg-gradient-to-br from-transparent to-transparent via-gray-500 hover:from-gray-500 hover:via-gray-500/80 hover:to-gray-500 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              404
            </motion.h1>
          </motion.div>

          {/* Error Message */}
          <motion.div className="mb-8" variants={itemVariants}>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The page you&apos;re looking for seems to have wandered off into
              the digital wilderness. Don&apos;t worry we&apos;ll help you find
              your way back!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <Link href="/">
              <motion.button
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-br from-transparent to-transparent via-gray-500 hover:from-gray-500 hover:via-gray-500/80 hover:to-gray-500 text-white font-semibold rounded-3xl transition-colors  duration-500 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-5 h-5" />
                Home
              </motion.button>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-3 hover:bg-white/50 text-gray-600 hover:text-black font-semibold rounded-lg hover:rounded-4xl transition-all duration-300 hover:shadow-xl backdrop-blur-sm border border-white/20 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
