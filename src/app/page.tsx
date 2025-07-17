"use client";
import { motion, easeOut } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import { Globe } from "@/components/globe";
import Navbar from "@/components/Navbar";

export default function Home() {
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
        ease: easeOut,
      },
    },
  };
  const handleSearch = (query: string) => {
    window.location.href = `/mud-ai?q=${encodeURIComponent(query)}`;
  };
  return (
    <div className="relative min-h-screen transition-colors duration-500">
      <Navbar />

      <div
        className="fixed inset-0 -z-10  transition-colors duration-500"
        aria-hidden="true"
      >
        <AnimatedBackground />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <SearchBar onSearch={handleSearch} />
              </motion.div>

              <Globe className="mt-20" />
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
