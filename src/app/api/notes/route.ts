import { NextResponse } from "next/server";
import { addNote, getNotes } from "@/lib/notes";

export async function GET() {
  const notes = await getNotes();
  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { title, body } = (payload ?? {}) as { title?: string; body?: string };

  try {
    const note = await addNote({ title: title ?? "", body: body ?? "" });
    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create note";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
