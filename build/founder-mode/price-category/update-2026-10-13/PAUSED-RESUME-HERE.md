# Price/Category full update — paused 14 Oct 2026 (QA lead: "Save the state … then come back")

Done so far (13 Oct):
- Live snapshot of all 26 cases (`snapshots-before/`); all ours, none edited by anyone else.
- Sources fetched and compared (`../SOURCE-CHECK-2026-10-13.md`): PRD 578781186 edited 13 Oct (epic link to SV-11258 and owner mention only); 63 codes, none added/removed/reworded; re-checked identical 13 Oct. Comments: one thread (23 Sep). Jira: epic SV-11258 (Design In Progress), stories SV-10134–10136, Story 4 SV-10403 "Not in this release", bugs SV-10386/10387/10445, verify tasks SV-10394–10396. No QA build.
- Tech plan received 13 Oct: `../sources/tech-plan-Parts-Settings-Sorting-2026-10-13.md` (not yet read in full by a writer).
- Design copy `../sources/design-2026-10-13-artifact/` (6 files, all read in full 13 Oct). Sweep 45/45 hovered and clicked, 0 failed; canvas drive (`../design-drive-2026-10-13/canvas-run3/`) 1 page, 5/5 boards played and exported, 0 errors. Design boards hold REAL production data (Automotive - 4700): never use it as example records.
- Writer brief ready: `WORKER-BRIEF.md`; `cases-now.md` written.

Next steps when resuming:
1. Write `config.json` (copy What/Why's: PRDF `build/founder-mode/price-category/sources/CONFLUENCE-578781186-2026-10-13.md`, MARKER `AUTOMATION: HOLD - no Price/Category QA build exists yet, not build-verified`, FEATURE `Founder Mode / Price/Category`, JIRA the stories file, TECH_PLANS the tech plan).
2. `--anchors`: this PRD writes its bullets as `\- **S1-R1:**` (leading backslash) — the anchor regex in `build/testing-tools/apply_case_update.py` must allow `\\?-` before running, then expect 63 codes.
3. One writer (26 cases) → validate → label check → text inventory triage → `--add-new-first` → `--docs` → doc workers → `--apply` → display check → run check (Nightly) → old docs list → FULL-UPDATE record → report (Rule 67).
