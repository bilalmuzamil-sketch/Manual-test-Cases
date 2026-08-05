# SOURCE-CURRENCY — Report Suite full live-observation pass, 2026-08-05
Standing Rule 31 pre-flight. Standing Rule 59 second read is recorded in `testrail-execution-log.md`.

## Read at pass start — 2026-08-05T19:51Z to 19:54Z

| Source | Identifier | Version / last-updated | Checked (UTC) | Verdict |
|---|---|---|---|---|
| Build (QA branch `sv8582`) | `https://sv8582.qa.shopview.com` `<meta name="app-version">` | **`v3.5-16cf83f`**, last-mod Wed 05 Aug 2026 06:40:32 GMT, etag `177c59546701e7810b894492dabc1423`, index.html sha256 `67932a75b5a3a11d987b065c526d2d6dd38d0f47f76adeef61a6d341b249fa78` | 19:51:00Z | **CURRENT** — unchanged from the previous pass. Branch NOT declared final, and per Rule 60 it never will be, so verdicts are PROVISIONAL by design. |
| SBC spec | Confluence 577634305 | **v15**, 2026-08-05T17:53:06Z, Chris Ward, *"Parth WIP review + suite-wide link-permission rule (2026-08-05)"* | 19:54Z | **CURRENT** |
| SBR spec | Confluence 585629698 | **v17**, 2026-08-05T17:53:08Z, Chris Ward, same message | 19:54Z | **CURRENT** |
| Parts Velocity spec | Confluence 620888066 | **v5**, 2026-08-05T13:21:40Z, Chris Ward, *"Applied QA review workbook decisions (2026-08-04)"* | 19:54Z | **CURRENT** |
| Technician Utilization spec | Confluence 641400833 | **v6**, 2026-08-05T13:33:10Z, Chris Ward | 19:54Z | **CURRENT** |
| WIP spec | Confluence 703660034 | **v9**, 2026-08-05T17:54:07Z, Chris Ward, *"WIP asset filter scope wording (Parth review)"* | 19:54Z | **CURRENT** |
| Inventory Value spec | Confluence 720142338 | **v4**, 2026-08-05T13:33:13Z, Chris Ward | 19:54Z | **CURRENT** |
| Epic + stories | SV-8582 | read this pass — see FINDINGS.md | 2026-08-05 | **CURRENT** |
| Designs | none exist for this project | n/a | n/a | **N/A** — spec-only project, confirmed with Chris Ward. No Rule-35 queue is open for Report Suite. |
| Tech plan | ingested `build/report-suite/tech-plan-2026-07-29/` | unchanged | 2026-08-05 | **CURRENT** |
| PO answers | `chris-answers-2026-08-05/`, `chris-newreqs-2026-08-05/`, `rulings-2026-08-05/` | latest 2026-08-05 | 2026-08-05 | **PARTIAL** — one follow-up question to Chris Ward is unanswered (the Location-column contradiction, four specs still stating it both ways). Named per case in FINDINGS.md. |

**Rule-31(a) trap check:** versions above are the **Confluence version numbers**, taken from
`version.number` on the REST response — NOT the in-body "Version" field, which on these pages
lags and cannot be trusted.

**All six specs are byte-identical in version to the previous pass's read** — Chris published nine
versions earlier today and has published none since 17:54Z.

## TestRail baseline read at 19:53Z
- Sections under group 4281: **96** (89 leaf case-bearing).
- Cases under 4281: **481** — **476 ours** (`created_by=3`) + **5 foreign** (`created_by=1`,
  Vladimir Tomovic, C38919–C38923).
- Run **359**: `include_all=false`, **476 tests**, **535 result records**.
- Marker census before this pass: **READY 419 · READY-EXPECT-FAIL 27 · HOLD 30 = 476**.

Per-report: SBR 112 · SBC 87 · WIP 78 · PV 71 · IV 68 · TU 60 = 476.
