import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NoteTag } from "@/types/note";

const initialDraft = { title: "", content: "", tag: "Todo" as NoteTag };

type NoteDraftState = {
  draft: typeof initialDraft;
  setDraft: (patch: Partial<typeof initialDraft>) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteDraftState>()(
  persist(
    (set, get) => ({
      draft: initialDraft,
      setDraft: (patch) => set({ draft: { ...get().draft, ...patch } }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    { name: "notehub-draft" }
  )
);
