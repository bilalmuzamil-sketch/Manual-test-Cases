# Source currency — Chris Ward answer-sheet ingest, 2026-08-10

**Standing Rules 31 (currency of every source) and 59 (re-read before writing).**
This pass is **READ-ONLY**: nothing was written to TestRail, Jira, Confluence or the application.

Sources read at pass start: **2026-08-10T15:05Z–15:16Z**.
There is **no write phase in this pass**, so Rule 59's second read is recorded as *not applicable —
nothing was written*. Every proposed change in `PROPOSED-CHANGES.md` is unexecuted and must have its
sources re-read at the moment it is actually applied.

---

## 1 · The answer sheet itself

| Item | Value |
|---|---|
| File | `Questions-for-Chris-Ward_Report-Suite_2026-08-06.xlsx` |
| Google Drive id | `1ail4jjCw7uNump_khBqWdeVxSvYE2g1y` |
| Owner | bilal.muzamil@shopview.com |
| Created | 2026-08-06T16:35:13.941Z |
| **Last modified** | **2026-08-10T15:01:38.905Z** (today — this is Chris's return) |
| Size reported by Drive | 220,177 bytes |
| Size actually downloaded | **220,177 bytes** — byte-for-byte match, so the download is complete |
| sha256 (first 16) | `6269d82df9bdf186` |
| Verdict | **CURRENT** |

**How it was read.** Downloaded as raw bytes and parsed cell by cell with `openpyxl` — *not* read from
the Drive preview snippet, which truncates. **98 populated cells across 3 worksheets**, every one
enumerated. Checked additionally for (a) any cell beyond column F — **none**, (b) embedded cell
comments — **none**, (c) Drive-level comments via `read_file_content(includeComments=true)` —
**none returned**.

**The QA-only tab was correctly withheld.** Our workbook had 4 sheets; the returned file has 3
(`1 Start here`, `2 Decisions`, `3 Just a tick`). The internal mapping tab was not forwarded, as
intended.

---

## 2 · The six report specifications — ⚠️ ALL SIX HAVE MOVED

Read live over the Atlassian MCP on 2026-08-10, using the **Confluence version number**, never the
"Version" written inside the page body (Rule 31's trap).

| Report | Page id | Our sheet recorded (2026-08-06) | **LIVE NOW** | Moved? |
|---|---|---:|---:|---|
| Sales By Customer **(handed off)** | 577634305 | 15 | **16** | **+1** |
| Technician Utilization **(handed off)** | 641400833 | 6 | **7** | **+1** |
| Work In Progress **(handed off)** | 703660034 | 9 | **10** | **+1** |
| Sales By Representative | 585629698 | 17 | **18** | **+1** |
| Parts Velocity | 620888066 | 5 | **6** | **+1** |
| Inventory Value | 720142338 | 4 | **5** | **+1** |

**Every one of the six is exactly one version ahead of what our question sheet recorded, and all six
report `lastModified` "Aug 07, 2026".** The brief's expected figures (SBC 15 · TU 6 · WIP 9 · SBR 17 ·
PV 5 · IV 4) were the values as at 2026-08-06 and are **all now stale by one**. This is the third time
Chris has edited the specs around one of our passes, which is exactly why Rule 31 requires verifying
rather than trusting.

**What the new version contains.** All six carry a new change-log row dated **2026-08-06**, reporter
`@claude`, and all six cite the same trigger in the Notes column: **"QA review workbook (2026-08-06)"**
— that is our question sheet. The change text, verbatim from Technician Utilization v7:

> *"Section 3 tidy-ups (QA review workbook 2026-08-06): reworded the Location-column visibility to the
> access-gated, column-selector-toggleable rule; added the export size-cap requirement (10,000 rows)
> with the verbatim 'too large to export' message."*

**So the Section 3 requests were actioned in the documents even though all seven Section 3 cells came
back blank.** That is a statement about what the documents now say — see `ANSWERS-INGESTED.md` §3 for
what was and was not actually completed, which is not uniform.

**Verdict for all six: CURRENT as read, but our own baselines are STALE by one version.** No case in
the suite has been re-checked against these new versions, and this pass did not do that either — it is
an answer ingest, not a spec-delta pass. **A spec-delta pass over the six new versions is owed** and is
listed in `FOLLOW-UP-QUESTIONS.md` and `THREE-REPORTS-FIRST.md`.

### A method warning worth recording (Rule 27 — it will save the next pass an hour)

**Confluence CQL text search cannot be trusted to establish whether a phrase is present in the current
page.** Probing `text ~ "not user-toggleable"` returned **all six pages**, including Technician
Utilization, whose full body demonstrably does **not** contain that phrase. A nonsense control phrase
correctly returned 0, so the filter is running — but `text ~` does **word** matching, and even the
escaped exact-phrase form returned five pages including one that lacks the phrase (stale index and/or
tokenising). **Every presence/absence claim in these deliverables comes from a fetched page body, never
from a search hit.**

---

## 3 · TestRail — read-only

Pulled live 2026-08-10 with `get_cases` and a **paged** `get_sections` (626 sections exist; an unpaged
call silently returns 250 and finds nothing — the known trap in playbook §J).

| Measure | Value |
|---|---|
| Cases live under group 4281 | **485** |
| **Ours** (`created_by = 3`, Bilal Muzamil) | **476** |
| Vladimir Tomovic's (`created_by = 1`) | **9** — hands off, Rule 38 |

**The foreign count has grown from 5 to 9 since 2026-08-06.** Four are new: C43567, C43568 (Parts
Velocity), C43572 (Work In Progress), C43573 (Inventory Value). They were **not touched, not counted as
ours, and not edited**. One of them bears on today's answers and is reported in
`DEFECTS-FOR-PERMISSION.md` §4.

**No write of any kind was made.** `update_case`, `add_case`, `delete_case`, run writes and result
writes were all **zero**. No snapshot/restore was needed because nothing was written.

---

## 4 · The build — NOT consulted, deliberately

**No application call was made, and `quick-login` / `switch-user` were not called**, per the brief and
because both rotate the shared session and would sign out concurrent workers.

This is not merely an access limitation, it is the **governing discipline of this pass (Rule 58)**: an
answer sheet is a document and is read as a document. The 2026-08-05 expected-behaviour damage entered
through an ingest pass exactly like this one, where an ambiguous PO answer met an observed build and
the observation won. **Where Chris's answer is ambiguous here, it has been left ambiguous and sent
back to him — not resolved by looking at the product.**

Consequence, stated plainly: **every existing build-dependent verdict in the Report Suite remains
PROVISIONAL and unrefreshed.** Our last readiness record (`READINESS-2026-08-06.md`) already states
**0 of 476 cases have been checked against build `v3.5-f77875c`**. This pass does not change that
figure and does not claim to.

---

## 5 · Epic and designs

**Epic SV-8582 was not re-read** (Rule 37 Tier 1 — no claim in these deliverables rests on it, and a
full re-read is expensive and user-gated).

**Designs: ABSENT.** The Report Suite is a spec-only project; there is no Figma file and no design
export. Under Rule 57 as amended (five sources: PRD · epic stories · PO answers · design · Figma),
sources (d) and (e) do not exist for this project, so expected behaviour here comes from the PRD, the
epic stories and Chris's answers only.

---

## 6 · Summary table

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| Chris's answer sheet | Drive `1ail4jjCw…` | modified 2026-08-10T15:01:38Z | 2026-08-10 | **CURRENT** |
| Sales By Customer spec | Confluence 577634305 | **v16** | 2026-08-10 | CURRENT (our baseline stale) |
| Technician Utilization spec | Confluence 641400833 | **v7** | 2026-08-10 | CURRENT (our baseline stale) |
| Work In Progress spec | Confluence 703660034 | **v10** | 2026-08-10 | CURRENT (our baseline stale) |
| Sales By Representative spec | Confluence 585629698 | **v18** | 2026-08-10 | CURRENT (our baseline stale) |
| Parts Velocity spec | Confluence 620888066 | **v6** | 2026-08-10 | CURRENT (our baseline stale) |
| Inventory Value spec | Confluence 720142338 | **v5** | 2026-08-10 | CURRENT (our baseline stale) |
| TestRail cases | group 4281 | 485 live / 476 ours | 2026-08-10 | CURRENT |
| Epic SV-8582 | Jira | not re-read | — | **NOT CHECKED** (nothing rests on it) |
| Designs / Figma | — | do not exist for this project | — | **ABSENT** |
| The build | `sv8582.qa.shopview.com` | not consulted, deliberately | — | **NOT CONSULTED** (Rule 58) |
