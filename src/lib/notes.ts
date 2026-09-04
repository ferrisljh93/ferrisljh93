import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

export type NoteInput = {
  title: string;
  body: string;
};

// File-backed store so created records survive dev-server hot reloads.
// Kept out of version control via .gitignore (see /.data).
const dataDir = path.join(process.cwd(), ".data");
const dataFile = path.join(dataDir, "notes.json");

async function ensureStore(): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, "[]", "utf8");
  }
}

export async function getNotes(): Promise<Note[]> {
  await ensureStore();
  const raw = await fs.readFile(dataFile, "utf8");
  try {
    const parsed = JSON.parse(raw) as Note[];
    return parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export async function addNote(input: NoteInput): Promise<Note> {
  const title = input.title?.trim() ?? "";
  const body = input.body?.trim() ?? "";

  if (!title) {
    throw new Error("Title is required");
  }

  await ensureStore();
  const notes = await getNotes();
  const note: Note = {
    id: randomUUID(),
    title,
    body,
    createdAt: new Date().toISOString(),
  };
  notes.unshift(note);
  await fs.writeFile(dataFile, JSON.stringify(notes, null, 2), "utf8");
  return note;
}
