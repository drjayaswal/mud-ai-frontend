"use client";

import type React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Send, SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionUser } from "@/types/app.types";

export default function Content({ user }: { user: SessionUser }) {
  const [prompt, setPrompt] = useState("");
  const [isLoading] = useState(false);
  const [hasProcessedUrlQuery, setHasProcessedUrlQuery] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle URL query parameters
  useEffect(() => {
    const urlQuery = searchParams.get("q") || searchParams.get("query");
    if (urlQuery && !hasProcessedUrlQuery) {
      setPrompt(urlQuery);
      setHasProcessedUrlQuery(true);

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("q");
      newUrl.searchParams.delete("query");
      router.replace(newUrl.pathname, { scroll: false });
    }
  }, [searchParams, hasProcessedUrlQuery, router]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPrompt("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSendMessage = () => {
    if (!prompt.trim()) return;

    // Here you would implement your message sending logic
    console.log("Sending message:", prompt);

    // Reset form
    setPrompt("");

    toast.success("Message sent!");
  };

  return (
    <motion.div
      key="content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75 }}
      className="min-h-screen bg-white text-gray-800"
    >
      <div className="flex flex-col min-h-screen relative">
        <div className="mt-10">
          <Navbar />
          <AnimatedBackground />
        </div>

        {user && typeof user === "object" && (
          <pre className="text-xs p-4 bg-gray-100 m-4 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Fixed input area */}
          <div className="fixed bottom-5 z-10 w-full px-4">
            <div className="max-w-5xl mx-auto">
              <Card className="rounded-full pt-3 pb-2 px-3 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <div className="relative w-full">
                  <Input
                    ref={inputRef}
                    placeholder="Ask Anything...."
                    autoFocus
                    className="min-h-[50px] pr-32 pl-14 pb-2 border-none shadow-none focus-visible:ring-0 text-gray-800 text-lg md:text-xl placeholder:text-gray-600 bg-transparent resize-none"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      } else if (e.key === "Escape") {
                        e.preventDefault();
                        setPrompt("");
                      }
                    }}
                  />

                  {/* Search icon */}
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600">
                    <Search className="h-7 w-7" />
                  </div>

                  {/* Action buttons */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2">
                    {/* Send button */}
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={!prompt.trim() || isLoading}
                      className={cn(
                        "h-10 w-10 rounded-xl text-white transition-all hover:scale-105 shadow-none",
                        !prompt.trim() || isLoading
                          ? "text-gray-400 bg-transparent cursor-not-allowed"
                          : "text-gray-600 bg-transparent hover:bg-transparent hover:shadow-gray-500/40 hover:scale-105 hover:rotate-45 cursor-pointer"
                      )}
                    >
                      <AnimatePresence mode="wait">
                        {!prompt.trim() ? (
                          <motion.div
                            key="idle"
                            initial={{ opacity: 0, rotate: -45 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 45 }}
                          >
                            <SendHorizontal className="h-7 w-7" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="ready"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                          >
                            <Send className="h-7 w-7" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                </div>
              </Card>

              {/* Disclaimer */}
              <p className="text-[0.35rem] sm:text-[0.65rem] md:text-[0.95rem] text-gray-500 text-center mt-3 px-4">
                This AI is not a substitute for professional advice. Use
                discretion and verify all outputs.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
