# Schedule — SOURCE CURRENCY, 5 August 2026

Established **before** any other work, per Standing Rule 31. Every source was fetched live this
run; nothing below is taken from memory or from a cached note.

## The verdict table

| # | Source | Identifier | Version / last-updated (live) | Our baseline | Checked | Verdict |
|---|---|---|---|---|---|---|
| 1 | **Specification** | Confluence page `713031682` "Schedule" | **version 23**, last edited **2026-07-30T10:40:32Z** by Branko Cicovic | version 23 | 2026-08-05 12:04Z | **CURRENT** |
| 2 | **Epic** | `SV-8685` Schedule — Technician Scheduling Module | 26 direct children; changelog last entry **2026-08-04T07:07:01** | 15 stories + SV-8812 + our 10 bugs | 2026-08-05 12:05Z | **CURRENT** (our recorded child count was wrong — see below) |
| 3 | **Story defects under the epic's stories** | subtasks of `SV-8686`…`SV-8700` | **22 defects**, 10 of them raised **since our 4 August ingest** | 12 | 2026-08-05 12:07Z | **STALE — now refreshed** |
| 4 | **Our 10 defect tickets** | `SV-8848` … `SV-8857` | **all 10 still Open**, priority Low, parent SV-8685 | Open | 2026-08-05 12:06Z | **CURRENT** |
| 5 | **The QA build** | `https://sv8685.qa.shopview.com` | **`v3.5-be42149`**, last-modified **Wed 05 Aug 2026 08:09:19 GMT**, etag `70e496609e155994b93f515db32d0289` | v3.5-4873abe (4 Aug) | 2026-08-05 12:01Z and 12:09Z | **MOVED — and NOT OBSERVABLE this run (no session)** |
| 6 | **Designs** | none — Schedule is a spec-only project (user confirmed 2026-07-21); the Claude prototype `Schedule.dc.html` is the design of record | unchanged | same | 2026-08-05 | **CURRENT** (no Rule-35 fetch queue is open for Schedule) |
| 7 | **Engineering tech plan** | ingested `build/schedule/tech-plan-2026-07-29/` | unchanged | same | 2026-08-05 | **CURRENT** |
| 8 | **PO answers** | Branko, `build/schedule/branko-answers-2026-07-31/` | no newer answer file; no new comment on the epic or any story | same | 2026-08-05 | **CURRENT** |

## 1 — The specification: CURRENT, and proven so exactly, not by version number

Live version is **23**; our baseline is **23**. Standing Rule 50 does not let us stop at the version
number, and Rule 31(a) warns that a page's in-body "Version" field can sit still while the real page
advances. So the live page body was fetched (`58,584` bytes of storage-format HTML,
sha256 `9e426a746f64a81c…`, kept as `evidence/spec-live-v23.html`) and word-diffed against our mirror
`build/schedule/spec-current-2026-07-31/Schedule-spec-current.md`:

- live: **5,185** words · mirror: **5,827** words · similarity **0.9410**
- **runs of 6 or more consecutive words present in the live page and ABSENT from our mirror: 0**
- runs present in the mirror and absent from live: **1**, and it is our own ingest header
  ("*Schedule — current Confluence spec, verbatim ingest … Confluence version 23 …*")

**So there is no spec content we do not hold.** The word-count gap is our mirror's added
headings and ingest banner, not missing requirements. **No spec diff is required, and no
requirement-verdict rows are owed under Rule 43.** The 128-requirement baseline stands.

## 2 — The epic: CURRENT, but our own recorded child count was wrong

Checked two independent ways with no paging remainder (Rule 37 Tier 1):

- `parent = SV-8685` → **26** issues
- `"Epic Link" = SV-8685` → **26** issues
- **the two key sets are equal in both directions** (A−B empty, B−A empty)

Composition: **15 stories** `SV-8686`…`SV-8700`, all **Ready for QA** · **`SV-8812`** Task, **Done**
(the QA environment) · **our 10 Bug tickets** `SV-8848`…`SV-8857`, all **Open**.

**CORRECTION TO OUR OWN RECORD.** `CLAUDE.md` says the epic is *"now 28 children … +12 Bug tickets
SV-8826…SV-8841"*. That is wrong in two ways:

1. The epic has **26** direct children, not 28.
2. The 12 tickets `SV-8826`…`SV-8841` are **not children of the epic at all**. They are
   **`Story Defect` subtasks parented to the individual stories** (hierarchy level −1), so they sit
   one level below the epic's children. They were never in the 26. They are also not "Bug" tickets —
   they are `Story Defect`s.
3. The range `SV-8826`–`SV-8841` is **16 tickets, not 12**. Twelve are Mudassir Qamar's Schedule
   defects; **`SV-8828` and `SV-8832` are Ahtasham Amjad's FILTERS defects** (parented to `SV-8795`,
   a Filters story) and **`SV-8836` and `SV-8838` are Ryan Fyfe's unrelated Bugs** with no parent.
   Our note swept four foreign, non-Schedule tickets into a Schedule count.

**Epic changelog since our ingest: nothing that changes a requirement.** The last two entries are
`2026-08-04T06:42:02` Stefan Vukovic setting **QA Branch** to `https://sv8685.qa.shopview.com`, and
`2026-08-04T07:07:01` Stefan Vukovic setting **Severity = High** and a **QA Test Plan** link
(`powertools.shopview.co…`). Both are administrative — exactly the Rule-31(b) trap, where an
`updated` date moves but no content did. **No story description changed, no story status moved, and
no comment was added to any of the 15 stories.**

## 3 — Story defects: our count was 8 tickets out of date

There are now **22** `Story Defect` subtasks under the 15 Schedule stories. **Ten arrived after our
4 August ingest:**

| Ticket | Status | Story | Raised by | Created | Summary |
|---|---|---|---|---|---|
| [SV-8863](https://shopview.atlassian.net/browse/SV-8863) | **Ready to Fix** | SV-8686 | Ayesha Khan | 04 Aug 15:01 | Schedule opens in Week view by default instead of Day view |
| [SV-8864](https://shopview.atlassian.net/browse/SV-8864) | Open | SV-8697 | Ayesha Khan | 04 Aug 15:29 | Conflict pop-up opens misaligned — position shifts for each conflict |
| [SV-8865](https://shopview.atlassian.net/browse/SV-8865) | Open | SV-8692 | Ayesha Khan | 04 Aug 16:05 | Recurring (series) shift can't be opened or deleted in Month view |
| [SV-8867](https://shopview.atlassian.net/browse/SV-8867) | Open | SV-8692 | Ayesha Khan | 04 Aug 16:28 | Recurring (series) shift can't be reassigned in Week and Month view |
| [SV-8868](https://shopview.atlassian.net/browse/SV-8868) | **Ready to Fix** | SV-8687 | Ayesha Khan | 04 Aug 18:47 | Schedule sidebar Status filter returns no work orders for most statuses |
| [SV-8869](https://shopview.atlassian.net/browse/SV-8869) | Open | SV-8688 | Ayesha Khan | 04 Aug 19:15 | No drag feedback when dragging a work order onto the grid in Day view |
| [SV-8870](https://shopview.atlassian.net/browse/SV-8870) | Open | SV-8688 | Ayesha Khan | 04 Aug 19:24 | Cannot create a shift by dragging a work order onto a day in Month view |
| [SV-8873](https://shopview.atlassian.net/browse/SV-8873) | **Ready to Fix** | SV-8687 | Mudassir Qamar | **05 Aug 04:19** | Sidebar search returns no results when you type a technician's full name |
| [SV-8874](https://shopview.atlassian.net/browse/SV-8874) | Open | SV-8686 | Mudassir Qamar | **05 Aug 05:26** | Grid search hides non-matching shifts instead of fading them |
| [SV-8877](https://shopview.atlassian.net/browse/SV-8877) | Open | SV-8697 | Mudassir Qamar | **05 Aug 06:21** | Conflict list does not show which technician or day each conflict is on |

Seven of the 22 now read **Ready to Fix**: SV-8826, SV-8831, SV-8840, SV-8841, SV-8863, SV-8868,
SV-8873. These are coverage inputs, not replies (Rule 45(d)); what they mean for our cases is worked
through in `FINDINGS.md`.

## 4 — Our 10 tickets: all still Open, and only a label was touched

| Ticket | Status | Resolution | Priority | Parent | Story link | Comments |
|---|---|---|---|---|---|---|
| [SV-8848](https://shopview.atlassian.net/browse/SV-8848) | Open | none | Low | SV-8685 | relates to SV-8686 | 0 |
| [SV-8849](https://shopview.atlassian.net/browse/SV-8849) | Open | none | Low | SV-8685 | relates to SV-8692, SV-8865 | 0 |
| [SV-8850](https://shopview.atlassian.net/browse/SV-8850) | Open | none | Low | SV-8685 | relates to SV-8693 | 0 |
| [SV-8851](https://shopview.atlassian.net/browse/SV-8851) | Open | none | Low | SV-8685 | relates to SV-8700 | 0 |
| [SV-8852](https://shopview.atlassian.net/browse/SV-8852) | Open | none | Low | SV-8685 | relates to SV-8695 | 0 |
| [SV-8853](https://shopview.atlassian.net/browse/SV-8853) | Open | none | Low | SV-8685 | relates to SV-8686 | 0 |
| [SV-8854](https://shopview.atlassian.net/browse/SV-8854) | Open | none | Low | SV-8685 | relates to SV-8687 | 0 |
| [SV-8855](https://shopview.atlassian.net/browse/SV-8855) | Open | none | Low | SV-8685 | relates to SV-8691 | 0 |
| [SV-8856](https://shopview.atlassian.net/browse/SV-8856) | Open | none | Low | SV-8685 | relates to SV-8694 | 0 |
| [SV-8857](https://shopview.atlassian.net/browse/SV-8857) | Open | none | Low | SV-8685 | relates to SV-8687 | 0 |

**Not one of the ten is fixed.** The only change since we filed them is Mudassir Qamar adding the
label `FS-Schedule` to all ten (05 Aug 03:21–04:02, read from each changelog). No status transition,
no resolution, no priority change, no comment. The filing shape is intact on all ten: priority
**Low** (Rule 53), parent **the epic** (Rule 52), owning story attached with **relates to**.

Ayesha also linked her **SV-8865** to our **SV-8849** herself on 04 Aug 16:08.

## 5 — The build: MOVED, and we could not get into it

| Field | 4 August pass measured | Serving now (read twice this run) |
|---|---|---|
| `<meta name="app-version">` | `v3.5-4873abe` | **`v3.5-be42149`** |
| `index.html` last-modified | Tue 04 Aug 2026 14:47:39 GMT | **Wed 05 Aug 2026 08:09:19 GMT** |
| etag | `9b4b1fc776ebbfb04a9a0ca051d847f7` | **`70e496609e155994b93f515db32d0289`** |

Read at **12:01:46Z** (start) and **12:09Z** (mid) — `index.html` **byte-identical between the two
reads**, so no further redeploy happened while this pass ran. Headers kept as
`evidence/index-headers-start-1201Z.txt`, the page itself as `evidence/index-start-1201Z.html`.

**We have no session.** The only Schedule cookie set we hold is from **2026-08-04 11:31 UTC**, about
24 hours 30 minutes old, and it is dead:

```
GET https://sv8685api.qa.shopview.com/api/auth/me/fe-permissions
→ HTTP 401 {"error":"sso_required","sso_redirect_url":"https://auth.qa.shopview.com/login?..."}
```

The same 401 comes back for the Filters (`sv8785`) and Report Suite (`sv8582`) cookie sets, and the
Filters cookie also 401s against the Schedule API — so this is the ordinary ~24-hour expiry across
the whole `.qa.shopview.com` estate, compounded by this morning's Schedule deploy. **It is not a
Schedule-specific fault and it cannot be worked around from here.**

**Consequence, stated plainly (Rule 12):** **0 of the 165 rows were re-observed.** Every verdict in
`viu-2026-08-04/RECHECK-QUEUE.md` remains **PROVISIONAL AND UNCONFIRMED** against `v3.5-be42149`,
and every provenance line on every case still names a build that is no longer being served. Nothing
in this pass infers a verdict to fill that gap.

## What is needed to finish

**Fresh cookies for `https://sv8685.qa.shopview.com`** — `sv_sso_session`, `PHPSESSID` and
`cf_clearance` for domain `.qa.shopview.com`, placed in `/tmp/schedule-viu/cookies.json` in the same
shape as before. Nothing else is missing: the spec, the epic, the story defects, the tickets and the
whole TestRail side are all current and proven current.
