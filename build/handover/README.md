# Handover deliverables — 12 August 2026

Two files, both for people outside this session.

> ## ⚠️ READ THIS FIRST — THE COMBINED TESTER SHEET HAS BEEN SPLIT INTO THREE, LATER THE SAME DAY
>
> `Manual-Tester-Handover_2026-08-12.xlsx` (item 1 below) is **superseded for hand-off purposes**
> by **three per-project sheets**, on the QA lead's instruction, verbatim: *"keep the hold on
> creating Jira tickets, rather give the Spreadsheet for each project to me to handover to the QA
> tester, so that they create the ticket if needed, just like you did for schedule this morning."*
>
> | | |
> |---|---|
> | `Schedule_Tester-Handover_2026-08-12.xlsx` (+ `.md`) | 8 problems · 4 misleading tickets · 35 to skip |
> | `Filters_Tester-Handover_2026-08-12.xlsx` (+ `.md`) | 1 problem · 1 misleading ticket · 18 to skip |
> | `Report-Suite_Tester-Handover_2026-08-12.xlsx` (+ `.md`) | 1 problem · 3 misleading tickets · 42 to skip |
>
> **Each tester gets only what concerns them.** Same four tabs, same layout and tone as the
> combined sheet it replaces (Standing Rule 16). **The combined sheet is KEPT, not deleted** — it
> is the record of the earlier snapshot, and its figures were right for their minute.
>
> **The counts differ from the combined sheet, and both are right for when they were taken.**
> Held went **88 → 95** and already-Passed-on-held went **13 → 15**, because more Schedule tests
> were checked and found to be waiting on something between the two snapshots.
>
> Full write-up, generator, live derivation and the 21-check verifier: **`per-project/`**
> (`data.py` · `gen.py` · `verify.py` · `tools/`). Snapshot **2026-08-12T12:33:19Z**, re-confirmed
> unchanged at **12:53Z**.
>
> **What the three sheets add that the combined one did not:**
> - **five more Schedule problems** written up — no way to collapse a department heading, the Tech
>   Hours switch showing nothing, no Priority section in the filter panel, no Unassigned row in the
>   grid, and the hover summary hiding the VIN behind a display switch;
> - **a "strongest argument AGAINST it being a fault" column on every problem**, so a tester can
>   answer the push-back before filing (Standing Rule 52's pre-filing self-challenge);
> - **the build markers re-read live** — **Schedule and Filters both redeployed at ~12:10 GMT
>   today**, so their observations predate the running build and every sheet says so;
> - **three Report Suite tests marked runnable that our own notes say cannot be run** (C30107,
>   C43591, C38913) — the correcting change was prepared and never executed;
> - **grouping by blocker on tab 4**, so one unblock is visible as one group.

## 1. `Manual-Tester-Handover_2026-08-12.xlsx` (+ `.md` twin)

For the manual QA tester, who is reading it for the first time. Four tabs:

1. **Read me first** — the one rule that matters (if a test says it cannot be run, mark it
   Blocked) and why it is not a formality.
2. **Problems found, not reported** — **three** confirmed faults with no ticket, written out
   so a tester can file them personally if they choose. Nothing has been filed: the QA lead's
   Jira creation hold is active.
3. **Old tickets that mislead** — four tickets where the ticket and the product disagree.
   Three closed but still reproducing, one open but already fixed. Suggestions only.
4. **Tests that cannot be run yet** — all **91**, with the **16** that already carry a Passed
   result marked. That is the single most actionable item in the sheet.

**Three defects, not four.** The brief anticipated four; the evidence supports three. Nothing
was padded to reach a number.

## 2. `Test-Case-Changes-for-Vlad_2026-08-12.xlsx` (+ `.md` twin)

For the automation engineer, per Standing Rule 65. Every case created, updated or deleted on
11 and 12 August — **771** in total, **0 deleted**.

- **Section A — 44** cases TestRail flags as Automated. Each was checked individually against
  `get_history_for_case`: all 44 were flagged by Vladimir Tomovic himself, never assumed.
  **7 of the 44** change what an automated check should conclude; they are banded at the top.
- **Section B — 714** other updated cases, banded per project with the 78 real changes first.
- **Section C — 13** created cases.

## How the numbers were derived

Everything was read **live from TestRail, read-only (`get_*` only)** on 12 August 2026. Zero
TestRail writes, zero Jira calls. The build markers on the three QA branches were read directly
from each branch's `index.html`.

The change list was established **two ways and reconciled**: from the committed per-operation
logs of every pass dated 11 or 12 August, and from TestRail's own `created_on` / `updated_on`.
**The two sets are equal in both directions — 771 = 771, with no member either set lacks.**

`tools/` holds the derivation scripts and their raw output, so every figure can be re-derived.

---

## Status at hand-off — what is complete, and what is not

**Both sheets are COMPLETE.** Every figure in them was derived live from TestRail in this
pass; none is carried over from a document.

**Snapshot time: 2026-08-12T05:53:56Z, and the time matters today.** Another worker was
editing the same three suites while these sheets were written, and the numbers moved twice:

| | earlier in the pass | at the snapshot |
|---|---|---|
| tests that cannot be run | 91 | **88** |
| of those, already marked Passed | 16 | **13** |
| Schedule tests waiting on a second sign-in | 14 | **11** |

Three Schedule cases — C30074, C30075, C30082 — were checked and passed by that worker and
came off the skip list. **Both figures were right for their minute.** The sheets carry the
later one and say so on their face.

## The one figure that is NOT fully live-derived

The **defects** and **misleading tickets** on tabs 2 and 3 were transcribed from today's
committed pass folders, not re-observed by this pass. The build markers **were** re-read
live from each branch's `index.html`. **No Jira call was made at all**, so every ticket
status quoted on tab 3 comes from those same committed records.

## Known shortfalls, stated rather than hidden

- **Screenshots exist but are not annotated.** Standing Rule 52's evidence bar requires
  annotated images before filing. Each tab-2 row says so in its own words.
- **The duplicate search was run for one of the three defects only** (the toast/Undo one).
  The other two say so and ask the filer to run it.
- **The concurrent worker's own pass has no committed execution log yet**, so its per-case
  detail is not in the "What changed" wording on Vlad's Section B. The case list is still
  complete, because it was derived from live TestRail rather than from the logs.

---

## ⚠️ TWO GENERATIONS OF GENERATOR SIT SIDE BY SIDE — CHECK WHICH `data.json` YOU ARE READING

*(Added 2026-08-12 by the Filters finish4 pass. Nothing below was changed or removed; this note
only labels what is already here, because the two vintages have near-identical names.)*

**There are TWO `data.json` files in this tree and they are different snapshots, hours apart.**
The hazard is not hypothetical: **both generators load their input with the same line of code,**
`json.load(open(os.path.join(HERE, 'data.json')))`, **so each silently reads the `data.json`
sitting beside itself.** Reading the wrong one publishes wrong counts in a sheet handed to a
tester.

| File | Snapshot | Status | Feeds |
|---|---|---|---|
| **`per-project/data.json`** | **12:47:58Z** | ✅ **CURRENT** | `per-project/gen.py` → the three per-project sheets · `per-project/verify.py` (21 checks) |
| `data.json` (top level) | 05:59:03Z | 🕗 **earlier snapshot — kept as the record** | `gen_tester_handover.py` → the combined `Manual-Tester-Handover_2026-08-12.xlsx` |
| `vlad.json` | 06:00:05Z | current for its own purpose | `gen_vlad_changes.py` → `Test-Case-Changes-for-Vlad_2026-08-12.xlsx` |

**Which generator produced which delivered file:**

| Delivered file | Generator | Input |
|---|---|---|
| `Schedule_Tester-Handover_2026-08-12.*` | `per-project/gen.py` | `per-project/data.json` |
| `Filters_Tester-Handover_2026-08-12.*` | `per-project/gen.py` | `per-project/data.json` |
| `Report-Suite_Tester-Handover_2026-08-12.*` | `per-project/gen.py` | `per-project/data.json` |
| `Manual-Tester-Handover_2026-08-12.*` (superseded for hand-off) | `gen_tester_handover.py` | `data.json` (top level) |
| `Test-Case-Changes-for-Vlad_2026-08-12.*` | `gen_vlad_changes.py` | `vlad.json` |

**The counts differ between the two snapshots and both were right when taken** — held went
88 → 95 and already-Passed-on-held 13 → 15, as the banner at the top of this file records. So a
figure quoted from the top-level `data.json` is not wrong, it is **stale**: it belongs to the
05:59Z snapshot. **Quote the per-project one for anything going to a tester.**

### One more thing to know before re-running `per-project/gen.py`

**It writes its output into `per-project/`, not into this folder.** `gen.py` builds its paths as
`os.path.join(HERE, stem + '.xlsx')` (lines 479–480) while `verify.py` sets
`OUT = os.path.dirname(HERE)` (line 21) and checks the copies **here in the parent** — which is
where the three delivered sheets live, having been relocated after they were generated.

**Consequence, stated plainly: a re-run as-is would drop a SECOND set of three sheets inside
`per-project/` and leave the delivered ones in this folder untouched, while `verify.py` went on
passing against those older delivered copies.** Nothing would look broken. If you re-run the
generator, either point its output at the parent or move the files afterwards, **and re-run
`verify.py` and read which files it actually opened.** There are no generated sheets in
`per-project/` today, so this has not happened yet.
