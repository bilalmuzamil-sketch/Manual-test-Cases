# SV-9013 — attaching a file to a note silently does nothing (intermittent)

**Status: DONE — QA PASSED. 13 of 13 checks pass, including the customer's exact scenario.**
QA comment `76714` posted; follow-up ticket **SV-10160** raised for a misleading message found on the
way. Nothing is inferred; every line below was observed live.

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

## The last three checks (run after a fresh sign-in, same build marker)

The session expired mid-run and a fresh one was supplied. The build marker was re-read at that point
and again at the end — `507b0fee…`, last-modified Tue 15 Sep 13:34:53 GMT, identical throughout — so
these checks sit on the same build as the first ten.

| # | Check | Result |
|---|---|---|
| 11 | **Three files in one pick**, focus at 0.5 s and files at 4 s | PASS — one `note/create` + one `add-attachments`, all three present, all three survive a refresh |
| 12 | **Eleven files in one pick** | PASS — a dialog names the eleventh and offers *"Create the note with the 10 supported file(s)?"*; pressing **Create** stores exactly 10 (verified by name after a refresh), the eleventh never uploads |
| 13 | **A 12 MB PDF** | PASS — uploads normally, so the size ceiling is above 12 MB |
| 14 | **Alt-tab three times while the picker is open** (blur+focus at 0.5 s, 3 s, 6 s; file at 8 s) | PASS — exactly one hidden input throughout, never torn down; the Attach button re-enables at ~2.5 s (the documented SV-10078 behaviour) and the file still uploads and survives a refresh |

Check 14 is the developer's third "known" item observed directly: the button does free up while the
window is still open, and it costs nothing — the selection still lands.

## The one thing raised: SV-10160

The eleven-file dialog reads **"Unsupported files — These file(s) aren't supported: ZZ9013-lim-11.pdf."**
The file is a PDF, which the app supports; it was only the eleventh. The shipped source classifies the
three reasons separately (`DropReason = 'unsupported' | 'oversize' | 'limit'` in
`src/utils/noteAttachments.ts`) but the dialog renders the same sentence for all of them.

**Checked on production before raising it** — `app.shopview.com`, build `v26.36.7-cf5012e`, eleven PDFs
picked, identical message, then **Cancel** pressed: no API call was made and the notes tab was still
empty, so nothing was created there. It is therefore **pre-existing, not introduced by this fix**, and
the ticket says so.

[SV-10160](https://shopview.atlassian.net/browse/SV-10160) — Bug, Medium, Product Area Work Orders,
Relates → SV-9013, no parent (SV-9013 has none either). Written to the follow-up format: the
*"Found while testing SV-9013"* credit line first, a two-line description, PO-runnable steps on the QA
branch, current vs expected, one annotated screenshot, environment — and no developer technical
section. Read back live: 1 rendered image from Jira's own attachment store, all five headings, title
80 characters.

## The QA comment

`76714` on SV-9013, posted after the pre-post gate (build marker re-read live and identical, ticket
still TESTING QA with no new comment since the developer's handoff, text scanned for any
machine-authored tell). Read back from Jira afterwards: **4 exhibit images in the right order, all
real Jira attachments** (61005–61008), 15 table rows (header + 14 checks), first line
*"OVERALL QA STATUS: PASSED"*.

Exhibits: `ev/EX1_before_after.png` (production vs branch, the Rule-73 comparison) ·
`ev/EX2_alt_tab.png` · `ev/EX3_multiple_files.png` · `ev/EX4_ten_file_limit.png` ·
`ev/TICKET_unsupported_wording.png` (SV-10160).

## Honest limits

* The iPhone photo-library behaviour behind the HEIC decision cannot be observed from a desktop
  browser — the code itself carries a `TODO(SV-7324)` saying no test here can observe it.
* No OneDrive / SharePoint / network drive could be mounted, so the "slow to release" condition was
  produced by holding the file back a measured number of seconds. That is the same delay the fix
  guards against, and a 12 MB file was tested as well. Stated plainly in the comment.
* SV-9013 was **left at TESTING QA** — the status move is the QA lead's or the developer's.

## Production left clean

One note was created on production by the first (successful, fast) pick and has been **deleted** —
the work order's Notes tab reads "No Work Order Notes Yet" again. `ev/PC2_prod_notes_after_clean.png`.
