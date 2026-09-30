# Founder Mode / Part Sales — Coverage verdict (2026-09-30)

Per-source coverage verdict (Rule 115 — proven per source, not asserted; Rule 43 — a per-requirement
verdict). **Scope: the Part Sales Update v1 feature** (the first feature of Founder Mode Batch #1,
epic SV-9667). Stories S1, S3, S4, S5, S6, S7, S8 (Story 2 was withdrawn in place; no anchors).

## What was authored
- **57 cases**, C154586–C154642, under TestRail **Founder Mode (20434) → Part Sales (20435)**, in 8
  content sub-folders (created new): S1, S3, S4, S5, S6, S7, S8, and **DATA** (Rule-116 numeric/money).
- House standard: atomic (one focused behaviour), build-grounded plain preconditions/steps in the
  product's real labels, three-part Expected (plain results → Source → verbatim quotes, Rule 113),
  tester-runnable (Rule 114), with the `AUTOMATION: HOLD` marker (not yet build-verified).

| Folder | Story (Jira) | Cases | C-ids |
|---|---|---|---|
| S1 | Return a core (SV-10262) | 20 | C154586–C154605 |
| S3 | Change the tax (SV-10264) | 3 | C154606–C154608 |
| S4 | Audit log & menu order (SV-10265) | 6 | C154609–C154614 |
| S5 | Sales representative (SV-10266) | 4 | C154615–C154618 |
| S6 | Actions column (SV-10267) | 2 | C154619–C154620 |
| S7 | Labels & tab bar (SV-10268) | 4 | C154621–C154624 |
| S8 | Take a deposit (SV-10269) | 12 | C154625–C154636 |
| DATA | Numeric/money accuracy (Rule 116) | 6 | C154637–C154642 |
| **Total** | | **57** | |

## Source-by-source verdict (Rule 115)

- **PRD / spec — Confluence 867434569 "Part Sales Update v1" — ✓ COVERED, PROVEN.**
  Parsed **104 requirement anchors** (R/N/E across S1, S3–S8). Machine-checked:
  **104 / 104 covered in exactly one story-folder case — 0 missing, 0 duplicated**
  (`COVERAGE-MATRIX-2026-09-30.md`). Expected Results quote the spec's own sentences verbatim (Rule 113).

- **Design — Founder-Partssales.zip canvas + live artifact JRh7EY87SWcHC9i3sm85K9 — ✓ COVERED, DRIVEN.**
  The canvas `.dc.html` boards and their embedded product screenshots were extracted from the
  `appifact-doc` record and driven: every board's annotations read, and the key states opened and
  zoomed (charged document, returned document, pre-receive estimate, parts grid returned row, Cancel
  Return menu + confirmation, Create Deposit dialog, reordered ⋮ menu, tax-editing Financial Info card,
  Sales Representative picker, Actions column, tab bar). Evidence: `design/DESIGN-DRIVING-LOG-2026-09-30.md`,
  `design/canvas/`. The design agrees with the PRD (before = staging, after = this build, work-order
  panels for comparison); the exact figures on the document boards ($517.55 / $79.99 → $597.54 /
  $29.88 / $627.42, and the returned $517.55 / $25.88 / $543.43) match S1-R13/S1-R11 and seed the DATA
  cases. No design-only behaviour or PRD↔design divergence needing a PO question was found.

- **Epic — SV-9667 "Founder Mode Batch #1" (Ready for Development) — ✓ COVERED.** Part Sales is
  priority 1; each story maps to a folder and every case's source line cites the epic and its story.

- **Technical design / tech plan — none provided for Part Sales (Rule 30).** The PRD's §4 already
  folds in the tech-planning pass (permissions, QuickBooks, form factor, the pricing-engine core-row
  decision). No separate engineering technical design was supplied; if one arrives, run an
  ADD/CONFIRM/DIVERGE pass (Rule 115).

- **PO answers — the PRD is PO-authored (Chris Ward) and self-contained.** No separate PO Q&A needed;
  the one live Open Question (Customer Portal accepting a part-sale deposit, SV-10261) is carried in the
  cases as HOLD (S8-R8/R11 unreachable, rest of S8 live) rather than guessed.

## Rule-116 numeric / money accuracy (DATA folder)
Dedicated exact-value cases: the charged document totals ($597.54 / $29.88 / $627.42); the returned
document ($517.55 / $25.88 / $543.43) with the credit carrying its own tax (the $4.00 GST delta =
5% of $79.99), proving totals fall back exactly; tax-rate recalculation to the cent with card↔document
parity ($290.91 → $305.46); the QuickBooks negative-line amount parity (−$79.99 == document row);
deposit overflow to an exact customer credit ($600 on $543.43 → $56.57); and the impossible $0.00 core.

## Honest limits (Outstanding)
- **Not build-verified.** No Part Sales Update v1 QA build/branch URL or credentials were provided; the
  feature is built on staging per the design but not reachable from here, and production login is
  read-only and does not yet carry it. Every case is `AUTOMATION: HOLD`; when a build is reachable, run
  build-verification and stamp each provenance line.
- **Customer Portal deposit (S8-R8–R11)** depends on SV-10261 (engineering, portal side) and is
  unreachable until the portal accepts part sales — reflected in the cases, not invented.
- **Other Founder Mode features** (Notifications, What/Why, Price/Category, Part Lifecycle) are separate
  folders under 20434 and are **not** authored here — Part Sales first, per the request.
