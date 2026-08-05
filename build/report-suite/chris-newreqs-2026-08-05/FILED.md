# FILED — two defect tickets, 2026-08-05

Both are **user-facing defects observed live** on `v3.5-16cf83f`, and both are filed in the **Rule-52
shape as amended today**: `issuetype` = **Story Defect** (10007) · `parent` = **the owning STORY** ·
`priority` = **Low** (Rule 53 — severity goes in the Severity field, never in Priority) · the owning
story **also linked `relates to`** · **Product Area deliberately NOT sent** (the field does not exist on
this issue type).

| Ticket | Summary | Parent story | Severity | Priority | Status |
|---|---|---|---|---|---|
| **[SV-8907](https://shopview.atlassian.net/browse/SV-8907)** | Work In Progress cannot be downloaded — a server error whenever the tab has any rows | **SV-8665** *WIP - Story 9 - Export to PDF and CSV* | High | **Low** | Open |
| **[SV-8908](https://shopview.atlassian.net/browse/SV-8908)** | Work In Progress Asset filter leaves out a vehicle that shares a unit number | **SV-8663** *WIP - Story 7 - Filters* | Medium | **Low** | Open |

## Field verification — read back live, 12 checks each, ALL PASS

| Check | SV-8907 | SV-8908 |
|---|---|---|
| HTTP 200 on read-back | PASS | PASS |
| `issuetype` = `Story Defect` | PASS | PASS |
| `issuetype` id = 10007 | PASS | PASS |
| subtask / hierarchy level −1 | PASS | PASS |
| parent is a **Story** (not an Epic) | PASS — SV-8665 | PASS — SV-8663 |
| `priority` = Low | PASS | PASS |
| Severity set | PASS — High | PASS — Medium |
| Product Area **not** sent | PASS | PASS |
| `relates to` link to the same story | PASS | PASS |
| All seven sections present in the rendered body | PASS | PASS |
| Tables rendered as real HTML (wiki markup accepted) | PASS | PASS |
| No barred content — no case id, no internal id, no TestRail reference, no provisional disclaimer | PASS | PASS |

The barred-content check was run by pattern against the **rendered** description, not the source:
`\bC3[0-9]{4}\b`, `(SBC|SBR|PV|TU|WIP|IV)-[A-Z]{3,6}-\d\d`, `testrail`, `not final|provisional|already
fixed`, `QA test case` — **0 hits in either ticket.**

## Duplicate search — what was searched, before filing

Five JQL queries, all of project SV:

| Query | Hits | Judgement |
|---|---|---|
| `summary~"plain text" OR summary~"link permission" OR description~"plain text, not a link"` | 10 | The closest is **SV-7855** *"Sales Rep: report links clickable despite View OFF (3 pages)"* — **Done 2026-07-13**, and it is about the **legacy** A/R and A/P reports, not this suite. It is the precedent that explains why Parth raised the rule at all, and it is quoted in `DELIBERATE-DECISIONS.md`. Also **SV-8292/8293/8294** — Work Orders Audit Log links shown without permission, all Done. **No open duplicate.** |
| `summary~"WO #" OR summary~"work order link"` | 350 | swept by eye for the report suite; nothing about a WIP download or the WIP asset filter |
| `summary~"filter" AND summary~"scope"` | 0 | — |
| `summary~"Work In Progress" AND summary~"filter"` | 0 | — |
| `summary~"invoice number"` | 52 | all legacy invoicing work; none about a report link |

**And the one that mattered most: SV-8907 is NOT [SV-8818](https://shopview.atlassian.net/browse/SV-8818).**
SV-8818 (Ready to Fix) is read in full and its own words scope it out: *"This happens on five of the six
new reports: Parts Velocity, Technician Utilization, Inventory Value, Sales By Customer and Sales By
Representative"*, **PDF only**, and *"Asking for the spreadsheet version of exactly the same view works
perfectly."* Ours is **Work In Progress only, both formats, and it fails with a single row.** Different
defect; the distinction is stated inside SV-8907 so a triager does not have to work it out.

## What is NOT filed, and why

| Finding | Why not filed |
|---|---|
| **The WIP report paginates in pages of 100**, so the new requirement's parenthetical *"loads the complete set of open jobs in one request"* is not how the build behaves | **This is a specification wording problem, not a product defect.** The requirement's substance — the filter lists span every open job — **is met** (proven set-equal both ways). Chris is the one to fix the sentence. Raised as an ask. |
| **The link/plain-text decision is made in the browser, and the API returns the target ids to everyone** | **Not a defect at all under Rule 24**, and there is nothing of the front-end-blocks/back-end-allows shape here — an identifier in a payload is not an action. |
| **Parts Velocity S1-N1 still describes role-based report access** while S1-R4 in the same version describes the single-permission model | Chris's text to correct; no case cites S1-N1. Raised as an ask. |
| **The negative half of the link rule** — whether the build actually plain-texts the element | **Nothing to file: it was never observed.** See `FINDINGS.md` §4. Filing on inference is what got SV-8821 closed as not-reproducible. |

**Rule 51 check, item by item: neither filed ticket is API-related.** Both faults occur through the
product's own screens — the three-dot download menu and the Asset filter — so the reachability test puts
them squarely on the user-facing side. The technical characterisation (a 500, a filter endpoint) lives in
section 7 of each ticket and does not change that. **No API-only finding arose in this pass, so
`API-ASK.md` records that explicitly rather than being omitted.**
