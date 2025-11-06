"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { NoteTag } from "@/types/note";

type Draft = { title: string; content: string; tag: NoteTag };
const initialDraft: Draft = { title: "", content: "", tag: "Todo" };

type NoteStore = {
  draft: Draft;
  setDraft: (patch: Partial<Draft>) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      draft: initialDraft,
      setDraft: (patch) => set({ draft: { ...get().draft, ...patch } }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "notehub-draft",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
