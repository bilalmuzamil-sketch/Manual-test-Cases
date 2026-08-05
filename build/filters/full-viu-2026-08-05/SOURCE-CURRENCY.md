# SOURCE-CURRENCY — Filters full live VIU, 2026-08-05

Standing Rule 31 pre-flight, run before any observation, and Standing Rule 59's second read
run again immediately before the writes began.

| Source | Identifier | Version / last updated | Checked | Verdict |
|---|---|---|---|---|
| Specification | Confluence page **572030978** "Filters" | **version 18**, last edited 2026-08-04T18:19:21Z, comment *"Date-range filter: reflect current in-app default range and standard predefined ranges"* | 19:56Z and again 21:34Z | **CURRENT** |
| Epic + child stories | **SV-8785** | **23 direct children**, verified two independent ways with equal key sets | 19:57Z | **CURRENT** |
| Defect tickets cited by our cases | SV-8824, SV-8828, SV-8832, SV-8843, SV-8844, SV-8845, SV-8846, SV-8847, SV-8871, SV-8875, SV-8883, SV-8903, SV-8904, SV-8906 | each read live individually | 19:58Z and again 21:34Z | **CURRENT** |
| Build | `sv8785.qa.shopview.com` | **`v3.4.2-d00239b`**, last-modified Tue 04 Aug 2026 22:51:02 GMT, etag `b9ab1d41718b5e871432064ed914e2e7` | 19:53Z · 21:00Z · 21:34Z, `index.html` **byte-identical by sha256 all three times** | **CURRENT — no redeploy under this pass** |
| Designs (Figma) | file `DR4gEODShYgJqkozs3mF5q` | no Rule-35 fetch queue is open for Filters (closed at 85/85 on 2026-07-31) | 19:53Z | **CURRENT** |
| Engineering tech plan | Filters tech plan 2026-07-29 | held; cited in the refs of several cases | — | **CURRENT** |
| PO product write-up for **Parts and Reports** | Branko | **NEVER SUPPLIED** | — | **MISSING** — this is why 9 cases are on HOLD |

## The staleness trap, confirmed again

The spec page's **in-body "Version" field reads `1.6`** while the real Confluence page version is
**18**. Going by the in-body number is what let this project's `refs` sit eight versions stale. All
110 `refs` entries now pin **`[spec v18 2026-08-04]`**, taken from the Confluence version number.

## Epic movement since the last recorded count

SV-8785 was recorded at 20 children; it now has **23**. The three additions are
**SV-8901** (Story, Open — "Miscellaneous QA Environment Issues (non-Filters)"),
**SV-8904** (Task, Board Backlog — the filter-chip leading-icon design-vs-PRD clarification) and
**SV-8906** (Task, Board Backlog — the empty-state inconsistency clarification across Work Orders,
Parts and Reports). None changes a documented requirement; two of them are clarifications Ahtasham
raised that corroborate findings in this pass.

## Ticket status at write time

| Ticket | Status | Bearing on this pass |
|---|---|---|
| SV-8824 | TESTING QA | **Fixed** — proven live: the dropdown stays open across two ticks |
| SV-8828 | **OBSOLETE / Done** | **Fixed** — proven live; two of our cases stopped expecting a failure |
| SV-8832 | Open | Still reproduces — a value that no longer exists is applied, not dropped |
| SV-8843 | OBSOLETE / Done | Still reproduces; superseded by **SV-8883**, which is Open |
| SV-8844 | OBSOLETE / Done | **Fixed** — no `search` key is written to the saved preference at all |
| SV-8845 | **Open (reopened by the QA lead)** | Still reproduces, and worse than "ignored" |
| SV-8846 | Open | Still reproduces — no Clear Filters control on a phone |
| SV-8847 | OBSOLETE / Done | Still reproduces on both halves |
| SV-8871 | Open | Still reproduces on every restore route |
| SV-8875 | Open | Still reproduces |
| SV-8883 | Open | Ahtasham's live replacement for SV-8843 |
| SV-8912 | Open | **Filed by this pass** |
