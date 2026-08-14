# CLAUDE.md

Guidance for AI assistants working in this repository.

## What this repository is

Source for **https://www.kuegeler.com** — the personal site of Michael Kügeler (artist / technologist). It holds two independent sites:

1. **`michael-kuegeler-blog/`** — the current site. A Next.js 16 + React 19 static-export blog based on [tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) (v2.4.0), with Contentlayer2 for MDX content. **This is where nearly all work happens.**
2. **Root-level static HTML** (`index.html`, `cv.html`, `datenschutz.html`, `style.css`, `werk/*.html`, `vimeo-*.html`) — the older hand-written site. Plain HTML/CSS, German-language, no build step. Kept for reference/archive; **not deployed by CI** (see Deployment). Its `<img>`/`<video>` paths (`../images/…`, `../../video/…`) point outside the repo at assets living on the web host.

`README.md` is a scrapbook of the prompts and generated scripts used to bootstrap the site — treat it as history, not as current instructions.

## Repository layout

```
/                             legacy static site + deploy plumbing
├── .github/workflows/
│   ├── ci.yml                pull_request → build check (no deploy)
│   ├── direct.yml            push to main → SFTP mirror of blog `out/` (active deploy)
│   └── deploy.yml            manual (workflow_dispatch) zip-based upload
│                             both share concurrency group `sftp-deploy`
├── sftp_upload_direct.sh     lftp mirror, used by direct.yml
├── sftp_upload.sh            lftp zip upload, used by deploy.yml
├── index.html, cv.html, datenschutz.html, style.css, werk/   legacy site
└── michael-kuegeler-blog/    the Next.js site
    ├── app/                  App Router pages
    ├── components/           shared React components
    ├── layouts/              page/post layout components
    ├── data/                 ALL content + site config (MDX, siteMetadata, nav, assets)
    ├── css/                  tailwind.css (Tailwind v4, CSS-first config), prism.css
    ├── scripts/              postbuild.mjs → rss.mjs (RSS generation)
    ├── contentlayer.config.ts  MDX document schemas + remark/rehype pipeline
    ├── next.config.js        static export, CSP headers, contentlayer wrapper
    ├── build.sh              clean + contentlayer build + next build
    └── out/                  BUILD OUTPUT — committed to git, see below
```

## The critical convention: `out/` is committed

`michael-kuegeler-blog/out/` is deliberately **not** gitignored (the `/out/` line in `michael-kuegeler-blog/.gitignore` is commented out). The deploy workflow does **not** run a build — it checks out the repo and mirrors `michael-kuegeler-blog/out/` straight to the web host over SFTP.

**Therefore: any change to content, components, config, or styles must be followed by a rebuild, and the regenerated `out/` must be committed together with the source change.** Source-only commits silently do nothing to the live site. Every content commit in the history (e.g. `bfb232e "Link to substack updated"`) touches `data/…` plus a few hundred files under `out/` — that is expected and correct, not noise.

## Development workflow

All commands run from `michael-kuegeler-blog/`.

```bash
npm ci               # package-lock.json is the source of truth (see note below)
npm run dev          # dev server on :3000
npm run build        # next build (static export) + postbuild RSS
npm run lint         # eslint over app, components, layouts, scripts
npm run lint:fix     # same, with --fix
npm run prettier     # repo-wide format check (respects .prettierignore)
npm run prettier:fix # repo-wide format write
./build.sh           # full clean rebuild — use this before committing
```

**ESLint setup.** `eslint.config.mjs` imports `eslint-config-next/core-web-vitals` as a native flat config. Do **not** reintroduce `FlatCompat` here: `eslint-config-next` 16 exports self-referential plugin objects, and the eslintrc validator `JSON.stringify`s configs, so compat loading dies with `TypeError: Converting circular structure to JSON`. For the same reason, additional shared configs (`jsx-a11y/recommended`, `@typescript-eslint` recommended) are spread as **rules only** — flat config refuses to redefine a plugin name that `eslint-config-next` has already registered, and the hoisted `eslint-plugin-jsx-a11y` is a different instance from the one it registers.

Note also that `next lint` no longer exists — Next.js 16 removed the subcommand, so the `lint` script invokes `eslint` directly.

`build.sh` is the one to use before a commit:

```bash
rm -rf out .next
npx contentlayer2 build
npm run build
```

Run `npx contentlayer2 build` explicitly whenever MDX edits do not show up — Contentlayer's cache in `.contentlayer/` goes stale often (noted in `README.md`).

**Package manager:** `package.json` declares `packageManager: yarn@3.6.1` and `.yarn/` + `.yarnrc.yml` exist (inherited from the template), but there is **no `yarn.lock`** — only `package-lock.json`. Use **npm**, matching `build.sh` and the existing lockfile.

## Content model

Content lives in `data/` and is compiled by Contentlayer2 into `contentlayer/generated` (aliased to `.contentlayer/generated`).

**Two document types** (`contentlayer.config.ts`):

- **`Blog`** — `data/blog/**/*.mdx`. Frontmatter: `title` (required), `date` (required), `tags`, `lastmod`, `draft`, `summary`, `images`, `authors`, `layout`, `bibliography`, `canonicalUrl`. Computed: `slug`, `path`, `readingTime`, `toc`, `structuredData`.
- **`Authors`** — `data/authors/**/*.mdx`. Frontmatter: `name` (required), `avatar`, `occupation`, `company`, `email`, social handles, `layout`.

**The `Authors` type is reused as a generic page-content store.** Several standalone pages render an "author" document through a custom layout:

| Route | Author doc | Layout |
|---|---|---|
| `/cv` | `data/authors/michael.mdx` | `layouts/CVLayout.tsx` |
| `/contact` | `data/authors/gdprofficer.mdx` | `layouts/ContactLayout.tsx` |
| `/privacy` | `data/authors/privacy.mdx` | `layouts/PrivacyLayout.tsx` |
| `/` and `/about` | `data/authors/default.mdx` | `layouts/AuthorLayout.tsx` (via `app/about/AboutMain.tsx`) |

To edit those pages, edit the MDX in `data/authors/`, not the TSX. Note `app/page.tsx` (the home page) renders `AboutMain`, not the post list in `app/Main.tsx`.

**Other content config in `data/`:**
- `siteMetadata.js` — title (`Analog / Digital`), author, `siteUrl`, socials, analytics (Umami via `NEXT_UMAMI_ID`), comments (giscus), search (kbar), newsletter (buttondown).
- `headerNavLinks.ts` — the nav: Home, CV, Contact, Privacy.
- `assets.ts` — exported constants for gallery images and videos, all pointing at `https://www.kuegeler.com/gallery/` and `/video/`. **Large media is hosted externally, not in this repo.** Reference it via these constants.
- `projectsData.ts` — the `/projects` cards, built from `assets.ts` constants.
- `references-data.bib` — bibliography for `rehype-citation`.

**Adding a post:** create `data/blog/<slug>.mdx` with the required frontmatter, import any image constants from `@/data/assets`, then rebuild and commit `out/`. Components available inside MDX are limited to those registered in `components/MDXComponents.tsx`: `Image`, `TOCInline`, `BlogNewsletterForm`, plus overrides for `a`, `pre`, `table`.

## Conventions

- **Path aliases** (`tsconfig.json`): `@/components/*`, `@/data/*`, `@/layouts/*`, `@/css/*`, `contentlayer/generated`, `pliny/*`. Use them rather than relative climbs.
- **Formatting** (`prettier.config.js`): no semicolons, single quotes, width 100, 2-space indent, `es5` trailing commas, `prettier-plugin-tailwindcss` for class sorting. Enforced in lint via the `prettier/prettier` ESLint rule. `.prettierignore` excludes everything generated — `out/`, `.next/`, `.contentlayer/`, `next-env.d.ts`, `public/`, `package-lock.json` — which matters because `out/` is committed and would otherwise be rewritten by any repo-wide prettier run.
- **The husky `pre-commit` hook** runs `lint-staged` (`eslint --fix` on `app`/`components`/`layouts`/`scripts`, `prettier --write` on the rest). Two details make it work across the nested layout, and both are easy to break:
  - `prepare` is `cd .. && husky michael-kuegeler-blog/.husky`. Plain `husky` fails here — it must run from the directory containing `.git`, which is one level up, and otherwise just prints `.git can't be found` and silently installs nothing. It sets `core.hooksPath` to `michael-kuegeler-blog/.husky/_` (generated, gitignored). Run `npm install` (or `npm run prepare`) once per clone to install it.
  - `.husky/pre-commit` starts with `cd "$(dirname "$0")/.."`. Git runs hooks from the repository root, and husky's runner prepends a `./node_modules/.bin` that does not exist there, so without the `cd` lint-staged is neither found nor configured.
- The `lint-staged` eslint glob is scoped to the four source directories on purpose. An unscoped `*.+(js|ts|tsx)` pattern also matches the hundreds of built files under `out/`, which get staged whenever the site is rebuilt. Prettier's broader glob is safe because `.prettierignore` excludes `out/`.
- The tree is prettier-clean repo-wide and CI enforces it (`npm run prettier`). This covers what ESLint does not — the `data/**/*.mdx` content, `css/tailwind.css`, and the root config files. Use `npm run prettier:fix` before committing content changes. Note prettier normalizes MDX emphasis to `_underscores_`, so don't fight it by hand-writing `*asterisks*`.
- **Styling:** Tailwind v4 with CSS-first config in `css/tailwind.css` (`@theme` block, oklch color scale, `primary-*` and `gray-*`). No `tailwind.config.js`. Dark mode via a `.dark` class variant driven by `next-themes`.
- **TypeScript:** `strict: false` but `strictNullChecks: true`. `@typescript-eslint/no-unused-vars` and `explicit-module-boundary-types` are off.
- **Static export constraints** (`next.config.js` `output: 'export'`): no server runtime. `next/image` optimization is disabled (`unoptimized: true`) — use the `components/Image.tsx` wrapper. The `app/api/newsletter/route.ts` handler is `dynamic = 'force-static'`. The `headers()` CSP block in `next.config.js` has **no effect on the exported site** (headers are a server feature); it is kept from the template. Real headers would have to be set on the web host.
- **Language:** content is mixed German and English (often both in one document, as in `data/authors/default.mdx`); UI chrome is English. Match the surrounding document.

## CI

**`.github/workflows/ci.yml`** runs on pull requests targeting `main`, as two parallel jobs against Node 22 in `michael-kuegeler-blog/`:

- **`build`** — `npm ci`, `npx contentlayer2 build`, `npm run build`.
- **`lint`** — `npm ci`, `npm run lint` (ESLint, no `--fix`), then `npm run prettier` (repo-wide format check).

Neither job deploys anything or commits anything.

It deliberately does **not** verify that the committed `out/` matches the sources, even though that is the invariant most likely to be violated. A rebuild with zero source changes rewrites ~370 files under `out/`, because Next embeds a per-build ID in the `_next/static/<buildId>/` paths and asset hashes. A `git diff --exit-code -- out/` check would therefore fail on every PR. Keeping `out/` current remains a manual discipline: run `./build.sh` and commit the result.

## Deployment

- **`.github/workflows/direct.yml`** — the live path. Triggers on push to `main`. Checks out the repo and runs `sftp_upload_direct.sh`, which `lftp mirror -R`s the contents of `./michael-kuegeler-blog/out` into the host directory. No build step in CI.
- **`mirror -R` runs without `--delete`.** Files are uploaded and overwritten but never removed, so anything deleted from `out/` lingers on the host indefinitely — including the `_next/static/<buildId>/` directories of every previous build. Harmless in itself (stale assets are simply unreferenced), but it has a sharp edge: since the HTML is what points at a build ID, whichever deploy finishes **last** decides which build the site actually serves.
- **Both deploy workflows share `concurrency: group: sftp-deploy`** with `cancel-in-progress: false`, which exists because of exactly that edge. Two merges in quick succession used to race, and a slower older run could finish after a newer one and silently revert the site to the previous build. The group serializes them in start order; `cancel-in-progress` stays false so an upload in flight is never killed mid-mirror, which would leave the host half-updated. Do not remove this, and keep the group name identical in both files — a manual `deploy.yml` run and a push-triggered `direct.yml` run write to the same target.
- **`.github/workflows/deploy.yml`** — manual `workflow_dispatch` only. Zips `out/` and `put`s it via `sftp_upload.sh`; remote unzip is commented out, so this is effectively a fallback/upload-only path.
- Secrets used by both: `SFTP_SERVER`, `SFTP_USERNAME`, `SFTP_PASSWORD`, `SFTP_TARGET`. Never echo or commit these.
- `michael-kuegeler-blog/.github/workflows/pages.yml` is leftover from the upstream template. It sits in a subdirectory, so GitHub Actions does not run it — ignore it.

## Git workflow

- Work happens on a feature branch, then a PR is merged into `main` (history shows a recurring `dev` → `main` PR pattern).
- Merging to `main` deploys immediately. Do not push to `main` directly.
- Commit messages are short and descriptive, sentence case (`"Link to substack updated"`, `"Start page updated"`).
- Expect large diffs from the committed `out/` directory; review the `data/`, `app/`, `components/`, `layouts/` portion of a diff and let the `out/` churn stand.
