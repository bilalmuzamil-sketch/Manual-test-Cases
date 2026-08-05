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
| 5 | Server MIME allow-list genuinely excludes `image/heic` / `image/heif` (Risk 1) | ~~cookies~~ | ✅ **CLOSED 2026-08-05 18:32Z** — 15 types, no HEIC, byte-identical to the bundle fallback | `evidence/list-supported-mime-types.json` |
| 6 | Drag-and-drop of a `.heic` is refused | ~~cookies~~ | ✅ **CLOSED 2026-08-05** — real `partitionAttachments` + real server list → rejected, reason `unsupported` | `evidence/race-test.mjs` test D |
| 7 | Blocked `list-supported-mime-types` request no longer poisons the session for its whole life | a desktop session + devtools | **NOT OBSERVED** | screenshot |
| 8 | `accept` on the live page, **both** call sites, byte-equal to the server list and free of HEIC | ~~cookies~~ | ✅ **CLOSED 2026-08-05** — `button_attach_files` and `menu_item_attach_files` both correct | `evidence/notes-page-live.png` |
| 9 | **The 300 ms window discards a late-arriving file** | ~~cookies~~ | ⚠️ **CONFIRMED AS A REAL DEFECT RISK 2026-08-05** — 400 ms → 0 files, 100 ms → 1 file, against the real shipped module | `evidence/race-test.mjs` tests B + C |

Rows 1–4: run `iPhone-Test-Script_SV-7324_2026-08-05.md`. **Row 4 is now the priority after row 1** —
row 9 proved the trap it hunts is real in shipped code.
Row 7: still needs a desktop session + devtools; it is a secondary item from the dev's own handoff
checklist, not part of the ticket's core claim.

**Rows 5, 6, 8 and 9 were closed on 2026-08-05** once a session became available — so **everything on
our side of the wire is now settled** and only the on-phone behaviour is outstanding.

**⚠️ Row 9 is a finding, not a pass.** It is confirmed that a file arriving more than 300 ms after the
picker closes is **silently discarded**. What is unknown is whether an iPhone's HEIC→JPEG transcode is
slow enough to trigger it. Rows 1 and 4 are what answer that.

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
