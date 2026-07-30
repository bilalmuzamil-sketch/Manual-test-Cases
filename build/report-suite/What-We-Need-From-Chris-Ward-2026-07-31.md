# What We Need From You — the six new reports

**For Chris Ward, Product Owner · Prepared 31 July 2026**

This is not a questionnaire. It is a short list of things we need you to do, and what each one
unblocks.

Our testers check the reports against your written report descriptions. Where a description says
one thing and you have told us another, a tester can report a perfectly good report as broken — or
miss a real problem. That is the risk every item below removes.

**Five things need your decision. Seven are answers you have already given us that have not yet
reached the written descriptions.**

---

## Things only you can decide

### 1. Sales By Representative — do the downloaded files follow the screen?

- **What we need from you:** Tell us which is right — the location column appears in the four
  downloaded files whenever it is showing on screen, or the downloads always show one fixed set of
  columns.
- **Why:** Your Sales By Representative description now says both. A newer line says the location
  column is in all four downloads; older lines list the download columns as a fixed set, in order,
  with no location column in it.
- **What happens if it stays as it is:** Two readers of the same description get two different
  answers, and a tester at a company with more than one location can report a correct download as
  broken. We have followed the newer line for now.
- **By when:** At your convenience — before anyone tests the downloads.

### 2. Where the location column sits in the two shorter downloads

- **What we need from you:** One line saying where the location column goes in the two shorter
  "Summary" downloads.
- **Why:** Your instruction is that it sits in the same place it sits on screen. Those two files do
  not contain the column it sits next to on screen, so there is no matching place, and nothing
  anywhere says where it should go.
- **What happens if it stays as it is:** Our check has to accept whatever position the build uses,
  so a wrong position would pass unnoticed.
- **By when:** At your convenience.

### 3. One logo rule for all six printed downloads

- **What we need from you:** Pick the single logo rule every report follows.
- **Why:** You told us on 29 July that every report now uses the same logo treatment, but the
  descriptions give three different rules: one says try the company's own logo first, then the
  built-in ShopView one, and print none if neither exists; another says always print the built-in
  ShopView logo; a third does not mention a logo at all.
- **What happens if it stays as it is:** Three of our checks follow three different rules, so at
  least two of them are wrong and nobody can tell which.
- **By when:** At your convenience.

### 4. Does "normal reports access" mean one permission for all six?

- **What we need from you:** Confirm whether all six reports open with one single reports
  permission, or whether the existing per-area reports permissions (such as the inventory one)
  still apply.
- **Why:** You have told us twice that these reports must not sit behind their own special
  permissions. Two of them — Parts Velocity and Inventory Value — are described as needing the
  existing inventory-reports permission, which is itself a normal one, so your instruction can
  honestly be read two ways.
- **What happens if it stays as it is:** Whoever sets up a test user does not know which permission
  to give them, so "who can open this report" goes untested for two reports. Separately, the Sales
  By Customer description still says that report has its own special permission — that line needs
  correcting whichever way you answer.
- **By when:** At your convenience.

### 5. Should the screens keep saying "VIN", even for a generator?

- **What we need from you:** Confirm the screens keep the word "VIN" for every asset, or tell us
  the wording you want for assets that are not vehicles.
- **Why:** You raised this yourself on 29 July — VIN means vehicle identification number, so for
  something like a generator the number in that field is really a serial number. Our checks
  currently expect the screens to keep saying "VIN".
- **What happens if it stays as it is:** Nothing breaks, but the reports will show "VIN" beside a
  generator's serial number, and customers will ask about it.
- **By when:** At your convenience.

---

## Things that just need writing down

You have already answered all seven of these. Our checks follow your answers, not the older
written text. What is missing is the edit to the descriptions — until it lands, the descriptions
and our checks disagree, and anyone comparing the two will assume the mistake is ours.

### 6. Work In Progress — put the VIN first (you believe this is already done)

- **What we need from you:** Edit the Work In Progress description so an asset is identified by its
  VIN first, then the unit number, then the plate.
- **Why:** On 29 July you told us this is the standard for every report, and that you had already
  made this edit. The description still puts the unit number first in six places.
- **What happens if it stays as it is:** On every screen that shows an asset, the description and
  our checks say the opposite of each other. This is the one to do first.
- **By when:** 4 August — the date we agreed.

### 7. The location dropdown disappears for a one-location person

- **What we need from you:** Correct the four descriptions — Sales By Representative, Technician
  Utilization, Inventory Value and Parts Velocity — which still say that someone with only one
  location still sees the location dropdown.
- **Why:** You ruled on 31 July that it is hidden.
- **What happens if it stays as it is:** Four descriptions actively state the opposite of your own
  ruling.
- **By when:** 4 August.

### 8. The full word "Representative" everywhere

- **What we need from you:** Replace "Sales Rep" with "Sales Representative" in the Sales By
  Representative description — the row on the customer record, the picker on the work order, and
  the assignments download (its menu entry, its file name and its column heading).
- **Why:** You ruled on 31 July that "Rep" is out everywhere.
- **What happens if it stays as it is:** The description still shows the short form in several
  places, so nobody reading it can tell what the screens are supposed to say.
- **By when:** 4 August.

### 9. The download size limit, and the message when it is hit

- **What we need from you:** Add the 10,000-row download limit to the Parts Velocity, Technician
  Utilization and Work In Progress descriptions, and correct the Sales By Customer wording so all
  six use the one message you chose: "This report is too large to export. Narrow the date range or
  filters, then try again."
- **Why:** You confirmed on 31 July that the limit applies to all six and that there is one message.
- **What happens if it stays as it is:** Three descriptions say nothing about a limit at all, so
  anyone reading them would call our checks unfounded.
- **By when:** 4 August.

### 10. The Escape key on the "deactivate a sales representative" pop-up

- **What we need from you:** Correct the Sales By Representative description, which still says that
  pop-up closes when you press the Escape key.
- **Why:** You ruled on 28 July that it should not — the app's general house rule wins. Our check
  follows your ruling.
- **What happens if it stays as it is:** The description asks for behaviour you have ruled out, and
  the developers are still carrying it as an unresolved question.
- **By when:** At your convenience — this is the oldest item here, from 28 July.

### 11. Three small tidy-ups

- **What we need from you:** (a) In the Sales By Customer description, name the menu group these
  reports sit in and say the new links go below the existing ones. (b) Correct the Parts Velocity
  line calling it the "only" report in the Parts group — Inventory Value is there too. (c) Two
  descriptions, Sales By Representative and Parts Velocity, have a few characters showing as odd
  symbols.
- **Why:** All three come from your own video and your own note.
- **What happens if it stays as it is:** Small things, but each one is a reader asking us a question
  you have already answered.
- **By when:** At your convenience.

### 12. The new "choose your columns" control on Technician Utilization has no ticket

- **What we need from you:** Have a ticket raised for the column-choosing control you asked for on
  Technician Utilization.
- **Why:** You asked for it in your 29 July note and we have written the checks, but there is no
  piece of work in the tracker for it.
- **What happens if it stays as it is:** Those two checks are the only ones in the whole set that
  cannot be tied back to a specific piece of work.
- **By when:** At your convenience.

---

**Thank you** — the 29 July round of description updates landed on time and cleared most of what we
were waiting on, and your answers on 31 July settled five open points in a day. The list above is
what is left.

---
---

# INTERNAL — NOT FOR CHRIS (QA-only appendix)

Everything below this line is for the QA lead. It does not appear in the copy sent to Chris.
Case links: `https://shopview.testrail.io/index.php?/cases/view/<id>` (Standing Rule 8).

## Item → case map

| # | Reader-facing item | Source of the ask | Affected cases (internal = C-id) |
|---|---|---|---|
| 1 | SBR downloads: location column follows the screen, or fixed columns | Q1 of `PO-Questions-Chris-ReportSuite-2026-07-31`; `DELIBERATE-DECISIONS.md` §A1; `contradiction-analysis-2026-07-31/SBR-CSV-LOCATION.md`. SBR v15 `S14-R20` vs `S14-R15`/`S14-R16` | SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) · SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) · SBR-EXP-03 = [C30278](https://shopview.testrail.io/index.php?/cases/view/30278) · SBR-EXP-04 = [C30279](https://shopview.testrail.io/index.php?/cases/view/30279) · SBR-LOC-05 = [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) |
| 2 | Location column position in the two Summary downloads | Q3 of the 31 July sheet; `DELIBERATE-DECISIONS.md` D3/E2 — SPEC-SILENT (SBC `S4-R13` states inclusion with no position; SBR `S14-R20` points at an on-screen column those files do not have) | SBC-EXP-16 = [C38856](https://shopview.testrail.io/index.php?/cases/view/38856) · SBC-LOC-04 = [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) · SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) · SBR-EXP-03 = [C30278](https://shopview.testrail.io/index.php?/cases/view/30278) · SBR-LOC-05 = [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) |
| 3 | One logo rule for all six | Q4 of the 31 July sheet; `DELIBERATE-DECISIONS.md` §A2. Chris 2026-07-29 verbatim *"Each report now ensures the same 'logo' treatment"* vs SBC `S15-R17`/`R18`, TU bundled default, PV silent | SBC-EXP-10 = [C30168](https://shopview.testrail.io/index.php?/cases/view/30168) · TU-EXP-06 = [C30439](https://shopview.testrail.io/index.php?/cases/view/30439) · TU-EXP-07 = [C30440](https://shopview.testrail.io/index.php?/cases/view/30440) · PV-EXP-05 = [C30379](https://shopview.testrail.io/index.php?/cases/view/30379) · PV-EXP-06 = [C30380](https://shopview.testrail.io/index.php?/cases/view/30380) |
| 4 | "Normal reports access" — one permission or per-area | Q5 of the 31 July sheet; his 2026-07-31 Q4 = A verbatim *"the intention is to not hide these from normal reports access"*; PV `S1-R4` + IV `S1-R4` name Inventory Reports → View; SBC `S1-R2` still names a dedicated permission | PV-PERM-01 = [C30325](https://shopview.testrail.io/index.php?/cases/view/30325) · PV-PERM-02 = [C30326](https://shopview.testrail.io/index.php?/cases/view/30326) · PV-PERM-03 = [C30327](https://shopview.testrail.io/index.php?/cases/view/30327) · IV-PERM-01 = [C30603](https://shopview.testrail.io/index.php?/cases/view/30603) · IV-PERM-02 = [C30604](https://shopview.testrail.io/index.php?/cases/view/30604) · SBC-PERM-01 = [C30098](https://shopview.testrail.io/index.php?/cases/view/30098) · SBC-PERM-02 = [C30099](https://shopview.testrail.io/index.php?/cases/view/30099) · SBC-NAV-01 = [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) |
| 5 | Keep the label "VIN" for non-vehicle assets | His own 2026-07-29 standing note, verbatim: *"we just have to be careful with using the acronym VIN … for a generator … it gets confusing … 90% of people will understand saying VIN though"* (`chris-update-2026-07-29/wip-identifier-answer-2026-07-29.md`). **He raised the concern and never settled the label** — our "keep VIN" is a QA decision (Rule 9), not his ruling, so this is a genuine open point, not a re-ask | SBC-LBL-01 = [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) · WIP-COL-05 = [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) · WIP-FLT-03 = [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) · WIP-SORT-03 = [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) · WIP-EXP-07 = [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) |
| 6 | WIP asset identifier = VIN chain | SPEC-WATCH item **1b**; his 2026-07-29 answer *"A is the correct answer"*. Verified live in the 31 July capture: unit-number-first at WIP §4 (2 lines), `S4-R7`, `S4-R8`, `S4-R9`, `S7-R4` = **6 places** | WIP-COL-05 = [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) · WIP-FLT-03 = [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) · WIP-SORT-03 = [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) · WIP-EXP-07 = [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) |
| 7 | Location filter hidden at ≤1 location | SPEC-WATCH item **4**; Q1 = A *"classic spec drift"*. Verified live: SBR `S21-N1`, TU `S9-N1`, IV `S7-N1` say *"still sees the filter"*, PV `S2-E4` says the same in different words = **4 descriptions** | SBR-LOC-04 = [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) · TU-LOC-05 = [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) · IV-LOC-04 = [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) · PV-FILT-13 = [C30340](https://shopview.testrail.io/index.php?/cases/view/30340) |
| 8 | "Representative" in full | SPEC-WATCH item **9**; Q5 = A *"slang, let's do representative everywhere"*. Verified live: SBR `S19-R7`/`S19-R8` still "Sales Rep", Story 15 still "Sales Rep Assignments" | SBR-WO-01 = [C30310](https://shopview.testrail.io/index.php?/cases/view/30310) · SBR-WO-02 = [C30311](https://shopview.testrail.io/index.php?/cases/view/30311) · SBR-WO-06 = [C30315](https://shopview.testrail.io/index.php?/cases/view/30315) · SBR-ASGN-01 = [C30292](https://shopview.testrail.io/index.php?/cases/view/30292) · SBR-ASGN-02 = [C30293](https://shopview.testrail.io/index.php?/cases/view/30293) |
| 9 | Export cap + one over-cap message | Q2 = A *"great catch"* + Q3 = A *"this was not well thought out by me"*; `DELIBERATE-DECISIONS.md` B1 + B3. PV/TU/WIP pages carry no cap line; SBC `S14-R16`/`S15-R25` carry the retired "too large to generate" string | SBC-EXP-14 = [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) · SBR-EXP-15 = [C30290](https://shopview.testrail.io/index.php?/cases/view/30290) · IV-EXP-07 = [C30593](https://shopview.testrail.io/index.php?/cases/view/30593) · PV-EXP-11 = [C38885](https://shopview.testrail.io/index.php?/cases/view/38885) · TU-EXP-09 = [C38887](https://shopview.testrail.io/index.php?/cases/view/38887) · WIP-EXP-10 = [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) |
| 10 | Escape on the Deactivate dialog | **His 2026-07-28 answer, verbatim "B."** (`chris-answers-2026-07-28/answers-ingested.md` Q1) = Esc must NOT dismiss. Verified live 31 July: SBR `S13-R8` still says it dismisses *"on Cancel, X, or Escape"*, and SV-8599 still carries *"surface as decision"* | SBR-DEACT-04 = [C30255](https://shopview.testrail.io/index.php?/cases/view/30255) — already asserts Esc does **not** dismiss, i.e. already aligned to his ruling |
| 11 | Nav group / "only report" / odd characters | SPEC-WATCH items **6**, **10**, **11** + the mojibake note. Verified live: SBC `S1-R1` names no group; PV `S1-R1` still says *"first (and, in this release, only) report"*; 9 mojibake hits in the SBR capture, 3 in PV | SBC-NAV-01 = [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) · TU-NAV-01 = [C30392](https://shopview.testrail.io/index.php?/cases/view/30392) · PV-NAV-01 = [C30322](https://shopview.testrail.io/index.php?/cases/view/30322) |
| 12 | TU Column Selection has no Jira story | `DELIBERATE-DECISIONS.md` D7; register §1. Both cases cite epic **SV-8582** and say so in `refs` | TU-COL-01 = [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) · TU-LOC-06 = [C38915](https://shopview.testrail.io/index.php?/cases/view/38915) |

## Two corrections to our own records, found while verifying this document

1. **The Escape-key question is NOT open — he answered it on 28 July ("B.").** The 31 July question
   sheet, `DELIBERATE-DECISIONS.md` D6 and `OUTSTANDING-ITEMS-REGISTER.md` §1 all describe it as
   *"still unanswered on the 2026-07-27 sheet … open 4 days"*. That is **wrong**: the
   2026-07-28 ingest (`chris-answers-2026-07-28/answers-ingested.md`, Q1) records his verbatim
   answer **"B."**, and **SBR-DEACT-04 = C30255 already matches it**. What remains is only his spec
   edit, which is why it appears here as item **10** in the "just needs writing down" section, not
   as a question. **Do not re-ask it.** The register row is corrected in the same commit as this
   document.
2. **PV-NAV-01 is C30322, not C30323.** `DELIBERATE-DECISIONS.md` §B7 and the QA mapping row of the
   31 July question sheet both print **C30323**; the id-map and the live case say **C30322**
   (*"Parts Velocity appears under a new Parts section in the Reports navigation"*). Flagged, not
   edited — those two files were written by an earlier pass this session.

## Deliberately left out of the reader-facing list, with the reason

| Left out | Why |
|---|---|
| **"Are designs or videos coming?"** | **Already answered.** 2026-07-28 Q3 verbatim: *"B -- currently the best is my kickoff video that's pinned in the chat … I'm going to film a much more condensed click-through tonight"* — and that condensed video **arrived 2026-07-30**. So: no pictures or mock-ups exist, the two videos are the visual reference, and we have both. Re-asking would be exactly the embarrassment Rule 36 warns about. (The register still lists a "confirm no designs exist" row — it is satisfied by this answer.) |
| **The QA branch / environment + fresh cookies + flag state** | Not Chris's to give. It is the QA lead's item and is in the OUTSTANDING section below. |
| **The 6 reopened engineering stories in his epic** (SV-8594–8599 went OBSOLETE → Open on 2026-07-29, SV-8589 In Progress) | A developer's board action, not a product decision, and **no description text changed** on any of them. No input needed from Chris. (`epic-recheck-2026-07-31/REPORT-SUITE-EPIC-DELTA.md`) |
| **The permission dev-change ticket** (build ships the dedicated SBC atom against his ruling) | Owed by dev / the QA lead, not by Chris — he has already ruled twice. Draft ready at `chris-answers-2026-07-31/Q4-permission-dev-note-2026-07-31.md`. |
| **The WIP column-selector live observation** (is Location offered in the picker?) | Settled by one look at a running build, not by Chris. Needs the QA environment. |
| **The 7 requirements we deliberately do not test, and the WIP asset-dropdown styling note** | QA judgements and a zero-impact note; raising them would pad his list with items that change nothing. Recorded in `coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md` §5 and SPEC-WATCH item 8. |
| **Case titles over 80 characters** | Discharged 2026-07-31 — 0 of 474 exceed 80. Never a Chris item; noted so nobody re-raises it. |

## Wording check performed on the reader-facing part (Standing Rule 7)

Checked by machine over everything above the "INTERNAL" line: **0** occurrences of `C3####`/`C38###`
case numbers, **0** internal case IDs (`SBC-`, `SBR-`, `PV-`, `TU-`, `WIP-`, `IV-`, `-EXP-`,
`-PERM-` …), **0** spec anchors (`S##-R##`, `S##-N#`, `§`), **0** spec version numbers (`v11`–`v15`,
"version"), **0** TestRail/Jira references (`TestRail`, `Jira`, `SV-`, `C###`), and **0** of the
banned jargon words: API, HTTP, requirement, assertion, coverage, traceability, regression, spec,
atom, endpoint, enum, VIU, refs, case ID. Report names are always written in full — no SBC/SBR/PV/
TU/WIP/IV. The only technical-looking string that survives is the customer-facing message text in
item 9, which is quoted deliberately so he can compare it with his own wording.

---

## OUTSTANDING — what I need from you (QA lead)

Cross-project register: `build/OUTSTANDING-ITEMS-REGISTER.md` (Standing Rule 36).

1. **Send this document to Chris**, and decide whether it goes *instead of* or *alongside*
   `PO-Questions-Chris-ReportSuite-2026-07-31.md`. They overlap by design: the sheet is the
   fill-in-the-blank version of items 1–4; this document is the action list and adds the eight items
   the sheet does not ask for (the VIN label, and the seven write-it-down items). **Sending both
   risks him answering one and ignoring the other** — my suggestion is to send this document and
   attach the sheet for the four questions that need a written A/B answer.
2. **The QA branch / environment for the reports, plus confirmation the reports are switched on, and
   fresh login cookies.** Still the biggest gap on this project: **all 474 cases have never been run
   against the real build** — everything we assert is "the description says so", not "the build shows
   it". Outstanding since 22 July.
3. **A decision on the two remaining go-aheads** already in the register: pushing the 2 new
   part-of-a-unit precision cases (PV-PREC-01/02, blank C-ids, plus a run-359 resync), and filing the
   permission dev-change ticket so the 3 deliberately-ahead-of-build cases are not read as our bug.
4. **Nothing else is outstanding from you on this pass.** No TestRail writes, no case edits and no
   spec edits were made producing this document — it is read-only over the cases and specs.

**One line for the standup:** *Chris owes five decisions and seven description edits; the WIP asset
identifier (item 6, due 4 August) is the one to chase first, and the Escape-key question everyone
thought was open was actually answered on 28 July.*
