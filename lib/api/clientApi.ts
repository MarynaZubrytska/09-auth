import { api } from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export type FetchNotesParams = {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
};

export type FetchNotesResponse = {
  items: Note[];
  totalPages: number;
  page: number;
  perPage: number;
};

export async function fetchNotes(
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> {
  const page = params.page ?? 1;
  const perPage = params.perPage ?? 12;

  const { data } = await api.get<{ notes: Note[]; totalPages: number }>(
    "/notes",
    { params }
  );

  return {
    items: data.notes ?? [],
    totalPages: data.totalPages ?? 1,
    page,
    perPage,
  };
}

export async function fetchNoteById(id: string) {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(payload: {
  title: string;
  content: string;
  tag: NoteTag;
}) {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}

export async function deleteNote(id: string) {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

type AuthPayload = { email: string; password: string };

export async function register(payload: AuthPayload) {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
}

export async function login(payload: AuthPayload) {
  const { data } = await api.post<User>("/auth/login", payload);
  return data;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function checkSession() {
  const { data } = await api.get<User | undefined>("/auth/session");
  return data;
}

export async function getMe() {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(payload: Partial<User>) {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
}
