# RESUME — Report Suite data preconditions, 12 August 2026

**Status: IN PROGRESS. The pass was killed by an API error at roughly 14:02–14:10 UTC and never
wrote this document itself.** This file was reconstructed on the same day by a recovery worker
**from the pass's own committed files plus its scratch output**, which was still present in the
container's `/tmp/rs812/` and has now been committed to `evidence/` so it survives.
**Everything below is sourced from those files. Where a file does not establish something, this
document says "NOT RECORDED" rather than guessing** — next week's pass will act on it.

---

## 🔴 READ THIS FIRST — THE BRANCH IS ABOUT TO CHANGE UNDER EVERY FIGURE IN THIS FILE

**The Report Suite release is POSTPONED TO NEXT WEEK, and the team are planning to make CHANGES
to the Reports branch.** Those are **FUNCTIONAL CHANGES, not bug fixes.**

**⇒ WHEN THEY LAND, STANDING RULE 60'S LAYER INVALIDATION APPLIES IN FULL.** On that branch,
**all** of the following may go stale:

- **layer 1 in its widened form (Rule 9, 2026-08-12): preconditions · steps · navigation ·
  labels** — so **the data-precondition work in this very folder is exactly what a functional
  change can invalidate**;
- **layer 2: the pass/fail verdict**;
- **the `HOLD` half of layer 3.**

**⚠️ DO NOT INHERIT THE FIGURES BELOW AS THOUGH THEY STILL HELD.** Every count here is a
measurement of **`v3.7-4626299`**. After a functional change the honest position is that the
data facts must be **re-run** (they are cheap — see the recipe) before any of them is quoted.

**⚠️ AND DO NOT REACH FOR THE 2026-08-12 BUG-FIX RULING TO AVOID THAT WORK.** The QA lead ruled
that day (commit `06bc0305`) that **a deploy which only fixes bugs does NOT make a prior pass
stale**. **THAT RULING DOES NOT COVER THIS.** It is scoped to bug fixes; what is coming is
functional change. Citing it here would be exactly the misreading that produces a suite which
looks freshly verified and is not.

**What survives a functional change untouched:** the **expected behaviour** of every case, because
it comes from the documents and never from the build (Rule 57). Also the **three API traps** and
the **366-day cap** in `evidence/API-FACTS.md` — those are contract facts, worth re-confirming but
not presumed lost.

---

## Build it worked against

`v3.7-4626299` · `index.html` last-modified **Wed 12 Aug 2026 05:06:49 GMT** ·
etag `da084d29fbcc187229d2988862374d6b` ·
sha256 `6dc177ab17a9243f4820e0523390602c0c06038f0d70ee165d1d26032ee9c85b`.

Byte-identical to what the preceding pass recorded — **no redeploy while it ran.**

**⚠️ EXPECT THIS MARKER TO HAVE MOVED.** Re-read it before trusting anything here; the branch has
redeployed repeatedly (four times in two days on a sibling project), and a functional-change
release is now expected. **Re-read, never re-stamp a date nobody observed** (Rule 12).

---

## Environment

- **Session:** live while it ran — 42 fe-permissions, HTTP 200.
- **Location:** all report reads pinned by explicit `locations=` parameters; the unfiltered
  default is the **active workplace only** (see trap 1 below). Standing default is
  **`Staging Heavy Duty - 9919`**.
- **API host:** `sv8582api.qa.shopview.com`; app `sv8582.qa.shopview.com`.
- **Cookie header** read from `/tmp/qa-cookies/reports-cookie-header.txt` — **ephemeral, will need
  re-supplying** (never committed; the repository is public).

---

## Writes — none, on any system

**0 TestRail writes · 0 Jira calls · 0 run writes · 0 non-GET API calls.**
The client (`tools/api.py`) is **GET-only by construction**; `get()` refuses any other method.
Its own counter at the end of the fact run reads **`{'GET': 58, 'POST': 0}`**
(`evidence/facts-run.txt`), and **no `api.post` caller exists anywhere in the tools** — checked
by grep across all six scripts.

## 🌱 SEEDING — NOTHING WAS SEEDED, AND NOTHING NEEDED TO BE. DO NOT GO LOOKING FOR IT.

This is the honest answer and it is a **finding, not an omission**: **every data state the 480
cases require already existed on the branch.** 31 of the first 32 checks came back PRESENT and
the 32nd PARTIAL — **0 ABSENT** — so the pass never had cause to create anything.

**⇒ There is no ZZAUTOTEST residue from this pass to find, keep, or clean up.** The QA lead's
ruling that cleanup is unnecessary (*"Any data added in these branches is just the test data"*)
is not engaged, because nothing was added. **If a future pass finds ZZAUTOTEST data in this
branch, it is somebody else's and is not documented here.**

**The head start next week actually inherits is the 38 measured facts in `evidence/facts.json`** —
i.e. the knowledge that the data is already there, and where. **That is worth more than seeded
rows and it does not rot in the same way** (though it must be re-run after a functional change).

---

## What it established

### 1 · Precondition extraction and classification — COMPLETE

- **492 live cases** pulled under group 4281 → **480 ours / 12 Vladimir Tomovic's** (Rule 38:
  his are untouched and excluded from every count here).
- **873 precondition LINES** extracted from the 480 cases → **595 distinct clusters** (543
  singletons).
- **All 873 lines classified, 0 UNKNOWN.** Full per-line data: **`evidence/classified.json`**.

| Category | Lines | Meaning |
|---|---:|---|
| `DATA_SHAPE` | 341 | a specific data state — checkable live, seedable |
| `ENV` | 159 | signed in / desktop browser / ordinary reports access |
| `DATA_OPEN` | 140 | "the report is open with rows" |
| `UISTATE` | 98 | a row expanded, a dialog open, a viewport, dark mode |
| `TOOL` | 63 | dev tools, network panel, forcing a failure |
| `BARRED_TO_US` | 44 | second sign-in / role / settings edit |
| `EXTERNAL` | 16 | an external system or physical device |
| `VOLUME` | 10 | paging / over-cap volumes |
| `NOTE` | 2 | an instruction to the tester, not a precondition |
| **TOTAL** | **873** | |

**The distinction this pass drew that its predecessor did not, and it matters:**
**"I cannot establish this" is NOT "a tester cannot run this."** A role or settings edit would
destroy the shared session of every holder on this branch, so **this pass** was barred from
making one; **a tester with admin access and no sibling worker can.** Those are `BARRED_TO_US`
— an honest limit on our verification, **not a divergence and not a reason to hold a case.**
**Only `EXTERNAL` is a genuine impossibility.** At case level that is **31 `NOT_OURS` vs only 12
genuinely `EXTERNAL`.**

**Method note worth keeping:** 45 lines the regexes could not place were **hand-judged
individually with the reason recorded**, not swept up by widening a pattern — *"a regex written
to make a number go up is not a measurement"* (`tools/classify.py` header).

### 2 · Live data facts — 38 checked, and this is the pass's real product

**`evidence/facts.json` (38 facts) · run log `evidence/facts-run.txt`.**

| Verdict | Count |
|---|---:|
| `PRESENT` | 33 |
| `PARTIAL` | 3 |
| `ABSENT_IN_SAMPLE` | 1 |
| `NOT_ESTABLISHED` | 1 |
| **TOTAL** | **38** |

**F1–F32 were committed earlier** (31 PRESENT / 1 PARTIAL). **F33–F38 are recovered here and
were NOT in the repository before this recovery** — they ran at 14:02, minutes before the pass
died, and their results existed only in `/tmp`.

**Each fact records a CONTROL that proves the probe can fail**, and **a probe that errors is
recorded `NOT_ESTABLISHED`, never `ABSENT`.** The non-PRESENT five, stated plainly:

- **F18 `PARTIAL`** — a part with **no category**: **no NULL category exists**; the build uses a
  category literally named **`Uncategorized`**. 180 parts have **no vendor**. *Whether
  "Uncategorized" satisfies "no category assigned" is the tester's reading, not ours.*
- **F33 `NOT_ESTABLISHED`** — **both S (service) and P (parts) invoice numbers**. All 100 rows
  read were `S`. **Deliberately not ABSENT:** `/api/work-orders` is **hard-capped at 100 rows**
  (`limit=250` still returns 100), reports **no total**, and both filters that would reach part
  sales (`type=2`, `status=invoiced`) return **HTTP 400**. *The correct next step is to capture
  the request the SBC expansion actually makes in the browser, rather than guessing a filter.*
- **F35 `ABSENT_IN_SAMPLE`** — an invoice number **>18 characters**. Length histogram is
  `{7: 25, 8: 63, 11: 12}`, so **>18 looks structurally impossible rather than merely
  unsampled** — but it is 100 rows of an unknown total, hence not graded ABSENT.
- **F36 `PARTIAL`** — **lower-case-initial customer names**: 250 upper, **0 lower**.
- **F38 `PARTIAL`** — statuses in the 100 read are `{paid: 90, estimate: 9, approved: 1}`;
  **`invoiced` did not appear**, under the same 100-row cap.

### 3 · FOUR FALSE ABSENCES CAUGHT — every one was the probe, not the data

**Keep this section. It is the most reusable thing the pass produced.**

- **F14 / F15 / F18** sorted Parts Velocity by demand **ASCENDING** and read the 250
  *lowest*-demand rows — all zero by construction. **Descending:** 250 rows of demand 8–700,
  with both inventory and special-order present (**9933 + 470 = 10403**).
- **F13** selected only Heavy Duty + Lethbridge; **the rep who spans locations spans a different
  pair.** Over all six locations, **Viktoria Videnovic** reads `location=Multiple`.
- **F20** asked whether a zero-time technician exists *at all*; the precondition is a **property
  of the RANGE.** Over a year **39** technicians clocked time; over a 2-day window, **1**.

### 4 · Three measured API traps + the date cap

Full detail in **`evidence/API-FACTS.md`**. In one line each:

1. **An unfiltered report call returns the ACTIVE WORKPLACE ONLY** — 245 rows, every one Heavy
   Duty. *This made a five-location organisation look like a one-location one, and this pass
   fell for it before checking.* Same class as the `/api/labour-types` artefact in CLAUDE.md.
2. **`locations=A&locations=B` (repeated key) SILENTLY KEEPS ONLY THE LAST** — no error, no
   warning. **The working format is comma-joined `locations=A,B`.** `locations[]=` → HTTP 400.
3. **The server caps date ranges at 366 days** — HTTP 400 *"Date range cannot exceed 366 days."*
   (WIP words it *"Date range cannot be over one year."*)

Plus: **16 customers render a literal `Multiple`** location value, which satisfies "a customer
has invoices at two different locations" outright.

---

## 🔢 THE HONEST FIGURE — AND WHAT IT IS *NOT*

**⚠️ THIS PASS DID NOT WALK ANY CASE END TO END. IT HAS NO WALKED FIGURE, AND IT MUST NOT BE
GIVEN ONE.** It enumerated and live-checked **data preconditions**; it never executed a case's
steps in the UI. **NOT RECORDED: any end-to-end walk by this pass.**

The **preceding** pass (`build/report-suite/finish-2026-08-12/`) produced the walked figure, and
its own caveat travels with it and must not be dropped:

> **Machine figure 253, published as an explicit UPPER BOUND.** Hand-audit of two random samples
> of 8 found **4 of 8** wrong, then **~3 of 8** after tightening — **roughly a 40% error rate.**
> Its own words: *"the classifier over-counts and the true figure is materially lower than 253"*
> and *"I do NOT recommend quoting it."*

**⇒ DO NOT LAUNDER 253 INTO A CLEAN NUMBER.** This folder exists *because* 253 was unreliable.

**What this pass can support instead** — a per-case rollup of *precondition establishment*,
`evidence/rollup.json`:

| Verdict | Cases | Meaning |
|---|---:|---|
| `ESTABLISHED` | **324** | every precondition line is self-met **or** tied to a live-checked data fact |
| `UNVERIFIED_DATA` | 113 | at least one data line not yet tied to a checked fact — **the residue** |
| `NOT_OURS` | 31 | needs a second sign-in / admin edit — **a tester very likely can** |
| `EXTERNAL` | 12 | needs a system we do not have — a genuine divergence |
| **TOTAL** | **480** | |

| Report | ESTAB | NOT_OURS | EXTERNAL | UNVER | total |
|---|---:|---:|---:|---:|---:|
| Inventory Value | 35 | 3 | 3 | 27 | 68 |
| Parts Velocity | 44 | 4 | 1 | 22 | 71 |
| Sales By Customer | 64 | 11 | 0 | 13 | 88 |
| Sales By Representative | 87 | 6 | 2 | 17 | 112 |
| Technician Utilization | 29 | 4 | 5 | 22 | 60 |
| Work In Progress | 65 | 3 | 1 | 12 | 81 |
| **TOTAL** | **324** | **31** | **12** | **113** | **480** |

**🔴 FIVE CAVEATS, ALL LOAD-BEARING. QUOTING 324 WITHOUT THEM WOULD REPEAT THE 253 MISTAKE:**

1. **`ESTABLISHED` MEANS "THE DATA A TESTER NEEDS IS THERE". IT DOES NOT MEAN THE CASE WAS RUN,
   ITS STEPS WALKED, OR ITS LABELS CHECKED.** It is **one of Rule 9's five runnability checks
   (check 1, precondition reachability)** — not the set.
2. **The rule behind it is deliberately harsh and that is a virtue:** a case counts only if
   **EVERY** line is established, because *one unmet line is the line the tester stops on*.
3. **324 IS ITSELF PROVISIONAL, AND KNOWN TO BE LOW.** The `MAP` in `tools/rollup.py` **stops at
   F32** — **F33–F38 are not wired in**, which is precisely the *"mapping the new facts"* work
   that was in flight when the pass died. Cases needing them therefore sit in
   `UNVERIFIED_DATA` today. Confirmed examples: **30107** (S+P → F33), **30126 / 30130 / 30131**
   (no-vehicle → F34), **30143** (mixed case → F36), **30280** (>18 chars → F35).
   **⇒ Wiring F33–F38 in will move cases out of the residue without any new API call.**
4. **137 unmapped data lines** remain — printed in full by `rollup.py` on every run.
5. **The 324 was produced by the RECOVERY worker re-running `rollup.py`** against the pass's
   final `classified.json` (13:59) and its 38-fact `facts.json` (14:02). **The pass's own
   `rollup.json` was written at 13:54, BEFORE its last classifier correction, and read
   `314 / 123 / 31 / 12`.** The stale copy is **not** committed; the 10-case difference is the
   classifier fix landing. **No API or TestRail call was made to produce either.**

---

## 🔁 RE-RUN RECIPE FOR THE REMAINDER

**`/tmp` IS GONE NEXT WEEK.** All six tools hardcode `/tmp/rs812/…`, and they were **deliberately
NOT rewritten** — they are the audit record of what actually ran (the same principle CLAUDE.md
applies to the executed `add_case` scripts). **So stage the committed evidence back into `/tmp`
first:**

```bash
cd /home/user/Manual-test-Cases/build/report-suite/data-preconditions-2026-08-12
mkdir -p /tmp/rs812
cp evidence/classified.json evidence/facts.json evidence/survey.json /tmp/rs812/
```

**Then, in order of cost — the first step is free and moves the number:**

1. **FREE, NO API — wire F33–F38 into `tools/rollup.py`'s `MAP`, then re-run.**
   ```bash
   python3 tools/rollup.py     # reads /tmp/rs812/{classified,facts}.json; prints the table
   ```
   Note `F33` is `NOT_ESTABLISHED` and `F35`/`F36`/`F38` are not `PRESENT`, so they will **not**
   all convert a case to `ESTABLISHED` — `rollup.py` only accepts `PRESENT`/`PARTIAL`. **That is
   correct behaviour; do not loosen it to make the number rise.**
2. **Work the 137 unmapped data lines.** `rollup.py` prints them with their C-ids. Each is either
   a new fact to check live, or a line that maps to a fact already measured.
3. **RE-RUN THE 38 FACTS after the functional-change release lands** — cookies, then:
   ```bash
   python3 tools/facts.py      # 58 GETs, GET-only, ~2 min; writes /tmp/rs812/facts.json
   cp /tmp/rs812/facts.json evidence/facts.json   # then commit
   ```
   **This is the cheap re-check the top of this file demands.**
4. **Re-pull the cases only if the suite changed** — `extract.py` needs
   `/tmp/rs812/live_now.json` (a `get_cases` + `get_sections` mirror of group 4281; **read-only**).
   **It was NOT committed** (~1.07 MB raw mirror). Re-pull it, then `extract.py` → `classify.py`.
   Not needed for steps 1–3.
5. **Settle F33 properly** — capture the request the **SBC expansion** actually makes in the
   browser network panel. Do not guess another filter; two were already rejected with HTTP 400.

---

## ❓ WHAT IT COULD NOT DETERMINE — listed plainly

- **Whether a P-prefixed (parts) invoice exists at all** — F33, blocked by the 100-row cap and
  two HTTP 400 filters. **Not absent; unestablished.**
- **Whether an invoice number >18 characters can exist** — F35; the histogram suggests a 7–11
  character scheme, but 100 rows of an unknown total cannot prove a negative.
- **Whether a lower-case-initial customer name exists** — F36; 0 of 250.
- **Whether an `invoiced`-status work order exists** — F38; absent from the 100 read.
- **Whether "Uncategorized" satisfies "no category assigned"** — F18; **a tester's reading, not
  ours.** Genuinely open.
- **Anything requiring a second sign-in, a role change or a settings edit** — 44 lines / 31
  cases. **Barred to us by the shared session, NOT to a tester with admin access.**
- **The 12 `EXTERNAL` cases** — QuickBooks, a screen reader, a developer action.
- **NOT RECORDED — no evidence either way in its files:** any end-to-end case walk; any label or
  step verification; any pass/fail verdict; any per-case Rule-54 provenance or marker change.
  **This pass touched none of that.**

---

## Provenance of this document

Reconstructed 2026-08-12 by a recovery worker from: the pass's three commits
(`2e1af1de`, `3f88e1a5`, `3aae98c6`) and their messages; `evidence/API-FACTS.md`; the pass's
scratch output recovered from `/tmp/rs812/` and committed alongside this file
(`facts.json` 38 facts, `facts-run.txt`, `classified.json`, `rollup.json`, `survey.json`); the
uncommitted `tools/` diffs (`classify.py` +7, `facts.py` +98 = F33–F38, `rollup.py` new); and one
local re-run of `rollup.py`. **The 253 walked figure and its ~40% error rate are quoted from
`build/report-suite/finish-2026-08-12/{COMPLETION-REPORT,RUNNABILITY,RESUME}.md`, which is a
DIFFERENT pass.** No TestRail write, no Jira call, no non-GET API call was made by the recovery.
