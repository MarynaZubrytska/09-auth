import { cookies } from "next/headers";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

const base = `${process.env.NEXT_PUBLIC_API_URL}/api`;

function authHeaders() {
  const c = cookies();
  return { headers: { cookie: c.toString() }, cache: "no-store" as const };
}

export type FetchNotesParams = {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
};

export type NotesListResponse = {
  notes: Note[];
  totalPages: number;
};

export async function fetchNotes(
  params: FetchNotesParams
): Promise<NotesListResponse> {
  const url = new URL(`${base}/notes`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString(), authHeaders());
  if (!res.ok) throw new Error(`Failed to fetch notes: ${res.status}`);
  return (await res.json()) as NotesListResponse;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await fetch(`${base}/notes/${id}`, authHeaders());
  if (!res.ok) throw new Error(`Failed to fetch note ${id}: ${res.status}`);
  return (await res.json()) as Note;
}

export async function checkServerSession(): Promise<User | undefined> {
  const res = await fetch(`${base}/auth/session`, authHeaders());
  if (res.status === 200) {
    try {
      return (await res.json()) as User;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export async function getMe(): Promise<User> {
  const res = await fetch(`${base}/users/me`, authHeaders());
  if (!res.ok) throw new Error(`Failed to get profile: ${res.status}`);
  return (await res.json()) as User;
}
