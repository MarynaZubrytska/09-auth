import type { Metadata } from "next";
import { withDehydratedState } from "@/lib/prefetch";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

type ParamsPromise = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const note = await fetchNoteById(id);
    const title = `${note.title} | NoteHub`;
    const summary =
      (note.content || "").trim().slice(0, 140) || "Note details.";
    const url = `https://08-zustand-theta-lake.vercel.app/notes/${id}`;

    return {
      title,
      description: summary,
      openGraph: {
        title,
        description: summary,
        url,
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
  } catch {
    return {
      title: "Note details | NoteHub",
      description: "Note details.",
      openGraph: {
        title: "Note details | NoteHub",
        description: "Note details.",
        url: `https://08-zustand-theta-lake.vercel.app/notes/${(await params).id}`,
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
  }
}

export default async function NoteDetailsPage({
  params,
}: {
  params: ParamsPromise;
}) {
  const { id } = await params;

  const element = await withDehydratedState(
    async (qc) => {
      await qc.prefetchQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
      });
    },
    <NoteDetailsClient />
  );

  return element;
}
