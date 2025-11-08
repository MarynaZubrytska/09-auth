"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

const PRIVATE_PREFIXES = ["/profile", "/notes"];
const PUBLIC_PAGES = ["/sign-in", "/sign-up"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { setUser, clearIsAuthenticated, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function guard() {
      setLoading(true);
      try {
        const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
        const isPublic = PUBLIC_PAGES.includes(pathname);

        if (isAuthenticated && isPublic) {
          router.replace("/profile");
          return;
        }

        if (!isAuthenticated && isPrivate) {
          const user = await checkSession();
          if (cancelled) return;

          if (user) {
            setUser(user);
          } else {
            clearIsAuthenticated();
            router.replace("/sign-in");
            return;
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    guard();
    return () => {
      cancelled = true;
    };
  }, [pathname, isAuthenticated, router, setUser, clearIsAuthenticated]);

  if (loading) return null;
  return <>{children}</>;
}
