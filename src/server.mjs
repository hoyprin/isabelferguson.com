import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { build, root } from './build.mjs';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.mp4': 'video/mp4', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2' };
await build();
let building;
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (!path.extname(pathname) || pathname.endsWith('.html')) {
      building ??= build().finally(() => { building = undefined; });
      await building;
    }
    const base = path.join(root, 'dist');
    let file = path.resolve(base, '.' + pathname);
    if (file !== base && !file.startsWith(base + path.sep)) { res.writeHead(403); return res.end(); }
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch (error) {
    res.writeHead(error.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain' });
    res.end(error.code === 'ENOENT' ? 'Not found' : 'Build failed. Check the terminal for details.');
    if (error.code !== 'ENOENT') console.error(error);
  }
}).listen(4321, '127.0.0.1', () => console.log('Local: http://localhost:4321'));
