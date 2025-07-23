"use client";
import {
  User,
  Loader2,
  Send,
  SendHorizontal,
  Search,
  Brain,
} from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { ResponseInterface, SessionUser } from "@/types/app.types";

interface Connection {
  username: string;
  prompt: string;
  response: string;
  created_at: string;
}

export default function Content({ user }: { user: SessionUser }) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [hasProcessedUrlQuery, setHasProcessedUrlQuery] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [connections]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPrompt("");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchConnections = async () => {
    setLoadingConnections(true);
    try {
      const res: ResponseInterface = await apiGet("connection/all");
      const data = Array.isArray(res.data) ? res.data : [];
      data.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setConnections(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConnections(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const formatCreatedAt = (created_at: string) => {
    const date = new Date(created_at);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const res: ResponseInterface = await apiPost("connection/send", {
        prompt,
      });
      if (res.data) {
        fetchConnections();
      } else {
        console.log(res.message || "No response from MudAi");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
      setPrompt("");
    }
  };

  return (
    <motion.div
      key="content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-800"
    >
      <div className="flex flex-col min-h-screen relative">
        <div className="mt-10">
          <Navbar />
          <AnimatedBackground />
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col overflow-hidden pb-32 mt-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
            {/* Loading State */}
            {loadingConnections && (
              <div className="flex justify-center items-center py-12">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 text-gray-600"
                >
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-lg">Loading conversation...</span>
                </motion.div>
              </div>
            )}

            {/* Messages */}
            {!loadingConnections && (
              <div className="space-y-6">
                {connections.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="py-16 px-4 sm:px-6 lg:px-8"
                  >
                    <div className="max-w-md mx-auto bg-gradient-to-t from-white via-transparent to-transparent shadow-xl rounded-b-[80px] sm:rounded-b-[100px] p-8 border-0 transition-all">
                      <div className="flex flex-col items-center text-center space-y-4 overflow-hidden">
                        <div className="flex items-center justify-center gap-3">
                          {/* Brain Icon from Right */}
                          <div
                            className="relative flex items-center"
                            style={{ minHeight: "48px" }}
                          >
                            <motion.div
                              initial={{ x: 60, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              className="bg-gray-200 p-4 rounded-full z-20"
                              style={{ position: "relative" }}
                            >
                              <Brain className="h-10 w-10 text-gray-600" />
                            </motion.div>

                            {/* Greeting from Left */}
                            <motion.h3
                              initial={{ x: -60, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              className="text-2xl font-bold text-gray-900 break-words break-all ml-3 z-10"
                              style={{
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                                padding: "0.25rem 0.75rem",
                                borderRadius: "1.5rem",
                                position: "relative",
                              }}
                            >
                              {`Hello ${user.user.username.trim()} 👋`}
                            </motion.h3>
                          </div>
                        </div>

                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-xs">
                          Share your thoughts or questions below
                        </p>
                      </div>{" "}
                    </div>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {connections.map((connection, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="space-y-4"
                      >
                        {/* User Message */}
                        <div className="flex justify-end">
                          <div className="max-w-[80%] sm:max-w-[70%]">
                            <div className="bg-gray-400 text-white rounded-2xl rounded-tr px-4 py-3 shadow-sm">
                              <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                                {connection.prompt}
                              </p>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-1 px-2">
                              <User className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {formatCreatedAt(connection.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* AI Response */}
                        {connection.response && (
                          <div className="flex justify-start">
                            <div className="max-w-[80%] sm:max-w-[70%]">
                              <div className="bg-white rounded-2xl rounded-tl px-4 py-3 shadow-sm">
                                <p className="text-sm sm:text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
                                  {connection.response}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 mt-1 px-2">
                                <Brain className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  Mud Ai
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Fixed Input Area */}
        <div className="fixed bottom-0 left-0 right-0 z-10 pt-6 pb-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="rounded-4xl p-1 bg-white/95 backdrop-blur-sm shadow-lg border-0">
              <div className="relative">
                <Input
                  ref={inputRef}
                  placeholder="Type your message..."
                  autoFocus
                  className="min-h-[52px] pr-14 pl-12 border-0 shadow-none focus-visible:ring-0 text-gray-800 text-base placeholder:text-gray-500 bg-transparent resize-none rounded-xl"
                  value={prompt}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      setPrompt("");
                    }
                  }}
                  disabled={isLoading}
                />

                {/* Search icon */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="h-5 w-5" />
                </div>

                {/* Send button */}
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!prompt.trim() || isLoading}
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-4xl transition-all duration-200 flex items-center justify-center",
                    !prompt.trim() || isLoading
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-white bg-gray-400 hover:bg-gray-400 hover:scale-105 shadow-sm"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <AnimatePresence mode="wait">
                      {!prompt.trim() ? (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0, rotate: -45 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 45 }}
                        >
                          <SendHorizontal className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="ready"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <Send className="h-4 w-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </button>
              </div>
            </Card>

            {/* Disclaimer */}
            <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-2 px-2 sm:mt-3 sm:px-4 leading-tight">
              AI responses may be inaccurate. Please verify important
              information.
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </motion.div>
  );
}
