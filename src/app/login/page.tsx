"use client";

import React, { useState } from "react";
import { Button } from "@/components/button";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";
import { login } from "@/lib/service";
import { Input } from "@/components/input";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";
import { ResponseInterface } from "@/types/app.types";
import Navbar from "@/components/Navbar";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ucode, setUcode] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("unode", ucode);
    const response: ResponseInterface = await apiPost("user/create", {
      username,
      password,
      ucode,
    });
    if (response.success && response.code === 200) {
      await login(username, ucode);
      toast.success("Welcome to MudAi");
      setLoading(false);
      redirect("/");
    } else if (!response.success && response.code === 409) {
      const loginRes: ResponseInterface = await apiPost("user/login", {
        username,
        password,
      });
      if (loginRes.success && loginRes.code === 200) {
        await login(username, ucode);
        toast.success("Welcome Back");
        setLoading(false);
        redirect("/");
      } else {
        setLoading(false);
        toast.info(loginRes.message || "Login failed.");
        return;
      }
    } else {
      setLoading(false);
      toast.error(response.message || "Something went wrong.");
      return;
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <Navbar />
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-xl mx-auto px-6">
        <div className="text-center mb-">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 bg-clip-text text-transparent">
            Welcome to MudAi
          </h1>
          <p className="text-gray-600 text-xl font-extralight mt-2">
            Continue to your account
          </p>
        </div>
        <div className="p-8">
          <form className="space-y-4" onSubmit={handleLogin}>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-xl focus-visible:ring-0 focus-visible:border-gray-500 border-0 shadow-none focus-visible:shadow"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl focus-visible:ring-0 focus-visible:border-gray-500 border-0 shadow-none focus-visible:shadow"
              required
            />
            <Input
              type="text"
              placeholder="Unique Code"
              value={ucode}
              onChange={(e) => setUcode(e.target.value)}
              className="rounded-xl focus-visible:ring-0 focus-visible:border-gray-500 border-0 shadow-none focus-visible:shadow"
              required
            />
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-transparent via-gray-200 to-transparent hover:from-transparent hover:to-transparent hover:via-gray-800 text-black hover:text-white font-semibold rounded-3xl transition-all duration-200 transform hover:scale-105 shadow-none hover:shadow-xl flex items-center justify-center gap-3 cursor-pointer"
              size="lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Continue"}
            </Button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-sm font-light text-gray-500">
              ...by continuing, you agree to our{" "}
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                TnC
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                PnP
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
