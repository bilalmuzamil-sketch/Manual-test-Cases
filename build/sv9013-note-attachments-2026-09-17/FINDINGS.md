# SV-9013 — attaching a file to a note silently does nothing (intermittent)

**Status: testing in progress — 10 checks done, all pass; the branch sign-in expired mid-run and the
last few checks need a fresh one.** Nothing is inferred; every line below was observed live.

## What the ticket says, and what the fix does

The reporter (Nevada Cosby, Taylor Browne Heavy Equipment Repair Ltd, via Intercom) says: *"I click on
the attach files button and select my file. But nothing attaches"* — a PDF, on a laptop, intermittently,
across several work orders. The developer's handoff describes the same thing from the code side: *"the
file was picked, but the upload never started and no error appeared. It happened when the browser took
a moment to hand the file over, so it looked random."*

The shipped source (read from the branch's own published sourcemap,
`/js/useNoteAttachmentPicker.DnPfC6zX.js.map`) names the mechanism exactly. Before this fix,
cancellation was **guessed** from the window regaining focus plus a **300 ms** grace, and on expiry the
hidden file input *and its change listener* were torn down — so a selection that landed even slightly
later hit a dead input and was discarded silently. The fix is two parts: the native `cancel` event is
now the authoritative dismissal signal, and resolving the caller's promise no longer ends the
interaction — the input keeps listening for up to `LATE_SELECTION_WINDOW_MS = 120_000`, with a late
selection delivered through `onLateFiles`. The focus grace is now `FOCUS_FALLBACK_GRACE_MS = 2_500`.

That tells us the shape of the real reproduction: **the window regains focus while the picker is still
open (alt-tab, or the dialog closing) and the file arrives after the grace.**

## Environments

| | URL | Build | Read |
|---|---|---|---|
| Fix branch | `sv9013.qa.shopview.com` | **v26.36.7-ca0ef20** | last-modified Tue 15 Sep 2026 13:34:53 GMT, etag `507b0fee…`, sha256 `9e1641b3cfe988cc` — identical at the start and at the end of the run, so no redeploy |
| Production (the pre-fix "before") | `app.shopview.com` | **v26.36.7-cf5012e** | signed in with credentials, not cookies |

Test data: work order **S9013-17435** and customer **Mayfield Heights Truck Centre** on the branch;
work order **S2-874 (ZZAUTOTEST Bridgeport Hauling)** on production. Every pick used a uniquely named
PDF (`ZZ9013-<case>.pdf`) so "did it attach?" is never ambiguous.

**Harness note, stated plainly:** the file dialog is a native OS dialog that no automation can drive, so
Playwright's file chooser is intercepted and the file is handed over programmatically after a measured
delay; the window-focus event that the old code keyed on is dispatched on the page. Everything else —
the clicks, the screens, the uploads, the results — is the real application.

## BEFORE: the defect reproduces on production

Clicked **Attach files** on the Notes tab, dispatched window focus 0.5 s later (the dialog losing
focus), then handed the PDF over at 4 s.

* **No network call at all** — not `note/create`, not `note/add-attachments`
* The notes list still reads **"No Work Order Notes Yet"**
* **No error anywhere on screen**
* Still nothing after a full page refresh — so the file never reached the server

`ev/PB3_1_before.png`, `ev/PB3_2_after.png`.

For completeness, a *fast* pick on production (no focus event, file handed over after 5 s) **does**
upload — which is exactly why the customer saw it as random.

## AFTER: the same reproduction on the fix branch

Same steps, same timings: `POST /api/note/create` **201** → `POST /api/note/add-attachments` **201**,
the attachment card appears **without a refresh**, and the notes count goes 3 → 4.
`ev/B1_1_before.png`, `ev/B1_2_after.png`.

## What has been checked so far

| # | Check | Result |
|---|---|---|
| 1 | New note → **Attach files**, work order, slow pick (5 s, no focus event) | PASS |
| 2 | **The reported case**: focus at 0.5 s, file at 4 s, work order | **PASS** (production fails) |
| 3 | Same with the file arriving at **30 s** | PASS |
| 4 | Existing note → **⋮ → Attach files**, work order | PASS (`add-attachments` only, no new note) |
| 5 | New note → **Attach files**, **customer** notes | PASS |
| 6 | Existing note → **⋮ → Attach files**, **customer** notes | PASS |
| 7 | **Cancel** (native `cancel` event): button re-enables, hidden input removed, no upload, and the next pick works | PASS |
| 8 | **Cancel with no `cancel` event** (the older-browser path): button stays disabled through the 2.5 s grace and re-enables at ~2.5 s; the input stays in the DOM listening, as designed; next pick works and uploads | PASS |
| 9 | **Unsupported file** (`.heic`): *"Unsupported files — These file(s) aren't supported: …"* dialog, nothing uploaded, nothing stored | PASS |
| 10 | **Over two minutes** (file handed over at 125 s): dropped, no upload, button not stuck | Behaves exactly as the developer documented (SV-10078) — **not raised** |

**The hidden input is well behaved throughout:** while a picker is open there is exactly one, with
`tabIndex -1` and `aria-hidden="true"` (so a keyboard user cannot tab into it), and it is removed on a
real cancel. `ev/C_focus.png`.

## Known items confirmed, not raised

* Over two minutes with the dialog open → the selection is dropped by design (SV-10078).
* The iOS 14/15 2.5-second re-enable delay after a cancel is this same focus grace; it was observed on
  desktop as the ~2.5 s in check 8.

## Still to do (needs a fresh branch sign-in)

The QA-branch session expired mid-run — `POST /api/quick-login` now answers
**401 `sso_required`**, which is the ordinary ~24 h SSO expiry, not a deploy: the build marker is
byte-identical to the start of the pass. Outstanding:

* several files in one pick, and the 10-attachment limit
* the alt-tab-while-open case the developer mentions (documented as SV-10078)
* the annotated before/after exhibit and the QA comment

## Production left clean

One note was created on production by the first (successful, fast) pick and has been **deleted** —
the work order's Notes tab reads "No Work Order Notes Yet" again. `ev/PC2_prod_notes_after_clean.png`.
