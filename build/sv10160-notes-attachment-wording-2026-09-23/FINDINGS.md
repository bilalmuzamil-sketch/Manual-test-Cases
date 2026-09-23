# SV-10160 — "an 11th file is called unsupported when it is only over the 10-file cap"

**Verdict: PASS.** Every message the developer described is on the branch, word for word, on both
surfaces and through both entry points.

## §0 — Sources and environments

| | where | build | last-modified |
|---|---|---|---|
| AFTER (fix) | `sv10160.qa.shopview.com` | **`v26.36.9-4e4ea7d`** | Wed, 23 Sep 2026 10:34:03 GMT |
| BEFORE (pre-fix) | `app.shopview.com` (production, Rule 86) | **`v26.36.9-8d1613f`** | Tue, 22 Sep 2026 09:38:08 GMT |

**The ticket** (SV-10160, Bug, TESTING QA, reported by us while testing SV-9013) defines the case:
eleven supported PDFs picked at once, the eleventh left out — correct — but described as *"not a
supported type"*, which it is not; it was only the eleventh.

**The developer's handoff** (Slavcho Mitrov, 23 Sep, PR #3240) says only the wording changed — the
same files are accepted and rejected as before — and lists four messages, two entry points and two
surfaces. It is the checklist mirrored below; **the ticket description is what defines the pass.**

**Test data:** eleven PDFs `ZZAUTOTEST-01.pdf` … `ZZAUTOTEST-11.pdf` (193 bytes each),
`ZZAUTOTEST-BIG.pdf` (**54,526,147 bytes**, a supported type deliberately over the 50 MB limit) and
`ZZAUTOTEST-photo.heic` (an unsupported type). Files were chosen through the real file picker, not
injected — the attach control raises a genuine chooser and `isMultiple()` is `true`.

## §1 — The BEFORE, on production — the reported bug reproduces exactly

Work order **S2-194** (First Customer Prod) → **Notes** → the attach icon → eleven PDFs:

> **Unsupported files**
> These file(s) aren't supported: **ZZAUTOTEST-11.pdf**. Create the note with the 10 supported file(s)?

A PDF, called unsupported, purely because it was eleventh. Exactly what the ticket reports.
Evidence `P2-prod-11pdfs.png`.

## §2 — The four messages on the fix branch — all four match

Work order **S3-16829** (`5841df7a-4bb8-4602-b964-3d621bbbda9f`) → **Notes** → the attach icon next
to *New Note*:

| case | files | heading | message |
|---|---|---|---|
| A — the reported case | 11 PDFs | **Too many files** | "You can attach 10 files at a time, so this one was left out: **ZZAUTOTEST-11.pdf**. Create the note with the remaining 10 files?" |
| B — over the size limit | 1 PDF + a 52 MB PDF | **File too large** | "This file is over the 50 MB limit: **ZZAUTOTEST-BIG.pdf**. Create the note with the remaining file?" |
| C — genuinely unsupported | 1 PDF + a .heic | **Unsupported file** | "This file type isn't supported: **ZZAUTOTEST-photo.heic**. Create the note with the remaining file?" |
| D — all three at once | 11 PDFs + big + .heic | **Some files weren't attached** | one line per reason, all three present, then "Create the note with the remaining 10 files?" |

**A is the ticket's case and it is fixed**: the eleventh PDF is now described as left out because a
note takes ten at a time, and **"not supported" is kept for the file whose type genuinely is not
allowed** (case C) — which is precisely what the ticket asked for.

## §3 — Accepting and cancelling

| behaviour | result |
|---|---|
| **Cancel** on the dialog | nothing attached — 0 `ZZAUTOTEST` filenames anywhere on the page |
| **X** (close) on the dialog | nothing attached — 0 filenames |
| **Create** | note created with **exactly 10** attachments — `ZZAUTOTEST-01` … `-10`, and **`ZZAUTOTEST-11.pdf` absent** |

The Create result was counted two independent ways: **ten filenames** in the page text and **ten
`note_attachment_card_…` elements** on the created note (`121077ed-3303-4df1-9f9b-72560347bd37`).

## §4 — Both entry points, both surfaces

| surface | entry point | heading | action wording |
|---|---|---|---|
| Work Order notes | attach icon beside *New Note* | Too many files | "Create the note with the remaining 10 files?" · **Create** |
| Work Order notes | existing note **⋮ → Attach files** | Too many files | "Upload the remaining 10 files?" · **Upload** |
| Customer notes | attach icon beside *New Note* | Too many files | "Create the note with the remaining 10 files?" · **Create** |
| Customer notes | existing note **⋮ → Attach files** | Too many files | "Upload the remaining 10 files?" · **Upload** |

The reason sentence is identical in all four; only the closing question and the button change, and
they change **correctly** — a new note is *created*, files added to an existing note are *uploaded*.
Customer **4 Star Truck Repair** (`6a7b6afc-084d-4584-aacb-773bcd71cbcd`) also showed the combined
**"Some files weren't attached"** dialog with all three reasons, so the fix is not work-order-only.

## §5 — Honest notes on method

- **Two console logs were lost to script crashes** (the customer all-three case, and a file-chooser
  timeout while seeding). In both cases the **screenshot taken in the same run carries the result**,
  and that is what the verdicts above rest on — the same Rule-79(c) lesson as SV-10035: a missing log
  is a fault in my harness, not a result.
- **The customer had no notes**, so one was created (`ZZAUTOTEST SV-10160 note`) purely to exercise
  the existing-note entry point (Rule 87 — build the state rather than skip the check).
- The branch's work-order list looked empty through the API shape I first used while **33 rows were
  rendered on screen**; the screen was the truth and was used instead (Rule 89).

## §6 — Test data left on the branch

Per-ticket QA branches need no cleanup, so this is a record, not an apology: one note on work order
**S3-16829** with ten `ZZAUTOTEST` PDFs, and one note on customer **4 Star Truck Repair**. All
prefixed `ZZAUTOTEST`. **Nothing was left on production** — every production dialog was cancelled,
and no note was created there.

---

## §7 — Exhibits

Built with PIL over the raw captures in `ev/`. No image is simulated or reconstructed; every
panel is a real screenshot, labelled with the environment, the build marker and the date it
was taken.

| Exhibit | File | What it shows |
|---|---|---|
| 1 | `ev/exhibit-1-before-after.png` | **Rule 73 before/after.** Production (`v26.36.9-8d1613f`) beside the branch (`v26.36.9-4e4ea7d`), the same eleven PDFs on the same kind of note. Left: "Unsupported files … These file(s) aren't supported". Right: "Too many files … You can attach 10 files at a time, so this one was left out". |
| 2 | `ev/exhibit-2-the-other-messages.png` | The other three messages on the branch — over the size limit, unsupported type, and the mixed case with one line per reason. |
| 3 | `ev/exhibit-3-create-attaches-ten.png` | Create attaches exactly ten — all of ZZAUTOTEST-01 … -10 visible in one frame, the eleventh absent. |
| 4 | `ev/exhibit-4-everywhere.png` | The same message on a customer note and when adding files to a note that already exists, where the wording correctly reads "Upload the remaining 10 files?" with an **Upload** button rather than Create. |

**Re-capture note (honest method, Rule 12).** The first capture of the Create result was taken
at a 1900px viewport, where the attachment strip scrolls horizontally and only nine of the ten
cards were in frame — a reader could not have verified "exactly ten" from that picture. It was
re-taken at 2560px (`ev/B-E3b-wide.png`), where the note block measures 2051px and all ten fit.
The card count was also read from the DOM in the same run: **10**, named
`ZZAUTOTEST-01 … ZZAUTOTEST-10`, with no `ZZAUTOTEST-11.pdf`. Work order **S3-16829**
(`5841df7a-4bb8-4602-b964-3d621bbbda9f`) still carries the note.

## §8 — Pre-post gate (Rule 72), run 23 Sep 2026

| Check | Result |
|---|---|
| Branch build marker re-read live | `v26.36.9-4e4ea7d`, last-modified Wed 23 Sep 2026 10:34:03 GMT, etag `b58a0941b140d935a2e7cc5c91c8dbca` — matches the exhibits |
| Production build marker re-read live | `v26.36.9-8d1613f`, last-modified Tue 22 Sep 2026 09:38:08 GMT, etag `bb2fc9820ec15cc1d8c1161c3477a7dc` — matches the exhibits |
| Ticket state re-read | SV-10160, status TESTING QA, priority Medium, 1 comment (the developer's handoff, 77120). Nothing new since testing began. |
| Named test data still live | Work order S3-16829 opened and its ten attachments counted this run |
| Every figure traced to a live measurement | Yes — the four message strings, the 10/11 counts and the two build markers were all read this pass |
| Human voice / no AI fingerprint | Scanned the comment text nodes before posting |
| No technical-details section | Absent unless the QA lead asks for one (Rule 84) |
| Read back after posting | Done — see below |

## §9 — Posted

**Comment [77129](https://shopview.atlassian.net/browse/SV-10160?focusedCommentId=77129)**, verdict
PASSED, posted 23 Sep 2026. Four exhibits uploaded as **real Jira attachments** (61298–61301), not
external links (Rule 81).

Read back from Jira in ADF and verified:

| | expected | read back |
|---|---|---|
| first line | `OVERALL QA STATUS: PASSED` | matches |
| media | 4, all `type: file`, in order | 4, all `file`, aspect ratios match exhibits 1–4 in order |
| table rows | 11 (header + 10 checks) | 11 |
| "PASSED" occurrences | 11 (verdict + 10 rows) | 11 |
| technical-details section | absent (Rule 84 — the QA lead said no for this ticket) | absent |
| AI fingerprint in reader-facing text | none | none |

