"use client";

import Content from "./content";
import { Suspense, useEffect, useState } from "react";
import { getSession } from "@/lib/service";
import { redirect } from "next/navigation";
import { SessionUser } from "@/types/app.types";
import AnimatedLogo from "@/components/AnimatedLogo";

export default function MudAi() {
  const [user, setUser] = useState<SessionUser>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSession = async () => {
      const userSession = await getSession();
      if (!userSession) {
        redirect("/login");
      } else {
        setUser(userSession as SessionUser);
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  if (loading) {
    return <AnimatedLogo />;
  }
  return (
    <Suspense fallback={<AnimatedLogo />}>
      {user && <Content user={user} />}
    </Suspense>
  );
}
