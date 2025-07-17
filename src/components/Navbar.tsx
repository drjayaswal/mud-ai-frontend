"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Orbit } from "lucide-react";
import { navLinks } from "@/lib/const";
import { getSession, logout } from "@/lib/service";
import { redirect } from "next/navigation";

export default function Navbar() {
  const [detached, setDetached] = useState(false);
  const [session, setSession] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      const sess = await getSession();
      setSession(sess as string);
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const onScroll = () => setDetached(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visibleLinks = detached ? navLinks.slice(0, 4) : navLinks;
  return (
    <AnimatePresence>
      <motion.nav
        initial={false}
        animate={{
          left: "50%",
          x: "-50%",
          width: detached ? "600px" : "100vw",
          maxWidth: detached ? "100vw" : "92vw",
          top: 25,
          borderRadius: detached ? 40 : 50,
          background: detached
            ? "rgba(255,255,255,0.95)"
            : "rgba(255,255,255,0.85)",
          boxShadow: "0 4px 32px 0 rgba(107, 114, 128, 0.15)",
          paddingLeft: detached ? 24 : 0,
          paddingRight: detached ? 24 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="fixed z-50 flex items-center justify-between px-6 py-3"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div
          className={`flex items-center justify-center w-10 h-10 cursor-pointer bg-gradient-to-br from-transparent to-transparent via-gray-500 hover:from-gray-500 hover:via-gray-500/80 hover:to-gray-500 transition-colors duration-300 rounded-full shadow-lg mr-4 ${
            detached ? "-ml-1" : "ml-4"
          }`}
        >
          <Orbit className="transition-all duration-300 hover:rotate-45 text-white text-xl" />
        </div>

        <div className="flex flex-1 items-center justify-between">
          {visibleLinks.map((link) => {
            if (link.label === "Login") {
              return (
                !session && (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex gap-2 items-center relative px-5 py-2 cursor-pointer rounded-3xl font-bold text-lg text-gray-500/40 hover:text-gray-400 transition-colors duration-200 ${
                      detached ? "-mr-2" : "mr-4"
                    }`}
                  >
                    {link.icon && <link.icon className="h-5 w-5" />}
                    {link.label}
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
                    className={`flex gap-2 items-center cursor-pointer relative px-5 py-2 rounded-3xl font-bold text-lg text-gray-500/40 hover:text-gray-400 transition-colors duration-200 ${
                      detached ? "-mr-2" : "mr-4"
                    }`}
                  >
                    {link.icon && <link.icon className="h-5 w-5" />}
                    {link.label}
                  </button>
                )
              );
            } else {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex gap-2 items-center cursor-pointer relative px-5 py-2 rounded-3xl font-bold text-lg text-gray-500/40 hover:text-gray-400 transition-colors duration-200 ${
                    detached ? "-mr-2" : "mr-4"
                  }`}
                >
                  {link.icon && <link.icon className="h-5 w-5" />}
                  {link.label}
                </Link>
              );
            }
          })}
        </div>
      </motion.nav>
    </AnimatePresence>
  );
}
