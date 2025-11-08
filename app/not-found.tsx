import type { Metadata } from "next";
import css from "./page.module.css";

const siteUrl = "09-auth-theta-puce.vercel.app/404";

export const metadata: Metadata = {
  title: "404 - Page not found | NoteHub",
  description: "The page you are looking for does not exist.",
  openGraph: {
    title: "404 - Page not found | NoteHub",
    description: "The page you are looking for does not exist.",
    url: siteUrl,
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub",
      },
    ],
  },
};

export default function NotFound() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
}
