# Filters cleanup, 5 August 2026 — where every source stood when we started

Standing Rule 31: the currency of **all** sources is established before anything is done, and every
source gets a verdict. Nothing here is taken from an earlier pass's summary — each line was read live
by this pass.

| Source | Identifier | Version / last change | Checked | Verdict |
|---|---|---|---|---|
| Specification | Confluence page **572030978** "Filters" | **version 18**, 2026-08-04T18:19:21Z, by Branko Cicovic, note *"Date-range filter: reflect current in-app default range and standard predefined ranges"* | 2026-08-05 12:00Z | **CURRENT** |
| Epic | **SV-8785** "Filters" (Epic, Open) | **20 children**, counted two independent ways (`parent=SV-8785` and `"Epic Link"=SV-8785`) — same keys, `isLast=true`, no paging remainder | 2026-08-05 12:10Z | **CURRENT — and it moved since yesterday** (see below) |
| The product owner's answer on the phone question | **SV-8825** | Branko's comment **2026-08-05T05:18:22.212-0500**, closed Done **05:18:37-0500** | 2026-08-05 12:00Z | **CURRENT — ANSWERED** |
| Build | `sv8785.qa.shopview.com` | `v3.4.2-d00239b`, etag `b9ab1d41…`, unchanged start to end | 2026-08-05 11:59Z and 12:20Z | **PARTIAL — we can prove which build is serving, but we had no sign-in, so we observed nothing it does.** See `BUILD-MARKER.md` |
| Designs (Figma) | file `DR4gEODShYgJqkozs3mF5q`, Filters nodes | the Rule-35 fetch queue is **CLOSED at 85/85** (2026-07-31) | 2026-08-05 | **CURRENT** |
| Engineering tech plan | Filters tech plan, ingested 2026-07-29 | unchanged | 2026-08-05 | **CURRENT** |
| Test cases | TestRail group **4110** | 110 cases, all authored by user id 3 (Bilal Muzamil); **no foreign case in the group** | 2026-08-05 12:00Z and 12:19Z | **CURRENT** |

## The trap this project keeps setting, confirmed again

**The specification page's own body still reads "Version: 1.6"** while the Confluence page version is
**18**. That is exactly the staleness trap Standing Rule 31(a) warns about: the number written inside
the document does not move, so a reader who trusts it never notices the page advancing. **We go by the
Confluence version number.**

For continuity, the cases' provenance lines keep saying *"the Filters specification version 1.6 as
revised on 4 August 2026"* — that is what the document calls itself, and changing it on 8 cases while
102 others keep the old wording would make the suite inconsistent. **It should be changed on all 110 in
one authorised pass, to name the Confluence version.** Logged as a finding, not fixed here.

## Where the phone rule actually came from — the version history matters

| Confluence version | When | What Branko did |
|---|---|---|
| 14 | before 4 Aug 12:04Z | **no mention of an Apply button at all** — 0 occurrences |
| **15** | 2026-08-04T12:04:15Z | *"Clarify mobile deferred apply: revise S12-R2, add S12-R5 and a Key Decision"* — **this is where the rule was born** |
| 16 | 2026-08-04T12:23:58Z | restored v1.6 search content that had been overwritten, re-applied the same edits |
| **17** | 2026-08-04T12:33:56Z | *"Fix Story 12 numbering: deferred-apply requirement renumbered to **S12-R6**, placed after the page-search S12-R5"* |
| 18 | 2026-08-04T18:19:21Z | the date-range wording (nothing to do with phones) |

So the rule entered at **v15** and became **S12-R6** at **v17**. It was already in the document when
Branko wrote *"This is updated in the filters prd"* the next morning.

## The two things we quote verbatim, read live from version 18

**Section 4, Key Decisions:**

> *"Mobile uses deferred apply: desktop filters in real time, while mobile stages the user's selections
> and applies them only when the user taps an "Apply filters" button — a deliberate difference for
> small-screen ergonomics (see Story 12)."*

**S12-R6:**

> *"Unlike desktop, mobile does not filter in real time. Selections made inside a dropdown / bottom
> sheet are staged, and the table updates only when the user taps an "Apply filters" button within the
> sheet. This confirms intent on smaller screens and avoids repeated table reflows / data fetches while
> the user scrolls a long option list. "Clear selection" and "Clear filters" behave as on desktop."*

And the sentence that decides whether this covers a **single** filter's sheet as well as the combined
one — **S12-R2, verbatim:**

> *"S12-R2: The filter chips behave like desktop with one exception (see S12-R5): tapping a chip opens
> its dropdown, selections update the chip appearance, and "Clear filters" appears when active"*

**That cross-reference is broken.** S12-R5 is the page-search requirement. The "one exception" it means
is the deferred apply, which was **S12-R5 until v17 renumbered it to S12-R6**. Read with the
renumbering in hand, S12-R2 says a chip's own dropdown behaves like desktop **except** that it stages
and needs an Apply button. Together with S12-R6's own words — *"a dropdown / bottom sheet"*, not "the
combined sheet" — the specification covers **individual filter sheets too**.

**Branko still needs to fix that cross-reference.** It is already on the outstanding list.

## What moved on the epic since yesterday

**20 children now (was 19).** New today: **SV-8876**, a Task, *"Clarification Required: Filter bar on
same row as tabs contradicts S1-…"*, status Ready — raised on ground the QA lead has already closed as
accepted (SV-8843).

Two story statuses advanced: **SV-8787 Status Filter** and **SV-8788 Customer Filter** are now
**QA Complete**.

**Three new Story Defects were raised today by Ahtasham Amjad**, hanging off the stories rather than the
epic, which is why they do not appear in the epic's child list:

| Ticket | Parent | What it says |
|---|---|---|
| **SV-8872** | SV-8796 | "Back To My Saved Filters" shows on the user's own view with nothing saved (S11-N3) |
| **SV-8875** | SV-8797 | **Individual phone filter sheets allow only one value and have no "Apply filters" button** |
| **SV-8878** | SV-8786 | Desktop: expanding chips push Create Work Order / Search / columns onto a second row |

**SV-8875 is the defect this pass was sent to raise.** It already exists. See `NO-TICKET-FILED.md`.
