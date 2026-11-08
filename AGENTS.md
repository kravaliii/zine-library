# AGENTS.md

## Project

This is a static zine library website by Kravali.

## Rules

- Build static only.
- Use only HTML, CSS, and JavaScript.
- Do not add frameworks, build tools, servers, or package managers.
- Keep files clearly separated:
  - `index.html` for structure/content
  - `styles.css` for styling
  - JavaScript in a separate `.js` file when needed
- Keep the site lightweight, readable, and easy to edit by hand.
- Prefer simple semantic HTML.
- Do not move or rename existing zine/PDF/media files unless asked.

## Zine files and naming

- Keep zines under `zines/`, each in its own folder named with a short, lowercase, filesystem-safe slug (for example `zines/taiwanzine/`). Use that slug consistently for new PDF filenames.
- Each zine has two distinct PDFs:
  - `<slug>.pdf`: the 8-page reading PDF. Its pages are shown in the inline browser on the website.
  - `<slug>-sheet.pdf`: the printable zine sheet. The **zine sheet** download link must point to this file, not the 8-page reading PDF.
- Use `cover.jpg` for the cover and `pages/page-1.png` through `pages/page-8.png` for individual page images generated from the reading PDF. Page 1 is the cover: show `cover.jpg` first, then spreads 2–3, 4–5, 6–7, and finally page 8 alone. Do not show page 1 twice.
- Always save the zine's title and description in `<slug>/zine.md` using a `# Title` heading followed by the description as a paragraph. Keep this file and the title/description in `index.html` in sync; this static site does not load Markdown at runtime.
- When adding a zine, check the real files, use the correct paths in `index.html` (`data-cover`, `data-folder`, `data-pages`, image `src`, and sheet download `href`), and replace an example duplicate rather than leaving extra copies of the same zine.
- Name new files consistently and verify every referenced file exists. If a zine has a different page count or file format, use its actual filenames and update the page count/navigation accordingly; never label a reading PDF as a sheet.

## Goal

A clean, simple, static library for browsing Kravali zines.
