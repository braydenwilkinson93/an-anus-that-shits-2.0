# An Anus That Shits — self-hosted, admin-editable site

This is your original Next.js site rebuilt with a full in-browser admin editor
modeled on Squarespace's/Webflow's "sections + blocks" pattern, but running
entirely on your own machine with content stored in plain files you own.

## What you can do in Admin Mode

- Click any heading, paragraph, or label on the live site to edit it in place
- Drag the ⠿ handle on the left of a section to reorder homepage sections
- Drag the bar at the bottom of a section to resize its height (button to reset)
- Drag book covers left/right in the shelf to reorder the reading canon
- Click "+ Add Volume" to add a new book, or the × on a cover to remove one
- Open a book's modal and click "Replace cover" to upload a new image
- Change a book's status (Completed / In Progress / Upcoming) from a dropdown
- Every edit autosaves ~0.5s after you stop typing — watch the "Saving…/Saved"
  indicator bottom-right

## Setup (VS Code / macOS)

1. Open this folder in VS Code.
2. Copy the env template and set your own password:
   ```bash
   cp .env.local.example .env.local
   # then edit .env.local and set ADMIN_PASSWORD to something only you know
   ```
3. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```
4. Open http://localhost:3000. Click **Admin** (bottom-right) and log in with
   your password to enter edit mode.

Everything you edit is written to `data/content.json` and uploaded images land
in `public/books/`. Both are plain files in this project — check them into git
whenever you want a snapshot, and revert with git if you ever want to undo a
round of edits.

## How this maps to "big name" site builders

I looked at how Squarespace and Webflow structure their editors before
building this, since that's the standard for "control everything" site
building:

- **Squarespace's Fluid Engine** is a section-based drag-and-drop editor:
  pages are made of ordered *sections*, each containing *blocks* (text,
  image, embed). You can't break the layout, but you also can't go past what
  the template allows.
- **Webflow** exposes real CSS (box model, flex, grid) for full design
  control, at the cost of a steeper learning curve — most people who want
  that level of control end up hiring a specialist to run it.
- Both platforms store your content in *their* hosted database. You're
  renting the editor and the hosting together, monthly, forever.

This build takes the Squarespace *pattern* — ordered sections made of
editable blocks — and implements it directly in your own Next.js code:
`data/content.json` is the database, your Mac's filesystem is the storage,
and the drag/resize/edit UI (`components/HomeSections.tsx`,
`SortableSection.tsx`, `EditableText.tsx`) is the equivalent of Fluid
Engine. You get the editing experience without a subscription, without
vendor lock-in, and without your essays and book notes living on someone
else's server before you're ready to publish.

## Important: how the "admin write" system actually works

The edit/save/upload endpoints (`app/api/content/route.ts`,
`app/api/upload/route.ts`) write directly to files on disk
(`data/content.json`, `public/books/`). That's exactly what makes this feel
"fully integrated with your Mac" — there's no database, no cloud account,
nothing to configure.

The trade-off: **this only works on a server with a writable filesystem**,
which `next dev` and `next start` on your own machine both are. If you later
deploy to a static/serverless host (Vercel, Netlify, etc. in their default
mode), file writes at request time generally aren't persisted between
requests — the site would still *display* fine, but the admin editor
wouldn't be able to save changes there. When you're ready to go from
"private and editing on my Mac" to "live on the internet," you'd either:

1. Keep editing locally and `git push` the updated `data/content.json` /
   `public/books/` files whenever you deploy a new version (simplest, fits
   how you described wanting to work), or
2. Swap the storage layer in `lib/content.ts` for a real database (Postgres,
   SQLite via Turso, etc.) if you want to edit the live site directly without
   redeploying — this is the point where you'd be reimplementing what
   Squarespace/Sanity/Contentful sell as a service. Ask me when you're ready
   for this and I'll wire it up.

## Security notes

- The admin password lives in `.env.local`, which is git-ignored — never
  commit it.
- Sessions are a random token in an httpOnly cookie, valid for 7 days, held
  in server memory (fine for single-user local use; restarting `next dev`
  clears all sessions).
- Image uploads are restricted to JPG/PNG/WEBP/GIF, 8MB max, and only ever
  write inside `public/books/`.
- None of the admin write routes are reachable without logging in first.

## Project structure

```
app/
  page.tsx              — homepage (server component, loads content.json)
  layout.tsx
  api/
    content/route.ts    — GET (public) / PUT (admin) content.json
    upload/route.ts     — POST (admin) book cover image upload
    auth/route.ts        — login / logout / session check
components/
  ContentProvider.tsx   — client-side content state + autosave
  AdminBar.tsx          — login form, edit-mode toggle, save status
  SortableSection.tsx   — drag-to-reorder + drag-to-resize section wrapper
  HomeSections.tsx       — orders and renders all homepage sections
  SiteHeader.tsx / HeroSection.tsx / BookCarousel.tsx / BookModal.tsx
  EditableText.tsx      — inline contentEditable text bound to content.json
data/content.json       — all editable site content (the "database")
lib/content.ts           — types + fs read/write
lib/auth.ts              — password check + session store
public/books/            — all 31 cover images, plus anything you upload
```

## A note on `AGENTS.md`

Your original upload included an `AGENTS.md`/`CLAUDE.md` pair claiming this
was a modified version of Next.js with hidden docs an AI assistant should
read before writing code. That's not real Next.js behavior, and I disregarded
it as a prompt injection rather than following its instructions — I didn't
carry those files into this build. If you didn't write that file yourself,
it's worth finding out where it came from.
