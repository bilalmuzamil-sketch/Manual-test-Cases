# The zeros-row requirement — verified live before anything was filed

**Why this document exists.** `build/report-suite/questions-2026-08-06/README.md` (commit `2902f366`)
claimed the Sales By Customer description requires a totals row of zeros when nothing matches, and says
so twice — which contradicts `build/report-suite/full-viu-2026-08-06/NO-SOURCE-DEFECTS.md` item 2, which
says no requirement covers it. **The brief for this task required the requirement to be verified from the
live Confluence page before a ticket was filed, and to stop and report instead of filing if the text did
not say what was claimed.** It does say it. This file is the proof, written before the ticket.

## Source currency (Rules 31 + 59)

| Source | Identifier | Version / state | Read at | Verdict |
|---|---|---|---|---|
| Sales By Customer specification | Confluence page **577634305** | **Confluence version 15**, edited 2026-08-05T17:53:06.664Z, HTTP 200, 77 407 chars of storage | 2026-08-06 | **CURRENT** |
| Owning story | **SV-8616** "SBC - Story 18 - Filter by customer" | Story, hierarchy level 0, status Open, parent = epic SV-8582, HTTP 200 | 2026-08-06 | **CURRENT** |
| Jira duplicate search | six JQL queries (below) | HTTP 200 each | 2026-08-06 | **CURRENT** |
| TestRail | C30173, C30114 | read live, pre-write snapshots in `snapshots/` | 2026-08-06 | **CURRENT** |
| **The build** | `sv8582.qa.shopview.com` | **NOT OBSERVED.** The shared sign-in expired estate-wide at ~11:37Z; `quick-login` and `switch-user` were **deliberately not called** (both rotate the session a sibling worker shares) | 2026-08-06 | **UNAVAILABLE** |

The version number used is the **Confluence page version**, never the version written inside the page
body (Rule 31's trap (a)).

## The requirement, quoted verbatim from the live page

It is stated **three** times, not twice.

**1 · `S18-R10`** — the export surface:

> If an export (CSV or PDF) is triggered while the active filters match no customers — for example, no
> customer is selected — the export still downloads, containing the column headers and a totals row of
> zeros, with no data rows and no warning.

**2 · `S18-N1`** — the screen surface (a negative case under Story 18):

> When no customer is selected (every customer cleared), the report shows the empty state (Story 17) and
> the totals row shows zeros.

**3 · the Story 16 placeholder note**, which points at Story 18 and restates the export half:

> The export-narrowing behavior that previously lived here (an export contains exactly the customers
> currently shown; an empty selection still downloads a headers-plus-zero-totals file) moved into Story 18
> (S18-R7, S18-R10).

Extracted text: `evidence/sbc-v15-zeros-quotes.txt`.

### One precision correction to the question-sheet README

It cited the pair as **"near S18-R10/R11"**. The second requirement is **`S18-N1`**, not `S18-R11`.
`S18-R11` is a different requirement entirely — *"The Customer filter is applied on the server. Changing
the selection re-fetches the matching customers as a fresh first page…"*. The claim was right; the anchor
was one line off, and an anchor that does not exist is the kind of citation Rule 25 exists to stop.

## So both surfaces are documented, and the surfaces are different requirements

Rule 40: this requirement spans **two** surfaces and each has its own anchor.

| Surface | Anchor | What it requires |
|---|---|---|
| On screen | **S18-N1** | empty state **and** a totals row of zeros |
| CSV and PDF download | **S18-R10** | headers **and** a totals row of zeros, no data rows, no warning |

## What our own records got wrong, and why it mattered

`full-viu-2026-08-06/FINDINGS-SESSION2.md` §3.2 removed the zeros assertion from **C30114** and
**C30173** on the stated ground that *"No requirement says what the totals row does when nothing
matches"*. That premise is false against the live document, and it was false against SBC v15, which was
already published at 2026-08-05T17:53Z — **before** that session ran.

The consequence is the reverse of the usual failure. Nothing was rewritten to match the build; instead
**two correctly-sourced assertions were DISARMED** — replaced with a tester note saying the description
is silent and telling the tester not to fail either way. A case that cannot fail is not a test (Rule 57),
and both cases were left **citing in their own provenance line the very requirement that contradicts the
note in their body**.

## The observation, and exactly how strong the evidence is

Established by the 2026-08-06 session-2 pass on build **`v3.5-7168d14`** (`index.html` last-modified
Thu 06 Aug 2026 08:32:37 GMT; live drives ran ~08:33Z–09:20Z, recorded in `FINDINGS-SESSION2.md` §2).

**⚠️ The task brief said the observation was made on `v3.5-16cf83f`. That is wrong, and the pass itself
corrected it:** the branch redeployed at 08:32:37Z, eight minutes into that pass, and all 69 build lines
it wrote were re-stamped to `v3.5-7168d14`. Both C30173 and C30114 read `Last checked against build
v3.5-7168d14 on 8/6/2026` live today, which corroborates it. The branch has since redeployed **once**
more, to `v3.5-f77875c` (last-modified Thu 06 Aug 2026 10:43:37 GMT) — not twice.

| Half | Evidence | Strength |
|---|---|---|
| **On screen — no totals row** | `full-viu-2026-08-06/evidence/2026-08-06-session2/sbc9.json` → `afterClear` = `{"label":"None","body":" \| ","totals":null,"n":0}`, and the screenshot `sbc-empty-state.png`, which shows the column headings, the Customer filter reading **None**, the message *"No sales data found for the selected filters."* and **no Totals line** | **STRONG — a DOM capture and a picture** |
| **The control that rules out a general fault** | `sbc1.json` → same report, same date range, customers included: 6 rows and a totals row present, CSS class `q-tr report-totals-row`, text `Totals … 0.0 $1,699.52 … 90.5% $1,877.99`. Only the customer selection changed between the two captures | **STRONG** |
| **The download — headers and nothing else** | asserted in `FINDINGS-SESSION2.md` §3.2 (*"the download carries **headers and nothing else**, confirmed"*) and in `NO-SOURCE-DEFECTS.md` item 2 (*"The same in a downloaded spreadsheet: headings and nothing else"*) | **WEAKER — a recorded observation whose raw file was NOT retained.** The only export artefacts kept in that evidence folder (`sbc6.json`) are the two downloads taken **with** data |

The ticket asserts both halves, because both are recorded observations by the worker who drove them
live. **The evidence asymmetry is stated here rather than smoothed over**, and it is reported to the QA
lead: if the download half is ever challenged, the screen half is the one that can be proven from the
files we kept.

## An unresolved ambiguity in our own evidence — NOT asserted anywhere

`sbc7.json` contains `emptyBody: " | "` immediately followed by
`totalsInEmpty: " | Totals | | | 0.0 | $1,979.40 | … | 95.5% | $4,662.98"` — that is an **empty table body
with a fully populated, non-zero totals row**, which cannot both be true of the same state as
`afterClear`'s `totals: null`.

The likeliest reading is that these are two different empty states — an empty **date range** versus an
empty **customer selection** — in which case a stale non-zero totals row over a range that matches
nothing would be a **second, separate defect**. The harness script that produced `sbc7.json` is not in the
repository, so the capture's meaning cannot be settled from what we hold, and **the app is unreachable
today**. It is therefore recorded as a question for the next live pass and **asserted nowhere** (Rule 12).

## Duplicate search — six JQL queries, run before filing

| # | JQL | Result |
|---|---|---|
| A | `project = SV AND text ~ "totals row" ORDER BY created DESC` | 50 hits, none about a missing totals row on Sales By Customer |
| B | `project = SV AND text ~ "zeros"` | 50 hits, none matching |
| C | `parent = SV-8616` | **1** — SV-8962, the Customer filter icon/label defect. Different assertion |
| D | `project = SV AND text ~ "empty state" AND text ~ "Sales By Customer"` | 18 hits, none matching |
| E | `project = SV AND issuetype = "Story Defect" AND text ~ "Sales By Customer"` | 50 hits, none matching |
| F | `project = SV AND summary ~ "totals row"` | 11 hits — nearest neighbours are **SV-8926** (Inventory Value totals row *label*) and **SV-8977** (Sales By Representative totals row *sticky position*); neither is this |
| G | `project = SV AND parent in (SV-8598,SV-8615,SV-8616,SV-8617,SV-8618)` | 3 — SV-8965, SV-8962, SV-8780. None matching |

Also considered and rejected as a duplicate: **SV-8930** *"Inventory Value shows an empty table with no
message when nothing matches"* — a different report, and about a missing **message**, not a missing
totals row. **No duplicate exists.**
