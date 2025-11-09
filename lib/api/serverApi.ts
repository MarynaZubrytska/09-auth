import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";
import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

function authHeaders() {
  const c = cookies();
  return { cookie: c.toString() };
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
  const res = await api.get<NotesListResponse>("/notes", {
    params,
    headers: authHeaders(),
  });
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`, {
    headers: authHeaders(),
  });
  return res.data;
}

export async function checkServerSession(): Promise<
  AxiosResponse<User | undefined>
> {
  const res = await api.get<User | undefined>("/auth/session", {
    headers: authHeaders(),
  });
  return res;
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>("/users/me", {
    headers: authHeaders(),
  });
  return res.data;
}