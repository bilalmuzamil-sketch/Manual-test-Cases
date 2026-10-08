# WO Board & Tech View — source check, 8 October 2026

Asked by the QA lead: *"check the test cases for WO board Tech view for sources updates etc"*. Last check: 30 Sep 2026
(PRD v33, `V33-RECHECK-2026-09-30.md`). Nothing has been written to TestRail in this check.

## Source currency
| Source | What we held | Live now | Verdict |
|---|---|---|---|
| PRD, Confluence 845185030 | v33 capture of 30 Sep (page edited 29 Sep) | **edited 7 Oct 2026 7:33 PM**; status line still says "PRD v33, 2026-09-28"; Chris calls it v42 in a comment | 🔴 **CHANGED** — saved `sources/CONFLUENCE-845185030-WO-BoardView-TechView-PRD-v33-edited-2026-10-07.md` |
| Review Decisions, Confluence 853901313 | capture of 23 Sep (page of 21 Sep) | edited 29 Sep (register refreshed) | 🔴 **CHANGED** — saved `sources/CONFLUENCE-853901313-Review-Decisions-Open-Questions-2026-09-29.md`; 5 rows still Open: MF-3 (dialog search UX), FF-6 (volumes/targets), SQ-8 (Tech View icon), SQ-11, SQ-15 (keyboard) |
| PRD comments (footer + inline) | read to 24 Sep | threads to 7 Oct | 🔴 **NEW decisions** 1–7 Oct, all folded into the PRD edit (shift prompt wording, empty column text, failed-drag alerts, header click, Tech View pins / total row / Assigned Techs position / Unassigned paging, Lines-tab technicians SV-9769) |
| Epic SV-10043 | 11 stories (Story 12 had none) | 11 stories **"Ready for QA"** (SV-10053 obsolete) + **SV-10593** (Story 12 analytics) + SV-9769 (Lines-tab bug, now in scope) + SV-10984, SV-10985 (build tasks/bugs) + 12 "Verify Phase" tasks | 🔴 **CHANGED** — saved `sources/jira-2026-10-08/SV-10043-stories-2026-10-08.md` |
| Design (Claude Design project 787fef1a) | export of 23 Sep, driven 23 and 30 Sep | Branko updated it after 28 Sep (column scrolling, pinned-area reordering); engineering says the 5 Oct export equals the 1 Oct one | 🟠 **NEWER VERSION EXISTS, NOT HELD** — a Claude Design project link needs a claude.ai login; the Artifact tool cannot open it |
| Tech plan | `sources/Tech-Plan-Kanban-Tech-View-Display-Options.md`, 17 Sep (PRD v0.8) | engineering wrote on 28 Sep "everything is now in the tech plan" | 🟠 **NEWER VERSION LIKELY, NOT HELD** |
| QA build | "no QA build" in our notes | **https://sv10043.qa.shopview.com responds, v26.40.8-7a95011** | Build exists. Not signed into (L7: build verification belongs to the build verification session) |

## What changed in the PRD (30 Sep → 7 Oct)
**17 new requirements, no case yet:** S2-R16 (collapsed group stays collapsed during search) · S2-R17 (Tech View pin order
like Board View) · S2-R18 (Unassigned opens expanded, sticky header, loads in pages) · S2-N4 (no pinning with Assigned
to me) · S2-N5 (no total row in Tech View) · S3-R20a (empty column of an unassignable pinned technician) · S4-R28–R31
(shift-clearing prompt: when it shows, exact wording, Cancel, where it shows) · S4-N10–N12 (three failed-drag alerts) ·
S7-R7 (Assigned Techs column right after Lines) · S7-R8–R10 (Lines tab shows scheduled technicians, no badge, else
"Unassigned").

**3 changed requirements, 3 cases quote old wording:** S1-R12 (header "Work Orders" click keeps the place) →
[C96917](https://shopview.testrail.io/index.php?/cases/view/96917) · S3-R20 (empty column reads "Drag a work order here to
assign it" to users who can reassign, "No work orders" to others) → [C96950](https://shopview.testrail.io/index.php?/cases/view/96950)
· S9-R14 (removing the lead puts the work order in Unassigned in the initial sort, not at the bottom) →
[C97007](https://shopview.testrail.io/index.php?/cases/view/97007).

## The suite today
148 live cases: **130 ours** (folder 13204 sections 13236–13248 + tech-plan folder 20449) and **18 by Vladimir Tomovic**
(2–7 Oct, all flagged Automated, listed below). Section 13245 (old Story 10) no longer exists. Our run
[498](https://shopview.testrail.io/index.php?/runs/view/498) holds our 130, all untested.
Coverage: 204 of 221 PRD requirements quoted; the 17 new ones are not.

Vladimir's cases (not touched; Rule 123 asks before any edit): C204099, C204100 (S3, 2 Oct) · C204101 (S5, 2 Oct) ·
C228761, C228762 (S2, 4 Oct) · C228763 (S5, 4 Oct) · C236975, C236976 (S4, 5 Oct) · C236977–C236981 (S9, 5 Oct) ·
C236982, C236983 (S1, 5 Oct) · C335320, C335321 (S11, 6 Oct) · C351740 (S7, 7 Oct).

## Next (Rule 122 — a full pass, not a delta)
Every one of our 130 cases re-read and rewritten to the current standard against the 7 Oct PRD, the 29 Sep register,
the comments and the stories; the design driven again; 17 new cases; run 498 brought into step (Rule 123). Waiting on the
QA lead for: the go-ahead to write, the current design export, and the current tech plan.
