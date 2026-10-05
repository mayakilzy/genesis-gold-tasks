#!/usr/bin/env node
/**
 * Serve the tabloid demo page. Usage: node demo/serve.mjs [port]
 * Serves the project root so the page can import the built bundle at
 * ../dist/index.js — run `npm run build` first.
 */
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { readFile } from 'node:fs/promises';

const root = process.cwd();
const port = Number(process.argv[2] ?? 4173);
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
};

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://127.0.0.1');
  const path = url.pathname === '/' ? '/demo/index.html' : url.pathname;
  const file = normalize(join(root, path));
  if (!file.startsWith(root)) {
    res.statusCode = 403;
    res.end('forbidden');
    return;
  }
  try {
    const body = await readFile(file);
    res.setHeader('content-type', types[extname(file)] ?? 'application/octet-stream');
    res.end(body);
  } catch {
    res.statusCode = 404;
    res.end('not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`tabloid demo serving on http://127.0.0.1:${port}/`);
});
