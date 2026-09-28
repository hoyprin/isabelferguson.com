# Isabel Ferguson

A minimal website with text, media, and code kept separate. Content was copied from isabelferguson.com on 28 September 2026, with minor grammar and line-break cleanup. The dates and qualifications have been retained as written on the original site.

## Edit the website

Open a file in **content/** and change the text:

| File | What it controls |
| --- | --- |
| `home.md` | Homepage name and introduction |
| `art-therapy.md` | Art therapy page |
| `workshops.md` | Workshop titles and photographs |
| `about.md` | Biography, portrait, and education |
| `contact.md` | Email and Instagram links |
| `site.json` | Shared site name, navigation, footer, and description |

Markdown is plain text. Keep one `# Page title` per page. Use `## Section title`, `### Smaller heading`, and a blank line between paragraphs. Links look like `[visible text](https://example.com)`. Images look like `![Description of the photo](/media/photo.jpg)`. Adjacent image lines make a photo grid. Use `**bold text**` for emphasis. HTML is not supported.

For shared text in `site.json`, edit the values inside quotation marks and keep the existing commas and brackets. The footer year is deliberately editable here.

## Add or replace photographs

Place files in **media/**. Use simple filenames with hyphens and no spaces, such as `flower-workshop.jpg`. Add an image line to the relevant page in **content/**. Describe the image between the square brackets for people who use screen readers. To replace an image without changing the page, keep its filename.

The existing site's workshop photos and portrait are already included. All website media belongs here; all implementation code belongs in **src/**.

## Preview

Install Node.js 20 or newer, then run:

```sh
npm run dev
```

Open http://localhost:4321. Save text, photos, or styles and refresh the browser to see changes. No dependency installation is needed. Press Control+C to stop the preview.

## Build

```sh
npm run build
```

The generated website appears in **dist/**, ready for static hosting. Do not edit that folder: the next build replaces it. Your editable originals remain in **content/** and **media/**.

Existing links to `/bauhaus` still open the art therapy page. To add a new page, create `content/page-name.md`, add its link to `content/site.json`, and rebuild.
