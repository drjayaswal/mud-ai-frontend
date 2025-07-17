"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Tabs, TabsContent } from "@/components/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { Separator } from "@/components/separator";
import {
  User,
  Eye,
  EyeOff,
  Settings,
  Key,
  Camera,
  Copy,
  SquareCheckBig,
} from "lucide-react";
import { cn, generateApiKey } from "@/lib/utils";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSession, login } from "@/lib/service";
import { redirect } from "next/navigation";
import { ResponseInterface, SessionUser } from "@/types/app.types";
import { apiPost } from "@/lib/api";

export default function Content({ user }: { user: SessionUser }) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const lastGeneratedTimeRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const fetchSession = async () => {
      const sess = await getSession();
      if (!sess) {
        redirect("/login");
      }
    };
    fetchSession();
  }, []);
  useEffect(() => {
    const saved = localStorage.getItem("active-settings-tab");
    if (saved) setActiveTab(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("active-settings-tab", activeTab);
  }, [activeTab]);

  const generateKey = async () => {
    if (isGenerating) return;
    const now = Date.now();
    if (
      lastGeneratedTimeRef.current &&
      now - lastGeneratedTimeRef.current < 60 * 1000
    ) {
      toast.warning("Wait atleast 1 minute before generating another");
      return;
    }
    setIsGenerating(true);
    lastGeneratedTimeRef.current = now;
    const toastId = toast.loading("Generating API key...");
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const key = generateApiKey();
      setApiKey(key);
      setShowApiKey(true);
      const keyRes: ResponseInterface = await apiPost("user/update-api-key", {
        username: user.user.username,
        key,
      });
      if (keyRes.success && keyRes.code === 200) {
        toast.success("API key generated!");
      } else {
        toast.error(keyRes.message || "Error while updating API key.");
      }
    } catch (err) {
      toast.error("Error while updating API key.");
      console.error(err);
    } finally {
      toast.dismiss(toastId);
      setIsGenerating(false);
    }
  };
  const updateUsername = async (newUsername: string) => {
    if (!newUsername || newUsername.trim() === "") {
      toast.error("Username cannot be empty.");
      return;
    }
    if (newUsername === user.user.username) {
      toast.info("This is already your username.");
      return;
    }
    const toastId = toast.loading("Updating username...");
    try {
      const res: ResponseInterface = await apiPost("user/update-username", {
        username: user.user.username,
        new_username: newUsername,
      });
      if (res.success && res.code === 200) {
        toast.success("Username updated successfully!");
        await login(newUsername, user.user.ucode);
      } else {
        toast.error(res.message || "Failed to update username.");
      }
    } catch (err) {
      toast.error("An error occurred while updating username.");
      console.error(err);
    } finally {
      toast.dismiss(toastId);
    }
  };
  return (
    <motion.div
      key="content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75 }}
    >
      <div className="h-full bg-white">
        <Navbar />
        <div className="mx-auto p-10 pt-30">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {[
                      {
                        id: "profile",
                        label: "Profile",
                        icon: <User className="h-4 w-4" />,
                      },
                      {
                        id: "account",
                        label: "Account",
                        icon: <Settings className="h-4 w-4" />,
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 text-left hover:text-gray-700 transition-colors duration-400 cursor-pointer",
                          activeTab === item.id
                            ? "bg-gray-50 text-gray-700 border-r-2 border-l-2 border-gray-600"
                            : "bg-transparent text-gray-300 border-0"
                        )}
                      >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="profile" className="space-y-6">
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl">
                        Profile Information
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Update your personal information and profile settings
                      </CardDescription>
                    </CardHeader>
                    <Separator className="bg-gray-700/15" />
                    <CardContent className="space-y-6">
                      <div className="flex items-start gap-6">
                        <div className="relative">
                          <Avatar className="h-20 w-20 border-2 border-gray-700 cursor-none">
                            <AvatarImage
                              //   src={user?.avatar || "/Surf.png"}
                              className="object-fill"
                            />
                            <AvatarFallback className="text-6xl pl-1">
                              {user?.user.username
                                .slice(0, 1)
                                .toLocaleUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            className="gap-2 hover:bg-gray-500/10 hover:text-gray-600 border-0 shadow-none cursor-pointer"
                            onClick={() => {
                              toast.info("This feature is not available yet");
                              // fileInputRef.current?.click();
                            }}
                          >
                            <Camera className="h-4 w-4" />
                            Change Avatar
                          </Button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            // onChange={handleAvatarChange}
                          />
                          <p className="text-sm text-gray-500">
                            JPG, PNG or GIF. Max size 2MB.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={username}
                            placeholder={user.user.username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="focus-visible:ring-0 focus-visible:border-gray-500 border-0 shadow-none focus-visible:shadow placeholder:text-gray-300"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="email">Unique Code</Label>
                          <span className="text-gray-400 italic select-none">
                            {user.user.ucode}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    {username != "" && (
                      <button
                        className="w-full h-12 bg-gradient-to-r from-transparent via-gray-200 to-transparent hover:from-transparent hover:to-transparent hover:via-gray-800 text-black hover:text-white font-semibold rounded-none transition-colors duration-400 transform shadow-none flex items-center justify-center gap-3 cursor-pointer"
                        onClick={() => {
                          if (username.length < 8) {
                            toast.error(
                              "Username must be at least 8 characters long"
                            );
                            return;
                          }
                          updateUsername(username);
                        }}
                      >
                        Save Changes
                      </button>
                    )}
                  </Card>
                </TabsContent>
                <TabsContent value="account" className="space-y-6">
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl">
                        Account Security
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage your password and security settings.
                      </CardDescription>
                    </CardHeader>
                    <Separator className="bg-gray-700/15" />
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-5">
                          <h4 className="font-medium text-lg">API Key</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Input
                                id="api-key"
                                type={showApiKey ? "text" : "password"}
                                value={
                                  apiKey || "sfr-slick-neuron-a83kzjdf-20250630"
                                }
                                className={`focus-visible:ring-0 border-0 shadow-none cursor-text ${
                                  isGenerating &&
                                  "bg-muted text-muted-foreground"
                                }`}
                                disabled={isGenerating}
                                readOnly
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-10 top-1/2 -translate-y-1/2 text-zinc-500 hover:bg-transparent cursor-pointer rounded-3xl"
                                onClick={() => {
                                  if (apiKey !== "") setShowApiKey(!showApiKey);
                                }}
                              >
                                {showApiKey ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              {apiKey && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent cursor-pointer rounded-3xl"
                                  onClick={async () => {
                                    try {
                                      await navigator.clipboard.writeText(
                                        apiKey
                                      );
                                      toast.success(
                                        "Key Copied to Clipboard !"
                                      );
                                      setIsCopied(true);
                                      setTimeout(() => {
                                        setIsCopied(false);
                                      }, 2000);
                                    } catch {
                                      toast.error("Failed to copy API key ");
                                    }
                                  }}
                                >
                                  {isCopied ? (
                                    <>
                                      <SquareCheckBig className="h-4 w-4 text-green-500" />
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-4 w-4" />
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              className="gap-2 hover:bg-gray-500/10 hover:text-gray-600 border-0 shadow-none cursor-pointer"
                              onClick={generateKey}
                            >
                              <Key className="h-4 w-4" />
                              Regenerate
                            </Button>
                          </div>
                          <span className="text-xs text-zinc-500 flex items-center justify-center">
                            This API key will be hidden automatically after a
                            short period of time{" "}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
