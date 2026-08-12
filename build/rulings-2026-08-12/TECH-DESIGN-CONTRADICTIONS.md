# Where the TECHNICAL DESIGN contradicts a spec, ticket, answer sheet, Claude design or Figma

**2026-08-12 — produced because the QA lead asked for it by name.** His ruling closes the
technical-design authority question that Standing Rule 57's follow-up (ii) had left open since
2026-08-06, and it ends with an instruction, not a courtesy.

> **USER DIRECTIVE (2026-08-12, verbatim, his typing preserved exactly as he wrote it, because Rule 25
> applies to his instructions as it does to a spec):**
>
> *"Technical design is the authority but if that contradicts with specs/tickets/answer sheet/claude
> design/figma (because they are also the authority with the rule that the latest entry for that
> question wins) I would suggest to consider the specs/tickets/answer sheet/claude design/figma (with
> the rule that the latest entry for that question wins) as the authority for the test cases but let
> me know where it contradicts with the tech design."*

**This document is the *"let me know"* half.** Following the precedence order silently would satisfy
one sentence of his ruling and breach the other.

---

## 🔴 READ THIS FIRST — THE FOUR THINGS THAT MATTER

1. **NOT ONE TEST CASE WAS CHANGED, AND NONE IS PROPOSED FOR CHANGE HERE.** A sibling worker is
   writing to two of these three projects right now. **0 TestRail calls · 0 Jira calls · 0 Confluence
   calls · 0 application access** were made by this pass. This is his list to act on (Rule 6).
2. **THE HEADLINE COUNT: 6 LIVE CONTRADICTIONS, 4 RESOLVED-AND-KEPT-FOR-THE-RECORD, 1 THAT NEEDS A
   LIVE SPEC READ BEFORE IT CAN BE CALLED EITHER.** Every one is named below with both texts quoted.
3. **THE MORE USEFUL HALF OF THE RULING IS THE HALF THAT UNBLOCKS WORK, AND IT IS EASY TO MISS BEHIND
   THE SUBORDINATION CLAUSE.** *"Technical design is the authority"* — so a case sourced by the
   technical design **alone**, with every other document **silent**, is **properly sourced**. **ELEVEN
   CASES WERE HELD ON THE OLD OPEN QUESTION AND ARE RELEASED BY THIS** (§3).
4. **A TECH-DESIGN-vs-PRD CONTRADICTION IS A DEFECT IN THE DOCUMENTS, NOT MERELY A TEST-CASE
   PROBLEM.** It means engineering is building to one description while the product is written to
   another. **That is worth more to him than a quietly-corrected test case** — which is exactly why he
   asked to be told.

---

## SOURCE CURRENCY (Standing Rule 31) — READ BEFORE RELYING ON ANY ROW

**This is a DOCUMENTS-ONLY sweep of committed evidence. It is NOT a live re-fetch, and it does not
claim to be.** The brief for this pass barred external calls while two siblings were writing.

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| Schedule technical design | `build/schedule/tech-plan-2026-07-29/TechPlan-Schedule-Module-Rewrite.md` | plan dated **2026-07-22**, uploaded 2026-07-29 | 2026-08-12, from the repository | **PARTIAL** — the artefact is current in our hands, but **it is undated internally beyond that header** and predates spec v24/v25 |
| Schedule specification | live-fetched body mirrored at `build/schedule/spec-v25-2026-08-06/evidence/raw-v25.xml` | **Confluence v25**, fetched 2026-08-06 | 2026-08-12, text searched directly | **PARTIAL** — current as at 6 August; **not re-fetched today** |
| Filters technical design | `build/filters/tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md` | own decisions log to 2026-07-20; **baseline "Spec v1.3"** | 2026-08-12 | **STALE against the spec** — its baseline is v1.3; the spec is **v19** |
| Filters specification | as recorded in `build/filters/testrail-id-map.csv` refs | **v19, 2026-08-06** | 2026-08-12, from the refs column | **PARTIAL** — not re-fetched today |
| Report Suite technical design | `build/report-suite/tech-plan-2026-07-29/TechPlan-Reports-Suite-Full-Implementation.md` | plan dated **2026-07-21**, grounded on `develop @ 674007b37e` | 2026-08-12 | **STALE against the specs** — predates every August spec edit |
| Report Suite specifications | refs in `build/report-suite/testrail-id-map.csv` + `build/report-suite/spec-delta-2026-08-11/` | **SBC v17 · SBR v18 · PV v6 · TU v7 · WIP v11 · IV v5** (2026-08-07 → 2026-08-10) | 2026-08-12 | **PARTIAL** — read from our own newest committed live readings, not re-fetched today |
| The six per-report spec **mirrors** under `build/report-suite/specs/` | ingested **2026-07-22** | v1-era | 2026-08-12 | **🔴 STALE — DO NOT QUOTE THEM.** They are ~5 spec versions behind and were deliberately **not** used as evidence for any row below |

**The honest consequence of the three PARTIAL rows: every verdict here is good as at the date in its
row, and a row could have been overtaken by a spec edit in the last few days.** Rule 59 exists because
Chris Ward edited all six Report Suite specs *during* a pass on 5 August. **Re-read the governing
requirement before acting on any single row.**

---

# 1 · LIVE CONTRADICTIONS — the technical design says one thing, another authoritative source says another

Ordered by how much is at stake. **Under the ruling, the other source wins for the test cases in every
one of these**, with latest-wins applying among the other sources (Rule 32).

---

### L1 · SCHEDULE — does the multi-day spread SKIP shop closures?

| | |
|---|---|
| **The technical design says** | Decision **D7**: the spread *"skips closures + non-working days (**real skipping** — the prototype never skipped closures)"*; Phase 7 SpreadDialog *"real closure skip"*; the end-to-end test asserts *"created series has no shift on the closure day"* |
| **The specification says** | **v25 §4.5, quoted from the live-fetched body:** *"Automatically skips weekends when business hours are not set for them. **Shop closures and public holidays are not skipped in V1.**"* |
| **Which wins under the ruling** | **THE SPECIFICATION** — the technical design loses on a contradiction. **Our cases already follow §4.5 and need no change.** |
| **Cases affected** | SCH-EDGE-05 = [C30089](https://shopview.testrail.io/index.php?/cases/view/30089) · SCH-SPREAD-07 = [C29983](https://shopview.testrail.io/index.php?/cases/view/29983) · SCH-SPREAD-08 = [C29984](https://shopview.testrail.io/index.php?/cases/view/29984) · SCH-SPREAD-11 = [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) · SCH-API-02 = [C38873](https://shopview.testrail.io/index.php?/cases/view/38873) |

**⚠️ AND THIS ONE HAS A SECOND HALF THE RULING DOES *NOT* SETTLE, SO DO NOT CLOSE IT.** The
specification **contradicts itself**, and both sentences are still in the live v25 body — §4.5 above
against **§12**: *"Shop closures (holidays, inventory days) are defined at the shop level and **block
the spread step from placing shifts on those days**."* **The technical design has taken the §12 side.**
So this is not a tech-design error so much as **engineering following the half of the PRD that our
cases do not follow**, and the underlying question is Branko's. **It has been on his sheet since 22
July and HAS NEVER BEEN SENT — the blocker is us, not him** (register row **S1**; Rule 66 now governs
when the sheet goes out). **The two cases most at risk carry `AUTOMATION: HOLD` for exactly this.**

---

### L2 · SCHEDULE — can a technician have a SPLIT working day (two time ranges)?

| | |
|---|---|
| **The technical design says** | `staff_working_hours` holds **ONE** `start_minute`/`end_minute` per weekday, with a unique key on `(staff_id, workplace_id, day_of_week)` — **there is no room for a second range in the data model** |
| **The specification says** | **v25, quoted from the live-fetched body:** *"Each day starts with a single range; **'Add hours' appends more to support split shifts, each removable.** Added ranges start empty so the user explicitly sets the times. **Overlap validation.** If a day's ranges overlap, the offending range is flagged in red with an inline message"* |
| **Which wins under the ruling** | **THE SPECIFICATION.** Our cases already assert the spec behaviour and need no change. |
| **Cases affected** | SCH-HRS-05 = [C38850](https://shopview.testrail.io/index.php?/cases/view/38850) · SCH-HRS-06 = [C38851](https://shopview.testrail.io/index.php?/cases/view/38851) |

**Why this is the sharpest row in the list: it is not a wording disagreement, it is a DATA MODEL that
cannot express what the PRD requires.** A unique key on `(staff, workplace, weekday)` makes a second
range **impossible to store**, so if the plan is built as written the spec requirement cannot be
satisfied at all — and both our cases will fail against a build engineering considers finished.
**This is the row most worth putting in front of engineering rather than merely recording.**

---

### L3 · SCHEDULE — is a DOUBLE-BOOKING a "conflict"?

| | |
|---|---|
| **The technical design says** | Decision **D4**: *"Tech double-booking … is flagged by the FE engine as a **soft warning** but is **not** a hard 'conflict' per the locked definition; the BE detector reports only outside-window/closure/non-working-day."* |
| **The specification says** | **v25 §4.11 Conflict detection, quoted from the live-fetched body:** the system *"continuously scans for scheduling issues and surfaces them in a **toolbar pill**"*, and the first row of its own conflict-type table is *"**Double-booked** — Two different work orders overlap on the same technician at the same time."* **§1.2 Goals** reinforces it: *"Reduce scheduling errors (**double-bookings**, weekend assignments, after-hours shifts) to near zero with automatic conflict detection."* |
| **Also** | Story **SV-8697** is the owning story for §4.11 — a **ticket**, and therefore on the winning side of the ruling as well |
| **Which wins under the ruling** | **THE SPECIFICATION AND THE STORY.** Our cases need no change. |
| **Cases affected** | SCH-CONF-01 = [C30023](https://shopview.testrail.io/index.php?/cases/view/30023) · SCH-CONF-05 = [C30027](https://shopview.testrail.io/index.php?/cases/view/30027) |

**The testable consequence is precise and worth stating: if the plan is built, the toolbar pill's
COUNT will not include double-bookings, so C30027 fails on a number rather than on a missing feature**
— the kind of failure that gets argued about instead of fixed.

---

### L4 · SCHEDULE — where do the shop's business hours actually LIVE?

| | |
|---|---|
| **The technical design says** | Phase 2 builds a **new admin page**, `ScheduleSettings.vue` — *"Business hours per weekday + closures CRUD; reachable from AdminLeftMenuNav; also the 'Schedule Settings' link target from the calendar's ViewOptions"* |
| **The specification says** | **v25, quoted from the live-fetched body:** *"Working hours are defined in **two places**: a technician's custom schedule in **Edit Staff Member**, and the shop's business hours in **Edit Location**. Both use the same pattern: behind a toggle, off by default"* — and the strings **`ScheduleSettings`** and **`Schedule Settings`** return **ZERO hits in the entire v25 body** |
| **Which wins under the ruling** | **THE SPECIFICATION.** Our cases already describe the Edit Staff Member / Edit Location surfaces. |
| **Cases affected** | SCH-HRS-02 = [C38847](https://shopview.testrail.io/index.php?/cases/view/38847) (the business-hours toggle and its per-day editor) · SCH-HRS-03 = [C38848](https://shopview.testrail.io/index.php?/cases/view/38848) (the Edit Staff Member toggle). **Stated precisely: SCH-HRS-04 = [C38849](https://shopview.testrail.io/index.php?/cases/view/38849) is NOT affected** — it asserts *inheritance* (a technician with no custom hours takes the shop's), which is unchanged wherever the control lives |

**This is a NAVIGATION-PATH contradiction, which makes it a Rule-9/Rule-60-layer-1 problem as well as a
requirements one:** a tester following our steps goes to Edit Location, and if the plan shipped the
control is on a page that does not exist in the PRD at all. **The tester reports "cannot find it",
which reads as a missing feature rather than a moved one.**

---

### L5 · FILTERS — on a phone, does one filter's own sheet apply IMMEDIATELY or only on "Apply filters"?

| | |
|---|---|
| **The technical design says** | Decision **D15**: **individual** filter sheets are **REAL-TIME**; **only** the combined "All Filters" sheet batches its changes behind a button |
| **The specification says** | **v18 §4 Key Decisions + S12-R6** (ratified by Branko on 2026-08-05, who closed [SV-8825](https://shopview.atlassian.net/browse/SV-8825) with *"This is updated in the filters prd, I'm closing it."*): a phone applies **only on tapping "Apply filters"** |
| **Which wins under the ruling** | **THE SPECIFICATION**, reinforced by a **PO answer** — two winning sources against one. **FLT-MOB-04 was already REVERSED to the spec on 2026-08-05 and needs no further change.** |
| **Cases affected** | FLT-MOB-04 = [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) directly; the sheet's siblings FLT-MOB-01 = [C29621](https://shopview.testrail.io/index.php?/cases/view/29621) · FLT-MOB-02 = [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) · FLT-MOB-03 = [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) share the requirement |
| **Already ticketed** | **[SV-8875](https://shopview.atlassian.net/browse/SV-8875)** — Ahtasham Amjad reached the same S12-R6 reading independently, 32 minutes after Branko closed SV-8825 |

**⚠️ AND THE BUILD SIDES WITH THE TECHNICAL DESIGN, NOT THE PRD** — a single filter's sheet was
observed applying as you tap, with no Apply button in the document. **So this contradiction has
already reached production behaviour**, which is the strongest available argument that a tech-design
divergence is worth telling him about rather than filing away. **⚠️ HOUSEKEEPING FOUND IN PASSING, NOT
FIXED: C29624's `refs` still carries the OLD tech-plan reading — *"individual-chip real-time per
S12-R2 + S2-R6 + tech-plan 2026-07-29"* — while the case body asserts the opposite. It is a
recording defect, not an assertion defect; it needs one authorised `update_case` and is NOT touched
here.**

---

### L6 · REPORT SUITE — does a ONE-LOCATION user see the Location FILTER?

| | |
|---|---|
| **The technical design says** | Phase 5 `LocationFilter`: a *"single-location user **still renders the control**"* |
| **The other sources say** | The **kickoff walkthrough video, P33** (2026-07-28, **ruled authoritative by the QA lead**, and newer than the plan): the filter is **HIDDEN** when the user has only one permitted location. **Our four cases were flipped to the video at the time**, and the behaviour was later **filed as a defect** — **[SV-8879](https://shopview.atlassian.net/browse/SV-8879)**, *"location chooser shown to a single-location user, all six reports"* |
| **Which wins under the ruling** | **THE VIDEO/PO SIDE** — the technical design loses. **No case change is implied; ours already follow the video.** |
| **Cases affected** | SBR-LOC-04 = [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) · TU-LOC-05 = [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) · IV-LOC-04 = [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) · PV-FILT-13 = [C30340](https://shopview.testrail.io/index.php?/cases/view/30340) |

**🔴 THIS ROW CARRIES A REAL CAVEAT AND IT IS STATED RATHER THAN BURIED. Our 2026-07-22 mirror of the
Parts Velocity spec contains `S2-E4`: *"A user with access to only one location **still sees** the
Location filter with a single selectable location; behavior is unchanged from single-location use."*
— i.e. the SPEC of that era agreed with the technical design and against the video.** That mirror is
**five versions stale** (PV is now v6) and Chris has since reworded the Location rules across three
specs to *"the access-gated, column-selector-toggleable rule"*, so it may well have been superseded.
**We did not re-fetch it, so we do not know**, and asserting either way would be exactly the
false-authority failure Rule 54 exists to prevent. **WHAT IS OWED: one live read of the current PV /
SBR / TU / IV specs on this point before anyone acts on this row.** Note also that the *column* half
of the Location question **is** settled — Chris answered it by editing the specs, and four `HOLD`
markers were lifted on 2026-08-11.

---

# 2 · CONTRADICTIONS THAT ARE ALREADY RESOLVED — kept visible and dated, never deleted

These were live tech-design contradictions when the three reconciliations ran on 2026-07-29/30. **Each
was closed by a later authoritative source.** They are recorded so nobody re-opens them, and so the
resolution direction is on the record.

| # | Project | The disagreement | How it closed | Direction |
|---|---|---|---|---|
| **R1** | Schedule | **Do events consume technician capacity?** Tech plan **D5** said yes (citing a PRD Q&A comment) while our cases were HELD | **Branko answered Q1 = A on 2026-07-31** — *"yes, event hours count"*, quoting §4.12 | **PO agreed with the plan** — no subordination arose |
| **R2** | Schedule | **A "Reassign" action in the shift modal?** Tech plan: *"drag-only reassign — no modal reassign action"*; our HELD item D4 | **Branko answered Q2 = B** — *"no button; drag only"* | **PO agreed with the plan.** SCH-MODAL-08 = [C30015](https://shopview.testrail.io/index.php?/cases/view/30015) stands |
| **R3** | Schedule | **The default working day.** Tech plan **D3**: *"Default = 07:00–19:00 local"*; the design drew 8–5 | **Branko answered Q5 = B** — *"7:00 AM to 7:00 PM"*, and **v25 confirms it in the body** | **PO and spec agreed with the plan**; the DESIGN was the outlier |
| **R4** | Filters | **Is the Status chip HIDDEN or GREYED-OUT on Estimates/Completed?** Tech plan said *hidden*; Branko's Q4 = B said *greyed-out/disabled* | **QA-lead ruling 2026-07-30**: *"Status chip is hidden on certain tabs = greyed-out/disabled"* — the two describe the **same** behaviour | **Not a contradiction at all** — a wording collision |
| **R5** | Filters | **URL precedence** (tech plan G7 runtime-only vs the v1.3 closing note *"URL wins on load, then persists"*) and **Imported combinability** (tech plan G1 mutually-exclusive vs S2-R1 listing it as a plain status) | **Spec v19 now states both the plan's way** — `S11-R6` *"URL state runtime-only with no write-back"*, `S2-R7` *"Imported cannot be combined with anything else"* | **The spec moved to the plan.** FLT-URL-05 = [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) · FLT-STAT-07 = [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) |
| **R6** | Report Suite | **The 10,000-row export cap was absent from the PV and TU spec pages** while the plan built it suite-wide | **Chris ratified it into both** — PV v6 `S6-R12`, TU v7 `S7-R14`, each with the verbatim message | **The specs moved to the plan.** PV-EXP-11 = [C38885](https://shopview.testrail.io/index.php?/cases/view/38885) · TU-EXP-09 = [C38887](https://shopview.testrail.io/index.php?/cases/view/38887) |

**R1, R2, R3, R5 and R6 are worth reading together, because they say something the subordination
clause on its own would hide: FIVE OF THE SIX RESOLVED DISAGREEMENTS CLOSED IN THE TECHNICAL DESIGN'S
FAVOUR.** Engineering was right about the behaviour and the product document caught up later. **That
is precisely why his ruling keeps the technical design *on* the authority list rather than demoting
it — and why the correct handling of a live contradiction is to REPORT it, not to treat the plan as
noise.**

---

# 3 · THE ELEVEN CASES THE RULING UNBLOCKS

**These were held on the OPEN question, and the ruling settles every one of them — in the direction
that RELEASES them.** In all eleven the technical design is the **only** source that speaks and the
other documents are **SILENT, not contradictory**, so the subordination limb never fires. Under
*"Technical design is the authority"* they are **properly sourced** and, under **Standing Rule 64**,
**not deletion candidates**.

**Where they were held:** the nine of class **C-3** in
`build/unsourced-cases-2026-08-11/CANDIDATES.md`, plus **two** added on 2026-08-11 by
`build/filters/c29600-sourcing-2026-08-11/FINDINGS.md` §7, whose own outstanding list reads: *"It now
governs **eleven cases, not nine**."*

| # | Case | Project | The tech-design item that sources it | Automation status when recorded | **What it now needs** |
|---|---|---|---|---|---|
| 1 | SCH-EDGE-07 = [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) | Schedule | `NFR-005` daylight-saving behaviour | `atm=3` Automated · READY | **Nothing on sourcing.** It was already `READY`; the hold was on the *question*, not the marker. Its own separate blocker stands: the DST state is **un-settable on this estate** |
| 2 | SCH-REG-01 = [C38867](https://shopview.testrail.io/index.php?/cases/view/38867) | Schedule | `FR-015` data migration — pre-existing shifts survive the rewrite | `atm=3` · **HOLD** | **A live check on a pre-rewrite data state.** The sourcing hold lifts; the marker can move to `READY` once someone can observe it |
| 3 | SCH-REG-02 = [C38868](https://shopview.testrail.io/index.php?/cases/view/38868) | Schedule | `FR-016` Dashboard shows one row per work order | `atm=3` · **HOLD** | Same — **sourcing settled; needs the Dashboard observed** |
| 4 | SCH-REG-03 = [C38869](https://shopview.testrail.io/index.php?/cases/view/38869) | Schedule | `AppointmentScheduler` — an appointment set at work-order creation appears on the board | `atm=3` · **HOLD** | Same — **sourcing settled; needs the appointment flow driven** |
| 5 | SCH-REG-04 = [C38870](https://shopview.testrail.io/index.php?/cases/view/38870) | Schedule | Work-order-primary location resolution | `atm=3` · READY | **Nothing.** Sourcing settled |
| 6 | SCH-REG-05 = [C38871](https://shopview.testrail.io/index.php?/cases/view/38871) | Schedule | `FR-P4` work-order priority (High/Medium/Low, none pre-selected) | `atm=3` · **HOLD** | **Sourcing settled.** ⚠️ **Overlaps Branko's sheet item 5** — his answer would ADD a spec source, which can only strengthen it |
| 7 | SCH-API-04 = [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) | Schedule | `NFR-001` location scoping — another location's shift returns 404 | `atm=3` · READY | **Nothing.** Sourcing settled |
| 8 | FLT-PERS-06 = [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | Filters | `s4-3.3` browser-storage → account-preference one-off migration | `atm=1` · **HOLD** | **Sourcing settled — and its `refs` literally say *"confirmation requested"*, which this ruling supplies.** Its remaining blocker is real and separate: it needs **an account whose filters were saved before the redesign**, which no longer exists |
| 9 | PV-PREC-02 = [C38925](https://shopview.testrail.io/index.php?/cases/view/38925) | Report Suite (Parts Velocity) | Phase 0 / PR-1 `D2` — QuickBooks journal amount from a fractional movement | `atm=1` · READY | **Nothing on sourcing.** Note it is **doubly sourced**: story **SV-8589**'s own verbatim *Tests* line covers it too, so it was arguably never held |
| 10 | FLT-CHIP-06 = [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | Filters | Tech Plan **§0.3** + **§1.8** *"AND across fields"* — two different filters combine as an intersection | **`atm=3` Automated** · no text marker at all | **Sourcing settled.** Two recording fixes are staged and **NOT executed** (`c29600-sourcing-2026-08-11/FINDINGS.md` §7a): correct the `refs` to cite the tech plan rather than §2/S8-R3, and **add the missing Rule-54 provenance line and `AUTOMATION:` marker** — it is the only Filters case with neither. **Both need his go-ahead, and Vlad must be told (Rule 65).** |
| 11 | FLT-API-02 = [C29632](https://shopview.testrail.io/index.php?/cases/view/29632) | Filters | Tech Plan **§0.3** repeated-`eq` request shape + **§1.8** | `AUTOMATION: READY` | **Sourcing settled.** Same staged `refs` correction; assertion untouched |

### Three honest qualifications on these eleven

1. **THE RULING SETTLES *SOURCING*. IT DOES NOT MAKE AN UNOBSERVED CASE OBSERVED.** Six of the eleven
   carry `HOLD` for a reason that has nothing to do with authority — a data state, an account or an
   environment. **Their markers move only when someone actually drives them** (Rules 12/49/60).
2. **SEVEN OF THE ELEVEN ARE FLAGGED `custom_atmstatus = 3` (Automated) IN TESTRAIL, so Rule 65
   bites**: if any of them is edited — including the two recording fixes on C29600/C29632 — **Vlad must
   be told what changed and whether it affects what an automated check asserts.** Nothing here proposes
   an edit; it is flagged so the next authorised pass does not miss it.
3. **⚠️ ON SCHEDULE, THE `Automated` FLAG IS NOT EVIDENCE THAT ANYTHING IS AUTOMATED.** `get_history_for_case`
   showed **nobody ever set it** — our own `add_case` tooling hardcodes `3` (Rule 64). **Reporting those
   seven to Vlad as "his" would pad the list and cost it credibility on the first reading.** Separate
   them and say why.

---

# 4 · THINGS THAT LOOK LIKE CONTRADICTIONS AND ARE NOT — checked, and deliberately not listed above

**Recorded because Rule 46 says an undocumented deliberate omission is indistinguishable from a
miss**, and because each of these would otherwise be re-derived by the next pass.

- **ALL 32 CASES WHOSE `refs` CITE THE TECHNICAL DESIGN WERE READ IN FULL — Filters 9 · Schedule 12 ·
  Report Suite 11 — AND NOT ONE OF THEM CITES IT *AGAINST* A REQUIREMENT.** Each cites it either as a
  **supplement** to a named spec anchor, or as the **sole source where the spec is silent** (those are
  the eleven in §3). **So the contradictions in §1 were NOT findable from the `refs` column** — they had
  to come from the three 2026-07-29/30 reconciliation documents, which are the only systematic
  tech-design-versus-source comparisons we hold. Examples of the supplement pattern:
  WIP-API-01 = [C30528](https://shopview.testrail.io/index.php?/cases/view/30528)
  (*"WIP spec Story 11 is silent on re-runs"*), PV-CALC-07 = [C30365](https://shopview.testrail.io/index.php?/cases/view/30365)
  (*"last-sale re-anchor on reversal — spec-silent"*), IV-DATE-09 = [C38892](https://shopview.testrail.io/index.php?/cases/view/38892),
  SBC-API-02 = [C30191](https://shopview.testrail.io/index.php?/cases/view/30191), SBR-CALC-09 = [C38894](https://shopview.testrail.io/index.php?/cases/view/38894),
  WIP-CALC-10 = [C38890](https://shopview.testrail.io/index.php?/cases/view/38890), FLT-API-06 = [C38895](https://shopview.testrail.io/index.php?/cases/view/38895),
  FLT-ASSET-07 = [C38878](https://shopview.testrail.io/index.php?/cases/view/38878). **Spec-silent is not
  spec-contradicting**, and under the ruling these are simply sourced.
- **Own-data WRITE scoping on Schedule** — the tech plan's `ManageShiftVoter` enforces it (*"cross-tech
  own-data violation → 403"*) while §14.3 rules out own-only **VIEWING** and is **silent on WRITING**.
  **That is a GAP, not a contradiction**, and it was correctly **re-routed to engineering** on
  2026-07-31 after Branko said *"I'm not sure if this question is for me Bilal."* **No case asserts the
  403 and none should be authored against a guess.** Context on SCH-PERM-09 = [C30082](https://shopview.testrail.io/index.php?/cases/view/30082).
- **The 8-week / 120-shift series caps** — named in the brief as a likely contradiction. **They are
  not one: the specification is SILENT and the caps appear only in the technical design** (`D8`). Under
  the ruling they are **sourced**. SCH-SPREAD-11 = [C38863](https://shopview.testrail.io/index.php?/cases/view/38863)
  and SCH-API-02 = [C38873](https://shopview.testrail.io/index.php?/cases/view/38873) also cite §4.5 for
  their *surrounding* behaviour, which is why they appear under **L1** for the closure half only.
- **The default Filters tab = Estimates** (tech plan `D10`) — spec-silent **and** ratified by Branko on
  2026-08-04 (*"A - it's fine"*). FLT-TAB-06 = [C38876](https://shopview.testrail.io/index.php?/cases/view/38876).
- **The two different "too large to export" messages** and the **SBR staff-dialog `Escape` question** —
  both surfaced *by* the technical design, but each is a **spec-versus-spec** or **spec-versus-Golden-Rule**
  disagreement. **The tech design is the messenger, not a party**, so neither belongs in §1. Both sit on
  Chris Ward's question list.
- **The per-browser vs server-side preference model** (tech plan `D3`) — **resolved for now in the
  specs' favour by the plan itself**, with a migration path documented. Recorded as a WATCH item: if the
  filter-redesign programme later migrates Reports to server-side preferences, the *"another browser =
  defaults"* half of the persistence cases must be re-derived.

---

# 5 · OUTSTANDING — what I need from you

**Standing Rule 36. Nothing here is rhetorical; each line is a decision only you can make.**

1. **THE SIX LIVE CONTRADICTIONS IN §1 — do you want them raised with engineering?** Our cases are
   already on the winning side of all six, so **no test-case change is needed**; what is at stake is
   that **engineering may be building to a description the PRD contradicts**. **The one I would raise
   first is L2** — a unique database key that makes a documented requirement impossible to store.
2. **A LIVE RE-READ OF THE LOCATION-FILTER REQUIREMENT (L6)** on the current PV / SBR / TU / IV specs.
   Our five-versions-stale mirror **agrees with the technical design and against the video**, and
   **four cases turn on which is right**. It needs a fetch we could not make in this pass.
3. **THE TWO STAGED RECORDING FIXES ON C29600 AND C29632** — references and provenance only, **no
   assertion touched**, and **C29600 has neither a provenance line nor an automation marker at all**.
   Two `update_case` calls, awaiting your go-ahead (Rule 6), **and Vlad must be told because C29600 is
   flagged Automated** (Rule 65).
4. **C29624's STALE `refs`** (found in passing at L5): the reference still records the tech-plan
   real-time reading while the case body correctly asserts the spec's Apply-button behaviour. One
   `update_case`, not touched here.
5. **BRANKO'S SHOP-CLOSURES QUESTION HAS STILL NEVER BEEN SENT** — drafted 22 July, and it is the
   product half of **L1**. **Under new Standing Rule 66 it goes out with the sheet, once everything we
   can do ourselves is finished** — so what I need from you is confirmation that we are at that point,
   or the word to hold.

---

## What was NOT done, stated plainly

**0 TestRail calls · 0 Jira calls · 0 Confluence calls · 0 application access · 0 test cases changed ·
0 tickets created** (the creation hold at Standing Rule 62's tail is **ACTIVE**, re-stated by the QA
lead today). **No live verification of any kind was performed by this pass**, and no row above claims
otherwise — every verdict is derived from committed documents, each cited to its file, with its
currency declared in the table at the top.
