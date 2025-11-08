"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignInPage.module.css";

export default function SignInPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setError("");
    setPending(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    try {
      const user = await login({ email, password });
      setUser(user);
      router.replace("/profile");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={onSubmit} noValidate>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className={css.input}
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            autoFocus
            disabled={pending}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className={css.input}
            type="password"
            name="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            minLength={6}
            disabled={pending}
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={pending}
            aria-busy={pending}
          >
            {pending ? "Logging in…" : "Log in"}
          </button>
        </div>

        {error && (
          <p className={css.error} role="alert">
            {error}
          </p>
        )}
      </form>
    </main>
  );
}
