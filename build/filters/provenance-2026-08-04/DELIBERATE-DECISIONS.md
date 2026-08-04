# Filters — DELIBERATE-DECISIONS / anticipated-challenge register (Standing Rule 46)

**Pass:** Standing Rule 54 provenance retrofit, 2026-08-04.
**Purpose:** every deliberate omission, every case that follows a ruling over spec text,
every HELD item and every accepted imperfection is written down **before anyone asks** —
because *an undocumented deliberate omission is indistinguishable from a miss.*

> **The PO-ruling half of this register lives in `PO-RULING-DEFENCE.md`** (one row per
> affected case: our quoted assertion · the spec verbatim with anchor and version ·
> Branko's ruling verbatim with date and repo path · why it wins · who closes it · honest
> risk · a paste-ready answer). This file carries the **rest** of the categories so there
> is one place per project.

**HONESTY CLAUSE.** This records what we **decided**, never what we wish we had decided.
The two defects found this pass are logged **as defects, dated**, not relabelled as choices.

## 1. Requirements not asserted because THE SPEC IS SILENT OR CONTRARY

| Decision | Plain one-sentence answer | Evidence | Affected cases | Who closes it | Risk |
|---|---|---|---|---|---|
| We kept the mobile **"All Filters" sheet with its "Apply filters" button** from the design, and said so rather than claiming spec support | *"On mobile our tests describe an All Filters sheet with an Apply button; that comes from the agreed design, the written spec does not describe it and says elsewhere that filters apply with no apply button, and we have not had a decision yet."* | Spec v1.6 **S2-R6** verbatim *"The table filters in real time as the user makes selections (no confirm/apply button needed)"*; **S12-R2** *"behave identically to desktop"*. A full-text scan finds *"All Filters"* **nowhere** in the spec. Branko question **B3** OPEN, never sent | FLT-MOB-01…08 = [C29621](https://shopview.testrail.io/index.php?/cases/view/29621) · [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) · [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) · [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) · [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) · [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) · [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) · [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | **Branko** — the ask must go on his next sheet | **HIGH** on C29622 + C29623 (**we would concede them**) · MEDIUM ×6 |
| We did **not** invent per-page "searching X finds Y" cases | *"The spec itself marks the list of searchable fields as pending, so we refused to make one up."* | **S13-R23** is marked *"Pending — QA has no baseline"* **in the PRD**; 5 client-side surfaces have no field list at all | none authored — **the coverage does not exist** | **Branko / engineering** | MEDIUM — a real gap, honestly empty rather than fabricated |
| We did **not** author any **sorting** cases | *"Sorting the Work Orders list appears only in the designs, which are still labelled work-in-progress, so no tests exist for it — the answer to 'how many sorting cases do we have?' is zero."* | Live v1.6 contains the word "sort" **exactly once**, incidentally, in S13-R14. Figma section still titled *"Sorting (Work In Progress)"*. Frozen by the QA lead's ruling *"Lets wait for Brankos answers."* (2026-07-31) | **zero authored** — no internal IDs, no C-ids, never pushed | **Branko** (his Q4) then **QA lead** to authorise | MEDIUM — a whole area of the list has no coverage, stated precisely so the number never drifts |

## 2. Cases that follow a PO RULING over the spec text

**4 cases — full detail in `PO-RULING-DEFENCE.md` group A** (the Status chip on the
Estimates and Completed tabs; Branko 2026-07-17 Q4=B against five live requirements that
still say "hidden"). **Risk LOW ×4**, because the QA lead ruled on 2026-07-30 that
"hidden" and "greyed-out/disabled" describe the same behaviour.

**Plus 9 cases** where the spec covers the area in prose only and Branko's 2026-07-31
answers supply the detail (`PO-RULING-DEFENCE.md` group B).

## 3. Cases resting on the ENGINEERING TECH PLAN with no requirement behind them

| Decision | Plain answer | Cases | Risk |
|---|---|---|---|
| Which tab opens on a first visit | *"The spec does not say which tab opens first; our test says Estimates because the engineering plan does, and the test states that plainly."* | FLT-TAB-06 [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | **HIGH** — 13 design boards show **All** selected; an engineering plan is not a product decision (Rule 30) |
| Filters saved before the redesign carrying over | *"Whether old saved choices survive the update is a one-off migration the spec does not cover; it comes from the engineering plan."* | FLT-PERS-06 [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | MEDIUM |

## 4. HELD items — deferred by the QA lead's own ruling (Rule 48 fields)

**(1) THE RULING, VERBATIM:** *"Lets wait for Brankos answers."*
**(2) WHEN + WHAT IT ANSWERED:** **2026-07-31**, replying to our direct question *"what
would it take to apply each staged group?"* — a deliberate deferral, not an oversight.
**(3) WHAT IT BLOCKS BY NAME:** the 8 mobile cases above; FLT-TAB-06 = **C38876**'s
default-tab assertion; and the **entirely unwritten** sorting block (est. 6–8 cases).
Also still held: the **19-case dropdown merges** (MG1/MG2/MG5/MG6) which rest on an
unverified shared-component assumption, and **FIX-PLAN F2/F3**.
**(4) WHY IT WAS REASONABLE:** applying any of them means **asserting behaviour no written
source supports**, which would breach Rule 42. **Nothing has changed since** — his sheet
came back blank a third time on 2026-07-31.
**(5) WHAT WOULD UNBLOCK IT:** Branko's answers to Q1/Q2/Q4, then the QA lead's go-ahead.

**Honoured to the letter this pass:** the frozen cases received **only** the provenance
line. The one exception is explained in §6 below and was mechanical, not substantive.

## 5. Cannot be settled without a live build

**All 110 cases are VIU-Pending and every provenance line is deliberately at state 1 with
NO build date.** Nothing in this suite has ever been checked against a running build.
**However — SV-8795 (Filter Persistence) and SV-8796 (URL State) are now `Ready for QA`**,
so this may change soon. Risk: **the largest single gap in the project.**

## 6. Foreign-case overlaps (Rule 38)

**None.** Group 4110 held **0** cases created by anyone but us, verified by a fresh live
read before and after the push (`created_by == 3` on all 110).

## 7. Known imperfections ACCEPTED or SCHEDULED — logged as defects, dated

| Item | Status | Honest note |
|---|---|---|
| **FLT-MOB-04 [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) is paste-corrupted** — two preconditions on one line, four steps run together, the whole expected result inside a stray `<li data-pasted="true">` | **refs artefact FIXED 2026-08-04; BODY reflow STAGED, not executed** | Found by the Rule-41 whole-case re-read. **It is a defect, not a decision** — it has been live since the case was authored. The body reflow is staged (`STAGED-REPAIRS.md`) because reflowing it would restate the very assertion Branko has not ruled on; the mechanical half that touches no contested text was done |
| **FLT-MOB-08 [C29628](https://shopview.testrail.io/index.php?/cases/view/29628)** was first stamped `plain` when its precondition depends on the design-only sheet | **FIXED same pass** | Caught by our **own** Rule-28 cross-case sweep, run after the main push. Recorded rather than quietly corrected: the first re-push was refused by the drift guard, the snapshot was refreshed, and the re-stamp replaced the line (idempotency confirmed live) |
| The **9 `FLT-SRCH` palette cases** exist locally but have **never been pushed** | **Held by the QA lead's ruling** | *"OK do not delete those cases unless Branko confirms that they are related to Global search only."* Branko's Q6 answer (2026-07-31) says the pop-up search is Global Search's, so they will likely move — but the ruling stands until he confirms explicitly |
