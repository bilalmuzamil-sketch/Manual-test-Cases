# The ticket list, and exactly how it was derived — 2026-08-06

## The rule being applied

QA lead, verbatim: *"Yes this source block MUST exist for every ticket you created."* And, on what a
source may be: *"Source can be the Story in Epic/Specs from PRD/Answer from the PO in an answer google
spreadsheett, in case of google spreadsheet do provide the spreadsheet link and the row reference from
that spreadseet"*.

## Why the list was NOT derived from a Jira author query

Our Jira account is **shared with the QA lead** — everything he does in the browser is recorded under
`Bilal Muzamil`, accountId `712020:6d590212-…`. So *"created by us"* in Jira also returns tickets **he**
created, and editing one of his would reverse a deliberate action (Standing Rule 53's corollary).

**The list therefore comes from OUR OWN COMMITTED RECORDS.** Every `FILED.md` and equivalent under
`build/report-suite/`, `build/schedule/` and `build/filters/` was read, including the dated pass folders
from 4, 5 and 6 August. Each key below names the record that claims we filed it.

**Every one of the 65 was then read live** and confirmed `creator = Bilal Muzamil` (the shared account).
**No ticket in our records turned out to have been created by somebody else**, so nothing had to be left
alone for that reason.

## The population

| Count | |
|---|---|
| Tickets our records claim we filed | **66** |
| **Skipped by instruction — SV-8923** | 1 |
| In scope | **65** |
| Already carried a source block (SV-8937) — left untouched | 1 |
| **Blocks written this pass** | **64** |

## Provenance — which record named each key

| Project | Record that names it | Keys |
|---|---|---|
| Report Suite | `build/report-suite/defect-pack-2026-08-04/FILED.md` | SV-8818 · SV-8819 · SV-8820 · SV-8821 · SV-8822 · SV-8823 |
| Report Suite | `build/report-suite/approved-writes-2026-08-05/TASK-C-TICKETS-FILED.md` | SV-8879 · SV-8880 · SV-8881 |
| Report Suite | `build/report-suite/chris-newreqs-2026-08-05/FILED.md` | SV-8907 · SV-8908 |
| Report Suite | `build/report-suite/full-viu-2026-08-06/FILED.md` | SV-8925 · SV-8926 · SV-8927 · SV-8928 · SV-8929 · SV-8930 · SV-8931 · SV-8932 · SV-8934 · SV-8935 · SV-8936 · **SV-8937 (already had a block)** · SV-8938 · SV-8939 · SV-8940 · SV-8943 · SV-8944 · SV-8945 · SV-8946 · SV-8947 · SV-8948 · SV-8949 · SV-8950 · SV-8951 · SV-8952 · SV-8953 · SV-8954 · SV-8955 · SV-8956 |
| Schedule | `build/schedule/READINESS-2026-08-04.md` (the ten raised from the 4 August pass; `build/schedule/viu-2026-08-04/RECHECK-QUEUE.md` corroborates) | SV-8848 · SV-8849 · SV-8850 · SV-8851 · SV-8852 · SV-8853 · SV-8854 · SV-8855 · SV-8856 · SV-8857 |
| Schedule | `build/schedule/final-viu-2026-08-05/FILED.md` | SV-8886 |
| Schedule | `build/schedule/full-viu-2026-08-05/FILED.md` + `tickets/*-payload.json` | SV-8924 · SV-8933 · SV-8941 · *(SV-8923 — SKIPPED)* |
| Schedule | `build/schedule/full-viu-2026-08-05/TICKET-SOURCE-BLOCK-REQUIREMENT.md` — the finishing worker's own handoff list | SV-8942 · SV-8957 · SV-8958 · SV-8959 |
| Filters | `build/filters/viu-2026-08-04/FILED.md` | SV-8843 · SV-8844 · SV-8845 · SV-8846 · SV-8847 |
| Filters | `build/filters/recheck-2026-08-05/FILED.md` | SV-8871 |
| Filters | `build/filters/full-viu-2026-08-05/FILED.md` | SV-8912 |

## SV-8923 — skipped, deliberately

**[SV-8923](https://shopview.atlassian.net/browse/SV-8923)** — *"the Business Hours switch shades
nothing"* — is **OBSOLETE**, withdrawn as an invalid defect. It was raised against working software: the
shop had no business hours configured at all, which breaches the source case's own precondition, so there
was nothing to shade and the switch was behaving correctly. **It has no legitimate source, and inventing
one would be worse than leaving it.** Read live at the end of this pass: status OBSOLETE, no source block,
`updated 2026-08-06T01:07:57-0500` — i.e. **untouched by this pass**.

## Skipped for a sibling worker — none

Both sibling workers (Schedule and Report Suite) had finished before the writes began, and neither filed
anything after the source-block instruction landed. **No ticket was skipped for collision risk.**

## Sources read live for this pass (Standing Rule 31)

| Source | Identifier | Version read live | Verdict |
|---|---|---|---|
| Schedule specification | Confluence page 713031682 | **v23** (Confluence version; in-body field reads 1.0 — the known trap) | CURRENT |
| Filters specification | Confluence page 572030978 | **v18** (in-body field reads 1.6) | CURRENT |
| Sales By Customer specification | Confluence page 577634305 | **v15** | CURRENT |
| Sales By Representative specification | Confluence page 585629698 | **v17** | CURRENT |
| Parts Velocity specification | Confluence page 620888066 | **v5** | CURRENT |
| Technician Utilization specification | Confluence page 641400833 | **v6** | CURRENT |
| Work In Progress specification | Confluence page 703660034 | **v9** | CURRENT |
| Inventory Value specification | Confluence page 720142338 | **v4** | CURRENT |
| Epic stories' acceptance criteria | 40 stories under SV-8582 / SV-8685 / SV-8785 | read live 2026-08-06 | CURRENT |
| Chris Ward's answer workbook | Google Sheets `1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY`, returned copy sha256 `6da732152589a31b842adf6e1a16549c3fce0dd0ca0c4da0e5792aac924993cd` | 15 of 24 answered, retrieved 2026-08-05 | CURRENT |

Spec text as read is kept in `specs/`; story text in `stories/`; the version register in
`specs/SPEC-VERSIONS.json`.

## Three specification versions had moved since the ticket was written

Caught by reading live rather than trusting the ticket text. Each block names the **current** version and
says plainly that the requirement carries over unchanged.

| Ticket | Version the ticket quoted | Live version | Requirement text |
|---|---|---|---|
| SV-8818 | Inventory Value v3 | **v4** | S10-R12 and S10-R14 unchanged |
| SV-8819 | Parts Velocity v4 | **v5** | the Window definition and the Turns / Yr formula unchanged |
| SV-8823 | Inventory Value v3 | **v4** | S10-R3 and S10-R7 unchanged |
| SV-8881 | Technician Utilization v5 | **v6** | S7-R2/R3/R4 present; the CSV label reads *"Download Summary (CSV)"* in v6, where the ticket quoted *"Download (CSV)"* — the block uses the live wording |

## Two mis-cited requirement numbers, corrected in the block

| Ticket | Cited in the ticket | Actually the governing requirement |
|---|---|---|
| SV-8881 | Sales By Customer **S15-R1 / S15-R2** | those numbers do not exist in the Technician Utilization spec at all; the wording is fixed by **TU v6 S7-R2/R3/R4** plus Chris Ward's answer |
| SV-8932 | Inventory Value **S12-R7** for the long-text half | S12-R7 is the dark-mode requirement; truncation is **S12-R6** |

## Verification

`FINAL-VERIFICATION.json` — all **65** re-read live after the writes: **exactly one** source block each,
the description above the block **byte-identical** to the pre-edit snapshot, and **no other field changed**
on any ticket. **65 PASS / 0 FAIL.**
