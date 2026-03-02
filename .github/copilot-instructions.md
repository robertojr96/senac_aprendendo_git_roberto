# Copilot instructions for this repository

This repository is a small static website. The goal of these instructions is to help an AI coding agent be immediately productive and make safe, minimal changes.

- **Big picture:** static HTML pages using Bootstrap via CDN. No build tools, no server-side code. Pages are: `index.html`, `produtos.html`, `contato.html` and an `img/` folder with assets.

- **Key files / patterns:**
  - `index.html`: main landing page; standard Bootstrap navbar reused across pages.
  - `produtos.html`: shows product cards using Bootstrap `.card` with images loaded from `./img/` (note filenames may contain spaces, e.g. `Novo Honda Civic 2016 (2).jpg`).
  - `contato.html`: simple contact form, uses plain inputs and a textarea.

- **Structural decisions (what you must preserve):**
  - Pages are plain static HTML with duplicated header/nav markup — do not remove or assume a templating system unless you add one explicitly and update all pages.
  - Images are referenced by relative paths (e.g. `./img/casa.jpg`). Preserve relative linking when moving or renaming files.
  - Bootstrap is included via CDN links in each HTML head and bundle at the end of `body`; changes should keep integrity attributes unless intentionally updating the CDN version.

- **Developer workflows / commands (discoverable and tested):**
  - Preview locally by opening `index.html` in a browser or run a simple static server from project root:

    ```bash
    # Python 3
    python -m http.server 8000
    # or on Windows if python is py
    py -m http.server 8000
    ```

  - No tests, build, or package managers are present. Avoid adding new tooling without asking the maintainer.

- **Conventions & gotchas for edits:**
  - Keep UTF-8 and `lang="br"` in HTML heads.
  - Filenames in `img/` may contain spaces and parentheses — when linking or generating URLs, URL-encode or rename files consistently and update all references.
  - Because markup is repeated across pages, prefer minimal, local edits (e.g., update both `index.html` and `produtos.html`) rather than refactors that introduce new build steps.

- **Integration points / external deps:**
  - Bootstrap CSS and JS from jsDelivr CDN (version present in files: 5.2.3). Any CDN updates should update both the `<link>` and the `<script>` tags across all pages.

- **Safe change examples (how to implement common edits):**
  - To add a new product card in `produtos.html`, copy an existing `.card` block and update the image path (preserve `card` structure and button classes).
  - To fix a broken image reference, check `img/` for exact filename (including spaces) and update the `src` value to the matching relative path.
  - To change the navbar label or links, update the `<nav>` block in each HTML file (they are not shared by an include system).

- **When to ask the human:**
  - If a change requires introducing a build system, templating, or dependency manager (npm, pip) — ask before adding files or CI.
  - If you plan to rename many image files or normalize filenames (spaces → hyphens), confirm because all references must be updated.

If anything above is unclear or you'd like the file expanded with examples (e.g., exact snippets to change), tell me which sections to improve.
