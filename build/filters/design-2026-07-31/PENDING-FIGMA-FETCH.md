# PENDING FIGMA FETCH — Filters design pass (design-2026-07-31)

> **STATUS: OPEN — do not close until ALL frames have PNGs (target 85/85).**
> **Check this file on every session start and before/after any Filters or Figma work.**
> **If now >= DUE-AT, run the fetch immediately without asking. If it 429s again, append
> the attempt and re-arm DUE-AT = new error time + 9 hours. Repeat until complete.**

**Governed by Standing Rule 35** — "Never leave design frames unfetched — auto-retry
rate-limited Figma fetches until 100% complete." No user authorization is needed for the
retry (user directive 2026-07-31).

---

## 1. Current shortfall

| | |
|---|---|
| Boards in the inventory | **85** |
| Boards WITH a PNG in `frames/` | **73** |
| Boards **still missing a PNG** | **12** |
| Figma file key | `DR4gEODShYgJqkozs3mF5q` |
| Canonical board list | `build/filters/design-2026-07-31/frame-inventory.json` |
| PNG output folder | `build/filters/design-2026-07-31/frames/` |
| Blocked endpoint | `GET https://api.figma.com/v1/images/{file_key}` (the *nodes* endpoint is a separate budget and still works) |
| Plan tier / limit type (from the 429 headers) | `x-figma-plan-tier: pro`, `x-figma-rate-limit-type: low` |

**Last rate-limit error (UTC):** `2026-07-30T14:27:02Z` _(attempt 3 in the log below)_
**Fresh `retry-after` returned then:** `36098` s (~10.03 h → the cap itself lifts about
`2026-07-31T00:28:40Z`)
**DUE-AT (re-attempt at or after this time):** `2026-07-30T23:27:02Z` _(re-armed by attempt 3: error 2026-07-30T14:27:02Z + 9h)_

> Note (honesty): the rule's 9-hour timer is DELIBERATELY shorter than Figma's own
> `retry-after` (~10.07 h). That is fine — attempt at DUE-AT; if it 429s again, the log row
> is appended and DUE-AT is re-armed automatically. Do not treat a second 429 as a failure
> of the process.

---

## 2. The exact node ids still missing a PNG (12)

| # | Node id | Board name | Figma path | Target filename |
|---|---|---|---|---|
| 1 | `12867:12201` | Search Filled | Filters / Work Order Explorations 20.4.2026 | `Work-Order-Explorations-20.4.2026__Search-Filled__12867-12201.png` |
| 2 | `12141:19858` | Mobile (early exploration) | Filters | `Filters__Mobile__12141-19858.png` |
| 3 | `11985:9686` | Step 1 | Filters / Sorting (Work In Progress) | `Sorting-Work-In-Progress__Step-1__11985-9686.png` |
| 4 | `11985:10428` | Step 2 | Filters / Sorting (Work In Progress) | `Sorting-Work-In-Progress__Step-2__11985-10428.png` |
| 5 | `11985:11259` | Step 3 | Filters / Sorting (Work In Progress) | `Sorting-Work-In-Progress__Step-3__11985-11259.png` |
| 6 | `11985:13334` | Step 4 | Filters / Sorting (Work In Progress) | `Sorting-Work-In-Progress__Step-4__11985-13334.png` |
| 7 | `11884:15901` | Mobile (final filter row, duplicate board) | Filters | `Filters__Mobile__11884-15901.png` |
| 8 | `11842:14069` | Customer v1 | Filters | `Filters__Customer-v1__11842-14069.png` |
| 9 | `11842:16879` | Customer v1 selected | Filters | `Filters__Customer-v1-selected__11842-16879.png` |
| 10 | `11829:2935` | Filters (COMPONENT: filter button, 4 states) | Filters / Components | `Components__Filters__11829-2935.png` |
| 11 | `11829:8908` | Button (COMPONENT: toolbar search box, 4 states) | Filters / Components | `Components__Button__11829-8908.png` |
| 12 | `11829:8920` | Line 3 (COMPONENT: divider line, 2 variants) | Filters / Components | `Components__Line-3__11829-8920.png` |

Comma-separated for a manual call:

```
12867:12201,12141:19858,11985:9686,11985:10428,11985:11259,11985:13334,11884:15901,11842:14069,11842:16879,11829:2935,11829:8908,11829:8920
```

All 12 are ALREADY described in `DESIGN-NOTES.md` §3 from the node tree (their own text
layers, component variant names and layer names) — accurate but **not seen rendered**.
Nothing about them is guessed (Standing Rule 12).

---

## 3. The exact resumable command to run

The token lives at `/tmp/figma-token` (secret — `/tmp` only, never committed). `/tmp` is
ephemeral, so on a fresh container **ask the user to re-supply the Figma token first**.

```bash
cd /home/user/Manual-test-Cases
python3 build/filters/design-2026-07-31/tools/fetch_all.py --scale 2 --batch 6
```

The script is **resumable and idempotent**: it reads `frame-inventory.json`, skips every
board that already has a PNG > 1 KB, renders only what is missing, caches render URLs in
`imgurls.json`, and appends its own row to the RETRY LOG below (re-arming DUE-AT on a 429).

Exit codes: **0** = 85/85 complete (close this file) · **2** = still short, rate-limited
(queue stays OPEN, DUE-AT re-armed) · **3** = still short for another reason (read the
output).

Options: `--once` (single try per batch, no waiting) · `--no-log` (do not touch this file)
· `--scale 1` (smaller PNGs — note scale=1 is capped by the SAME budget, it is not a
workaround).

### After a SUCCESSFUL complete run, also do these
1. Update `DESIGN-NOTES.md` — the Completeness table (73/85 → 85/85), the "Why 12 are
   missing" paragraph, the §3 inventory "PNG?" column, and §6 honest-limits items 1–2.
2. Update `frame-inventory.json` — set each board's `png_source` from
   `NOT RENDERED (Figma images rate limit, retry-after ~10.5h)` to the render date.
3. If a rendered frame reveals information NOT in its text-derived description, note it in
   the **DESIGN vs CASES** section of `DESIGN-NOTES.md` as a FLAG only — no case edits
   without user authorization (Standing Rule 6).
4. Remove the pointer line from `build/filters/PROJECT-STATE.md` and mark this file
   **CLOSED — 85/85** (keep it for the audit trail).

---

## 4. RETRY LOG

| # | Attempt timestamp (UTC) | Outcome | Frames obtained | Still missing | `retry-after` (s) | Next DUE-AT |
|---|---|---|---|---|---|---|
<!-- RETRY-LOG-START -->
| 1 | 2026-07-30T13:58Z (approx., from `frames/` mtime) | HTTP 429 rate limit — initial design pass, stopped at 73/85 | 24 rendered + 49 copied from the 2026-07-17 export | 12 | 37874 | superseded by attempt 2 |
| 2 | 2026-07-30T14:24:38Z | HTTP 429 rate limit — single probe of all 12 ids, no frames returned | 0 | 12 | 36242 | superseded by attempt 3 |
| 3 | 2026-07-30T14:27:02Z | HTTP 429 rate limit — resumable fetcher run (validated end-to-end, exit 2) | 0 | 12 | 36098 | 2026-07-30T23:27:02Z |
<!-- RETRY-LOG-END -->

_(The fetcher appends rows here automatically. Row 1 was reconstructed from
`DESIGN-NOTES.md`; row 2 was the live probe on 2026-07-30.)_
