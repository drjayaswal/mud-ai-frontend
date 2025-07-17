"use client";

import { Loader2 } from "lucide-react";
import Content from "./content";
import { Suspense, useEffect, useState } from "react";
import { getSession } from "@/lib/service";
import { redirect } from "next/navigation";
import { SessionUser } from "@/types/app.types";

export default function MudAi() {
  const [user, setUser] = useState<SessionUser>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const userSession = await getSession();
      if (!userSession) {
        redirect("/login");
      } else {
        setUser(userSession);
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-12 h-12 text-gray-500" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin w-12 h-12 text-gray-500" />
        </div>
      }
    >
      {user && <Content user={user} />}
    </Suspense>
  );
}
