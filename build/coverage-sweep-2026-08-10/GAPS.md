# GAPS — every uncovered or partly covered story, across all three active projects

**Date:** 2026-08-10 · **Read-only** — nothing authored, nothing pushed, no ticket created.
**Everything below is a PROPOSAL.** Authoring needs the QA lead's go-ahead (Standing Rule 6).

---

## THE THREE ANSWERS, KEPT APART

The QA lead needs to know which kind of "no case" each one is, because they carry completely
different weight. Lumping them together would overstate our failure in one direction and understate
it in the other.

| Class | Meaning | Count |
|---|---|---|
| **A — OUR MISS** | A documented requirement, built or buildable, with no case. **This is the number that measures us.** | **9** |
| **B — DELIBERATELY UNBUILT** | Engineering decided not to build it. A test would fail a correct build. | **3** |
| **C — NOT V1 / NOT YET A REQUIREMENT** | Fast-follow, Founder Mode, or an idea with no spec text yet. | **7** |
| **D — BLOCKED / OPEN QUESTION** | Cannot be settled until someone answers. | **4** |
| **E — NO CASE REQUIRED** | Obsolete, retired, or not a requirement carrier. | **16** |

**The honest headline: 9 genuine misses across 758 cases and 127 stories.**

---

# CLASS A — OUR MISSES (9)

## A1 · Filters `S13-R25` (b) — a search does not follow you to another device
**Story:** [SV-8798](https://shopview.atlassian.net/browse/SV-8798)
> **Spec v19, verbatim:** *"The query is stored in the browser tab session, never against the user
> account. This is deliberately different from filters, which are stored server-side and sync across
> the user's devices."*

**Covered:** the tab-session half, by [C38886](https://shopview.testrail.io/index.php?/cases/view/38886).
**Not covered:** that the query does **not** appear on a second device.
**Corroborated by the handover** §5.1: *"search lives only in the browser tab session
(`sessionStorage`), never the account, no cross-device sync"* — so this is real, built, and testable.
**Proposed case:** sign in as the same user in a second browser, confirm the filters carried across
and the search box came back empty. **Needs a second sign-in.**

## A2 · Filters `S13-R21` (b) — five search behaviours are desktop-only
**Story:** [SV-8798](https://shopview.atlassian.net/browse/SV-8798) · **the largest of the nine**
> **Spec v19, verbatim:** *"All query behaviour is identical across breakpoints: additive with
> filters (S13-R10), tab scoping (S13-R11, S13-R24), clearing (S13-R13), retention (S13-R14) and the
> four component states (S13-R2 to S13-R6)."*

**Covered:** only the width rule, by [C38889](https://shopview.testrail.io/index.php?/cases/view/38889).
**Not covered:** all five named behaviours on a phone.
**Scope caveat (handover §8):** *"only WorkOrders uses mobile sheets"* — so the proposed case should
be scoped to Work Orders rather than asserting every page.
**Proposed case:** one phone-viewport case walking additive-with-filters, tab scoping, clearing and
retention on Work Orders.

## A3 · Filters `S13-R16` (b) — tapping the search must raise the keyboard
**Story:** [SV-8798](https://shopview.atlassian.net/browse/SV-8798)
> **Spec v19, verbatim:** mobile uses the *"same inline expansion"*, and tapping *"moves focus into
> the field and raises the keyboard"*.

**Covered:** the inline expansion. **Not covered:** focus and keyboard.
**Proposed case:** one step appended to the mobile search case.

## A4 · Filters `S13-R8` (b) — keyboard navigation and drag-selection in the search field
**Story:** [SV-8798](https://shopview.atlassian.net/browse/SV-8798)
> **Spec v19, verbatim:** *"standard text input behavior with horizontal scroll"*, with keyboard
> navigation and click-and-drag selection behaving as in any text input.

**Covered:** long queries scrolling, by [C38898](https://shopview.testrail.io/index.php?/cases/view/38898).
**Not covered:** the keyboard/drag half. **Lowest value of the nine** — arguably framework behaviour
rather than feature behaviour (Rule 28 would score it WEAK-KEEP). **Flagged, not recommended.**

## A5 · Schedule §5.3 — the panel collapse toggle
**Story:** [SV-8686](https://shopview.atlassian.net/browse/SV-8686) (Grid Layout & Navigation)
> **Spec v27, verbatim:** *"5.3 Panel collapse. An icon button collapses and expands the left panel.
> It is the first item in the grid toolbar, left of Today… A borderless panel-left icon in secondary
> text color. The icon does not change between states; the tooltip carries the meaning — "Hide panel"
> when open, "Show panel" when collapsed… The panel animates closed… its divider disappears so no
> seam remains, and the grid reflows into the reclaimed space. State preservation. Contents are
> hidden rather than discarded."*

**No case covers it.** Five Schedule cases mention collapsing and **none is this**: C29929
(department header), C29934 (mini calendar chevron), C29984 (spread preview), C29998 (lane
stacking), C30086 (responsive auto-collapse below 960px).
**Mitigating, and stated plainly: §5.3 did not exist until spec v27, published 2026-08-07 — three
days ago — and our baseline is v25.** This is a fresh gap created by a spec change we had not yet
ingested, not a long-standing hole.
**Proposed case:** toolbar position (first item, left of Today), tooltip wording both ways, the grid
reflowing, the divider disappearing, and contents preserved rather than discarded.

## A6 · SBC `S10-N1` — sort controls stay put but do nothing when there are no rows
**Story:** [SV-8608](https://shopview.atlassian.net/browse/SV-8608) · **HANDED-OFF REPORT**
> **SBC v16, verbatim:** *"S10-N1: When the table has no customer rows, the sort controls on the
> headers are still present but produce no visible change."*

**Nearest case** is the empty-state case
[C30181](https://shopview.testrail.io/index.php?/cases/view/30181), which asserts *"The header-row
chevron is hidden when the table has no visible rows"* — **a different control and a different
outcome**. Nothing asserts the sort headers.
**Proposed case:** filter to an empty result, click each sortable header, confirm they are present,
clickable and change nothing.

## A7 · SBR `S11-N1` — the same hole on Sales By Representative
**Story:** [SV-8628](https://shopview.atlassian.net/browse/SV-8628)
> **SBR v18, verbatim:** *"S11-N1: With only one rep row visible, the sort affordances are present
> but produce no observable change."*

**No case asserts it.** Same class as A6 — worth authoring both together or neither.

## A8 · IV `S10-R8a` — the "as of" line is tested in the PDF and not in the spreadsheet
**Story:** [SV-8677](https://shopview.atlassian.net/browse/SV-8677)
> **IV v5, verbatim:** *"S10-R8a: The CSV (spreadsheet) export carries the same "as of" line as its
> first line, naming the day the values represent, worded the same as the PDF header."*

**[C30590](https://shopview.testrail.io/index.php?/cases/view/30590) covers the PDF header only** —
its refs cite `S10-R8; S10-R9` and its text asserts the PDF as-of line and that *"The CSV never
includes a logo"*. **The CSV's own as-of line is asserted nowhere.**
**⚠️ This is the SAME MECHANISM as the SBR Location column that Vlad found in July** — a requirement
that spans two surfaces, verdicted on one (Standing Rule 40). It has recurred.

## A9 · SBR `S14-R14` — the PDF font rule's no-positive-value branch
**Story:** [SV-8631](https://shopview.atlassian.net/browse/SV-8631)
> **SBR v18, verbatim:** *"…because the S14-R14 shift is defined relative to the largest positive
> value, it does not apply when no positive value exists, so the tier stays 11px"*

**[C30283](https://shopview.testrail.io/index.php?/cases/view/30283)** covers `S14-R12`/`S14-R13`
(the font stepping down and fixed column widths). **The all-zero / all-negative branch is not
asserted.** Low value; flagged for completeness.

---

# CLASS B — DELIBERATELY UNBUILT (3) — a test here would fail a correct build

## B1 · Filters `S13-R22` (b) — "the scope is wider than the S14-R6 list"
> **Spec v19, verbatim:** *"Note the scope of this requirement is wider than the S14-R6 surface list:
> that list covers only tables global search filters today, so tables it never touched still fall
> under this rule."*
> **Handover, verbatim:** *"Guiding rule: **adopt-only-existing** — migrate only the filters a page
> has today; don't invent new filter capabilities from the spec/Figma (user decision 2026-07-29)."*

**The spec asserts a scope engineering deliberately did not build.** Not our miss.
**Recommended action: none by us — this is a PO question.** Branko should either narrow `S13-R22` or
accept that it describes a later phase.

## B2 · Filters `S14-R5` (b) — "an app-wide sweep, not a per-module check"
> **Handover §8, verbatim:** *"Do **not** migrate `TechnicianEfficiency`, `Sales`,
> `ServiceAdvisorAnalysis`, `WorkInProgress`"* — plus aging/as-of-date, nav-orphan and no-date
> reports, all explicitly not migrated.

**[C38891](https://shopview.testrail.io/index.php?/cases/view/38891) walks the 42 named surfaces,
which is the built scope.** Asserting "every page in the application" would fail by design.
**Note for the QA lead about Ahtasham's wording:** the handover's own *"6 Reports"* (Shop Billing
Efficiency, My Timesheets, Timesheet Activities, Notes, Reminders, Sales Tax) are **not** the six
Report Suite reports. Checking Story 13/14 against the Report Suite six would find nothing, correctly.

## B3 · Filters `S13-R2/R3/R17/R18` (b) — exact colours, fonts and pixel widths
> **Handover §7, verbatim:** *"The visual components were built from existing app components while
> Figma was rate-limited — they are **not** pixel-perfect. Get the authoritative list of style deltas
> from the PM/design before polishing."*

**Asserting grey/100 `#EEF2F6`, Inter Medium 14/20 or a 162px field today would fail a build nobody
intends to ship yet.** Correctly deferred until the Figma-fidelity pass lands.

---

# CLASS C — NOT V1, OR NOT YET A REQUIREMENT (7)

All from the Schedule design review of 5 August. **None of these is a coverage gap of ours.**

| # | Item | Why it is not ours |
|---|---|---|
| C1 | **E1** hover pill on WO cards | *"Out of Scope — Done in foundermode FS"*; fast-follow |
| C2 | **E13** visual indicator for assigned lines | *"Will be done in Foundermode FS"* |
| C3 | **E14** single tech selector + "Add Tech" | *"Will be done in Foundermode FS"* |
| C4 | **E16** vertical Day View | *"Fast-follow, not part of this v1 release"* |
| C5 | **E15/E7/E8** carryover button, its rename, one-day extend | In scope but *"scope TBC"* — **no spec text and no story yet.** 0 cases; becomes ours once specced |
| C6 | **E12** persist view options per user | Same — *"Stated; scope TBC"*. 0 cases |
| C7 | **E3/E4/E5/E6** scheduling-modal redesign | Same — *"scope TBC"*, decisions still open |

**Recommendation:** do not author C5–C7 yet, but **do put them on the watch list** — the moment
Branko writes them into the spec they become Class A.

---

# CLASS D — BLOCKED OR OPEN QUESTIONS (4)

| # | Item | Blocked on |
|---|---|---|
| D1 | Filters `S13-R23` — *"Each table searches the fields its existing search endpoint already covers"* | **Engineering.** The per-table field list has never been supplied; the requirement says so itself. Untestable until it exists |
| D2 | Filters Status chip on Estimates/Completed | **Branko.** Spec says hidden (unchanged since 14 May); he said shown-greyed-out on 17 July. 5 cases wait |
| D3 | Schedule [SV-8916](https://shopview.atlassian.net/browse/SV-8916) "Add Existing Work Order" | **Product.** In the design, absent from the build, *"unresolved whether dropped or never scoped"*, Blocked in Jira. **0 cases — correctly, because nobody knows if it is a requirement** |
| D4 | Filters Parts/Reports chip write-up | **Branko.** 11 cases on HOLD; fourth week of asking |

---

# CLASS E — NO CASE REQUIRED (16)

**Report Suite (15 stories with no case, every one legitimate):**

| Stories | Why no case is owed |
|---|---|
| SV-8583 – SV-8588 (6) | **OBSOLETE** first-cut per-report placeholders, superseded by the granular user stories |
| SV-8590, 8591, 8592, 8594, 8595, 8596, 8597, 8599 (8) | **Engineering build stories** (Tech Plan Parts A and B). Their user-visible behaviour is asserted through the per-report cases — e.g. SV-8591's 10,000-row cap is covered six times over by [C30172](https://shopview.testrail.io/index.php?/cases/view/30172), [C30290](https://shopview.testrail.io/index.php?/cases/view/30290), [C38885](https://shopview.testrail.io/index.php?/cases/view/38885), [C38887](https://shopview.testrail.io/index.php?/cases/view/38887), [C38918](https://shopview.testrail.io/index.php?/cases/view/38918), [C30593](https://shopview.testrail.io/index.php?/cases/view/30593). This classification was made and audited on 2026-07-27 (`build/report-suite/epic-sv8582/RECONCILIATION.md`) and is re-confirmed here |
| **[SV-8614](https://shopview.atlassian.net/browse/SV-8614)** "SBC - Story 16 - Print the report" | **Retired by the spec.** SBC v16 reads verbatim: *"Story 16: (removed — Print retired). The Print action that previously occupied this story has been removed from this report."* Our [C30159](https://shopview.testrail.io/index.php?/cases/view/30159) asserts *"The overflow menu holds exactly the four download items - no Print"* — **correct.** ⚠️ **The Jira story is still `Open` and should be closed** — it is the only Jira/spec disagreement this sweep found |

**Filters (1):** [SV-8901](https://shopview.atlassian.net/browse/SV-8901) — a container story for
QA-environment defects that are *"non-Filters"* by its own title. Not a requirement carrier.

---

# TWO FINDINGS THAT ARE NOT GAPS BUT NEED A DECISION

## F1 · Two cases now rest on a tech plan when the spec has caught up
**PV [C38885](https://shopview.testrail.io/index.php?/cases/view/38885)** and
**TU [C38887](https://shopview.testrail.io/index.php?/cases/view/38887)** both carry refs saying
*"spec silent on a cap; tech-plan-2026-07-29 A3/FR-F4: suite-wide 10,000-row export cap"*.

**That is now false.** PV v6 added **`S6-R12`** and TU v7 added **`S7-R14`**, both stating the cap
*and the exact toast* verbatim: *"This report is too large to export. Narrow the date range or
filters, then try again."*

**Why it matters (Rules 30 and 57):** a tech plan is not a source of expected behaviour. These two
cases were resting on the only source they had; a proper one now exists. **Proposed: re-point both
refs to the real anchors and re-stamp the provenance.** Two writes.

## F2 · One of our Schedule cases contradicts a V1-scoped design decision
**[C30001](https://shopview.testrail.io/index.php?/cases/view/30001)** asserts, item 4:
*"The timeline is not stuck at the start - it remains a full 24-hour scrollable timeline (midnight to
midnight)."*

The design review's **E11**, marked in scope for V1, says: *"Render only business hours plus a small
trailing buffer rather than the full 24 hours."*

**If E11 ships, our case fails a correct build.** Not yet a defect — E11 has no spec text and its
scope is "paired with E10". **Flagged for a ruling before the release decision.**

**Also worth recording, because it is the Rule-44 outcome:** the coordinator's brief suggested
[SV-8915](https://shopview.atlassian.net/browse/SV-8915) (view opens at midnight) *"maps onto a
coverage gap we had already flagged but never authored"*. **It does not — C30001 covers it**,
including the 7:00 AM fallback and the earliest-technician-start rule, and it already names the
existing defect [SV-8837](https://shopview.atlassian.net/browse/SV-8837) for the same symptom.
**SV-8915 looks like a duplicate of SV-8837, which is consistent with it now being OBSOLETE.**

---

## OUTSTANDING — what I need from you

1. **Go-ahead to author the 9 Class-A cases** — or a subset. My recommendation: **author A1, A2, A3,
   A5, A6, A7 and A8** (seven), **skip A4 and A9** as low value, and say so openly in the
   decisions register rather than leaving them silently undone.
2. **A ruling on B1 and B2** — should our cases stay scoped to what was built ("adopt-only-existing"),
   with the spec's wider wording raised to Branko as a spec defect? That is my recommendation.
3. **Close [SV-8614](https://shopview.atlassian.net/browse/SV-8614)** — the spec retired Print; the
   story is still Open. Chris Ward's call. **No ticket action taken by me (Rule 62).**
4. **A ruling on F2 before the Thursday release decision** — does E11 ship in V1? If yes, C30001
   needs one edit.
5. **Go-ahead for the two F1 re-points** (PV and TU export-cap cases).
6. **The Class-C watch list** — confirm you want E15/E7/E8 and E12 tracked rather than authored.
