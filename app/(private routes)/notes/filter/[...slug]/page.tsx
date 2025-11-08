import { withDehydratedState } from "@/lib/prefetch";
import { fetchNotes } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";

type PageProps = { params: Promise<{ slug?: string[] }> };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const raw = slug?.[0];
  const tag = !raw || raw === "all" ? "All" : raw;
  const url = `09-auth-theta-puce.vercel.app/notes/filter/${raw ?? "all"}`;
  const title = `Notes - ${tag} | NoteHub`;
  const description = `Browse your notes filtered by tag: ${tag}.`;

  return Promise.resolve({
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
  });
}

export default async function FilteredNotesPage({ params }: PageProps) {
  const { slug } = await params;
  const raw = slug?.[0];
  const tag = !raw || raw === "all" ? "" : raw;

  const element = await withDehydratedState(
    async (qc) => {
      await qc.prefetchQuery({
        queryKey: ["notes", tag, 1, 12, ""],
        queryFn: () =>
          fetchNotes({
            page: 0,
            perPage: 12,
            search: "",
            tag: tag || undefined,
          }),
      });
    },
    <NotesClient initialTag={tag} />
  );

  return element;
}
