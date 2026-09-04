import { getNotes } from "@/lib/notes";
import { NoteForm } from "@/components/note-form";

export const dynamic = "force-dynamic";

export default async function Home() {
  const notes = await getNotes();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-medium text-black/60 shadow-sm dark:border-white/15 dark:bg-white/5 dark:text-white/60">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Environment ready
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Notebook</h1>
        <p className="mt-2 text-base text-black/60 dark:text-white/60">
          A tiny full-stack Next.js app. Create a note below — it is persisted
          through an API route and read back from the server.
        </p>
      </header>

      <NoteForm />

      <section aria-labelledby="notes-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="notes-heading" className="text-lg font-semibold">
            Notes
          </h2>
          <span className="text-sm text-black/50 dark:text-white/50">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </span>
        </div>

        {notes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/15 p-8 text-center text-sm text-black/50 dark:border-white/15 dark:text-white/50">
            No notes yet. Add your first one above.
          </div>
        ) : (
          <ul className="space-y-3">
            {notes.map((note) => (
              <li
                key={note.id}
                className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-medium">{note.title}</h3>
                  <time
                    className="shrink-0 text-xs text-black/40 dark:text-white/40"
                    dateTime={note.createdAt}
                  >
                    {new Date(note.createdAt).toLocaleString()}
                  </time>
                </div>
                {note.body && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-black/70 dark:text-white/70">
                    {note.body}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
