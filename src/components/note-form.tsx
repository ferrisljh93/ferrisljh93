"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NoteForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = title.trim().length > 0 && !submitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `Failed to create note (${res.status})`);
      }
      setTitle("");
      setBody("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create note");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-10 space-y-4 rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
    >
      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-sm font-medium text-black/70 dark:text-white/70"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ship the environment"
          className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-black/40 focus:ring-2 focus:ring-black/10 dark:border-white/15 dark:bg-black/20 dark:focus:border-white/40"
        />
      </div>
      <div>
        <label
          htmlFor="body"
          className="mb-1 block text-sm font-medium text-black/70 dark:text-white/70"
        >
          Details
        </label>
        <textarea
          id="body"
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Optional details…"
          rows={3}
          className="w-full resize-none rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-black/40 focus:ring-2 focus:ring-black/10 dark:border-white/15 dark:bg-black/20 dark:focus:border-white/40"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!canSubmit}
        className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/85"
      >
        {submitting ? "Adding…" : "Add note"}
      </button>
    </form>
  );
}
