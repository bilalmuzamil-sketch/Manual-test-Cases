# Founder Mode / Part Sales — PROJECT-STATE

**Canonical live document for this feature.** Part Sales is feature 1 of Founder Mode Batch #1.

## Identity
- **Feature:** Part Sales Update v1 (Founder Mode).
- **Epic:** SV-9667 (Founder Mode Batch #1, Ready for Development). Priority 1 of 4.
- **Stories:** SV-10262 (S1 Return a core), SV-10264 (S3 Tax), SV-10265 (S4 Log & menu),
  SV-10266 (S5 Sales rep), SV-10267 (S6 Actions column), SV-10268 (S7 Labels & tabs),
  SV-10269 (S8 Deposit). **Story 2 withdrawn in place** (ids retired; anchors none).
- **Spec (PRD):** Confluence **867434569** "Part Sales Update v1" (Chris Ward), last mod 2026-09-28.
  Verbatim copy: `sources/CONFLUENCE-867434569-PartSales-Update-v1-2026-09-30.md`.
- **Design:** `Founder-Partssales.zip` canvas + artifact JRh7EY87SWcHC9i3sm85K9. Extracted &
  driven → `design/canvas/`, `design/DESIGN-DRIVING-LOG-2026-09-30.md`.
- **Tech design:** none separate (tech-planning folded into PRD §4).
- **PO:** Chris Ward (PRD author).
- **TestRail:** Founder Mode = section **20434**; Part Sales feature folder = **20435**.

## Status (2026-09-30)
- **AUTHORED — Part Sales complete.** 57 cases, C154586–C154642, across 8 new sub-folders.
  Section ids in `section-map.json`; id map in `created-log.json`.
- **Coverage: 104/104 PRD anchors covered once, 0 missing / 0 duplicated** (`COVERAGE-MATRIX-2026-09-30.md`,
  verdict `COVERAGE-VERDICT-2026-09-30.md`).
- **Build badge: ❌ never build-verified** — no Part Sales QA build reachable. Every case
  `AUTOMATION: HOLD`. **Source badge: ✅ 2026-09-30**; design driven same day.

## Sub-folders (parent 20435)
S1 20440 · S3 20441 · S4 20442 · S5 20443 · S6 20444 · S7 20445 · S8 20446 · DATA 20447.

## Founder Mode sibling feature folders (under 20434, NOT yet authored)
Notifications 20436 · What/Why 20437 · Price/Category 20438 · Part Lifecycle 20439.

## Authoring standard applied
Atomic; build-grounded preconditions (real tabs/cards/grid columns/labels from the driven design);
one-action steps; three-part Expected (plain → Source → verbatim quotes, Rule 113); tester-runnable
(Rule 114); 100% per-source coverage with the design driven end-to-end (Rule 115); dedicated
numeric/money-accuracy DATA folder (Rule 116).

## How to regenerate / extend
- Library: `ps_lib.py` — `run(folder_code, CASES)`; `--apply` writes, else dry-run.
- Anchors + verbatim text: `anchor-quotes.json`. Per-folder authoring: `s1_cases.py`,
  `s3_s8_cases.py`, `data_cases.py`.
- Design canvas extraction: from `_t.html` `appifact-doc` record → `design/canvas/` (`.dc.html`
  boards + decoded PNG screenshots). Raw zip is git-ignored (`design/_zip/`).
- Render-repair (fr-view): `bash build/testing-tools/ensure_bridge.sh` then loop
  `CID=<id> /opt/node22/bin/node build/invoice-design-selection/hs_repair_one.mjs`.

## OUTSTANDING (Rule 36)
1. **No Part Sales QA build reachable** → whole suite HOLD / source-verified only (Rule 85). Build-verify
   and stamp when a build/branch + access is provided.
2. **Customer Portal part-sale deposit (S8-R8–R11)** blocked on SV-10261 (engineering, portal side) —
   reflected as HOLD in the cases; rest of S8 is live.
3. **Sibling Founder Mode features** (Notifications, What/Why, Price/Category, Part Lifecycle) not yet
   authored — awaiting the go-ahead to proceed feature by feature.
