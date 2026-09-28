import { readFile, writeFile, readdir, mkdir, rm, cp, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const root = fileURLToPath(new URL('../', import.meta.url));
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safeUrl = value => {
  if (!/^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(value)) throw new Error(`Unsupported link: ${value}`);
  return escape(value);
};
function inline(value) {
  return escape(value).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => `<a href="${safeUrl(url.replace(/&amp;/g, '&'))}">${label}</a>`).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}
async function markdown(source) {
  const blocks = source.trim().split(/\n\s*\n/);
  const output = [];
  for (const block of blocks) {
    const heading = block.match(/^(#{1,3}) (.+)$/);
    if (heading) { output.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`); continue; }
    const images = block.split('\n').map(line => line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/));
    if (images.every(Boolean)) {
      const items = [];
      for (const [, alt, url] of images) {
        if (!url.startsWith('/media/')) throw new Error(`Images must be in media/: ${url}`);
        const local = path.resolve(root, '.' + url);
        if (!local.startsWith(path.join(root, 'media') + path.sep)) throw new Error(`Invalid media path: ${url}`);
        await stat(local);
        items.push(`<img src="${safeUrl(url)}" alt="${escape(alt)}" loading="lazy" decoding="async">`);
      }
      output.push(`<div class="photo-grid${items.length === 1 ? ' single' : ''}">${items.join('')}</div>`);
      continue;
    }
    output.push(`<p>${inline(block.replace(/\n/g, ' '))}</p>`);
  }
  return output.join('\n');
}
export async function build() {
  const site = JSON.parse(await readFile(path.join(root, 'content/site.json'), 'utf8'));
  const files = (await readdir(path.join(root, 'content'))).filter(file => file.endsWith('.md'));
  const pages = [];
  for (const file of files) {
    const slug = path.basename(file, '.md');
    const source = await readFile(path.join(root, 'content', file), 'utf8');
    const title = source.match(/^# (.+)$/m)?.[1];
    if (!title) throw new Error(`${file} needs a # Page title`);
    pages.push({ slug, title, body: await markdown(source) });
  }
  const nav = current => site.navigation.map(item => `<a href="${safeUrl(item.url)}"${item.url === `/${current}/` ? ' aria-current="page"' : ''}>${escape(item.label)}</a>`).join('');
  const template = page => `<!doctype html>
<html lang="${escape(site.language)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(page.slug === 'home' ? site.name : `${page.title} — ${site.name}`)}</title>
<meta name="description" content="${escape(site.description)}">
<link rel="icon" href="/media/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="page-${escape(page.slug)}">
<a class="skip-link" href="#main">${escape(site.skipLink)}</a>
<header class="site-header"><a class="wordmark" href="/">${escape(site.name)}</a><nav aria-label="${escape(site.navigationLabel)}">${nav(page.slug)}</nav></header>
<main id="main" tabindex="-1">${page.body}</main>
<footer>${escape(site.copyright)}</footer>
</body>
</html>`;
  // Validate content before replacing generated output.
  await rm(path.join(root, 'dist'), { recursive: true, force: true });
  await mkdir(path.join(root, 'dist'), { recursive: true });
  for (const page of pages) {
    const folder = path.join(root, 'dist', page.slug === 'home' ? '' : page.slug);
    await mkdir(folder, { recursive: true });
    await writeFile(path.join(folder, 'index.html'), template(page));
  }
  const therapy = pages.find(page => page.slug === 'art-therapy');
  if (therapy) {
    await mkdir(path.join(root, 'dist/bauhaus'), { recursive: true });
    await writeFile(path.join(root, 'dist/bauhaus/index.html'), template(therapy));
  }
  await cp(path.join(root, 'media'), path.join(root, 'dist/media'), { recursive: true });
  await cp(path.join(root, 'src/styles.css'), path.join(root, 'dist/styles.css'));
  console.log(`Built ${pages.length} pages into dist/`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
