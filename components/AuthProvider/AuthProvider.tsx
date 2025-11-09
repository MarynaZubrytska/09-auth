"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, getMe } from "@/lib/api/clientApi";
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
      const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
      const isPublic = PUBLIC_PAGES.includes(pathname);

      if (isAuthenticated && isPublic) {
        router.replace("/profile");
        return;
      }

      if (isPrivate && !isAuthenticated) {
        setLoading(true);
        try {
          const sessionUser = await checkSession();
          if (cancelled) return;

          if (sessionUser) {
            const profile = await getMe();
            if (cancelled) return;
            setUser(profile);
          } else {
            clearIsAuthenticated();
            router.replace("/sign-in");
            return;
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      }
    }

    void guard();
    return () => {
      cancelled = true;
    };
  }, [pathname, isAuthenticated, router, setUser, clearIsAuthenticated]);

  if (loading) {
    return (
      <div aria-busy="true" aria-live="polite" style={{ padding: 24 }}>
        Checking session…
      </div>
    );
  }

  return <>{children}</>;
}
