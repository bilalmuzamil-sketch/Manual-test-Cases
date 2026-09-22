# DVI V2 — source map & currency (established 2026-09-22)

## Canonical sources (Rule 57 list), located live 2026-09-22
| Source | What it is | Currency |
|---|---|---|
| **Confluence 768507905 "Digital Inspections V2"** (space PM, PM Milos Vasic) | THE spec the cases cite — `S#-R#` / `S#-N#` / `S#-E#` anchors ("specification version 18"). QA env `https://sv8181.qa.shopview.com`. | **Last modified 2026-09-18** |
| **Confluence 845348865 "Review Decisions and Open Questions: Digital Inspections V2"** | Decision / Q&A / open-questions log (Rule 108 — must be read with the spec). | Updated 2026-09-10 (R1 2026-09-09) |
| Confluence 845447169 "Run log: DVI V2" | Machine-readable review run log (secondary). | 2026-09-10 |
| **Attached design handoff** (in build/digital-inspections-v2/sources/): DVI-V2-PRD.md (FR-01..FR-24), build-spec, user-stories (TB-/FD-/FM-/HO-), tech plan, design .dc.html screens | The Claude design + PRD handoff. Different structure (FR-##) from the cited spec (S#-R#). | PRD "Last revised 2026-09-10" |
| **Epic SV-8181 + 38 children** | Stories S1..S18 (SV-9099..SV-10243). | Epic updated 2026-09-10 |

## 🔴 CURRENCY FINDING (Rule 31/32)
All 43 cases carry: *"as per … Digital Inspections V2 specification version 18 … read on 21 August 2026."*
The canonical spec (768507905) was **last modified 2026-09-18** — AFTER the cases' 2026-08-21 read.
**The source has moved since the cases were last verified**, so every case must be re-checked against the
current version, and the read-date re-stamped (Rule 54). The attached design handoff (2026-09-10) and the
Review Decisions log (2026-09-10) are also newer than the cases and may carry changes (latest-wins, Rule 32).

## Known moving parts to watch during verification
- **Conditional follow-up:** the PRD/user-stories mark it REMOVED (PRD §13), yet a live story **SV-10243
  "Conditional follow-up on a checkbox response" (Open)** and a design file "Conditional Follow-up V2"
  exist — a later, narrow re-introduction. Latest-wins + disclose (Rule 32/56). No case currently covers it.
- **S10 (SV-9108) is OBSOLETE** — no case should trace to it (none does).
- **Open questions (do not invent answers, Rule 58):** Q1 bulk-OK on an unmeasured position; Q2 starter
  seeding; Q6 where Advisor/Started/progress live; Q7 ShopCoach drafting not testable on QA.
- **Naming drift to check against the current spec:** cases say "New axle set" (C44511) but the design
  handoff decided **"Per axle" / "New axle measurements"** and "axle set" is banned (FR-01/decision 7).
  Must confirm which the CURRENT spec (768507905 v-latest) says, and quote it verbatim (Rule 113).
- Cases carry `custom_automation_type=0` (None) — should be set per case on the next write pass
  (deliverable convention), but that is a write concern, not source verification.

## Plan (per-folder, Rule 101 full)
Read 768507905 (current version + S#-R# body) and 845348865, then verify each of the 43 cases folder by
folder: does its Expected match the CURRENT spec quote (Rule 113), is the S#-R# anchor still valid, is the
story live (not obsolete), re-stamp the read-date. Record verdicts in this folder.
