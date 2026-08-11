# Report Suite — SOURCE CURRENCY, spec-delta pass, 2026-08-11 (Standing Rules 31 + 59)

**Rule 59 — the sources were read TWICE**, once at pass start and again immediately before the
first write.

| | |
|---|---|
| Pass-start read | **2026-08-11 19:26Z** |
| Write-start re-read | **2026-08-11 19:36Z** |
| Verdict of the second read | **all six specifications UNCHANGED** — same version integer and same body length on every page |
| First write | 2026-08-11 19:38Z · last write ~19:52Z |

## The six specifications

| Report | Page | Baseline (what our cases were written against) | Live | Verdict |
|---|---|---|---|---|
| Sales By Customer | `577634305` | 16 | **17** (2026-08-10, Chris Ward — *"SV-9074: Product Type filter to multi-select toggles"*) | CURRENT |
| Sales By Representative | `585629698` | 17 | **18** (2026-08-07, *"Section 3 tidy-ups"*) | CURRENT |
| Parts Velocity | `620888066` | 5 | **6** (2026-08-07, *"Section 3 tidy-ups"*) | CURRENT |
| Technician Utilization | `641400833` | 7 | **7** — did not move | CURRENT |
| Work In Progress | `703660034` | 10 | **11** (2026-08-10, *"QA-cycle decisions: line-state bucketing, fixed-price valuation, core …"*) | CURRENT |
| Inventory Value | `720142338` | 4 | **5** (2026-08-07, *"Section 3 tidy-ups"*) | CURRENT |

**The live bodies were re-fetched independently in this pass and are byte-identical, by sha256, to
the copies the `read-dates-2026-08-11` pass fetched.** That is a real check, not a formality: two
independent fetches agreeing rules out a truncated or partially-rendered read on either side.

**Rule 31 trap (a) does not apply to these pages** — they carry no in-body "Version" field at all
(all six bodies searched, zero occurrences), so the Confluence version integer is the only marker
that exists and is what every figure here comes from.

## Epic SV-8582

Read live **2026-08-11 19:27Z** via the case suite's own references. **No Tier-2 full epic re-read
was done** — Rule 37 requires the QA lead's go-ahead for that, and nothing in this pass needed it.
The epic is cited by every case's provenance line and was already Tier-1 currency-checked at
105 children by the read-dates pass earlier the same day.

## Designs and Figma — NOT APPLICABLE

Rule 57 (amended 2026-08-06) makes designs and Figma authoritative. **The Report Suite has none** —
it has been spec-only from the start and not one of the 480 cases cites a design or a Figma frame.
Recorded as N/A rather than left blank, because a silent omission is indistinguishable from a
source nobody checked.

## The build — deliberately NOT read

**No build was observed in this pass. No case's Rule 54 sentence 2 was added, altered, re-dated or
removed**, and that was verified byte-exact on every case written: the writer refuses the write if
the build line moves. The QA-branch session has expired estate-wide, so **this pass claims no build
fact whatsoever** (Rule 12).

One consequence worth stating plainly: the four new cases carry **sentence 1 only and no build
line**, because they have never been checked against any build and saying otherwise would be a
false claim.
