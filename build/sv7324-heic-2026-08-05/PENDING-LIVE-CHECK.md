# PENDING LIVE CHECK — SV-7324 HEIC on a real iPhone

**STATUS: OPEN** — check at every session start. Closes only when all 4 checks below are observed on
a real iPhone by a human, with evidence.

**Why it is open:** the fix works by making iOS convert HEIC → JPEG *inside the iOS photo picker*,
before the browser receives a file. That is not observable from this container, by emulation, by a
mobile-viewport browser, by user-agent spoofing, or by any automated test. It needs a **real physical
iPhone** — the one blocker category Standing Rule 14 accepts as genuine, and the same reason a case
would carry `AUTOMATION: HOLD`.

**This is NOT waiting on a timer and cannot be self-cleared.** It needs a person with a phone.

---

## Build marker at the time of writing (Standing Rule 49)

| Field | Value |
|---|---|
| Environment | `sv7324.qa.shopview.com` |
| App version | **`v3.4.2-fc52c44`** |
| `index.html` last-modified | Tue, 04 Aug 2026 12:36:01 GMT |
| etag | `ea8a27a71b369e387d4e9fb188bf07cf` |
| sha256 of `index.html` | `f91db12ebe6aba524ea666926f4efc23075c846516fda37752811daaf112b8d2` |
| Read at | 2026-08-05T18:07:51Z |

**If the app version has changed when this queue is picked up, re-read `FINDINGS-2026-08-05.md`
section "What I verified LIVE" before testing** — the accept list and the two risks were read from
this exact bundle and a redeploy can move them.

---

## The rows

| # | Check | Depends on | Status | Evidence needed |
|---|---|---|---|---|
| 1 | New-note path: **Attach Files** → camera-roll photo → attaches, renders, arrives as `.jpg` | real iPhone | **NOT OBSERVED** | screenshot + attachment file name |
| 2 | Existing-note path: **⋮ → Attach files** → same result | real iPhone | **NOT OBSERVED** | screenshot + attachment file name |
| 3 | A `.heic` in the Files app is not selectable (expected trade-off, not a bug) | real iPhone | **NOT OBSERVED** | screenshot |
| 4 | Large photo + 3-at-once still attach (the 300 ms transcode race, Risk 2) | real iPhone | **NOT OBSERVED** | screenshot + photo size + iPhone model / iOS version |
| 5 | Server MIME allow-list genuinely excludes `image/heic` / `image/heif` (Risk 1) | fresh `.qa.shopview.com` cookies | **NOT OBSERVED** | captured `GET /api/note/list-supported-mime-types` response |
| 6 | Drag-and-drop of a `.heic` still hits the "Unsupported files" dialog | fresh cookies (desktop) | **NOT OBSERVED** | screenshot |
| 7 | Blocked `list-supported-mime-types` request no longer poisons the session for its whole life | fresh cookies (desktop + devtools) | **NOT OBSERVED** | screenshot |

Rows 1–4: run `iPhone-Test-Script_SV-7324_2026-08-05.md`.
Rows 5–7: need a live session on the environment; rows 6 and 7 come from the dev's own QA handoff
checklist on the ticket.

**Row 5 is a diagnostic, not a prerequisite** — rows 1/2/4 settle the question either way. A `.jpg`
landing proves the server list excluded HEIC. Row 5 only matters if the phone test fails, and then it
is the first thing to check.

---

## What is already CONFIRMED and does not need re-checking on the phone

Read live from the deployed bundle (541 chunks, 5.9 MB, transitive closure, no sampling):

- the `accept` attribute **is** set on the file input (`useNoteAttachmentPicker.Be51Fctn.js` — kept in
  `evidence/`)
- the hardcoded fallback accept list **excludes** HEIC/HEIF
- `heic` / `heif` appear **0 times** in the entire frontend — the superseded client-side approach is
  genuinely gone
- both call sites exist: `attach_files` (label **Attach Files**) and `menu_item_attach_files`
  (label **Attach files**)
- limits: 10 files, 50 MB each

---

## On closing this

Close it only when rows 1–4 are observed with evidence. Rows 5–7 can close separately when cookies
arrive. **Do not close any row by inference** (Standing Rule 12) — and note that a pass on rows 1–4
is still against a build that has not been declared final, so the verdict is **PROVISIONAL** until it
is (Standing Rule 49 / 60).
