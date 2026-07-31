# PENDING FIGMA FETCH — Filters design pass (design-2026-07-31)

> # ✅ CLOSED — 85/85 — 2026-07-31T08:58:40Z
> **Every board in `frame-inventory.json` now has a PNG in `frames/`. Nothing is
> outstanding. This file is kept for the audit trail only — no further retries are due and
> no DUE-AT is armed. Everything below the closing note is the historical record.**
>
> **THE METHOD THAT FINALLY WORKED (record this):** the **REST** endpoint
> `GET https://api.figma.com/v1/images/{file_key}` with a **Figma personal access token**
> supplied by the QA lead, stored at `/tmp/figma-token` (secret — `/tmp` only, never
> committed), driven by the existing resumable fetcher:
>
> ```bash
> python3 build/filters/design-2026-07-31/tools/fetch_all.py --scale 2 --batch 6 --once
> ```
>
> It skipped the 79 boards that already had a PNG, rendered exactly the 6 missing ones,
> downloaded all 6 first time (**no 429**), and exited **0**. Total elapsed: one call.
> The 2026-07-30 `/v1/images` cap had indeed lifted — the only thing ever missing was the
> credential. **So the ordering lesson is: MCP is cheap but its per-seat call cap is low;
> a REST token has no such cap and finishes a whole backlog in one shot. Ask for a token
> early rather than burning MCP calls.**
>
> **Renders read, and they corrected our own notes** — see
> `BOARD-NOTES-12-2026-07-31.md` §5 and `RECONCILIATION-FINAL-2026-07-31.md`.

<details>
<summary>Historical record (was: STILL OPEN — 79/85)</summary>

> **STATUS: STILL OPEN — 79/85. NOT closed. Do not close until ALL frames have PNGs (85/85).**
> **⚠️ THE BLOCKER CHANGED on 2026-07-31 — read §0 before doing anything else.**
> **Check this file on every session start and before/after any Filters or Figma work.**
> **If now >= DUE-AT, run the fetch immediately without asking. If it 429s again, append
> the attempt and re-arm DUE-AT = new error time + 9 hours. Repeat until complete.**

**Governed by Standing Rule 35** — "Never leave design frames unfetched — auto-retry
rate-limited Figma fetches until 100% complete." No user authorization is needed for the
retry (user directive 2026-07-31).

---

## 0. UPDATE 2026-07-31 08:05Z — 6 of the 12 captured, blocker CHANGED, 6 left

**Progress: 73 → 79 of 85.** Six of the twelve were rendered successfully (rows 1, 2, 3, 4, 5 and 10 of the §2 list):

| Node id | Board | File |
|---|---|---|
| `11829:2935` | Components / Filters (filter button, 4 states) | `frames/Components__Filters__11829-2935.png` |
| `12867:12201` | Search Filled (mobile, filled page-search) | `frames/Work-Order-Explorations-20.4.2026__Search-Filled__12867-12201.png` |
| `12141:19858` | Mobile (early exploration) | `frames/Filters__Mobile__12141-19858.png` |
| `11985:9686` | Sorting (WIP) / Step 1 | `frames/Sorting-Work-In-Progress__Step-1__11985-9686.png` |
| `11985:10428` | Sorting (WIP) / Step 2 | `frames/Sorting-Work-In-Progress__Step-2__11985-10428.png` |
| `11985:11259` | Sorting (WIP) / Step 3 — **the sorting panel** | `frames/Sorting-Work-In-Progress__Step-3__11985-11259.png` |

### What worked — and it is NOT the REST API
**The Figma MCP server** (`mcp__Figma__get_screenshot`), already authenticated in-session as the
QA lead's own Figma account. **No token needed.** `mcp__Figma__whoami` reports seat
**View**, plan tier **starter**. It returns a short-lived asset URL that is then `curl`ed to
a PNG — cheap in tokens and **on a completely different budget from REST `/v1/images`**.

**Record this as the preferred method from now on:** try the Figma MCP FIRST; REST is the
fallback, not the default.

### The NEW blocker (different from the 2026-07-30 one)
After 6 successful calls the MCP returned:

> `You've reached the Figma MCP tool call limit for your View seat on the Professional plan.`

This is a **per-seat cap on MCP tool CALLS**, not an image-rendering cap. It is a *different*
limit from the `/v1/images` HTTP 429 that stopped the 2026-07-30 pass. It gives **no
`retry-after` header**, so the Rule-35 +9h formula is applied to the error time.

**No REST token exists any more** — `/tmp` was wiped. Checked and confirmed absent (not
assumed): `$FIGMA_TOKEN`, `$FIGMA_PAT`, `/tmp/figma-token`, `~/.figma-token`. The repo was
deliberately **not** searched — tokens were never committed.

### Clock cross-check (do not trust the container clock blindly)
Container `date -u` = `2026-07-31T08:04:31Z`; Figma server `Date:` header =
`Fri, 31 Jul 2026 08:04:32 GMT`. **Agree to 1 second** — timestamps here are sound.

### ⭐ FASTEST UNBLOCK — ask the QA lead for a token
The 2026-07-30 `/v1/images` cap was due to lift at ~`2026-07-31T00:28:40Z`, which has
**already passed**. So the REST path is very likely healthy again and only lacks a
credential. **One Figma personal access token finishes all 6 remaining boards in a single
call:** Figma → Settings → Security → Personal access tokens → new token with **"File
content read-only"** scope → paste it; store at `/tmp/figma-token` (secret, `/tmp` only,
never committed) and run the resumable fetcher in §3.

**Do NOT attempt a Google SSO browser login** — it needs a live 2FA code.

## 0a. The 6 boards STILL missing a PNG

| # | Node id | Board | Target filename | Evidence held today |
|---|---|---|---|---|
| 1 | `11985:13334` | Sorting (WIP) / Step 4 — multi-level sort panel | `Sorting-Work-In-Progress__Step-4__11985-13334.png` | **Full layer tree** (2026-07-30) — structure-only |
| 2 | `11829:8908` | Components / Button — toolbar search box, 4 states | `Components__Button__11829-8908.png` | **Full layer tree** — structure-only |
| 3 | `11829:8920` | Components / Line 3 — search-box text caret | `Components__Line-3__11829-8920.png` | **Full layer tree** — structure-only |
| 4 | `11884:15901` | Mobile (final filter row, duplicate board) | `Filters__Mobile__11884-15901.png` | **Text layers only** (duplicates the rendered `11884:20807`) |
| 5 | `11842:14069` | Customer v1 | `Filters__Customer-v1__11842-14069.png` | **Text layers only** (superseded "v1") |
| 6 | `11842:16879` | Customer v1 selected | `Filters__Customer-v1-selected__11842-16879.png` | **Text layers only** (superseded "v1") |

Comma-separated for a manual call:

```
11985:13334,11829:8908,11829:8920,11884:15901,11842:14069,11842:16879
```

## 0b. ⚠️ A layer tree is NOT a substitute for a render — proven this run

The rendered `11985:9686` (Sorting step 1) **disproves** two claims that the 2026-07-30
node-tree pass wrote into `DESIGN-NOTES.md` §5.1: that step 1 had "**No sort control at
all**", and that **no** board showed a sorted-column indicator. The render plainly shows
the **toolbar up/down sort icon** *and* a **`↓` indicator on the `Status` column heading**.
The tree pass missed them because the icon sits inside a Button instance under a name
containing no "sort" keyword. §5.1's "Retraction (honesty)" paragraph was therefore a
**false correction** and has itself been retracted — see
`BOARD-NOTES-12-2026-07-31.md` §4.1.

**Lesson: when the question is "is this control present?", only a render answers it.** This
is exactly why Standing Rule 35 demands 100% of frames.

---

## 1. Current shortfall

| | |
|---|---|
| Boards in the inventory | **85** |
| Boards WITH a PNG in `frames/` | **79** _(was 73; +6 on 2026-07-31 via the Figma MCP)_ |
| Boards **still missing a PNG** | **6** _(was 12 — see §0a)_ |
| Figma file key | `DR4gEODShYgJqkozs3mF5q` |
| Canonical board list | `build/filters/design-2026-07-31/frame-inventory.json` |
| PNG output folder | `build/filters/design-2026-07-31/frames/` |
| Blocked endpoint | **2026-07-31: the Figma MCP per-seat tool-call cap** (no `retry-after`). The 2026-07-30 REST blocker `GET https://api.figma.com/v1/images/{file_key}` has probably lifted but **no token survives** to use it. The `/nodes` endpoint remains a separate budget. |
| Plan tier / limit type (from the 429 headers) | `x-figma-plan-tier: pro`, `x-figma-rate-limit-type: low` |

**Last rate-limit error (UTC):** `2026-07-31T08:05Z` — **Figma MCP per-seat tool-call cap**
_(attempt 5 in the log below; clock verified against the Figma server `Date:` header)_
**`retry-after` returned then:** **NONE** — the MCP cap sends no `retry-after` header, so the
Rule-35 +9h formula is used unmodified.
**DUE-AT (re-attempt at or after this time):** **`2026-07-31T17:05Z`** _(re-armed per Rule 35:
error `2026-07-31T08:05Z` + 9h)_
**At DUE-AT, retry the MCP first** (`mcp__Figma__get_screenshot`, 6 node ids from §0a — one
call each). **If a token has been supplied in the meantime, use the REST fetcher in §3
immediately instead and do not wait for DUE-AT at all.**

> ⚠️ **Read this before the next attempt.** Figma's own `retry-after` has now pointed at
> **~`2026-07-31T00:28:40Z`** three times in a row, which is *later* than the Rule-35
> formula DUE-AT of `00:03:19Z`. An attempt at the formula time will therefore probably 429
> once more. **Best practical retry time = at or after `2026-07-31T00:30Z`.** The formula
> DUE-AT is kept above because that is what the rule prescribes; this line is the
> evidence-based recommendation, not a rule change.

> ✅ **Useful discovery (2026-07-30): only IMAGE RENDERING is capped.** The
> `GET /v1/files/{key}/nodes?ids=…` endpoint sits on a **different budget and still returns
> 200**. Full layer trees (with `visible` flags) were pulled for **7 of the 12** missing
> boards this way — the 4 Sorting boards and the 3 Components boards — which pinned the sort
> control, the filter-button states and the search-box states verbatim and **caught a real
> error** in the previous text-only reading of Sorting steps 1–2. So a rate limit is **not**
> a reason to stop analysing a board: read the tree, and treat the PNG as confirmation of
> layout/spacing/colour only. Script: `/tmp/nodes_probe.py` pattern (re-creatable; `/tmp` is
> ephemeral).

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

_(Superseded by §0/§0a — 6 of these 12 now HAVE renders. The 6 that remain are listed in
§0a with their exact evidence level.)_ All are described in `DESIGN-NOTES.md` §3 from the
node tree / text layers — accurate but **not seen rendered**. Nothing about them is guessed
(Standing Rule 12). **But see §0b: a tree read is demonstrably NOT equivalent to a render.**

**Updated 2026-07-30:** rows **3–6 (Sorting)** and **10–12 (Components)** have since had
their **full visibility-filtered layer trees** read via the `/nodes` endpoint, so their
DESIGN-NOTES entries are now layer-verbatim rather than text-only (and Sorting steps 1–2
were **corrected** — the earlier "sort arrow / toolbar sort button on step 1" reading was
wrong). Rows 1, 2, 7, 8, 9 are still text-extract only. The PNGs are still wanted for
layout/spacing/colour confirmation.

---

## 3. The exact resumable command to run

**Try the Figma MCP FIRST — it needs no token** (see §0). Only fall back to this REST
fetcher. The token lives at `/tmp/figma-token` (secret — `/tmp` only, never committed).
`/tmp` is ephemeral and **was wiped before the 2026-07-31 run**, so on a fresh container
**ask the user to re-supply the Figma token first** (Settings → Security → Personal access
tokens, scope "File content read-only").

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
| 3 | 2026-07-30T14:27:02Z | HTTP 429 rate limit — resumable fetcher run (validated end-to-end, exit 2) | 0 | 12 | 36098 | superseded by attempt 4 |
| 4 | 2026-07-30T15:03:19Z | HTTP 429 rate limit — **EARLY probe, run 8h24m BEFORE the DUE-AT** (see note) — run with `--once --no-log` so the armed DUE-AT could not be corrupted; log row added by hand | 0 | 12 | 33921 | **2026-07-31T00:03:19Z** (practical: ≥ `00:30Z`) |
| 5 | 2026-07-31T08:03Z–08:06Z | **PARTIAL SUCCESS then a NEW cap.** Figma **MCP** used (no token needed): 6 `get_screenshot` calls succeeded → 6 PNGs written (73→79). The 7th call returned *"You've reached the Figma MCP tool call limit for your View seat on the Professional plan."* A single confirming retry also failed. **No REST token exists** (`/tmp` wiped) so the now-probably-healthy `/v1/images` path could not be used. | **6** | **6** | none sent (MCP cap) | **2026-07-31T17:05Z** |
| 6 | 2026-07-31T08:58:40Z | SUCCESS - all frames obtained | 6 | 0 | - | n/a - COMPLETE |
<!-- RETRY-LOG-END -->

_(The fetcher appends rows here automatically. Row 1 was reconstructed from
`DESIGN-NOTES.md`; row 2 was the live probe on 2026-07-30.)_

</details>

---

## 5. CLOSING NOTE — 2026-07-31, 85/85

All six remaining boards were rendered at `scale=2` in a single REST call and are committed
under `frames/`:

| Node id | Board | File | Size |
|---|---|---|---|
| `11985:13334` | Sorting (Work In Progress) / Step 4 — the multi-level sort panel | `Sorting-Work-In-Progress__Step-4__11985-13334.png` | 3456x2092 |
| `11829:8908` | Components / Button — the toolbar search box, 4 states | `Components__Button__11829-8908.png` | 558x520 |
| `11829:8920` | Components / Line 3 — the text caret | `Components__Line-3__11829-8920.png` | 80x184 |
| `11884:15901` | Filters / Mobile (second final filter-row board) | `Filters__Mobile__11884-15901.png` | 804x1748 |
| `11842:14069` | Filters / Customer v1 | `Filters__Customer-v1__11842-14069.png` | 568x1028 |
| `11842:16879` | Filters / Customer v1 selected | `Filters__Customer-v1-selected__11842-16879.png` | 568x1160 |

**Clock cross-check (never trust the container clock blindly):** container `date -u` at the
successful run = `2026-07-31T08:58:40Z`; the Figma response `Date:` header agreed to the
second. No rate-limit headers were returned at all.

**Each of the six was then READ (not merely downloaded)** and three claims our own notes had
made from layer trees were re-verified against the pixels — one of which was WRONG. Details:
`BOARD-NOTES-12-2026-07-31.md` §5.

## OUTSTANDING — what I need from you

**Nothing outstanding on this queue.** The Figma design source for Filters is COMPLETE at
85/85 and this file needs no further action. (The Figma token lives in `/tmp` only and will
vanish with the container — if a *future* Filters design link is added, a fresh token will be
needed again.)
