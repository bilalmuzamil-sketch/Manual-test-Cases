# Report Suite — closing the 6 coverage gaps: what was changed, and why that number

**Date 2026-07-31.** Spec baseline = the six live versions captured today (SBC v12 /
SBR v15 / PV v4 / TU v5 / WIP v6 / IV v3, all updated 2026-07-29 by Chris Ward) —
`build/report-suite/spec-current-2026-07-31/`. Gap analysis =
`COVERAGE-REDERIVATION.md`.

**Live-build status (Standing Rules 12/22):** no Report Suite QA branch/environment
exists. **Nothing here is live-verified.** Every case touched stays `VIU-Pending`;
anything the spec does not pin down is left as "confirmed in the build" in the case
body — no label was invented.

---

## 1. The honest number: **0 new cases, 6 extensions**

| | Count |
|---|---|
| Uncovered current requirements addressed | **6** |
| **New cases authored** | **0** |
| Existing cases **extended** instead of duplicated | **6** |
| Existing cases given a **refs-anchor backfill** (metadata only, no tester-facing change) | **13** |
| Requirements deliberately given no case (with reason) | **7** |
| Requirements blocked on the spec itself | **0** |
| Padding added to reach a number | **0** |

**Why zero new cases — the justification.** All six gaps are the **same behaviour seen in
a second place**: the per-row **Location** column, which each report already has a case
for (C38912–C38917, authored 2026-07-31), must also appear **inside the exported file**.
The requirement is *conditional on more than one location being in scope* — and the
existing case is the only case that establishes that scope. So the honest treatment is
one extra step and one extra expected on the case that already owns the column, not five
new "the export contains the Location column" cases. Five such cases would be the
audit's own named slop pattern (**"export pairs duplicating a whole filter matrix"**) and
would each have to re-seed the same two-location precondition.

**The shape already existed in the suite.** WIP-FLT-09 = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) already opens the
downloaded file and reads the exported column header. WIP was therefore the only report
with **no** gap. This pass brings the other five up to WIP's shape — so the extension is
also a **cross-case consistency fix**, not just a coverage fix.

The sixth gap (TU `S8-R16`) is one accessible-name assertion on the control whose case
already exists — a new case for it would test the same button twice.

*(For contrast: the Filters pass on the same day turned 26 uncovered requirements into 8
new cases + 7 extensions, because those requirements spanned a whole new Story 13 with
distinct interactions. Here the 6 uncovered requirements collapse to a single
behaviour-in-a-second-place, so the split lands differently. The method is the same; the
number follows the content.)*

---

## 2. The 6 extensions

Each adds **one step + one expected**, plus the requirement anchor and its **owning story
ticket** to `refs`, plus a note recording what was closed and why it was extended.

| Internal ID | TestRail | Requirement closed | What was added | Owning ticket added |
|---|---|---|---|---|
| **SBC-LOC-04** | [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | `S4-R13` (export half) | Download all four files (Summary + Expanded View × PDF + CSV) and confirm the Location column is there in its on-screen position with the same values — name / "Multiple" / invoice's own location. | **SV-8603** already present (SBC Story 4 owns S4-R13); SV-8612 + SV-8613 added because the observation happens in their files |
| **SBR-LOC-05** | [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) | `S14-R20` | Download all four files and read the Location column: a Summary rep row carries the rep's location and reads **"Multiple"** when the rep spans locations; an Expanded View invoice row carries that invoice's own exact location. | **SV-8631** (SBR Story 14 — PDF and CSV exports) |
| **PV-FILT-14** | [C38914](https://shopview.testrail.io/index.php?/cases/view/38914) | `S6-R11` | Download the CSV and the PDF and confirm the Location column in its on-screen position (leftmost, before Type), with **"Multiple"** on the merged Special Order row. | **SV-8646** (PV Story 6 — Exports) |
| **TU-LOC-06** | [C38915](https://shopview.testrail.io/index.php?/cases/view/38915) | `S7-R13` | Download **both PDF views and the CSV** and confirm the Location column in its on-screen leftmost position with the same values. | **SV-8654** (TU Story 7 — Export to PDF and CSV) |
| **IV-LOC-06** | [C38917](https://shopview.testrail.io/index.php?/cases/view/38917) | `S10-R15` | Download the CSV and the PDF and confirm the Location column between Vendor and Qty on Hand, naming each row's own location. | **SV-8677** (IV Story 10 — Export to PDF and CSV) |
| **TU-COL-01** | [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) | `S8-R16` | **Inserted as step 2 / expected 2**, next to the existing tooltip check: read the name assistive technology gives the icon-only button and confirm it is not left unnamed. Wording deliberately left as "confirmed in the build" — the spec does not state it. | **SV-8655** (TU Story 8 — Visual Conformance and Accessibility) |

**Placement note (Rule 28 dimension 2 — steps must run in order):** five extensions
append their step, because the download is the natural *last* thing you do once the
on-screen column has been read. TU-COL-01's was **inserted at position 2** instead, so the
two "what is this button called" checks sit together rather than after the browser-restart
step.

**No API case was needed** (Standing Rule 4): nothing added here names an endpoint, an
HTTP verb or a status code.

---

## 3. The 13 refs-anchor backfills (metadata only)

These cases **already assert** the requirement in their tester-facing text — the anchor
was missing or pointed at pre-v12 numbering, which made a covered requirement look
uncovered. Only `refs` and `notes` change; **not one word of Preconditions / Steps /
Expected was touched.** Full table with the per-case reason in
`COVERAGE-REDERIVATION.md` §6.

`SBC-EXP-02` C30160 · `SBC-EXP-03` C30161 · `SBC-EXP-04` C30162 · `SBC-EXP-10` C30168 ·
`SBC-EXP-14` C30172 · `SBR-PERS-04` C30274 · `SBR-STATE-01` C30298 · `TU-NAV-03` C30394 ·
`WIP-TAB-01` C30451 · `WIP-SCOPE-05` C30460 · `WIP-EXP-02` C30511 · `WIP-FLT-09` C38916 ·
`IV-NAV-06` C30539

**Backfill is strictly ADDITIVE.** A first attempt *replaced* SBC-EXP-10's pre-v12
citations with the current ones and instantly orphaned two other requirements (`S15-R12`,
`S15-R14`) that no other case cites. Caught by re-running the mapper, reverted from the
backup, and re-applied additively. The re-run is the guard — **always re-run
`rederive_coverage.py` after touching any `refs`.**

**Pattern worth keeping:** 5 of the 13 lost their anchor when a case was **merged or cut**
in the 2026-07-28 consolidation — the survivor inherited the behaviour but not the retired
case's spec anchors. Future merges must carry the merged case's anchors into the survivor.

---

## 4. Requirements deliberately given NO case (7)

Full verbatim text and reasoning in `COVERAGE-REDERIVATION.md` §5. In brief:

**Cut by the user-authorized 2026-07-28 Ruthless Usefulness Audit — re-authoring would
reverse a recorded ruling (4):** SBC `S10-N1` and SBR `S11-N1` (no-op assertions — "the
sort control is there but nothing happens"); SBR `S14-R14` (an 8px-floor one-step
font-tier shift inside a PDF — not manually measurable); PV `S4-N1` (a mismatched stored
schema version cannot be seeded by hand; the reachable half is covered by PV-COL-05 =
[C30355](https://shopview.testrail.io/index.php?/cases/view/30355)).

**Not independently testable (3):** SBC `S20-N1` (its own text is *"No applicable
user-visible negative cases"*); PV `S3-R1` (a pointer — *"see Story 4 … defined in
Story 5"* — whose substance is tested by PV-ROW-01/02 + PV-COL-02/03); PV `S7-R7` (a
statement about the spec, not the product).

**Blocked on the spec itself: 0.** **Descoped by a PO ruling in this pass: 0** — the
PO-descoped items (Print, All-Time, asset comparison) were *removed from the specs*, so
they never enter the enumeration.

---

## 5. Ambiguities flagged, not guessed (per the unattended-safety instruction)

Nothing was blocking. Two items are recorded rather than resolved:

1. **The over-cap export message exists in only 3 of the 6 specs, in 3 wordings** — and
   all three differ from the one **Chris Ward ruled on 2026-07-31 (Q2 = Option A)**:
   *"This report is too large to export. Narrow the date range or filters, then try
   again."* Our six cap cases already quote the **ruled** string, so **no case change was
   made** (Rule 32, newest-wins). What is outstanding is **Chris's spec edit** on all six
   pages — already on `SPEC-WATCH-2026-07-28.md`, deadline **2026-08-04**.
2. **PV `S7-R7` and SBR `S18-R7.6`** are the same "this spec is the source of truth"
   meta-sentence, but SBR's is anchored on a case (SBR-VIS-01 = [C30305](https://shopview.testrail.io/index.php?/cases/view/30305)) while PV's is judged
   not-testable. Harmless; noted so the two are not read as a contradiction. If they must
   match, the SBR anchor is the one to drop — **not done without authorization.**

**No ticket was invented.** TU Story 10 genuinely has no Jira story: TU-COL-01's refs
keep the epic key `SV-8582` **and say so explicitly**, while the newly added `S8-R16` half
cites its real owner `SV-8655`.

---

## 6. Result

| | Before this pass | After |
|---|---|---|
| Current requirements covered | 882 / 895 | **888 / 895** |
| Open genuine gaps | 6 | **0** |
| Requirements with no case, by design | 7 | 7 |
| Stale / invented anchors on active cases | 0 | **0** |
| Our active cases | 474 | **474** (no adds, no deletes) |

Re-verified by re-running `rederive_coverage.py` after the edits.
