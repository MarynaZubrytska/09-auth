"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignUpPage.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setError("");
    setPending(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    try {
      const user = await register({ email, password });
      setUser(user);
      router.replace("/profile");
    } catch {
      setError("Registration failed. Try a different email or later.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={onSubmit} noValidate>
        <h1 className={css.formTitle}>Sign up</h1>

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
            placeholder="At least 6 characters"
            autoComplete="new-password"
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
            {pending ? "Registering…" : "Register"}
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
