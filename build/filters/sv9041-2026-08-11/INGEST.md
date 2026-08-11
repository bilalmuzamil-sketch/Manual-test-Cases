# SV-9041 — FULL INGEST — 2026-08-11

**Read live and in full: description, every comment, every attachment (downloaded and looked at),
changelog, links, parent.** Rule 37. **Zero Jira writes** — no ticket created, no comment, no
transition, no field edit.

---

## The ticket, as it stands live

| Field | Value |
|---|---|
| Key | **[SV-9041](https://shopview.atlassian.net/browse/SV-9041)** |
| Summary | Expand/collapse filter toggle visibility |
| Issue type | **Task** (id 10005, hierarchy level 0) — *not* a Story, *not* a Story Defect |
| **Parent** | **SV-8785** — the Filters **epic**, directly |
| Status | **TESTING QA** |
| Priority | Medium |
| Reporter / Assignee | **Dusan Radulovic** (both) |
| Created | **2026-08-07T08:28:17.103−0500 = 13:28:17Z** |
| `updated` (surface) | 2026-08-11T07:59:16.356−0500 = 12:59:16Z |
| Resolution | none |
| Labels | `FS-Filters`, `QAcomplete_Ahtasham_Amjad` |
| Product Area | Platform Features |
| Issue links | **none** |
| Comments | 1 |
| Attachments | 1 |

## Description — VERBATIM, in full (Rule 25)

> Expand/collapse filter toggle should only be visible if there is more then 1 filter present on the
> page. If not then it shouldn't be visible and the filter is always shown

That is the entire description. The typo *"more then"* is his; it is quoted as written.

**Parsed into its two limbs:**

1. **Positive:** the toggle is visible **only if** the page has **more than one** filter.
2. **Negative:** otherwise it is **not visible at all**, and the filter bar is **always shown**.

Note limb 2 is not merely "the toggle is disabled" — it is **absent**, and the bar is permanently on
display. That distinction is what makes a single-filter page a **PASS with no control**, rather than
a page missing a control.

## Comment — 1 of 1, verbatim (Ahtasham Amjad, 2026-08-11T07:58:46.701−0500 = 12:58:46Z)

> QA Result:
> @Dusan Radulovic
> This is working as expected
> Expand/collapse filter toggle is only visible if there is more then 1 filter present on the page ✅
> **QA Status: Passed**
> cc: @Stefan Mitrovic

**Read correctly (Rule 12/57):** this is **another QA's** live observation, not ours, and under Rule
57 a build observation does not set expected behaviour in any case. Its value here is different and
real — it tells us the behaviour is **built and working**, so **no defect ticket is warranted and no
`EXPECT FAIL` marker belongs on either case.**

## Attachment — downloaded and LOOKED AT, and it is the most useful thing on the ticket

`image-20260811-125810.png` · 236,141 bytes · 1909 × 1003 · added by Ahtasham Amjad
2026-08-11T07:58:46−0500. Local copy: `evidence/SV-9041-att-59679.png`.

**What the screenshot actually shows — and it is NOT the Work Orders page:**

- URL bar: **`sv8785.qa.shopview.com/parts/part-sales`** — the QA branch, **Parts → Part Sales**
- Page heading **"Part Sales"**; toolbar row on the right reads **Search · Status ⌄ · New Part Sale**
- **Exactly ONE filter is present: `Status`**
- **There is NO expand/collapse toggle anywhere in that toolbar**
- The table (Number / Status / Customer / Asset / VIN-Serial # / Created By / Total Price / Created
  On / Parts / Returns) sits directly below, with no collapsed filter row

**Why this matters more than the description does.** The description says *"the page"* without naming
one. The evidence chosen to prove the ticket is a **Parts** page. So in practice the rule has already
been applied beyond Work Orders — which is precisely why **C43562 (Parts and Reports parity) is the
case that is genuinely contradicted**, and why item 10a of the Branko addendum asks him to confirm
the reach explicitly rather than us inferring it.

## Changelog — 7 entries, and the one that matters is the one that is ABSENT

Read **live** (`evidence2/SV-9041-changelog-LIVE.json`), not taken from the killed pass's copy.

| When (−0500) | Who | Field |
|---|---|---|
| 2026-08-07T08:28:17.124 | Dusan Radulovic | IssueParentAssociation `None` → `SV-8785` |
| 2026-08-07T08:30:19.678 | Dusan Radulovic | status Board Backlog → In Progress |
| 2026-08-07T08:30:35.958 | Dusan Radulovic | status In Progress → TESTING QA |
| 2026-08-07T09:11:05.268 | Dusan Radulovic | status TESTING QA → In Progress |
| 2026-08-07T10:23:12.901 | Dusan Radulovic | status In Progress → TESTING QA |
| 2026-08-11T07:58:46.657 | Ahtasham Amjad | Attachment added |
| 2026-08-11T07:59:16.356 | Ahtasham Amjad | labels `''` → `FS-Filters QAcomplete_Ahtasham_Amjad` |

**`description` edits: ZERO.** Therefore:

> ### The condition was stated at creation — **2026-08-07T13:28:17Z** — and has never been amended.

**The surface `updated` date of 11 August is a label edit by a different person.** Dating the
requirement from it would have made the ticket look four days newer than it is. That is **Rule 31
trap (b)** and it is exactly why the changelog is read rather than the timestamp.

**A second, subtler point worth recording:** four of the seven entries are status flips on 7 August
(TESTING QA → In Progress → TESTING QA). Under **Rule 61** none of that is evidence about the build,
and none of it was used as such.

## Links and parent

- **Issue links: none.** No `relates to`, no `blocks`, nothing.
- **Parent: SV-8785, the epic itself.** SV-9041 is a `Task` (level 0), which *may* take an Epic
  parent — unlike a `Story Defect`, which may not. So its shape is valid and **is not ours to
  change** (Rules 38/52/53). We did not touch it.
