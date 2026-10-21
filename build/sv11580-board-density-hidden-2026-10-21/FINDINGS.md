# SV-11580 — Board View: no Density, "Column Selection" centred (QA, 21 Oct 2026)

**Verdict: PASSED** — Jira comment 79238 (2 exhibits, 8 checks). Triggered by the 3-hourly watch (routine
trig_01Wusm7jfyD5uEC6G8RHWNBm) at 18:50 UTC: status had moved In Progress → TESTING STAGE, no QA branch linked → staging.
Staging redeployed during the pass: v26.40.20-4c6c9e0 (18:39 GMT) → **v26.40.20-912efe2**; toolbar, tooltip, picker and card
checks were all re-run on 912efe2 and the post gate confirmed 912efe2. PRD v73 S3-R11 / S5-R2.

## Matrix (live)
- Board toolbar at 1024/1280/1440/1600/1920 px: only `button_board_fields_selection` (aria-label "Column Selection") between
  two dividers, 13 px each side; no `button_density`. Tech View: `button_density` + `button_tech_view_column_selection`.
  List: `button_column_selection` only. (`ev/e580a-*.json`)
- Tooltip "Column Selection"; picker 13 fields; saved boardFields (10 on / 3 off) shown unchanged; Lead technician off survives
  reload. Tech View Density menu: Compact / Regular / Comfortable.
- Cards (1440 px, same cards as SV-11541 on 20 Oct v26.40.20-9c75418): S2-33692 230.09, S2-32262 230.09, S2-16176 207.36,
  S2-35703 183.48 at Compact, Regular AND Comfortable = the 20 Oct Regular sizes exactly (Compact then was 216.09/195.36/171.48,
  Comfortable 248.09/223.36/199.48). Board cards no longer follow density; they keep the default spacing.
- Before: my own staging c627fc7 capture from this morning (Density + fields icons). QA branches were unreachable (CONNECT 502)
  and production has no Board View.
- Admin preferences snapshot restored and read back equal after every run.

## Open
- Disabling the watch routine failed: the remote-control tool did not connect. Disable trig_01Wusm7jfyD5uEC6G8RHWNBm when it is
  back (a later firing must not re-test or re-post).
