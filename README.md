# ferrisljh93

A small full-stack [Next.js](https://nextjs.org) (App Router) starter used to
bootstrap and validate a Cloud Agent development environment end to end.

It ships a tiny **Notebook** feature that exercises a real client → API →
persistence → server-read flow:

- `src/app/page.tsx` — a client UI to create and list notes.
- `src/app/api/notes/route.ts` — a REST API route (`GET` / `POST`).
- `src/lib/notes.ts` — a file-backed data store (`.data/notes.json`).

## Requirements

- Node.js 22 (matches the Cloud Agent base image)
- npm (uses the committed `package-lock.json`)

## Getting started

```bash
npm ci          # install exact dependencies from the lockfile
npm run dev     # start the dev server on http://localhost:3000
```

Then open [http://localhost:3000](http://localhost:3000) and add a note.

## Common commands

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the development server         |
| `npm run build` | Production build                     |
| `npm run start` | Serve the production build           |
| `npm run lint`  | Run ESLint (`eslint-config-next`)    |

## API

```bash
# List notes
curl http://localhost:3000/api/notes

# Create a note
curl -X POST http://localhost:3000/api/notes \
  -H 'Content-Type: application/json' \
  -d '{"title":"Hello","body":"world"}'
```

## Cloud Agent environment

`.cursor/environment.json` configures the Cloud Agent environment:

- `install`: `npm ci` — restores dependencies from the lockfile.
- `terminals`: runs `npm run dev` so the dev server is available with visible logs.
