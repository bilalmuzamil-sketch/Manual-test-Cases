# Report Suite — epic SV-8582 LIVE VERIFICATION, 2026-08-04

> **Purpose:** close the 4-day blind spot in `EPIC-REREAD.md`. That document was built from the committed
> **2026-07-31T07:18Z** REST snapshot because no Jira session was available, so anything that changed between
> then and 2026-08-04 was invisible to it. This pass had a **live authenticated session** and re-verified the
> epic against Jira itself.
> **READ-ONLY on the epic and its children — no descriptions, statuses, comments or fields were edited.**
> The only Jira writes this session made were the six new defect tickets (see
> `build/report-suite/defect-pack-2026-08-04/FILED.md`) and their issue links.

## SOURCE-CURRENCY block (Standing Rule 31)

| Source | Identifier | Version / last-updated | Checked | Verdict |
| --- | --- | --- | --- | --- |
| Epic + children | SV-8582 + **101** children | live REST read; latest child `updated` = 2026-08-04T00:23:40−0500 | 2026-08-04 | **CURRENT** — live, not a snapshot |
| Jira changelogs | all 98 pre-existing issues, full history | live | 2026-08-04 | **CURRENT** |
| Comments | live count on every child | live | 2026-08-04 | **CURRENT** — 0 comments, confirmed live |
| Attachments / inline images | live count on every child | live | 2026-08-04 | **CURRENT** — 0 attachments, confirmed live |

**`EPIC-REREAD.md`'s PARTIAL verdict is hereby upgraded to CURRENT**, and its PARTIAL banner should be read
together with this file. Its quoted requirement text is confirmed unchanged — see the byte-level proof below.

## THE HEADLINE — what the 4-day blind spot was actually hiding

**No requirement text changed. The work started.**

1. **All ten engineering stories moved `Open` → `In Progress`** on **2026-08-03 13:37–13:38 (−0500)**, by
   **Chris Ward** — SV-8590, SV-8591, SV-8592, SV-8593, SV-8594, SV-8595, SV-8596, SV-8597, SV-8598, SV-8599.
2. **All ten were then assigned to `parth fadadu`** on **2026-08-03 22:56 (−0500)**.
3. **Nothing else changed.** Zero description edits, zero comments, zero attachments, zero new or removed
   children other than the four tickets this session filed.

This is consistent with, and independently corroborates, engineering's statement that QA branch `sv8582` is
**being actively worked and is NOT FINAL** — which is exactly why the Rule-49 re-check queue
`build/report-suite/viu-2026-08-03/RECHECK-QUEUE.md` must stay **OPEN**.

## 1. Child set verified TWO WAYS (Rule 37 Tier 1, Rule 50 set-equality both directions)

| JQL | Children returned |
| --- | --- |
| `parent = SV-8582` | **101** |
| `"Epic Link" = SV-8582` | **101** |

- **Set equality proven in BOTH directions:** only-in-`parent` = **none**; only-in-`Epic Link` = **none**.
  The two queries return the identical key set, not merely the same count.
- Both queries were **paged to exhaustion** (`nextPageToken` followed until `isLast`), so there is no paging
  remainder (Rule 17).

### 101 live vs 97 in the baseline — the +4 is ours

| Change | Keys | Explanation |
| --- | --- | --- |
| **NEW** | SV-8818, SV-8819, SV-8820, SV-8823 | **Filed by this session today** as children of the epic (see FILED.md). Not an external change. |
| **REMOVED** | none | — |

So the **external** child set is **still exactly the 97** the baseline held. No story was added, deleted or
re-parented by anyone else in the window.

## 2. Every child's status — 10 changed, 87 unchanged

| Key | Baseline (2026-07-31) | Live (2026-08-04) | Summary |
| --- | --- | --- | --- |
| SV-8590 | Open | **In Progress** | [Reports Suite][A2] Shared paginated-report contract |
| SV-8591 | Open | **In Progress** | [Reports Suite][A3] Export contract + 10k row-cap guard |
| SV-8592 | Open | **In Progress** | [Reports Suite][A4] Denormalized invoice financial columns |
| SV-8593 | Open | **In Progress** | [Reports Suite][A5] FE report shell |
| SV-8594 | Open | **In Progress** | [Reports Suite][B1] Work In Progress (WIP) report + nightly snapshot cron |
| SV-8595 | Open | **In Progress** | [Reports Suite][B2] Technician Utilization (TU) report |
| SV-8596 | Open | **In Progress** | [Reports Suite][B3] Parts Velocity (PV) report + part.last_sold_at |
| SV-8597 | Open | **In Progress** | [Reports Suite][B4] Inventory Value (IV) report + nightly snapshot + retention |
| SV-8598 | Open | **In Progress** | [Reports Suite][B5] Sales By Customer (SBC) report + dedicated permission |
| SV-8599 | Open | **In Progress** | [Reports Suite][B6] Sales By Representative (SBR) report + rep schema + staff dialog |

**The other 87 children are byte-for-byte unchanged in status** (the six reports' per-story tickets
SV-8600→SV-8679 remain **Open**, as does the epic SV-8582 itself).

**Why this matters to QA, plainly:** the ten stories that just went In Progress are the ten that own the
shared plumbing and the six report implementations. Their moving does **not** change what we test — no
requirement text moved — but it does confirm the build under our feet is changing, so **every finding taken
from `v3.4.1-0ed4433` stays PROVISIONAL** (Rule 49).

## 3. Changelog since the 2026-07-31 snapshot — all 25 entries, nothing summarised away

Read live with `?expand=changelog` on **all 97** pre-existing children (not a sample). Entries after the
snapshot instant, in order:

| When (−0500) | Issue | Author | Field | From | To |
| --- | --- | --- | --- | --- | --- |
| 2026-08-03T13:37:41 | SV-8590 | Chris Ward | status | Open | In Progress |
| 2026-08-03T13:37:44 | SV-8591 | Chris Ward | status | Open | In Progress |
| 2026-08-03T13:37:47 | SV-8592 | Chris Ward | status | Open | In Progress |
| 2026-08-03T13:37:49 | SV-8593 | Chris Ward | status | Open | In Progress |
| 2026-08-03T13:37:51 | SV-8594 | Chris Ward | status | Open | In Progress |
| 2026-08-03T13:37:53 | SV-8595 | Chris Ward | status | Open | In Progress |
| 2026-08-03T13:37:54 | SV-8596 | Chris Ward | status | Open | In Progress |
| 2026-08-03T13:37:56 | SV-8597 | Chris Ward | status | Open | In Progress |
| 2026-08-03T13:37:58 | SV-8598 | Chris Ward | status | Open | In Progress |
| 2026-08-03T13:38:01 | SV-8599 | Chris Ward | status | Open | In Progress |
| 2026-08-03T22:56:00 | SV-8590 | parth fadadu | assignee | None | parth fadadu |
| 2026-08-03T22:56:05 | SV-8591 | parth fadadu | assignee | None | parth fadadu |
| 2026-08-03T22:56:08 | SV-8592 | parth fadadu | assignee | None | parth fadadu |
| 2026-08-03T22:56:13 | SV-8593 | parth fadadu | assignee | None | parth fadadu |
| 2026-08-03T22:56:16 | SV-8594 | parth fadadu | assignee | None | parth fadadu |
| 2026-08-03T22:56:19 | SV-8595 | parth fadadu | assignee | None | parth fadadu |
| 2026-08-03T22:56:22 | SV-8596 | parth fadadu | assignee | None | parth fadadu |
| 2026-08-03T22:56:27 | SV-8597 | parth fadadu | assignee | None | parth fadadu |
| 2026-08-03T22:56:31 | SV-8599 | parth fadadu | assignee | None | parth fadadu |
| 2026-08-03T22:56:35 | SV-8598 | parth fadadu | assignee | None | parth fadadu |
| 2026-08-04T00:22:21 | SV-8591 | Bilal Muzamil | Link | None | This work item relates to SV-8818 |
| 2026-08-04T00:23:27 | SV-8645 | Bilal Muzamil | Link | None | This work item relates to SV-8819 |
| 2026-08-04T00:23:30 | SV-8672 | Bilal Muzamil | Link | None | This work item relates to SV-8820 |
| 2026-08-04T00:23:34 | SV-8592 | Bilal Muzamil | Link | None | This work item is blocked by SV-8821 |
| 2026-08-04T00:23:40 | SV-8677 | Bilal Muzamil | Link | None | This work item relates to SV-8823 |

**Read that table honestly: the last five rows are MINE.** The `Link` entries at 00:22–00:23 on 2026-08-04
are the issue links this session created when filing the six defect tickets — they bumped the `updated` date
on SV-8591, SV-8592, SV-8645, SV-8672 and SV-8677. **That is precisely the Rule-31 trap in reverse:** those
five issues *look* changed but their content is untouched, and it would be dishonest to report them as
external movement.

**External changes therefore total 20:** 10 status transitions + 10 assignee sets. **Zero** field edits of any
kind to requirement text.

## 4. Requirement text — BYTE-LEVEL proof that nothing moved (Standing Rule 50)

Not a spot-check. **All 98 pre-existing issues** (the epic + its 97 children) were re-read live and their
description text re-extracted with **the same `desc_text()` function that produced the 2026-07-31 baseline**
(`extract.py`), so the two sides are directly comparable:

| Check | Result |
| --- | --- |
| Issues compared | **98 / 98** (no sampling) |
| Descriptions **byte-identical** to the 2026-07-31 baseline | **98 / 98** |
| Summaries byte-identical | **98 / 98** |
| Descriptions found empty | **0** |
| Differences of any kind | **NONE** |

**Consequence:** every requirement quotation in `EPIC-REREAD.md` and in
`NEW-OR-CHANGED-REQUIREMENTS.md` is confirmed still accurate against live Jira as of 2026-08-04. **No case
needs a change on account of the epic.** The coverage position those documents record is unaffected.

## 5. Comments and attachments — confirmed live, not carried over

| Check (live, all 97 children) | Result |
| --- | --- |
| Total comments | **0** — no child has a single comment |
| Total attachments / inline images | **0** — no child has any attachment |

The baseline asserted 0/0; that is now **confirmed against live Jira** rather than inherited from a snapshot.
It also means the Rule-37 obligation to open and *look at* every inline image is satisfied trivially: **there
are none to look at.**

## 6. SV-8594 → SV-8599 re-read LIVE, individually

| Key | Status | Assignee | Description | Comments | Attachments | Sub-tasks | Changelog entries |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **SV-8594** | In Progress | parth fadadu | 1748 chars, **byte-identical to baseline** | 0 | 0 | none | 8 |
| **SV-8595** | In Progress | parth fadadu | 1846 chars, **byte-identical to baseline** | 0 | 0 | none | 6 |
| **SV-8596** | In Progress | parth fadadu | 1724 chars, **byte-identical to baseline** | 0 | 0 | none | 7 |
| **SV-8597** | In Progress | parth fadadu | 1987 chars, **byte-identical to baseline** | 0 | 0 | none | 6 |
| **SV-8598** | In Progress | parth fadadu | 2117 chars, **byte-identical to baseline** | 0 | 0 | SV-8780 | 7 |
| **SV-8599** | In Progress | parth fadadu | 2288 chars, **byte-identical to baseline** | 0 | 0 | none | 7 |

**Titles as read live:**

- **SV-8594** — [Reports Suite][B1] Work In Progress (WIP) report + nightly snapshot cron
- **SV-8595** — [Reports Suite][B2] Technician Utilization (TU) report
- **SV-8596** — [Reports Suite][B3] Parts Velocity (PV) report + part.last_sold_at
- **SV-8597** — [Reports Suite][B4] Inventory Value (IV) report + nightly snapshot + retention
- **SV-8598** — [Reports Suite][B5] Sales By Customer (SBC) report + dedicated permission
- **SV-8599** — [Reports Suite][B6] Sales By Representative (SBR) report + rep schema + staff dialog

**Verdict on these six: nothing to act on.** They moved to In Progress and gained an assignee; their
requirement text did not change by a single byte, so the coverage conclusions the earlier re-read drew from
them stand unaltered.

## 7. One genuinely new fact the live read surfaced — SV-8780

`EPIC-REREAD.md` recorded SV-8780 as *absent from the snapshot, therefore created after 2026-07-31*, and out
of scope by the QA lead's ruling. The live read locates it precisely:

| Key | Type | Status | Parent | Summary |
| --- | --- | --- | --- | --- |
| SV-8780 | **Story Defect** (sub-task) | **Ready to Fix** | SV-8598 | SBC report gated by its own permission |

- It is a **sub-task of SV-8598**, which is why it is **not** in the epic's 101 direct children — the child
  count is not missing it, the hierarchy simply places it a level lower.
- **It was NOT opened, read in full, or modified.** The QA lead's ruling of 2026-08-03 was verbatim
  *"Ignore this ticket."*, so the only thing recorded here is what a read-only listing of SV-8598's sub-tasks
  returns — enough to prove the child-set arithmetic is complete, and nothing more.
- Its status being **Ready to Fix** is new information since 2026-07-31 and is reported for awareness only.

## 8. What this changes for our test suite

**Nothing — and that is a verified result, not an assumption.**

- No requirement was added, edited or removed → **no new cases are needed on account of the epic**, and no
  existing case is stale on account of the epic.
- The reverse direction was checked too: every child key in the baseline still exists live, so **no case's
  `refs` anchor points at a ticket that has vanished** (Rule 43's case → requirement direction).
- The only live-build consequence is Rule 49: the branch is moving, so the re-check queue stays **OPEN**.

## OUTSTANDING — what I need from you (Standing Rule 36)

| # | What is missing | Who owes it | What it blocks | Since |
| --- | --- | --- | --- | --- |
| 1 | A ruling on the **parent placement** of the four report-suite defects. A `Bug` cannot be a child of a Story in this project, so SV-8818/8819/8820/8823 are parented to epic SV-8582 with a `relates to` link to the story the pack named. If you want story-level parents they must be `Story Defect` sub-tasks instead. | **QA lead** | Nothing is blocked — the tickets are filed and linked. This is a tidiness/reporting decision only. | 2026-08-04 |
| 2 | Confirmation on **SV-8823** (defect-pack ticket 6). Its pack file still says you asked for it *flagged for awareness rather than filed*; the instruction for this pass was to file all six and it named SV-8677 as its parent, so it **was** filed. | **QA lead** | Nothing. If you wanted it unfiled, SV-8823 is the one to close. | 2026-08-04 |
| 3 | A decision on **SV-8614** ("SBC - Story 16 - Print the report") — still **Open** for a feature the PO retired and the build does not contain. Recommendation in `SV-8614-STATE-2026-08-04.md`. **Not closed by us** — Rule 6. | **QA lead**, then PO (Chris Ward) | Our SBC print coverage position: we cannot state whether print is in or out of scope while the ticket contradicts the spec. | 2026-08-04 |
| 4 | **When QA branch `sv8582` is declared FINAL.** | Engineering (via you) | Every VIU verdict on the Report Suite is **PROVISIONAL** until then (Rule 49); the suite may not be called VIU-complete and `RECHECK-QUEUE.md` stays OPEN. | 2026-08-03 |
| 5 | Nothing else. Jira access is **working** — a live session was obtained this run and the credentials/method are now recorded in `build/ATLASSIAN-JIRA-ACCESS-METHOD.md`. Note `/tmp` is wiped on a container reset, so the session will need re-establishing (one OTP code from you) next time. | — | — | — |

