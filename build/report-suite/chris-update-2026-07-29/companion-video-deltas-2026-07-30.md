# Report Suite — Companion-Video Delta Analysis (2026-07-30)

**Source:** the PRD/Spec Companion video, Chris Ward — Loom
https://www.loom.com/share/e4a3ad01912048c0bba88f1a02677004 (verbatim transcript:
`companion-video-transcript-2026-07-30.md`). This is the condensed click-through Chris promised
at kickoff (kickoff P38) and in his 2026-07-29 group message.
**Authority:** per the user's standing ruling (2026-07-28), Chris's videos are authoritative
product intent, newest-wins. This video (2026-07-30) is NEWER than the six specs (2026-07-21),
the kickoff video (2026-07-28 ingest) and the 2026-07-29 group message — where they conflict,
this video wins.
**Honesty (Rule 12):** the analysis is TRANSCRIPT-based. The video's visual content (which
exact links are bolded, which screen "this here" points at, styling/coloring) is NOT in the
transcript — every such detail is classified VISUAL-VIU-CONFIRM, never asserted.
**Scope of this pass:** LOCAL only — NO TestRail writes (change-list awaits push authorization).
Baseline = 465 active cases (id-map 465/465 C-ids, post tech-plan push 2026-07-30-B).

**Classification tags:** FIRM DELTA · CONFIRMATION · PENDING-SPEC · VISUAL-VIU-CONFIRM ·
CROSS-SQUAD · NO-IMPACT.

---

## Summary — counts by classification

| Tag | Count | Points |
|---|---|---|
| FIRM DELTA | 3 | C4 (Performance-nav anchors + SBC/WIP below-rule), C17 (customer-card "Sales Representative" label), C2b (PV not the "only" Parts report — PV+IV both under Parts) |
| CONFIRMATION | 10 | C2a, C3, C7, C8, C9, C11, C13, C14, C16, C20 |
| PENDING-SPEC | 1 | C15 (how far "Representative, the full word" reaches — small "Sales Rep" labels) |
| VISUAL-VIU-CONFIRM | 3 | C6 (bolded vs non-bolded hyperlinks), C12 (all six modeled after Technician Efficiency), C10/C18 (search-box look; may change, same functionality) |
| CROSS-SQUAD | 1 | C19 (filters "help coming soon" = Branko/Miloš Filters squad) |
| NO-IMPACT | 2 | C1 (ignore local noise/fake data), C5 (video "just for visual representation… not perfect") |
| **TOTAL points** | **20** | |

**Case-change roll-up:** 7 tester-facing case edits (push queue) +
13 notes-only annotations (local metadata, no push) + **0 new cases** (both candidate gaps —
customer-card label, P/S prefixes — were already covered; edit/confirm only, Rule-28 no-slop) +
1 new question appended to the unsent Chris sheet + SPEC-WATCH updated.

---

## Full point list (C1–C20, in transcript order)

### C1 (00:00–00:35) — Focus on the six reports; local build has "additional noise". **NO-IMPACT**
"What I really want you to focus on are the six reports… Consider anything else that is not
normal from what you know." Process guidance; matches our scope (exactly the 6 reports). Also
05:10 "this is fake data" — ignore fake-data artifacts (same as kickoff P40).

### C2 (00:35–01:06) — New "Parts" nav section; PV + IV live under it.
- **C2a — CONFIRMATION:** "we've added a new section, and that's Parts. Parts Velocity and
  Inventory Value will live under here." Matches PV-NAV-01 (C30322) + IV-NAV-01 (C30534) as
  authored (kickoff P2 already firm).
- **C2b — FIRM DELTA (intra-suite spec inconsistency settled):** the PV spec S1-R1 says
  "Parts Velocity is its first (and, in this release, only) report" — but the IV spec S1-R1
  puts Inventory Value under Parts too, and the video says BOTH live under Parts. Newest-wins:
  PV is NOT the only Parts report. Our PV-NAV-01 (C30322) expected line 2 copied the PV spec's
  "(the only Parts report in this release)" — a cold tester would fail it when Inventory Value
  correctly appears under Parts. **EDIT PV-NAV-01** (drop the "only" claim; expect PV and IV
  both under Parts). Spec inconsistency flagged to SPEC-WATCH (Rule 15: "spec inconsistent
  (flagged)", conflicting citations PV S1-R1 vs IV S1-R1 vs video 00:35–00:51).

### C3 (00:51–01:18) — No alphabetical sort; order within the section is flexible. **CONFIRMATION**
"there is no alphabetical sort to our reports… put them in the order that seems the most
fitting. There's really no issue there." Confirms the kickoff P3 order-relax. Checked all nav
cases: none over-asserts an order WITHIN the Parts section or among the four new Performance
entries (SBR-NAV-01's "at the BOTTOM" is re-based by C4 below, not by an ordering claim among
the six). Notes-only annotation on PV-NAV-01/IV-NAV-01 (ordering inside Parts = PO-flexible;
don't fail on PV-vs-IV order).

### C4 (01:18–02:05) — Performance nav: additive not interruptive; the four ANCHOR items are named; TU/WIP/SBC/SBR go BELOW them. **FIRM DELTA**
"Sales, Technician Efficiency, and Advisor Analysis… and shop efficiency… normally live in a
spot that everybody's used to clicking on. Let's add technician utilization, work in progress,
sales by customer, and sales by representative below… those items, rather than interrupting
those items." New precision vs kickoff P3 (which only said "below what's already there"):
1. The anchor items are NAMED: **Sales, Technician Efficiency, Advisor Analysis, Shop
   Efficiency** — a tester can now check placement concretely.
2. The below-rule explicitly covers ALL FOUR new Performance reports — including **SBC** (whose
   spec names NO navigation group at all; our SBC-NAV-01 note said "VIU-confirm where it sits")
   and **WIP** (WIP-TAB-01 had Performance group but no placement rule).
**EDITS:** TU-NAV-01 (C30392) — name the four anchors (task check: it did NOT name them);
SBR-NAV-01 (C30197*) — replace "at the BOTTOM of the group" with below-the-named-anchors (four
new reports are added below; SBR need not be literally last); SBC-NAV-01 (C30096) — add
Performance group + below-the-anchors (new information for SBC); WIP-TAB-01 (C30455*) — add
below-the-anchors. (*C-ids read from testrail-id-map.csv at apply time.)

### C5 (02:05–02:28) — "a lot of this video is really just for visual representation. It's not going to be perfect." **NO-IMPACT** (process; same as kickoff P40).

### C6 (02:28) — "hyperlinks Different hyperlinks. Bolded, not. Very important." **VISUAL-VIU-CONFIRM**
There ARE two visually distinct hyperlink styles (bolded vs not) and the distinction is
"very important". The transcript does NOT say which report/screen or which link type is bold
(likely the collapsed vs uncollapsed / summary vs detail split from kickoff P16, but that is a
guess — not asserted). No spec anchors the bold split. **Notes-only** on the link lead cases
(TU-LINK-01 C30414*) + delta doc: at VIU, capture which links render bold vs not and record the
distinction; do not fail styling against the spec's silence.

### C7 (04:32) — "Once again, you can see the location." **CONFIRMATION**
A visible per-row/section location indication — confirms kickoff P10 + the 2026-07-29 message's
on-screen location scoping (SBC-LOC-03, SBR-LOC-03, PV-FILT-10, TU-LOC-01, IV-LOC-01 already
edited 2026-07-29). No change.

### C8 (04:32–05:10) — "Labor Delta, that's the green, red, black." **CONFIRMATION**
Confirms kickoff P14 color rules (green +, black 0.0, red −) already in the SBC/SBR/WIP cases.
No change.

### C9 (05:10–05:42) — SBC tree prefixes: P = parts order, S = service/work order; his local's S rows under parts sales = FAKE DATA; "These would all be P's." **CONFIRMATION**
Task check — do our cases assert the P/S prefixes? YES, already covered:
- SBC-TYPE-02 (C30104*) — S/P prefix classification drives the Product Type filter (whole
  invoice classified by prefix).
- SBR-TREE-09 — P/S numeric tie-break (P before S).
- SBC-TREE-11 — the deliberate edge: a no-vehicle S invoice lands in the Parts Sales bucket
  (bucket decided by vehicle ABSENCE, not prefix — spec S8-E3). The video does NOT contradict
  this: Chris is saying his local's all-S parts-sales rows are a fake-data artifact and real
  parts orders are P-prefixed ("the P will be consistent usually under parts sales") — "usually"
  leaves the S8-E3 edge intact. **Notes-only** on SBC-TYPE-02 + SBC-TREE-11 (video anchor:
  under Parts Sales expect P numbers in real data; an S there is either seeded edge data per
  S8-E3 or bad data — not automatically a report bug). No new case (Rule-28 no-slop).

### C10 (05:42–06:41) — "we are able to search in a really crappy way. It works." **VISUAL-VIU-CONFIRM / NO case change**
The search works; its look is rough (local). Functionality already covered (SBC-CUST-01/02
type-ahead; PV page search). Visual roughness = local artifact (C1/C5).

### C11 (06:41–08:06) — Customer-compare filter semantics: selecting customers puts exactly those on the page; exports carry the page contents. **CONFIRMATION**
"I want to compare accurate aerodynamics versus Baxter Mining Corp… What I just did by
selecting those is allow those to be on the page… when I export, only those, the information
on the page is going to show up on the exports. Important you see what that toggle does."
Confirms export-reflects-filters (kickoff P13) and the Customer-filter scoping — covered by
SBC-CUST-02/03/04 (selection scoping) + SBC-EXP-05 (C30163*, exports = exactly the customers
matching the active filters incl. the Customer selection). The COMPARE use-case (pick 2+
customers side-by-side in the same window) is the product intent behind the multi-select —
already exercised by SBC-EXP-05's two-customer selection step. **Notes-only** on SBC-CUST-02 +
SBC-EXP-05 (record the compare intent + video anchor).

### C12 (08:06–08:51) — Visual conformance: all six reports modeled after Technician Efficiency. **VISUAL-VIU-CONFIRM (+ CONFIRMATION)**
"visual conformance is so very important… All reports are modeled after technician efficiency…
the most recently updated visual representation… that won't hold forever, so keep that with a
grain of salt, but ideally all six reports will look as close together as possible." Confirms
the specs' visual stories (SBC S20 already cites Technician Efficiency; SBC-VIS-01 note has
it). NOT a per-case assertion (Rule-28 anti-slop — no "matches TE" case per report): **notes-only**
on each report's VIS lead case (SBR-VIS-01, PV-VIS-01, TU-VIS-01, WIP-VIS-01, IV-VIS-01) naming
Technician Efficiency as the side-by-side styling reference at VIU, with the "grain of salt"
caveat (the reference may move; his local shows coloring drift at the bottom — ignore local).

### C13 (09:03–09:17) — SBR padding "flagged in the standup, the kickoff, and also in the spec." **CONFIRMATION** (visual; the 2026-07-29 message said the spec gets a padding flag — purely visual, no case). No change.

### C14 (09:17–09:41) — SBR entry point: "We're going to go into settings. We're going to go staff, we're going to edit the staff member, and we have a new toggle here." **CONFIRMATION (+ tester-aid edit)**
Confirms kickoff P26 (toggle on Edit Staff Member). Task check — does our case wording match
that path? The toggle's EFFECT is covered (SBR-WO-02 C30273* offers only toggle-ON reps;
SBR-ROW-01/03 report-side) but no case spelled out HOW a tester reaches the toggle. **EDIT
SBR-WO-02** preconditions: add the plain path (open Settings → Staff, edit the staff member,
use the sales-rep toggle) so a layman tester can arrange the precondition (Rules 7/9); exact
on-screen toggle label = VIU-confirm (transcript gives the path, not the label). No new case —
a dedicated "toggle exists" case would be slop (its behavior is already load-bearing in
SBR-WO-02/SBR-ROW-01).

### C15 (09:41–10:10) — Naming: no short forms; "If there's any divergence, please, let's representative, the full word." **PENDING-SPEC (scope question)**
The report name is already the full word everywhere (SBR-NAV-01 asserts it; 2026-07-29 message
confirmed the rename). What is NOT settled: how far the no-short-forms ruling reaches — the
spec still names small labels "Sales Rep" (WO left-panel selector S19-R1/R8 accessible name
"Sales Rep"; the "Sales Rep Assignments" export + its "Sales Rep" CSV header + filename
sales-rep-assignments.csv, S15). Chris demonstrated the WO dropdown WITHOUT flagging its label
(he only explicitly flagged the customer card — C17), so flipping every "Sales Rep" label on
the strength of the principle alone would be guessing. **ROUTED: one layman question appended
to the unsent Chris sheet** (PO-Questions-Chris-ReportSuite-TechPlan_2026-07-30.md/.xlsx, new
Q5) + **notes-only** on SBR-WO-01/SBR-WO-02 (label may flip to the full word pending his
answer) + SPEC-WATCH item.

### C16 (10:10–10:53) — WO card sales-representative dropdown; "default as unassigned… you can assign it as a user." **CONFIRMATION**
Task check — covered? YES: SBR-WO-01 (selector on standard WO + Part Sale WO, hidden on
imported/History), SBR-WO-02 (offers only toggle-ON reps), SBR-WO-03 (new WO opens UNASSIGNED,
save-on-change). No change (label scope → C15/Q5).

### C17 (10:53–11:12) — The CUSTOMER CARD label must say "Sales Representative". **FIRM DELTA**
"In the customer card, this actually should say sales representative… If we short-form things…
that's not okay. So, please, and I will flag this immediately, label this as sales
representative." This is his explicit, flagged-immediately ruling — firm despite the spec:
S19-R7 verbatim says the customer record's left-panel sidebar shows a single **"Sales Rep"**
row (Rule 25 citation — this is the wording the case derived from). Newest-wins: the label is
**"Sales Representative"**. Task check — do we have a case asserting the customer-card label?
YES: SBR-WO-06 (customer record's "Sales Rep" row). **EDIT SBR-WO-06** (row label → "Sales
Representative"; "Unassigned" default unchanged). No new case needed. SPEC-WATCH: S19-R7 text
must be ratified in the changelog re-diff.

### C18 (11:12–11:46) — "warned to not use the global search for virtually anything until it's fixed. This is a convenient way to do it. Visually, this box is unappealing. If there's a better way that maintains the same functionality, I absolutely would love that." **CONFIRMATION + VISUAL-VIU-CONFIRM**
Confirms the local-search-not-global stance (kickoff P29). The box's LOOK may change ("better
way that maintains the same functionality") — functionality cases stand; do not pin the search
box's visual at VIU. The transcript does not pin WHICH report's search box he was on (SBR/
customer context; visual-only) — no case edit.

### C19 (12:01) — "Filters here… are still not ideal. Thankfully, we have some help coming soon. just a flag." **CROSS-SQUAD**
Matches the 2026-07-29 message part 2: Branko/Miloš Filters squad will sweep the report
filters once on staging; build to spec for now, expect that portion to change. No case change
(already recorded 2026-07-29; kickoff P19 cross-squad note stands).

### C20 (12:01–13:10) — Snapshot/As-of indicator: "I believe that it's safe to assume that if snapshot data is taken, we don't need to see this. This really only… would be important if you've been offline. Literally no internet connection for a while. Or, no snapshot." **CONFIRMATION (soft-worded; honest classification)**
- The referent element is visual-only (transcript "This here") — most consistent reading: the
  snapshot-freshness/"As of" indicator family (kickoff P32's "snapshot taken N days ago" label
  and/or IV's "As of" indicator). Both readings were checked:
  1. **PV/WIP "snapshot taken N days ago" label:** already REMOVED from the current specs
     (spec-diff V7, 2026-07-28: no such label anywhere in PV v3; WIP S11-R7 no screen reads the
     snapshot) — the video's "we don't need to see this" CONFIRMS the ratified removal; his
     local still showing it = local lag.
  2. **IV "As of" indicator (S5-R5/S5-R6):** the current spec ALREADY makes it conditional —
     shown only when the displayed day is EARLIER than the day asked for (no snapshot for that
     date → fell back), hidden when they match. That is exactly "if snapshot data is taken, we
     don't need to see this… only important if… no snapshot." IV-DATE-05 (C30581*) asserts
     precisely this. **NO contradiction with the current IV spec — the soft ruling CONFIRMS it.**
- Verdict: **CONFIRMATION**, not FIRM/PENDING — no case change, no question needed (the "I
  believe / safe to assume" hedge is noted, but everything it hedges is already the spec'd and
  authored behavior). The one nuance NOT currently spec'd: "important if you've been offline"
  hints at an offline/stale-data display state — spec silent; recorded as a VIU-watch note (do
  not author to it; Rule 15 "spec silent" stated explicitly). **Notes-only** on IV-DATE-05
  (video corroboration + the offline nuance) + SPEC-WATCH note (if the changelog touches the
  As-of indicator, re-diff against this soft ruling).

---

## Consolidated action list

**Tester-facing case EDITS (7 — push queue, awaiting authorization):**
| # | Case (C-id) | Point | One-liner |
|---|---|---|---|
| 1 | SBC-NAV-01 (C30096) | C4 | Performance group + below the four named anchor items (new info for SBC — its spec names no group) |
| 2 | TU-NAV-01 (C30392) | C4 | Name the four anchor items the entry must sit below |
| 3 | SBR-NAV-01 (from id-map) | C4 | "At the BOTTOM" → below the four named anchors (four new reports added below; SBR need not be literally last) |
| 4 | WIP-TAB-01 (from id-map) | C4 | Add below-the-anchors placement to the Performance-group expectation |
| 5 | PV-NAV-01 (C30322) | C2b | Drop "(the only Parts report in this release)" — IV lives under Parts too (spec inconsistency settled by the video) |
| 6 | SBR-WO-06 (from id-map) | C17 | Customer-card row label → "Sales Representative" (supersedes S19-R7 "Sales Rep") |
| 7 | SBR-WO-02 (from id-map) | C14 | Precondition tester-aid: the Settings → Staff → edit-staff-member path to the sales-rep toggle |

**Notes-only annotations (13 — local metadata, NO push):** IV-NAV-01 (C3 order-flex; PV-NAV-01's note rides with its edit), TU-LINK-01 (C6 bold-vs-not), SBC-TYPE-02 + SBC-TREE-11 (C9), SBC-CUST-02 + SBC-EXP-05 (C11), SBR-VIS-01/PV-VIS-01/TU-VIS-01/WIP-VIS-01/IV-VIS-01 (C12), SBR-WO-01 (C15 label-pending; SBR-WO-02's rides with its edit), IV-DATE-05 (C20).

**New cases: 0.** Both candidate gaps were already covered (C9 P/S prefixes → SBC-TYPE-02/
SBC-TREE-11/SBR-TREE-09; C17 customer-card label → SBR-WO-06 edit). Rule-28 no-slop honored.

**Question sheet:** ONE new layman question (Q5, Rep-label scope — C15) appended to the unsent
PO-Questions-Chris-ReportSuite-TechPlan_2026-07-30.md/.xlsx, noted added 2026-07-30 after the
companion video.

**SPEC-WATCH:** companion video DELIVERED (expected-artifact item closes); new watch items:
S19-R7 customer-card label, SBC Performance-group + anchors text, PV S1-R1 "only report"
inconsistency, Rep-label scope (Q5); C20 As-of note. Spec changelog still awaited (deadline
2026-08-04 stands).

**Rule 20 refs:** every edited case's spec_ref gains the companion-video anchor
(`companion video 2026-07-30 <timestamp>` alongside the existing ticket + spec anchor).
