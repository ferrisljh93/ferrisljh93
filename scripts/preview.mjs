#!/usr/bin/env node
// Minimal, fully offline GitHub-styled Markdown preview server for the profile README.
// Renders README.md (or the file passed as argv[2]) using GitHub-flavored Markdown and
// github-markdown-css, and live-reloads the browser when the file changes on disk.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { createRequire } from "node:module";

import { Marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const targetFile = resolve(repoRoot, process.argv[2] || "README.md");

const cssPath = require.resolve("github-markdown-css/github-markdown.css");

const marked = new Marked();
marked.use(gfmHeadingId());

async function fileMtime(path) {
  try {
    return (await stat(path)).mtimeMs;
  } catch {
    return 0;
  }
}

async function renderPage() {
  let markdown;
  try {
    markdown = await readFile(targetFile, "utf8");
  } catch {
    markdown = `# File not found\n\nCould not read \`${targetFile}\`.`;
  }
  const body = marked.parse(markdown);
  const css = await readFile(cssPath, "utf8");
  const mtime = await fileMtime(targetFile);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>README preview</title>
  <style>${css}</style>
  <style>
    body { margin: 0; background: #f6f8fa; }
    .markdown-body {
      box-sizing: border-box;
      min-width: 200px;
      max-width: 980px;
      margin: 32px auto;
      padding: 45px;
      background: #ffffff;
      border: 1px solid #d0d7de;
      border-radius: 6px;
    }
    @media (max-width: 767px) { .markdown-body { padding: 15px; margin: 0; border-radius: 0; } }
  </style>
</head>
<body>
  <article class="markdown-body">${body}</article>
  <script>
    const current = ${mtime};
    async function poll() {
      try {
        const res = await fetch("/__mtime");
        const { mtime } = await res.json();
        if (mtime !== current) location.reload();
      } catch (e) { /* server restarting */ }
    }
    setInterval(poll, 1000);
  </script>
</body>
</html>`;
}

const server = createServer(async (req, res) => {
  if (req.url === "/__mtime") {
    const mtime = await fileMtime(targetFile);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ mtime }));
    return;
  }
  if (req.url === "/healthz") {
    res.writeHead(200, { "content-type": "text/plain" });
    res.end("ok");
    return;
  }
  try {
    const html = await renderPage();
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(html);
  } catch (err) {
    res.writeHead(500, { "content-type": "text/plain" });
    res.end("Render error: " + err.message);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`README preview server running at http://${HOST}:${PORT}`);
  console.log(`Rendering: ${targetFile}`);
});
