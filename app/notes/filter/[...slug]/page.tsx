import type { Metadata } from "next";
import { withDehydratedState } from "@/lib/prefetch";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

const PER_PAGE = 12;

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const raw = slug?.[0];
  const tag = !raw || raw === "all" ? "All" : raw;

  const url = `https://08-zustand-theta-lake.vercel.app/notes/filter/${raw ?? "all"}`;
  const title = `Notes - ${tag} | NoteHub`;
  const description = `Browse your notes filtered by tag: ${tag}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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
}

export default async function FilteredNotesPage({ params }: PageProps) {
  const { slug } = await params;
  const raw = slug?.[0];
  const tag = !raw || raw === "all" ? "" : raw;

  const element = await withDehydratedState(
    async (qc) => {
      await qc.prefetchQuery({
        queryKey: ["notes", tag, 1, PER_PAGE, ""],
        queryFn: () =>
          fetchNotes({
            page: 1,
            perPage: PER_PAGE,
            search: "",
            tag: tag ? tag : undefined,
          }),
      });
    },
    <NotesClient initialTag={tag} />
  );

  return element;
}
