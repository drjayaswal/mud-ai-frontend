"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import {
  Search,
  ArrowRight,
  TrendingUp,
  Send,
  Brain,
  MessageSquare,
  Code,
  FileText,
  ImageIcon,
  Calculator,
  Globe,
} from "lucide-react";

interface SearchSuggestion {
  id: string;
  text: string;
  category: "recent" | "trending" | "suggested" | "popular";
  icon: React.ReactNode;
  description?: string;
}

interface PremiumSearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Ask me anything...",
  className = "",
}: PremiumSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    SearchSuggestion[]
  >([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const suggestions: SearchSuggestion[] = useMemo(
    () => [
      {
        id: "1",
        text: "Write a professional email for a job application",
        category: "trending",
        icon: <FileText className="h-4 w-4" />,
        description: "Create compelling professional content",
      },
      {
        id: "2",
        text: "Explain quantum computing in simple terms",
        category: "suggested",
        icon: <Brain className="h-4 w-4" />,
        description: "Complex topics made easy",
      },
      {
        id: "3",
        text: "Generate a React component with TypeScript",
        category: "popular",
        icon: <Code className="h-4 w-4" />,
        description: "Code generation and assistance",
      },
      {
        id: "4",
        text: "Create a marketing strategy for my startup",
        category: "trending",
        icon: <TrendingUp className="h-4 w-4" />,
        description: "Business strategy and planning",
      },
      {
        id: "5",
        text: "Summarize this article about AI trends",
        category: "recent",
        icon: <MessageSquare className="h-4 w-4" />,
        description: "Text analysis and summarization",
      },
      {
        id: "6",
        text: "Help me solve this math problem",
        category: "popular",
        icon: <Calculator className="h-4 w-4" />,
        description: "Mathematical problem solving",
      },
      {
        id: "7",
        text: "Design a logo concept for my brand",
        category: "suggested",
        icon: <ImageIcon className="h-4 w-4" />,
        description: "Creative design assistance",
      },
      {
        id: "8",
        text: "Research the latest web development trends",
        category: "trending",
        icon: <Globe className="h-4 w-4" />,
        description: "Research and analysis",
      },
    ],
    []
  );

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = suggestions.filter((suggestion) => {
        const textMatch = suggestion.text.toLowerCase().includes(query);
        const descMatch = suggestion.description?.toLowerCase().includes(query);
        return textMatch || descMatch;
      });
      setFilteredSuggestions(filtered.slice(0, 6));
    } else {
      const categorized = [
        ...suggestions.filter((s) => s.category === "trending").slice(0, 2),
        ...suggestions.filter((s) => s.category === "popular").slice(0, 2),
        ...suggestions.filter((s) => s.category === "suggested").slice(0, 2),
      ];
      setFilteredSuggestions(categorized);
    }
    setSelectedIndex(-1);
  }, [searchQuery, suggestions]);

  useEffect(() => {
    if (searchQuery) {
      setIsTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 500);
    } else {
      setIsTyping(false);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [searchQuery]);
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      setShowSuggestions(false);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  }, [onSearch, searchQuery]);

  const handleSuggestionClick = useCallback(
    (suggestion: SearchSuggestion) => {
      setSearchQuery(suggestion.text);
      setShowSuggestions(false);
      setIsFocused(false);
      onSearch?.(suggestion.text);
    },
    [onSearch]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!showSuggestions) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredSuggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleSuggestionClick(filteredSuggestions[selectedIndex]);
          } else {
            handleSearch();
          }
          break;
        case "Escape":
          setShowSuggestions(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
        case "Tab":
          if (selectedIndex >= 0) {
            e.preventDefault();
            setSearchQuery(filteredSuggestions[selectedIndex].text);
          }
          break;
      }
    },
    [
      showSuggestions,
      selectedIndex,
      filteredSuggestions,
      handleSearch,
      handleSuggestionClick,
    ]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => handleKeyDown(e);
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handleKeyDown]);
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        inputRef.current?.focus();
        setShowSuggestions(true);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const getCategoryInfo = (category: SearchSuggestion["category"]) => {
    switch (category) {
      case "trending":
        return {
          color: "text-gray-500",
          bg: "bg-gray-50",
          label: "Trending",
        };
      case "recent":
        return { color: "text-gray-500", bg: "bg-gray-50", label: "Recent" };
      case "suggested":
        return {
          color: "text-gray-500",
          bg: "bg-gray-50",
          label: "Suggested",
        };
      case "popular":
        return {
          color: "text-gray-500",
          bg: "bg-gray-50",
          label: "Popular",
        };
      default:
        return { color: "text-gray-500", bg: "bg-gray-50", label: "General" };
    }
  };

  return (
    <div className={`relative max-w-3xl mx-auto ${className}`}>
      <div
        className={`relative transition-transform duration-200 ease-out ${
          isFocused ? "scale-102" : "scale-100"
        }`}
      >
        <div
          className={`absolute inset-0 rounded-full transition-all duration-300 ${
            isFocused ? "bg-gray-500/25 blur-xl scale-105" : "bg-transparent"
          }`}
        />
        <div
          className={`relative bg-white/10 backdrop-blur-md rounded-full shadow-none hover:shadow-3xl transition-all duration-300 ${
            !isFocused && "shadow-none"
          }`}
        >
          <div className="absolute left-6 rounded-full top-1/2 -translate-y-1/2 z-10">
            <div
              className={`transition-all duration-200 ${
                isFocused
                  ? "scale-110 text-gray-500"
                  : "scale-100 text-gray-500"
              }`}
            >
              <Search className="h-6 w-6" />
            </div>
          </div>

          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className={`w-full h-20 px-15 text-lg font-medium bg-transparent ${
              isFocused && "bg-white border-0"
            } rounded-full border-none outline-none placeholder:text-gray-400 text-gray-800 transition-all duration-300`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setIsFocused(false);
                setShowSuggestions(false);
              }, 150);
            }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
            <div className="hover:scale-105 active:scale-95 transition-transform duration-150">
              <Button
                size="lg"
                className={`h-14 px-6 rounded-2xl shadow-none font-semibold transition-all duration-300 ${
                  searchQuery.trim()
                    ? "text-gray-600 bg-transparent hover:bg-transparent hover:shadow-gray-500/40 hover:scale-105 hover:rotate-45 cursor-pointer"
                    : "bg-transparent text-gray-400 cursor-not-allowed"
                }`}
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
              >
                <Send className="h-5 w-5 scale-150 mx-[5px]" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className={`absolute top-full left-0 right-0 mt-4 z-50 transition-all duration-300 ease-out ${
            showSuggestions
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-5 scale-95 pointer-events-none"
          }`}
        >
          <Card className="p-4 bg-white/40 backdrop-blur-md shadow-2xl border-0 rounded-4xl">
            <div className="space-y-2">
              {filteredSuggestions.map((suggestion, index) => {
                const categoryInfo = getCategoryInfo(suggestion.category);
                return (
                  <button
                    key={suggestion.id}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-start gap-4 group animate-in slide-in-from-left-5 cursor-pointer ${
                      selectedIndex === index
                        ? "bg-gradient-to-r from-gray-50 to-gray-50 border border-gray-200 shadow-md scale-[1.02]"
                        : "hover:bg-gray-50/50 border border-transparent hover:scale-[1.01]"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`${categoryInfo.color} rounded-xl group-hover:scale-110 transition-transform duration-200`}
                        >
                          {suggestion.icon}
                        </div>
                        <span className="font-medium text-gray-800 group-hover:text-gray-900 truncate">
                          {suggestion.text}
                        </span>
                        <ArrowRight className="h-5 w-5 text-black opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mt-0 p-4 pb-1 border-t border-gray-200/50">
                <span>
                  Use ↑↓ to navigate • Enter to select • Tab to complete
                </span>
                <span>Esc to close</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
