"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export default function About() {
  return (
    <div className="relative isolate min-h-screen px-4 sm:px-6 py-16 sm:py-24 lg:px-8 overflow-hidden">
      <Navbar />

      <AnimatedBackground />

      <section>
        <div className="mx-auto max-w-3xl text-center relative z-10 mt-10 sm:mt-20">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
            About Us
          </h1>
          <p className="mt-6 sm:mt-8 text-base sm:text-lg text-gray-600 text-center sm:text-left">
            We&apos;re a passionate team focused on building AI-driven solutions
            that simplify work for professionals across industries. Our mission
            is to merge technology with human experience, enabling smarter
            decisions and efficient outcomes
          </p>
        </div>

        <div className="mx-auto mt-6 sm:mt-8 max-w-3xl relative z-10 text-gray-700 text-sm sm:text-base leading-relaxed space-y-6">
          <p className="text-center sm:text-left">
            Whether you&apos;re a small startup or a large enterprise, our tools
            are crafted to help you save time, improve processes, and drive
            growth. From intelligent chat systems to task automation and
            advanced analytics, we&apos;re committed to making technology work
            for you.
          </p>
          <p className="text-center sm:text-right">
            Transparency, simplicity, and continuous innovation define our
            approach. We believe in creating products that are not just
            functional, but also enjoyable to use.
          </p>
          <p className="text-center sm:text-left">
            Thank you for being part of our journey.
            <br />
            <span className="font-semibold text-gray-400 italic">
              team@mud.ai
            </span>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
