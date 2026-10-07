# SV-10274 — Work order note with many images extends sideways — QA findings (7 Oct 2026)

**Ticket:** [SV-10274](https://shopview.atlassian.net/browse/SV-10274) · TESTING QA · Medium · parent SV-9667 · reporter Ryan Fyfe (PowerTools, customer Intercom 215476000331984) · Relates SV-10246
**Handoff:** Nemanja 77886 — checklist: 12 images wrap, no sideways scroll, ⋮ visible; same at 375 px; viewer still works. PR ShopView/shopview#3369.
**Sources read in full:** description; comments 76958 (Milos), 77599 (Mike Freeman + screenshot: zoomed-in, horizontal scrollbar only visible at the bottom), 77886; attachments: Mike's image, the Intercom transcript (advisor thought Edit/Delete were gone; ⋮ pushed off-screen by photos), the 45 s screen recording (frames extracted every 4 s: notes with photos in one long row).
**AFTER:** sv9667 `v26.40.8-cf5b7ad` (read at start and at the gate). **BEFORE:** production `app.shopview.com` `v26.40.8-1e8e914`, org 72b2cc90, WO S2-861.

## Set-up
Branch WO **S2-17414**: notes created (WO note on screen via New Note; others via `/api/note/create`, same call the screen makes) and **all images attached on screen** through ⋮ → **Add attachment** (file chooser, multiple). Picking 12 at once shows **"Too many files — You can attach 10 files at a time, so these were left out: … Upload the remaining 10 files? Cancel / Upload"** → Upload → then add 11–12 in a second pass. Notes: WO 12 (`3aebdd5b…`), line 12 (`03ac3d5c…`), WO 25 (`5b320a2b…`), customer West Mifflin 12 (`57fa74f9…`). Test images `zz10274_img01–25.png` (800×600, numbered).

## Variant matrix (Rule 96) — measured live (scrollWidth vs viewport, attachment rows, ⋮ rect + elementFromPoint, horizontal scrollers, menu, viewer)
| Note | 1920×1080 | 1366×768 | 960×1080 (=1920 @200% zoom) | 375×812 |
|---|---|---|---|---|
| WO 12 | 3 rows, no h-scroll, ⋮ visible+on top, menu, viewer 800×600 | 4 rows ✓ | 4 rows ✓ | 12 rows ✓ (viewer image loads after ~6.6 s with ~50 thumbnails loading) |
| Line 12 | 3 rows ✓ | 4 rows ✓ | 4 rows ✓ | 12 rows ✓ |
| WO 25 | 5 rows ✓ | — | 9 rows ✓ (⋮ checked scrolled into view) | 25 rows ✓ |
| Customer 12 | 3 rows ✓ | — | — | 12 rows ✓ |
| **Production WO 12 (BEFORE)** | **1 row, note to x=2447, ⋮ at x=2400 (off-screen), notes panel scrolls sideways (2091/1530)** | same, ⋮ at 2417 | same, ⋮ at 2058 | same, ⋮ at 2044 |
Menu items: **Edit · Add attachment · Delete Note**; Edit → "Update Note" dialog; Delete Note → "This note and its attachments will be deleted for everyone. This cannot be undone. Cancel / Delete" (cancelled, 0 writes). Harness artefacts disclosed: at 960 the first run scrolled the note under the sticky header (click hit "Clock In") — re-measured centred → pass; 375 viewer blank at 2–3.5 s = loading, proven by polling (loaded at 6.6 s).

## Observations, bucketed (Rule 93)
- (d→ask QA lead) Images in a note are not shown in upload order (e.g. 11, 12, 10, 9, 7, 8, 5, 4, 3, 6, 2, 1). **Same on production.** Outside this ticket.
- (c) "Too many files" 10-at-a-time: expected, per the handoff.
- (c) Thumbnails/viewer take several seconds when ~50 images load on one page — loading, not a layout defect; not compared with production.

## Production clean-up (restore-after)
Note `2fbaae87…` on S2-861 created, 14 images (an interrupted run uploaded 2 extra; 2 removed via the hover trash icon → `POST /api/note/delete-attachment` 200 ×2), measured, then **deleted** (`POST /api/note/delete` 200); reload confirms gone.

## Posted
Comment **78031** — PASSED, 8 rows, desktop + phone before/after (attachments 61883, 61884). Gate: markers cf5b7ad / 1e8e914 unchanged; ticket TESTING QA, last comment 77886; 0 fingerprint hits; no technical section (Rule 84 — asked in chat). Read back: panel success, 2 media file (1590×1128, 770×697), 9 table rows, 4 steps.

## Learning check (Rule 95)
Recorded in playbook §AC.15 addendum 2: note ⋮ labels; Add attachment file chooser + "Too many files" dialog; per-file delete is a hover icon (`delete_attachment_<id>` → `/api/note/delete-attachment`); `/api/note/delete`; the layout-measuring recipe. Lessons: I hit the `pkill -f` self-kill trap again (already in §U.0b) — logged as a recurrence.

## QA lead's answers (7 Oct 2026)
Technical section on 78031: *"No"*. Image-order observation: *"No - Because its the same on production too."* — not raised. SV-10323: *"We will check that later."*
