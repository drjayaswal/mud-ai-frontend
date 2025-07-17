"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { apiPost } from "@/lib/api";
import { ResponseInterface } from "@/types/app.types";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const validate = () => {
    const errs: Record<string, string> = {};
    if (
      !form.email.trim() ||
      !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email)
    )
      errs.email = "Please enter a valid Gmail address.";
    const wordCount = form.message.trim().split(/\s+/).length;
    if (!form.message.trim()) errs.message = "Message is required.";
    else if (wordCount > 150)
      errs.message = "Message must not exceed 150 words.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    try {
      const response: ResponseInterface = await apiPost("user/connect", {
        email: form.email,
        message: form.message,
      });

      if (response.success) {
        toast.success("Connection request sent successfully");
        setForm({
          email: "",
          message: "",
        });
      } else {
        toast.error(response.message || "Failed to send help request.");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative isolate min-h-screen px-6 py-24 sm:py-32 lg:px-8 overflow-hidden">
      <Navbar />
      <div
        className="fixed top-[-120px] left-[-100px] w-[400px] h-[400px] bg-gradient-to-tr from-gray-200 to-gray-300 opacity-30 blur-lg rounded-full"
        style={{ clipPath: "circle(60% at 50% 50%)" }}
      />
      <div
        className="fixed bottom-[-120px] left-[50vw] w-[400px] h-[400px] bg-gradient-to-tr from-gray-300 to-gray-400 opacity-30 blur-lg rounded-full"
        style={{ clipPath: "circle(60% at 50% 50%)" }}
      />
      <div
        className="fixed top-[-120px] right-0 w-[400px] h-[400px] bg-gradient-to-tr from-gray-300 to-gray-400 opacity-30 blur-lg rounded-full"
        style={{ clipPath: "circle(60% at 50% 50%)" }}
      />
      <section>
        <div className="mx-auto max-w-2xl text-center relative z-10 mt-20">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Let’s Connect
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Share your ideas, collaborations, or simply say hello
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-16 max-w-xl sm:mt-20 relative z-10 space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              placeholder="Enter your email address"
              onChange={(e) => handleChange("email", e.target.value)}
              className="mt-2.5 block w-full bg-white px-3.5 py-2 text-base text-gray-900  placeholder:text-gray-400 focus-visible:ring-0 rounded-lg focus-visible:outline-0 border-0 shadow-none focus-visible:shadow-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Message <span className="text-[8px]">in 150 words</span>
            </label>
            <textarea
              rows={4}
              value={form.message}
              placeholder="Enter your message"
              onChange={(e) => handleChange("message", e.target.value)}
              className="mt-2.5 block w-full bg-white px-3.5 py-2 text-base text-gray-900  placeholder:text-gray-400 focus-visible:ring-0 rounded-3xl focus-visible:outline-0 border-0 shadow-none focus-visible:shadow-xl"
            />
          </div>
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-transparent via-gray-200 to-transparent hover:from-transparent hover:to-transparent hover:via-gray-800 text-black hover:text-white font-semibold rounded-3xl transition-colors duration-400 transform shadow-none flex items-center justify-center gap-3 cursor-pointer"
            >
              {isSubmitting ? "Sending..." : "Send Connection"}
            </button>
          </div>
        </form>
      </section>
      <Footer />
    </div>
  );
}
