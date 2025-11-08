"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./AuthNavigation.module.css";

function shortenEmail(email?: string, max = 22) {
  if (!email) return "";
  if (email.length <= max) return email;
  const [name, domain = ""] = email.split("@");
  const keep = Math.max(3, max - domain.length - 4);
  return `${name.slice(0, keep)}…@${domain}`;
}

export default function AuthNavigation() {
  const router = useRouter();
  const { isAuthenticated, user, setUser, clearIsAuthenticated } =
    useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setUser(undefined);
      clearIsAuthenticated();
      router.push("/sign-in");
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
            Login
          </Link>
        </li>
        <li className={css.navigationItem}>
          <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
            Sign up
          </Link>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/profile" prefetch={false} className={css.navigationLink}>
          Profile
        </Link>
      </li>

      <li className={css.navigationItem}>
        <span className={css.userEmail} title={user?.email}>
          {shortenEmail(user?.email)}
        </span>
        <button
          type="button"
          className={css.logoutButton}
          onClick={handleLogout}
        >
          Logout
        </button>
      </li>
    </>
  );
}
