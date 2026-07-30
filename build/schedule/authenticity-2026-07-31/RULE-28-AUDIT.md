# Schedule — Rule-28 three-dimension re-verify (closing authenticity pass, 2026-07-31)

> Mandatory final gate on every authoring pass. Scored over **100% of the 164 active cases**
> (no sampling — Rule 17). Method: `build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md`.
> Per-case verdicts: `per-case-verdicts.csv` (164 rows, with TestRail Case ID + link per Rule 8).

## Headline tally

| Dimension | Result over all 164 |
|---|---|
| **1 — USEFUL** | **145 KEEP · 19 WEAK-KEEP · 0 MERGE · 0 CUT** |
| **2a — MAKES SENSE (cold read, 6 fail conditions)** | **164 SENSIBLE · 0 FIX-WORDING outstanding · 0 NONSENSE** |
| **2b — CROSS-CASE CONSISTENCY** | **1 NEW contradiction found (X7) · 1 RESOLVED · 0 left PENDING** |
| **3 — GENUINE + LAYMAN-RUNNABLE** | **164 / 164 PASS** |
| **KEEP-but-NONSENSE (the embarrassment check)** | **EMPTY** ✅ |
| **Unresolved contradictions** | **0** (the bar this pass had to clear) |

**Is the critic right?** On the *"70%+ useless"* half: **no.** 164/164 are recommended for
keeping — 0 CUT, 0 MERGE remaining, because the 2026-07-31 consolidation already executed the
26 merges and cuts (190 → 164). Waste rate in the delivered suite = **0%**; the 19 WEAK-KEEP
are flagged low-value, not slop, and each is legitimate coverage. On the *"some tests just do
not make sense"* half: **one real contradiction was still live** and today's sweep found it
(X7 below) — that is the honest answer. It is fixed. Zero remain.

---

## Dimension 2b — the cross-case consistency sweep (all 164)

Control groups built (by CONTROL, not section): cell-menu (9) · capacity-bar (11) · events (18)
· modal (26) · series-banner (22) · spread/skipping (18) · tooltip-VIN (13) · hours (24) ·
permissions (11) · undo-toast (15) · lanes-overlap (11) · drag-drop-create (30) · conflict (17)
· colour (11).

### NEW contradiction found and resolved this pass

| # | Control group | The problem (quoted) | Authority | Action taken |
|---|---|---|---|---|
| **X7** | Conflict reason strings — hours/working-days | **SCH-CONF-02 (C30024)** E1 quoted the prototype's hardcoded string *"'Scheduled on a weekend **(outside Mon-Fri)**'"*. Three problems at once: (a) that exact string exists in **no** spec / design / ticket / PO source — v23 §4.11 reads *"Weekend shift \| Shift scheduled on Saturday or Sunday **(outside working days)**"*; (b) it contradicted **the case's own E2** — *"If the technician's working days DO include that day (for example Saturday hours are configured), a shift on that day is NOT flagged"* — a fixed Mon-Fri window cannot coexist with per-technician working days; (c) it was **inconsistent with its own control group's sibling**, SCH-CONF-03 (C30025), whose hardcoded 8:00 AM / 5:00 PM were de-numbered in the morning pass as contradiction **X5** for exactly this reason. | **Spec v23 §4.11** (verbatim), reinforced by Branko's tech-hours hierarchy ruling | **SCH-CONF-02 (C30024)** E1 realigned to the spec's own *"(outside working days)"* wording + an explicit *"names the technician's own working days, not a fixed Monday-to-Friday window"*. Full rationale recorded in the case notes. |

**Why X7 matters:** it is the same failure mode as X6 yesterday — the morning pass repaired
**one** member of the hours-conflict group (CONF-03) and left its **neighbour** (CONF-02)
asserting the superseded model. Nothing but a re-run of the control-grouped diff finds that; a
per-case cold read passes CONF-02 because it is *almost* internally consistent.

### The morning pass's six contradictions — RE-VERIFIED, all still resolved

| # | What it was | Re-verified today |
|---|---|---|
| **X1** | Series banners asserted "visible breaks around skipped / otherwise-booked days" (deleted in Confluence v22) | ✅ **STILL RESOLVED** — 0 `break` assertions remain in SCH-SER-01 (C29987) / SCH-SER-02 (C29988) expected results |
| **X2** | SCH-SER-01 E3 claimed weekend columns are empty *unconditionally* | ✅ **STILL RESOLVED** — E3 now reads *"…are empty (no bar) **when no business hours are set for those weekend days**"* |
| **X3** | Six cases told the tester to **right-click** a menu that only opens on left-click | ✅ **ALL 6 HELD** — see the dedicated table below |
| **X4** | SCH-EVT-08 asserted events do **not** count toward capacity | ✅ **STILL RESOLVED** — title *"An event's hours count toward the capacity bar but raise no conflict"*; E1 *"Adding the event DOES increase that day's capacity bar fill"*; E3 keeps the capacity/conflict split |
| **X5** | SCH-CONF-03 quoted hardcoded 8:00 AM / 5:00 PM | ✅ **STILL RESOLVED** — no `8:00 AM` and no `5:00 PM` anywhere in its expected; E3 names the 7:00 AM–7:00 PM general default. *(This pass extended the same fix to its neighbour CONF-02 = X7.)* |
| **X6** | SCH-EVT-02 had left-click both *starting creation* and *opening a menu* | ✅ **STILL RESOLVED** — step 1 and E1 both route through the menu: *"Left-clicking empty day-view space opens the cell menu; choosing 'Create Event' starts creation at the time you clicked"* |

### The six right-click → left-click repairs — VERIFIED HELD

Suite-wide scan of every tester-facing field (title / preconditions / steps / expected) of all
164 cases for `right-click`:

| Case | TestRail | left-click hits | right-click hits |
|---|---|---|---|
| SCH-EVT-01 | C30016 | 2 | 0 |
| SCH-REAS-03 | C30054 | 3 | **1 — intentional** |
| SCH-EVT-03 | C30018 | 1 | 0 |
| SCH-PERM-02 | C30075 | 1 | 0 |
| SCH-PERM-04 | C30077 | 2 | 0 |
| SCH-REAS-06 | C38855 | 1 | 0 |

**Exactly one `right-click` mention survives in the whole suite** and it is the deliberate
PO-backed negative — SCH-REAS-03 E5: *"This menu is opened by a normal left-click - right-clicking
the cell does not open it."* That is the assertion, not a stale instruction.

### Candidate contradictions surfaced and CLEARED (13 pairs)

A fuzzy opposite-polarity detector (≥0.45 Jaccard on the claim wording **and** opposite
negation) was run inside every control group, plus a title-level pass inside every shared spec
anchor. 13 pairs surfaced; **all 13 cleared, each with a reason** (recorded so the sweep is
auditable, not a bare "none found"):

| Pair | Why it is not a contradiction |
|---|---|
| SCH-REAS-03 *"menu contains ONLY two items"* vs SCH-PERM-02 *"No creation menu opens at all"* | **Different precondition — role.** PERM-02's user has Schedule: View only; REAS-03's has Edit. Both true of the same build |
| SCH-START-01 *"starts at the technician's own configured start time, not the shop's"* vs SCH-START-02 *"starts at the shop's business-hours start time"* | **The two branches of the §4.2 hierarchy** — START-01's tech HAS hours, START-02's does not |
| SCH-START-02 vs SCH-START-06 *"unassigned shift starts at the shop's business-hours start"* | **They agree** (both business hours); only the phrasing polarity differs |
| SCH-START-05 *"no technician added to the roster by this drop"* vs SCH-START-07 *"the technician is added to the roster"* | **Sequential, not opposed.** START-05 drops onto the *Unassigned row* (no technician exists to add); START-07 then drags that shift *onto a technician row* |
| SCH-START-05 vs SCH-REAS-01 *"Technician B is added … A is removed"* | Same reason — Unassigned drop vs cross-technician reassign |
| SCH-START-05 vs SCH-DND-01 *"the technician is added to that line's labor roster"* | **Different drop target** — Unassigned row vs a technician's cell |
| SCH-DND-03 *"added to that line's roster only (not the order's other lines)"* vs SCH-START-07 | **They agree**; DND-03 adds a scope qualifier |
| SCH-LINE-04 *"no cap on how many technicians"* vs SCH-SCOPE-01 *"roster as an avatar stack plus count"* | **They agree** — same rendering; "no cap" is an extra detail |
| SCH-START-05 ↔ SCH-START-07 (title level, §3.2 and §4.2 clusters) | Different actions — create-unassigned vs assign-an-unassigned |
| SCH-DND-01 *"single-line work order → **no** scope picker"* vs SCH-DND-02 *"multi-line work order → **opens** the scope picker"* | **This is the defining distinction between the two cases.** Correct, and load-bearing |

---

## Dimension 2a — MAKES SENSE, cold read against the 6 fail conditions (all 164)

| Fail condition | Mechanical check | Result |
|---|---|---|
| 1. Steps not executable in order / precondition unreachable | every case has non-empty preconditions + steps + expected; numbering integrity `1. 2. 3.` | **0 failures** (0 empty, **0 numbering breaks**) |
| 2. Expected doesn't follow from the steps | steps-vs-expected token overlap; the 25 low-overlap cases hand-read | **0 failures** — all 25 are observation-style cases (*"Look at the capacity bar"* → *"An amber segment extends past the right edge"*); low lexical overlap is correct here, not a defect |
| 3. Internal contradiction | opposite-polarity near-identical expected lines *within* one case | 3 flags, **all 3 cleared**: SCH-FILT-02 (the two filter states), SCH-BLOCK-02 (two different blocks, '4 Lines' vs '2 Lines'), SCH-KEY-01 (Escape's layered stacking order) |
| 4. Names a control in no source | all 45 distinct quoted UI labels checked against spec v23 + design notes + epic stories + tech plan + PO answers | **1 real failure → X7 above (now fixed).** The only 3 remaining unmatched strings are our own throwaway test-data names (`ZZAUTOTEST Rush` / `ZZAUTOTEST note` / `ZZAUTOTEST stand-up`), correct per Standing Rule 5 |
| 5. Domain nonsense | closure/weekend/hours logic re-derived against v23 §4.2/§4.5/§4.11/§12 | **0 failures** |
| 6. Not actionable | every case has an observable pass/fail in Expected | **0 failures** |

### Spec-internal contradiction X1 (requirements.md) — our cases sit on the correct side

Confluence v23 contradicts itself: **§4.5** *"Shop closures and public holidays are not skipped
in V1.."* versus **§12** *"Shop closures … block the spread step from placing shifts on those
days."* Both live in v23 (Branko updated §4.5 in v22, never updated the §12 bullet). Per Rule 15
we flag and never silently pick a side.

**Checked all 8 closure sentences in the whole suite. Every one asserts the §4.5 side; NONE
asserts the §12 side:**

| Case | TestRail | Assertion |
|---|---|---|
| SCH-SPREAD-07 | C29983 | *"Shop closures and public holidays are NOT skipped in V1 - shifts can be placed on those days."* |
| SCH-EDGE-05 | C30089 | *"The closure day is NOT struck through or skipped by the spread in V1."* · *"A shift CAN be placed on the shop closure day."* · *"no extra day is added for the closure."* |

Both cases cite **both** sections in `refs`, so the contradiction is visible from the metadata
rather than buried. It is already a confirmation question on the Branko sheet (**NQ-1**) — left
**flagged pending**, not resolved by us. **No case needed re-aligning.**

---

## Dimension 1 — USEFUL (all 164)

**145 KEEP · 19 WEAK-KEEP · 0 MERGE · 0 CUT.** No new slop could be introduced this pass (no
cases were authored — only 73 titles trimmed and 19 refs repaired), and the re-check confirms
none was:

- **0 duplicate titles**, **0 empty titles** across 164.
- **0 near-identical title pairs** introduced by the 73 rewrites — every rewritten title was
  diffed against all 163 others (and against all untouched titles); highest overlap is below
  the 0.7 threshold.
- **1 near-identical Expected pair** surfaced — **SCH-START-01 (C29969) ↔ SCH-START-02
  (C29970)**, 0.70. **Checked and CLEARED, not a merge:** these are two of the three branches
  of the §4.2 start-time hierarchy (technician hours → shop business hours → 7:00 AM default,
  the third being SCH-START-03/C29971). Each branch has a distinct precondition and a distinct
  observable outcome, and a failure in any one is a separate real bug. This is exactly the
  load-bearing calculation/hierarchy coverage the audit process says to **credit**, not cut.

---

## Dimension 3 — GENUINE + LAYMAN-RUNNABLE (all 164) — 164/164 PASS

| Check | Result |
|---|---|
| Rule 20 traceability — ticket + spec anchor on every case | **164 / 164** (Phase 1: 0 stale anchors, 0 missing, 0 over the 250-char cap) |
| Jargon in tester-facing fields (ticket keys, §-numbers, FR-/NFR- codes, "VIU", feature-flag, HTTP/endpoint/payload outside API sections) | **0 hits** |
| Numbered Preconditions / Steps / Expected, each line breaking | **0 numbering breaks** |
| Titles fully displayable in TestRail (≤ 80 chars) | **164 / 164** (Phase 2; longest = 80) |
| Every case has an observable pass/fail a non-technical tester can apply | **164 / 164** |

---

## Honesty notes (Rule 12 / Rule 22)

- **This is a documentary audit, not a live-build verification.** Schedule still has **no QA
  branch or environment** (OQ-3), so nothing here was observed in the running app and **all 164
  cases remain `VIU-Pending`**. Spec-pinned and design-pinned ≠ VIU-Verified.
- The X7 fix aligns the case to the **spec's** wording. The **actual on-screen string** must
  still be captured live at VIU (Rules 9/12) — as its note now says.
- The mechanical detectors are proxies, and are reported as such: they surfaced 38
  title-vs-expected flags, 25 steps-vs-expected flags, 13 opposite-polarity pairs and 3
  internal-polarity flags. **Every one was hand-read**, and the counts above separate what the
  metric flagged from what was genuinely wrong (**1 of 79 flags = X7**).
- The **19 WEAK-KEEP** verdicts are carried forward from the 2026-07-31 usefulness audit and
  were not re-litigated here; they are flagged low-value, and remain in the suite.
