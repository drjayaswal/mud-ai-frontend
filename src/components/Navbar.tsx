"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Orbit, X, ChevronDown } from "lucide-react";
import { navLinks } from "@/lib/const";
import { getSession, logout } from "@/lib/service";
import { redirect } from "next/navigation";

export default function Navbar() {
  const [session, setSession] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const sess = await getSession();
      setSession(sess as string);
    };
    fetchSession();
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      const close = () => setMobileOpen(false);
      window.addEventListener("resize", close);
      window.addEventListener("scroll", close);
      return () => {
        window.removeEventListener("resize", close);
        window.removeEventListener("scroll", close);
      };
    }
  }, [mobileOpen]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 pt-4">
      <AnimatePresence>
        <motion.nav
          initial={false}
          animate={{
            borderRadius: 54,
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 6px 32px 0 rgba(107, 114, 128, 0.18)",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="relative w-full max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-4 bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl"
          style={{
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Show Orbit only on mobile (md and below) */}
          <div className="flex md:hidden ml-2">
            <Orbit />
          </div>
          {/* Desktop Nav Links */}
          <div className="hidden md:flex flex-1 items-center justify-between gap-1 lg:gap-2">
            {navLinks.map((link) => {
              if (link.label === "Login") {
                return (
                  !session && (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex gap-1.5 lg:gap-2 items-center relative px-3 lg:px-5 py-2 cursor-pointer rounded-2xl font-semibold text-sm lg:text-base text-gray-500/60 hover:text-gray-700 transition-colors duration-200 whitespace-nowrap"
                    >
                      {link.icon && (
                        <>
                          <link.icon className="hidden lg:inline h-5 w-5" />
                          <link.icon className="inline lg:hidden h-7 w-7" />
                        </>
                      )}
                      <span className="hidden lg:inline">{link.label}</span>
                    </Link>
                  )
                );
              } else if (link.label === "LogOut") {
                return (
                  session && (
                    <button
                      key={link.href}
                      onClick={async () => {
                        logout();
                        redirect("/login");
                      }}
                      className="flex gap-1.5 lg:gap-2 items-center cursor-pointer relative px-3 lg:px-5 py-2 rounded-2xl font-semibold text-sm lg:text-base text-gray-500/60 hover:text-gray-700 transition-colors duration-200 whitespace-nowrap"
                    >
                      {link.icon && (
                        <>
                          <link.icon className="hidden lg:inline h-5 w-5" />
                          <link.icon className="inline lg:hidden h-7 w-7" />
                        </>
                      )}
                      <span className="hidden lg:inline">{link.label}</span>
                    </button>
                  )
                );
              } else {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex gap-1.5 lg:gap-2 items-center cursor-pointer relative px-3 lg:px-5 py-2 rounded-2xl font-semibold text-sm lg:text-base text-gray-500/60 hover:text-gray-700 transition-colors duration-200 whitespace-nowrap"
                  >
                    {link.icon && (
                      <>
                        <link.icon className="hidden lg:inline h-5 w-5" />
                        <link.icon className="inline lg:hidden h-7 w-7" />
                      </>
                    )}
                    <span className="hidden lg:inline">{link.label}</span>
                  </Link>
                );
              }
            })}
          </div>

          {/* Hamburger for Mobile */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-gray-300/80 transition-all duration-300 flex-shrink-0 shadow-none active:scale-95"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span className="relative flex items-center justify-center w-full h-full">
              <span
                className={`absolute inset-0 rounded-full scale-110 transition-all duration-300 ${
                  mobileOpen ? "opacity-100" : "opacity-0"
                }`}
              />
              <span
                className={`transition-transform duration-500 ease-in-out ${
                  mobileOpen
                    ? "rotate-[360deg] scale-110 text-red-500"
                    : "rotate-0 scale-100 text-gray-700"
                }`}
              >
                {mobileOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300" />
                ) : (
                  <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300" />
                )}
              </span>
            </span>
          </button>

          {/* Mobile Nav Links */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.22 }}
                className="absolute top-full left-2 right-2 mt-2 bg-white border-0 shadow-2xl rounded-4xl flex flex-col items-stretch py-2 z-50 ring-1 ring-white/10 overflow-x-auto"
                style={{
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  maxWidth: "100vw",
                }}
              >
                <div className="flex flex-row flex-wrap items-center justify-center w-full gap-1 px-1 overflow-x-auto">
                  {navLinks.map((link, index) => {
                    if (link.label === "Login") {
                      return (
                        !session && (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex flex-col items-center justify-center min-w-[72px] px-3 py-2 h-16 rounded-xl font-semibold text-xs text-gray-500/70 hover:text-gray-900 transition-colors duration-200 ${
                              index < navLinks.length - 1 ? "mb-1" : ""
                            }`}
                            style={{ maxWidth: "100vw" }}
                          >
                            {link.icon && (
                              <link.icon className="h-7 w-7 flex-shrink-0 mb-1" />
                            )}
                            <span className="truncate">{link.label}</span>
                          </Link>
                        )
                      );
                    } else if (link.label === "LogOut") {
                      return (
                        session && (
                          <button
                            key={link.href}
                            onClick={async () => {
                              logout();
                              redirect("/login");
                            }}
                            className={`flex flex-col items-center justify-center min-w-[72px] px-3 py-2 h-16 rounded-xl font-semibold text-xs text-gray-500/70 hover:text-gray-900 transition-colors duration-200 ${
                              index < navLinks.length - 1 ? "mb-1" : ""
                            }`}
                            style={{ maxWidth: "100vw" }}
                          >
                            {link.icon && (
                              <link.icon className="h-7 w-7 flex-shrink-0 mb-1" />
                            )}
                            <span className="truncate">{link.label}</span>
                          </button>
                        )
                      );
                    } else {
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex flex-col items-center justify-center min-w-[72px] px-3 py-2 h-16 rounded-xl font-semibold text-xs text-gray-500/70 hover:text-gray-900 transition-colors duration-200 ${
                            index < navLinks.length - 1 ? "mb-1" : ""
                          }`}
                          style={{ maxWidth: "100vw" }}
                        >
                          {link.icon && (
                            <link.icon className="h-7 w-7 flex-shrink-0 mb-1" />
                          )}
                          <span className="truncate">{link.label}</span>
                        </Link>
                      );
                    }
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </AnimatePresence>
    </div>
  );
}
