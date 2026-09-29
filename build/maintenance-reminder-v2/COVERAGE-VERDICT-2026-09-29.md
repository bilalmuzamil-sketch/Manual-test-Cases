# Maintenance Reminder — Chunk 1 · Coverage verdict (2026-09-29)

Per-source coverage verdict for the MR Chunk 1 suite (Rule 115 — coverage is proven per source, not
asserted; Rule 43 — a per-requirement verdict, not a narrative). **Scope: Chunk 1 only** (stories
S1–S9, S13, S14, S21). Chunk 2 (S10 readings entry, S11 confidence engine, S12) is out of scope and
is **not** authored here; the S11 *confidence display/grading text*, which the Chunk 1 spec reproduces
because S9 and S13 must render it, is covered where it is displayed and in the DATA numeric cases.

## What was authored

- **81 cases**, C146309–C146389, under TestRail folder **19397 "Maintenance Reminder (Oct 2026)"**,
  in 13 content sub-folders (created new): S1–S9, S13, S14, S21, and **DATA** (Rule-116 numeric/date
  accuracy).
- Every case follows the house standard: atomic (one focused behaviour), build-grounded plain
  preconditions/steps, and a three-part Expected (plain results → Source → verbatim quotes) with the
  `AUTOMATION: HOLD` marker (no MR QA build exists — see Outstanding).

| Folder | Story | Cases | C-ids | Anchor citations |
|---|---|---|---|---|
| S1 | SV-10558 Create a schedule | 7 | C146309–C146315 | 16 |
| S2 | SV-10559 Add a routine service | 8 | C146316–C146323 | 31 |
| S3 | SV-10560 Add a compliance inspection service | 4 | C146324–C146327 | 12 |
| S4 | SV-10561 Attach canned lines | 3 | C146328–C146330 | 11 |
| S5 | SV-10562 Reminder timing | 2 | C146331–C146332 | 9 |
| S6 | SV-10563 Edit and archive a schedule | 6 | C146333–C146338 | 19 |
| S7 | SV-10564 Enrol an asset | 7 | C146339–C146345 | 36 |
| S8 | SV-10565 Compliance records on the asset | 5 | C146346–C146350 | 19 |
| S9 | SV-10566 The asset Maintenance tab | 7 | C146351–C146357 | 24 |
| S13 | SV-10570 The worklist | 13 | C146358–C146370 | 42 |
| S14 | SV-10571 Contact / send from a row | 5 | C146371–C146375 | 17 |
| S21 | SV-10576 The audit trail | 6 | C146376–C146381 | 11 |
| DATA | Rule 116 numeric/date accuracy | 8 | C146382–C146389 | 19 (overlay) |
| **Total** | | **81** | | |

## Source-by-source verdict (Rule 115)

- **PRD / spec — Confluence 886931488 "Chunk 1 MR" — ✓ COVERED, PROVEN.**
  Parsed **245 Chunk-1 requirement anchors** (R/N/E items across S1–S9, S13, S14, S21) plus the
  **9 S11 confidence anchors** the spec reproduces for display. Machine-checked coverage
  (`/tmp/.../cov.py` logic; see `COVERAGE-MATRIX-2026-09-29.md`):
  **245 / 245 Chunk-1 anchors covered in exactly one story-folder case — 0 missing, 0 duplicated.**
  All 9 S11 confidence anchors covered too (S9 display cases + DATA numeric cases). The Expected
  Results quote the spec's own sentences verbatim (Rule 113).

- **Design — MR_V2.zip (attached) — ✓ COVERED, DRIVEN.**
  The design was localized and driven end-to-end (Chromium + Playwright), screenshots and extracted
  text in `design-exploration-2026-09-29/` (settings, schedule editor, service form, asset Maintenance
  tab, worklist, confidence cards). Preconditions and step wording use the design's real labels and
  navigation (Settings > Maintenance, "Untitled schedule" editor, "Is this a compliance inspection?",
  the asset Maintenance tab, worklist tiles/chip, confidence meter). No design-only behaviour was found
  that the PRD does not also state; no PRD↔design divergence requiring a PO question was found in
  Chunk 1 scope.

- **Epic — SV-3780 — ✓ COVERED.** Chunk 1 stories SV-10558…SV-10566, SV-10570, SV-10571, SV-10576 each
  map to a folder; the source line of every case cites the epic and its story.

- **Technical design / tech plan — ✗ NOT PROVIDED (Rule 30).** The Engineering Head's technical design
  "will be provided later on when and if it is created" — it does not exist yet. No tech-plan-derived
  behaviour (release-note changes, error/empty/loading states, NFRs) could be covered. **This is an
  open input, listed in Outstanding.** When it arrives it must be run as an ADD/CONFIRM/DIVERGE pass
  (Rule 115) against the suite.

- **PO verified answers — none on file for MR.** No PO Q&A document exists for this feature yet; the
  spec itself carries an "Open Questions" section (e.g. reminder email sender/delivery, S14-R4) which is
  reflected in the cases as HOLD/"switched on once confirmed" rather than invented.

## Rule-116 numeric / date accuracy (DATA folder)

Dedicated cases making a wrong number impossible to ship, each an arithmetic hazard on its own:
month-interval due dates incl. 31-Jan→28-Feb roll-back and leap-year 29-Feb, days-interval drift
(exact dates); certificate term/effective/expiry derivation and last-day-of-month expiry; Remind-
before-expiry defaults by term band and the cannot-exceed-term cap; the confidence grade matrix
(usable-pair count × reading-age cap, lower-wins, guard-drop) with the two S11-E5 worked examples,
independent per-meter grading, the N-visits count and the No-data state; worklist tile day-window
boundaries (−1/0/+30/+31/+91/+92) and Needs-readings crossing; tile counting (count-once-per-tile,
tiles don't sum to a total, location-filtered); and interval field caps (999,999 / 99,999 / 999,
months 1–12, whole-numbers-only). Parity dimensions (asset tab = worklist row) are asserted where the
same figure/date shows on two surfaces.

## Honest limits

- **Not build-verified.** No Maintenance Reminders QA build is available; the feature ships behind the
  `maintenance_reminders` flag. Every case carries `AUTOMATION: HOLD - not yet build-verified …` and
  the Expected wording is derived from the documents (Rule 57), never from a build. When a build
  exists, run the build-verification lane and stamp the provenance line's sentence 2.
- **S21 audit surface** — the exact place the audit trail is surfaced in the UI is not confirmed on a
  build; the S21 cases name "the audit trail wherever the build surfaces it" and stay HOLD until the
  surface is confirmed (Rule 114).
