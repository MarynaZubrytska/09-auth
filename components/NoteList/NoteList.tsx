"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "@/types/note";
import { deleteNote } from "@/lib/api/clientApi";
import Link from "next/link";
import css from "./NoteList.module.css";

export interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const qc = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { mutateAsync } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: ["notes"],
        exact: false,
        refetchType: "all",
      });
    },
  });

  if (!notes.length) return null;

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.listItem}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>

            <Link className={css.link} href={`/notes/${id}`}>
              View details
            </Link>

            <button
              type="button"
              className={css.button}
              onClick={() => handleDelete(id)}
              disabled={deletingId === id}
            >
              {deletingId === id ? "Deleting…" : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
