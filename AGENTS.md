# Project instructions

- Keep the site minimalistic, organised, accessible, and responsive.
- Store all visitor-facing text in the root `content/` folder. Use one easy-to-find Markdown file per page. Keep shared labels, navigation, metadata, and footer text in `content/site.json`. Do not hard-code visitor-facing copy in source files.
- Store all website media (photos, images, icons, video, audio, and fonts) in the root `media/` folder. Reference assets using `/media/filename`. Do not hotlink media or introduce a separate public/assets content folder.
- Keep all implementation code, templates, styles, build scripts, and server code inside the root `src/` folder. Only necessary project configuration, documentation, and lockfiles belong at the root.
- `dist/` is generated output. Never edit it manually; regenerate it with `npm run build`.
- Maintain `README.md` with plain-language instructions for editing text, adding media, previewing, and building the site.
- Preserve the existing site's content and links unless the user requests changes. Preserve `/bauhaus` as an alias for the art therapy page.
- Keep dependencies minimal. This project uses native Node.js and does not require an install step.
- After edits, run `npm run build` and check affected pages, navigation, and referenced media.
