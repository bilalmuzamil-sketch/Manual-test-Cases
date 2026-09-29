# Maintenance Reminder (MR) — Chunk 1 · PROJECT-STATE

**Canonical live document for this project.** Keep it current when a fact changes.

## Identity
- **Feature:** Maintenance Reminder (MR), **Chunk 1**.
- **Epic:** SV-3780. **Chunk-1 stories:** SV-10558 (S1) … SV-10566 (S9), SV-10570 (S13),
  SV-10571 (S14), SV-10576 (S21).
- **Spec (PRD):** Confluence **886931488** "Chunk 1 MR". Local verbatim copy:
  `sources/CONFLUENCE-886931488-Chunk1-MR-2026-09-29.md` (read 2026-09-29).
- **Design:** `MR_V2.zip` (attached by QA lead). Driven end-to-end → `design-exploration-2026-09-29/`.
- **Technical design:** **NOT PROVIDED** — "provided later on when and if it is created" (Rule 30 open input).
- **PO:** not named for MR yet — **ASK** before sending any PO question sheet (Rule 2).
- **TestRail folder:** group **19397** "Maintenance Reminder (Oct 2026)", project 1, suite 1.

## Status (2026-09-29)
- **AUTHORED — Chunk 1 complete.** 81 cases, C146309–C146389, across 13 new sub-folders
  (S1–S9, S13, S14, S21, DATA). Section ids in `section-map.json`, id map in `created-log.json`.
- **Coverage: 245/245 Chunk-1 anchors covered once, 0 missing / 0 duplicated** + all 9 S11 confidence
  anchors. Proof: `COVERAGE-MATRIX-2026-09-29.md`; per-source verdict: `COVERAGE-VERDICT-2026-09-29.md`.
- **Build badge: ❌ never build-verified** — no MR QA build; feature behind flag `maintenance_reminders`.
  Every case carries `AUTOMATION: HOLD - not yet build-verified …`.
- **Source badge: ✅ 2026-09-29** (spec read same day). Design driven same day.

## Sub-folders (parent 19397)
S1 19398 · S2 19399 · S3 19400 · S4 19401 · S5 19402 · S6 19403 · S7 19404 · S8 19405 · S9 19406 ·
S13 19407 · S14 19408 · S21 19409 · DATA 19410.

## Authoring standard applied (per QA-lead direction, carried from Simple Flow V2)
Atomic (one focused behaviour per case); rich build-grounded preconditions (real nav + where the
control sits + data setup + gotchas); numbered one-action steps in the build's labels; three-part
Expected (plain results → Source line → verbatim quotes, Rule 113) tester-runnable (Rule 114);
100% coverage from every provided source with the design driven end-to-end (Rule 115); dedicated
numeric/date-accuracy cases (Rule 116, DATA folder). Not spec-dumps.

## How to regenerate / extend
- Library: `mr_lib.py` — `run(folder_code, CASES, log)`; `--apply` writes, else dry-run.
- Anchors + verbatim text: `anchor-quotes.json` (parsed from the spec).
- Per-folder authoring scripts: `s1_cases.py`, `s2_cases.py`, `s3_s4_s5_cases.py`, `s6_cases.py`,
  `s7_cases.py`, `s8_s9_cases.py`, `s13_cases.py`, `s14_s21_cases.py`, `data_cases.py`.
- Render-repair (fr-view): `bash build/testing-tools/ensure_bridge.sh` then loop
  `CID=<id> /opt/node22/bin/node build/invoice-design-selection/hs_repair_one.mjs` (batched in
  background — ~9 s/case exceeds the 120 s foreground limit).

## OUTSTANDING (Rule 36)
1. **Technical design not provided** (Rule 30). When it arrives, run an ADD/CONFIRM/DIVERGE pass
   (Rule 115) over the suite; a code-vs-doc conflict is a PO item (Rule 96).
2. **No MR QA build** → whole suite is HOLD / source-verified only (Rule 85). When a build exists,
   run build-verification and stamp each provenance line.
3. **PO not identified for MR** — ask before any PO question sheet.
4. **Spec Open Questions** (e.g. reminder email sender/delivery, S14-R4) reflected as HOLD in cases,
   not invented — surface with the PO when one is named.
5. **S21 audit UI surface** unconfirmed — cases stay HOLD until the build shows where the trail lives.
6. **Chunk 2 (S10/S11/S12) intentionally out of scope** — not authored here.
