# WO Board and Tech View — Testing Suite Currency Check V2, source half (14 Oct 2026)

**Suite:** Work Orders Board View & Tech View Display Options (epic [SV-10043](https://shopview.atlassian.net/browse/SV-10043)) ·
**Baseline:** the 8 Oct check (`source-update-2026-10-08/SOURCE-CHECK-2026-10-08.md`: PRD page v42 of 7 Oct, Review Decisions of
29 Sep, comments to 7 Oct, stories of 8 Oct, tech plan revised 24 Sep).
**Read-only:** nothing was written to TestRail, Jira, Confluence, Slack or Google, and I did not sign into any build. No git commands were run.
Every claim below carries its source. Times are UTC unless marked.

Files in this folder from this pass: `CONFLUENCE-845185030-2026-10-14.md` (PRD v48, verbatim) ·
`CONFLUENCE-853901313-2026-10-14.md` (Review Decisions v13, verbatim) · `PRD-DIFF-2026-10-07-vs-now.md` / `.json` ·
`confluence-comments-2026-10-14.md` · `jira-2026-10-14.md` · `impact-2026-10-14.json` · this report.

---

## 1 · Source currency

| Source | What we held (8 Oct) | Live on 14 Oct | Verdict |
|---|---|---|---|
| PRD, Confluence [845185030](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/) | page **v42** (7 Oct 14:33) | **v48**, 12 Oct 16:43, Chris Ward. Status line still reads "PRD v33, 2026-09-28". Change Log table is empty. | 🔴 **CHANGED**: 5 added, 1 removed, 5 reworded, 215 identical ([diff v42→v48](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=42&selectedPageVersions=48)) |
| Review Decisions, [853901313](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/) | capture of 29 Sep | v13, 29 Sep 16:42. Body byte-identical to ours (90,985 characters). | 🟢 unchanged, but **out of date against the PRD** (see PQ-5) |
| Other descendants of 845185030 | Run log 853245959 | Run log, last changed 21 Sep. No new child page. | 🟢 unchanged |
| PRD and child comments (footer and inline, open and resolved, every reply) | read to 7 Oct | 82 on the PRD (newest 7 Oct 14:35), 6 on the child (all 15 Sep) | 🟢 **none after 7 Oct** (`confluence-comments-2026-10-14.md`) |
| Epic SV-10043 and children (`parent =` and `"Epic Link" =`, fully paged) | 11 stories + SV-10593, SV-9769, SV-10984/5, 12 verify tasks | 31 children. New: SV-11087 (bug, 9 Oct), SV-11240 (task, 12 Oct). Also 22 story defects and bugs under the stories or linked (8–14 Oct). | 🔴 **CHANGED**: 57 issues updated since 7 Oct (`jira-2026-10-14.md`). Story descriptions re-synced to PRD v42–v48 on 8, 9, 12 and 13 Oct |
| Tech plan | `sources/Tech-Plan-…-2026-10-08-upload.md`, revised 24 Sep (sha256 `ab6def33…`) | Same file in the uploads and in `_tech-plans-inbound/Dashboard-and-TechView-TechPlan.md` (same hash). Nothing on Confluence or Jira: the verify tasks say "Ask Milan Zivanovic for the plan document". | 🟢 no newer version found |
| Release notes (new source) | not held | [928121200](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/928121200/) (9 Oct) and the combined [931069964](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/931069964/) (10 Oct), both by Chris Ward | 🟠 read in full. They match the PRD except one stale line on Imported (PQ-6) |
| Squad pages (new) | not held | [Board / Tech View (SV-10043) · PM Chris Ward](https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/935362568/) and [Feature Squads](https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/936017922/) (13 Oct). The Standups page has no daily pages yet. | facts only (section 7) |
| Slack | not read on 8 Oct | #fs-board-tech-view (7–14 Oct, every message and thread), #release-comms-26-43-0, #qa-automation, #team-qa, and the QA lead's DMs that matched the searches | facts in sections 3 and 7 |
| Design | export of 8 Oct | `sources/design-2026-10-14-upload/` exists (uploaded 14 Oct) | ⚪ **not part of this half**: needs the Rule 124 drive by the lead session |
| QA build | v26.40.8-7a95011 (8 Oct) | build `e84b3d1` on 12 Oct, **`35e65f9` on 14 Oct** (Slavcho, [Slack](https://shopview.slack.com/archives/C0C41RV3T3L/p1791976990525429); SV-10043 comment 78661) | not signed into (read-only lane) |

## 2 · What changed, and when

Dates come from the PRD's **version history**: each version carries Chris Ward's message, and I read the diff of every version one
by one. The page's own Change Log is empty, so it names nothing. Our copy-vs-live diff equals the union of these six diffs.

| # | Change (behaviour) | Codes | Version · when | Why (as recorded) |
|---|---|---|---|---|
| CH-1 | Tech View and Board View use the **List's empty state**. With filters on: "No work orders match these filters" / "Try removing a filter to widen your results." / **Clear all filters**. Search only: "No work orders match the search "{search}"." with **no button**. Before: "No work orders match your filters" + Clear filters. | S1-N1 reworded; **S1-N1a, S1-N1b added**; Design updates line; section 9 row | [v43](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=42&selectedPageVersions=43) · 8 Oct 22:11 | Ahtasham's question (Filters PRD removed global Clear filters); Chris: "S1-N1's quoted wording is out of date" ([Slack 8 Oct 22:12 UTC](https://shopview.slack.com/archives/C0C41RV3T3L/p1791497536300869)) |
| CH-2 | A **pinned technician who is not enrolled here gets no column**. If they still lead work here, they show as a normal, unpinned column. S3-R20a ("No work orders" to everyone) now covers **deactivated** technicians only. | S3-R20a reworded; **S3-R20b added**; context note | [v44](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=43&selectedPageVersions=44) · 9 Oct 13:29 | Sasha's SQ-11 answer of 24 Sep (footer comment 886374410) |
| CH-3 | **Assigned to me stays as the user set it** when the location changes (was: "resets"). | S1-E3 reworded | [v45](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=44&selectedPageVersions=45) · 12 Oct 13:08 | [SV-11098](https://shopview.atlassian.net/browse/SV-11098): production keeps it on; Slavcho asked Chris to correct S1-E3 |
| CH-4 | A line whose technician is there **only because of a Schedule shift** is not "explicitly assigned": it **follows the incoming lead**, and the shift technician stays on the line's technician list. | S4-R8 context note | [v46](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=45&selectedPageVersions=46) · 12 Oct 13:11 | [SV-11128](https://shopview.atlassian.net/browse/SV-11128) |
| CH-5 | **Work-order-level shift defined**: a shift that "covers every current line of the work order". A shift on only some lines shows no clear-shifts question. | S4-R28 reworded | [v47](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=46&selectedPageVersions=47) · 12 Oct 13:11 | [SV-11126](https://shopview.atlassian.net/browse/SV-11126) |
| CH-6 | **Imported work orders open in List only.** In List with Imported ticked, Board View and Tech View are greyed out with the tooltip "Not available while Imported is selected." In Board View and Tech View, "Imported" is greyed out in Status with the tooltip "Imported work orders open in List." The Imported reassign tooltip is removed, and the lock now names Invoiced and Paid only. | **S1-R13a, S1-R13b added**; **S4-N9 removed**; S4-N2 reworded; Story 4 preconditions; overview bullet; section 9 row | [v48](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=47&selectedPageVersions=48) · 12 Oct 16:43 | Engineering proposal 17 Sep, Sasha agreed 24 Sep, "@chris confirmed it on 2026-10-12" (context note) |
| CH-7 | **Moving a timesheet entry to another line**: only the labor row the app added (clock-in, "New timesheet", a move) is removed. A technician added through Edit Line stays at 0.00 h. A line that Start filled goes back to Unassigned. A plain Edit Line save does not count as on purpose. | Jira only | Chris Ward, [SV-11087](https://shopview.atlassian.net/browse/SV-11087) comments 78396 (9 Oct), 78407 (9 Oct), 78508 (12 Oct), 78592 (13 Oct) | Ships in the **bugfix release** (PR #3619 into main), not in SV-10043; testable on sv11087 (comment 78675) |

Jira story descriptions: Chris Ward re-synced SV-10044 … SV-10054, SV-10593 and the verify tasks to PRD v42 (8 Oct), v43/v44
(9 Oct), v45/v47 (12 Oct) and v48 (13 Oct), each marked "_Updated … to match PRD vNN_". The only story text that is not in the PRD
is acceptance-criteria wording that restates it (checked line by line in `jira-2026-10-14.md`; script output at
`raw/story-diff-filtered.txt` in the scratchpad). SV-10593's AC now starts "Given a user opens Work Orders at 1024px or wider", in
line with S12-R1 and the verify task SV-10229 ("Phones (below 1024 px) send no Story 12 events, and the List sends view events only").

## 3 · Latest wins: every behaviour discussed more than once

| Behaviour | Statements, oldest first (source · date) | Winner |
|---|---|---|
| Empty state in the new views | PRD v42 S1-N1: "No work orders match your filters" + Clear filters · QA ticket [SV-11099](https://shopview.atlassian.net/browse/SV-11099) (Bilal, 9 Oct 15:10, from that text; now Obsolete) · Ahtasham: List shows the search message ([Slack 8 Oct 22:06](https://shopview.slack.com/archives/C0C41RV3T3L/p1791497173963109)) · Chris (PM): same as List, two messages ([Slack 8 Oct 22:12](https://shopview.slack.com/archives/C0C41RV3T3L/p1791497536300869)) · **PRD v43** (8 Oct 22:11) | **PRD v43** S1-N1/N1a/N1b |
| Pinned technician no longer eligible here | Engineering: a pinned technician always gets a column (17 Sep, comment 869171201 §A4) · Sasha: "technicians who aren't eligible in the current location simply don't show" (24 Sep, 886669314) · Chris: "No work orders" on that column, S3-R20a v41 (7 Oct 14:15, 924057650) · **PRD v44** (9 Oct): not enrolled → no column; deactivated → "No work orders" · register SQ-11 still "Open" (29 Sep) | **PRD v44** S3-R20a/R20b (PQ-2 on drops) |
| Assigned to me on a location change | PRD to v44: "resets … as it does today" · [SV-11098](https://shopview.atlassian.net/browse/SV-11098) (Bilal, 9 Oct): should switch off · Slavcho (developer, 12 Oct 04:44 -05): production keeps it on · **PRD v45** (12 Oct, Chris) · register FF-3/DR-6 (13 Sep): "Retain existing Assigned to me location-change behavior" | **PRD v45** S1-E3 (stays on) |
| What Assigned to me matches | S1-R13 "existing Assigned to me rules" · Chris (PM): lead tech, service advisor or a line technician, as in production ([Slack 12 Oct 13:41](https://shopview.slack.com/archives/C0C41RV3T3L/p1791812502307109)) | Chris, 12 Oct (unchanged production rule) |
| Schedule-shift technician on a line, at a lead change | Slavcho: scheduled technicians "stay put when the lead changes (S4-R8)" (7 Oct 14:29, 924221605) · [SV-11128](https://shopview.atlassian.net/browse/SV-11128) (Ahtasham, 10 Oct): should follow · Slavcho fix (12 Oct) · **PRD v46** note (12 Oct, Chris) | **PRD v46**: the line follows the new lead; the shift technician stays listed |
| What triggers the clear-shifts question | Sasha: whole-work-order shifts not ended (24 Sep) · PRD v40 S4-R28 (6 Oct) · [SV-11126](https://shopview.atlassian.net/browse/SV-11126) (10 Oct) · Slavcho: "A shift created with the Schedule's 'Entire work order' option" (developer, 12 Oct) · **PRD v47** "covers every current line" (12 Oct) | **PRD v47**. The one-line-work-order edge is open (PQ-1) |
| Imported work orders | Engineering: board displays unavailable with a tooltip (17 Sep) · Sasha agreed and asked to disable Imported in the Status filter (24 Sep) · PRD v35 S4-N9 Imported lock tooltip (29 Sep) · register DR-37 (29 Sep) · release notes: "can't change on Invoiced, Paid or Imported" (9–10 Oct) · **PRD v48** (12 Oct): List only, two exact tooltips, S4-N9 removed · Slavcho removed the tooltip (14 Oct, SV-10043 comment 78661) | **PRD v48** (release notes and register stale: PQ-5, PQ-6) |
| Where a removed lead's work order lands | PRD v37 / register DR-47 (29 Sep): bottom of Unassigned · **PRD v38** (1 Oct): Unassigned in the initial sort · stories (8 Oct) follow v38 | **PRD v38** S9-R14 (register stale) |
| Timesheet move off a line | Ahtasham: regression (9 Oct) · Slavcho: same in production, not a regression (9 Oct) · **Chris (PM)**: keep deliberate rows, remove only app-added ones (9, 12, 13 Oct) | **Chris, 13 Oct** (bugfix release) |
| Work order page Lead Technician with no lead | Ahtasham asked (12 Oct) · Chris: it should read "Unassigned"; blank is a production bug, [SV-11235](https://shopview.atlassian.net/browse/SV-11235); "Don't fail Board and Tech View on it" ([Slack 12 Oct](https://shopview.slack.com/archives/C0C41RV3T3L/p1791812502307109)) | Chris, 12 Oct (no case expects it, checked) |
| Phones and narrow screens | S1-R14 · Bilal asked (9 Oct) · Chris: expected, per S1-R14 ([Slack 9 Oct 15:20](https://shopview.slack.com/archives/C0C41RV3T3L/p1791559253474019)) | S1-R14 (unchanged) |
| Estimated hours on a card | S5-R11 "existing production meaning" · [SV-11106](https://shopview.atlassian.net/browse/SV-11106) (Bilal): the sum of the lines · Slavcho (developer only, 12 Oct): sum excluding declined lines, may differ from the work order page by 0.1 | **No winner**: developer-only, so PQ-3 |
| Lead name on cards | Slavcho (developer only, [Slack 12 Oct](https://shopview.slack.com/archives/C0C41RV3T3L/p1791816487158519)): cards use the account name, List the staff record name | **No winner**: PQ-4 |
| Who owns the test cases | Vladimir Tomovic (8 Oct, a comment on every story): "Critical and High priority cases are automated (Playwright) … assigned to Ahtasham Amjad"; everything else "Manual … assigned to Bilal Muzamil" · Milos (DVI notes, 12 Oct): "QA on the feature squad owns writing and updating test cases" ([Slack](https://shopview.slack.com/archives/C0C39T5MLMB/p1791807912692899)) · Milos (DM, 14 Oct): "not my rule … checking with Stefan and team" · Bilal ([#team-qa 14 Oct](https://shopview.slack.com/archives/C08A245PFC1/p1791972460700409)): "As agreed, the QA assigned to each Feature Squad owns its test cases" | Squad QA owns the cases. For this squad that is **Bilal Muzamil** (manual) and **Ahtasham Amjad** (automation) — see section 7 |

## 4 · Impact: cases that need a change (behaviour-first, after an adversarial pass)

I searched all 258 snapshotted cases for every changed behaviour, then read every hit in full. A case is listed only if a tester
following it today would fail a correct build, or pass a build that still works the old way. "Before" texts are copied by script from
`snapshots-before/` into `impact-2026-10-14.json`.

| Case | Title | Owner · automated | What a tester now sees differently | Change |
|---|---|---|---|---|
| [C154648](https://shopview.testrail.io/index.php?/cases/view/154648) | Tech View and Board View are unavailable while Imported is selected | ours · no | The PRD now fixes both tooltips word for word: "Not available while Imported is selected." on the switcher, and "Imported work orders open in List." on the greyed-out Imported option. The case accepts any tooltip ("write down its words") and never checks the Imported option's tooltip, so it **passes a build with wrong or missing tooltip text**. | CH-6, v48 |
| [C368133](https://shopview.testrail.io/index.php?/cases/view/368133) | The clear-shifts question appears only for the old lead's unfinished shifts | ours · **yes** | Work order C has one line. A shift on its only line covers every current line, so under v47 it **is** work-order-level and the question must open; the case expects none, so it **fails a correct build**. The setup also cannot be followed: the Schedule books a one-line work order at once, with no Choose lines window (recorded in [C368178](https://shopview.testrail.io/index.php?/cases/view/368178)). Its "what you should see today" note is out of date since build e84b3d1. | CH-5, v47 |
| [C96965](https://shopview.testrail.io/index.php?/cases/view/96965) | Clear shifts removes only the old lead's whole-work-order shifts | ours · no | [WO-1] and [WO-2] have one line each, so the 13:00–15:00 "Line 1" shift covers every line. It is work-order-level and Clear shifts removes it, but the case expects it to stay: **fails a correct build**. Vladimir added the v47 quote on 12 Oct but kept the one-line work orders. | CH-5, v47 |
| [C236975](https://shopview.testrail.io/index.php?/cases/view/236975) | Owner drags a work order to another technician on Board View and clears the outgoing lead shifts | Vladimir Tomovic · **yes** | "one line authorized for repair" plus a "line-level shift … on the authorized line". If that is the only line, step 5 ("the line-level shift still exists") **fails a correct build**. It depends on PQ-1(c). | CH-5, v47 |
| [C236976](https://shopview.testrail.io/index.php?/cases/view/236976) | Owner reassigns the lead from a Tech View row and clears the outgoing lead shifts | Vladimir Tomovic · **yes** | Same set-up, step 6 ("the line-level shift remains"). | CH-5, v47 |

**Already brought up to date by someone else (no action):** [C96923](https://shopview.testrail.io/index.php?/cases/view/96923)
(S1-E3, Vladimir 12 Oct) · [C368131](https://shopview.testrail.io/index.php?/cases/view/368131) (S3-R20a/R20b, Vladimir 9 Oct) ·
[C154884](https://shopview.testrail.io/index.php?/cases/view/154884) (Assigned to me also matches the service advisor; Bilal, setup
only, [DM to Vladimir 13 Oct](https://shopview.slack.com/archives/D094L9DHB1T/p1791834641773129)).

**Checked and left out (wording only, or the case does not exercise the change):** C368130 (old "Design updates" quote) · C96963,
C97009, C368158 (quote the old S4-N2 with Imported; each tests Invoiced/Paid only) · C96970 (its un-enrolled technician leads work
here, so she still has an unpinned column; the refused drop is unchanged; see PQ-2) · C368156 · C96960, C96961 (no line held only by
a shift) · C368177 (checks only that Line 2 takes the technician) · C96978 (see PQ-3, PQ-4).

**Deleted since 8 Oct** (facts from another session's committed record `deleted-since-8-oct.json`, branch
`claude/test-execution-defects-cdrjsq`, plus Slack): C154887 (S4-N9 Imported tooltip, deleted 12 Oct, correct under v48) · C368247
(imported lead lock) · C96918 (empty state: Ahtasham updated it on 9 Oct for CH-1, then by 12 Oct it "isn't a valid TestRail ID",
[#qa-automation](https://shopview.slack.com/archives/C0BQ279NC65/p1791799589841239)) · C368211 ("got deleted … as it was no longer
valid", Ahtasham 9 Oct) · C368149 (S9-R11 concurrency; deleted 12 Oct on the QA lead's instruction because SV-11119 was Obsolete) ·
C368165, C368204 (QA lead, 12 Oct) · C368216, C368221, C368242 (QA lead, 12 Oct, regression cases) · C368160/162/164 (design-only
controls, 12 Oct). **C96918 and C368149 leave PRD rules with no case (NT-1, NT-2, NT-4).**

Not a source change, but worth the owner's look: C154886, C368128, C368132, C96931, C96933 turn on Assigned to me without handling
the service-advisor match that Bilal had to fix in C154884's setup (Chris, 12 Oct). I did not check their setups in detail.

## 5 · New tests needed

| # | Proposed test | Why (change · date) | Before you start | Steps | What you should see | Related |
|---|---|---|---|---|---|---|
| NT-1 | With a filter on and no match, Tech View and Board View show the List's filtered empty state | CH-1, v43 (8 Oct). Its only case, C96918, was deleted | Work orders at the location; desktop 1024 px or wider | Board View > tick a Status nothing has > read; add any search text > read; switch to Tech View > read | "No work orders match these filters", "Try removing a filter to widen your results.", a **Clear all filters** button, in both displays, with or without the search; never a page of empty columns | C96918 (deleted) |
| NT-2 | A search alone that matches nothing shows the search empty state with no button | CH-1, v43 | No filter ticked | Board View > Search "ZZNOMATCH123" > read; Tech View > read | "No work orders match the search "ZZNOMATCH123"." and **no button**, in both | SV-11099 (Obsolete) |
| NT-3 | A line held only through a Schedule shift follows the new lead | CH-4, v46 (12 Oct), SV-11128 | Approved work order led by A: Line 1 with no own technician and a Schedule shift for B on Line 1 only; Line 2 with C set in Edit Line; no labor | Board View > More actions > Reassign lead technician > D (Keep shifts if asked) > open Lines tab and Edit Line | Line 1 follows D, and B is still listed on Line 1; Line 2 keeps C | C96960, C96961 |
| NT-4 | When two people reorder the same technician at once, the later save wins with no warning | S9-R11 (unchanged); its only case, C368149, was deleted on 12 Oct | Two users, two browsers; one technician leads Alpha Co, Bravo Co, Charlie Co | B1: drag Charlie Co to the top; B2 (not refreshed): drag Bravo Co to the top; refresh both | No warning anywhere; both show Bravo Co, Alpha Co, Charlie Co | C97005; SV-11119 |
| NT-5 (optional, other release) | Moving a timesheet entry off a line removes only the row the app added | CH-7, Chris 9–13 Oct; ships in the bugfix release, not SV-10043 | sv11087 (build dc2c8a0), rows created after the fix | As in SV-11087 comment 78675, steps 1–6 | An app-added row leaves the source line; an Edit Line technician stays at 0.00 h; a Start-filled line goes back to Unassigned | C368177 |

Not proposed as new tests (they belong in the updates above): exact Imported tooltips (C154648); a shift on some lines of a two-line
work order (C368133 and C96965 once updated).

## 6 · Questions for the PO (Chris Ward, PM for this squad)

| # | Topic | Question | What we know today | Where we found it |
|---|---|---|---|---|
| PQ-1 | Clear-shifts question | (a) Does a shift on the only line of a one-line work order count as work-order-level? (b) Does a "Choose lines" shift that ticks every line? (c) Do unapproved or declined lines count as "current lines"? (d) If a line is added after an Entire work order shift was made, does the shift still count? | v47: "covers every current line … which is what the Schedule's Entire work order drop creates". The Schedule books a one-line work order at once. Four cases depend on the answer. | PRD v47 S4-R28; SV-11126 |
| PQ-2 | Un-enrolled technician who still leads work here | (a) Can work be dropped onto this "normal, unpinned column"? (b) Does it show the inactive marker? (c) What does it say once it is empty? | Sasha (24 Sep): treat them like inactive. Slavcho (7 Oct): a drop there is refused with "This technician can't be assigned work orders." | PRD v44 S3-R20b; comments 886374410, 925204483 |
| PQ-3 | Estimated hours on a card | Leave out declined lines? May it differ from the work order page by 0.1 hrs? | Only the developer has said so (SV-11106, 12 Oct) | SV-11106 comment 78518 |
| PQ-4 | Technician name on cards | Should cards and headers show the account name while the List shows the staff record name? | Developer statement only (Slack 12 Oct). C96978 expects card values to match the List. | [Slack](https://shopview.slack.com/archives/C0C41RV3T3L/p1791816487158519) |
| PQ-5 | Review Decisions page | Refresh it, or mark it as replaced by the PRD? | v13 of 29 Sep still has DR-47 (bottom of Unassigned), SQ-11 open, UX-6 with the old empty-state text, UX-17 and DR-37 with the Imported lock | Confluence 853901313 |
| PQ-6 | Release notes | They say the lead "can't change on Invoiced, Paid or Imported work orders". Since v48 Imported is List-only and S4-N2 names Invoiced and Paid. Update them? | Release 26.43.0; pre-release comms planned for 15 Oct | Confluence 931069964, 928121200 |
| PQ-7 | Imported via a link or saved filter | If Board View or Tech View opens with "Imported" already ticked (from a link or saved filter), what happens? | S1-R13a covers List; S1-R13b greys the option inside the views | PRD v48 |
| PQ-8 | PRD status line | Bring "PRD v33, 2026-09-28" up to date, and use the Change Log? | The page is at version 48, and the Change Log table is empty | PRD header, section 10 |

## 7 · Facts: owners, PO, release, environment, the "Not runnable for now" folder

- **PM / PO for this squad: Chris Ward** ([squad page](https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/935362568/);
  [Feature Squads](https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/936017922/)). PRD owner and design authority:
  Sasha Grosman (PRD header). Designer: Branko Cicovic. Developer: Slavcho Mitrov. Engineering: Milan Zivanovic, Stefan Mitrovic.
  Channel: **#fs-board-tech-view** (private, created by Chris Ward 23 Sep).
- **Who owns the test cases:** the feature squad's QA ([#team-qa, 14 Oct](https://shopview.slack.com/archives/C08A245PFC1/p1791972460700409);
  [DVI notes, 12 Oct](https://shopview.slack.com/archives/C0C39T5MLMB/p1791807912692899)). On this squad, Vladimir Tomovic's comment
  on every story (8 Oct, e.g. SV-10044 comment 78306) assigns **manual cases to Bilal Muzamil** and **automated (Critical/High) cases
  to Ahtasham Amjad**. Ahtasham is doing the automation ([Slack 9 Oct](https://shopview.slack.com/archives/C0C41RV3T3L/p1791570182070279):
  "43 of the 50 High cases are automated").
  Vladimir prepared the automation plan ([Slack 8 Oct](https://shopview.slack.com/archives/C0C41RV3T3L/p1791473775896849)) and owns
  18 of the cases. **So in V2 the "QA who owns the suite" for this squad is the QA lead himself (Bilal), with Ahtasham as the
  automation owner.**
- **Release: 26.43.0** (Sasha, #release-comms-26-43-0, 8 Oct). Chris: "release should be in theory the 22nd" (9 Oct 19:44 UTC,
  [channel](https://shopview.slack.com/archives/C0C7UQVTWAD)). Staging is not merged yet: Stefan asked "Are we ready for merge to
  staging?" ([14 Oct](https://shopview.slack.com/archives/C0C41RV3T3L/p1791977199462849)), then "code review done, make adjustments
  and we can deploy on staging" ([14 Oct 12:49](https://shopview.slack.com/archives/C0C41RV3T3L/p1791982197110099)). QA status: "all
  completed tests have passed … One test remains Blocked" (Bilal, [12 Oct](https://shopview.slack.com/archives/C0C41RV3T3L/p1791828591771179)).
- **QA environment: https://sv10043.qa.shopview.com** (Stefan, [8 Oct](https://shopview.slack.com/archives/C0C41RV3T3L/p1791415452664599)).
  Builds: 7a95011 (8 Oct) → e84b3d1 (12 Oct, [Slack](https://shopview.slack.com/archives/C0C41RV3T3L/p1791816487158519)) → **35e65f9
  (14 Oct)**. Slavcho warned that for a while on 14 Oct it ran "the new frontend on the old backend, so anything you test there now
  could produce false bugs" (DM, 14 Oct 10:17 UTC), before the 11:23 UTC redeploy. SV-11087 is tested on sv11087.qa.shopview.com
  (build dc2c8a0).
- **"Not runnable for now" (section 55300, 24 cases, under 13204):** created on **8 Oct 16:48 UTC by the QA lead's own
  build-verification session, on his instruction**. 11 cases were moved in then, and 13 more at 16:56. The section's own description
  gives the reason: "QA lead 2026-10-08: WO Board and Tech View cases a manual tester cannot run for now on the current build
  (sv10043 v26.40.8-7a95011): cases waiting for a decision (Edit Work Order window cannot be opened, the List has no pages, a staff
  member with logged time cannot be deleted, three pages have no filter, impersonation has no on-screen control, no second
  organisation on the QA build); the analytics and data-scope checks only a developer can make; and the sign-out case left for
  another session. Kept, not deleted; still in run 498 and marked AUTOMATION: HOLD with the reason." Sources: commits `942cdeaba`
  and `44275532a`; `build/setup-to-doc-2026-10-09/sections.json`. Neither Slack nor Jira mentions it.
- Vladimir and the developers agreed that from the **next** feature squad, QA writes cases before the dev tests are written
  ([Slack 12 Oct](https://shopview.slack.com/archives/C0C41RV3T3L/p1791818078377289)). On 12 Oct he added "Dev-layer test" lines to
  the preconditions of many of our cases (`OTHERS-EDITS-2026-10-14.md`).

## 8 · Reading coverage (Rule 119)

| Source | Size | Read |
|---|---|---|
| CLAUDE.md (index) | 72,570 B | 100% (loaded at start) |
| TOKEN-DISCIPLINE-CHARTER.md · 22-TESTING-SUITE-CURRENCY-CHECK-V2.md | 6,365 B · 10,787 B | 100% |
| PROJECT-STATE.md · SOURCE-CHECK-2026-10-08.md · OTHERS-EDITS-2026-10-14.md | 8,588 B · 5,101 B · 37,721 B | 100% |
| PRD 845185030 v48 body | 60,407 chars, 640 lines | 100% (lines 1–640), plus all six per-version diffs v42→v48 |
| Review Decisions 853901313 v13 body | 90,985 chars, 267 lines | 100% (lines 1–267); byte-identical to the 29 Sep copy |
| Comments, both pages (flat list incl. nested replies) | 86,721 B JSON; 88 comments | 100% |
| Release notes 928121200 · 931069964; squad pages 935362568, 936116225, 936017922 | full API bodies | 100% |
| Jira: 31 epic children + 26 related; descriptions and comments | 764,426 B JSON → `jira-2026-10-14.md` | 100% (descriptions of the 43 issues not in our 8 Oct copy in full; the 14 others as line-by-line diffs; every comment since 7 Oct) |
| Tech plan copies (4 files, by hash) | 115,972 B each | identical by sha256 to the copy read in full on 8 Oct |
| Slack #fs-board-tech-view 7–14 Oct, every thread | every message returned (one page, no more) and all 10 threads | 100% |
| Slack #release-comms-26-43-0; searches (SV-10043, Tech View, ownership, "not runnable") | channel 100%; 47 search hits | 100% of hits; relevant DM threads read |
| Case snapshots (258) | 1.36 MB text | all 258 scanned by script for every changed behaviour; read in full: C368130, C154648, C96970, C368156, C96960, C368133, C368177, C236975, C236976; setup/steps/expected read: C96965, C96930, C97005, C96938, C96961, C96978, C96963, C97009, C368158 and the line-shift cases (C351740, C368142/143/178/179/190/191/192, C96993) |
| Design upload of 14 Oct | — | **not read: outside this half** |

## 9 · Secret scan

`python3 build/testing-tools/scan_secrets.py` on the 8 files written in this pass, run 14 Oct 2026: **"secret scan clean -- 8 path(s)", exit 0** (structural patterns only; no fingerprint file in /tmp). Email
addresses were removed from the Jira and comment captures before saving (script check: 0 email addresses in the output files).

## OUTSTANDING — what I need from you

1. Decide what happens next under V2: the five changed cases (section 4) and the new tests (section 5) go to the owning QA. On this
   squad that is you (manual) and Ahtasham Amjad (automation; C368133, C236975, C236976 are automated). C236975 and C236976 are
   Vladimir's cases.
2. PQ-1 to PQ-8 for Chris Ward (send last, Rule 66). PQ-1 decides how C368133, C96965, C236975 and C236976 should be fixed.
3. The 14 Oct design upload still needs its Rule 124 drive. It was outside this half.
