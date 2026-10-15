# Next session — WO Board run 498 on staging (written 15 Oct 2026 13:05 UTC, before the weekly quota reset)

Start: read this file and `../PROJECT-STATE.md` (last sections). Run `recover.sh` first; start a background watcher (L0372).
Staging sign-in: /tmp/qa-cookies/staging-sso.txt + staging-full.json (supplied 15 Oct 12:27 UTC; usually ~24 h). If expired, ask the QA lead.

## 1 · Seven re-runs (scripts fixed or fixes written in judge/wave31.json / wave30.json)
| Case | Script | Fix still to apply before running |
|---|---|---|
| C368217 | ps-counts.mts | done (same customer at both locations) |
| C368156 | rest-batch.mts | wave31: three Heavy Duty columns pinned + picture; read each pin's state from its button; name all Lethbridge columns; switch back via stored-location route |
| C368178, C368179 | high1-fix5.mts | wave31: delete Esther's other ZZAUTOTEST shifts that day first; after reload open blocks until one names this work order; picture its details |
| C96962 | s4-batchE.mts | wave31: open ⋮ > Audit Log on screen after each lead change; line number > Audit log before/after Edit Line; reload board before last picture |
| C97012 | staledrop-stg4.mts | wave31: step 4 from the dispatcher's own switched session; check session right before drag; steps 7–9 need a second independent sign-in, else Blocked (prove with blocker_gate) |
| C590120 | design-stg5.mts | needs a work order with progress > 0 so the blue bar fill can be seen |
Make one plan file (eleventh-pass-plan.txt pattern: signin-check, role-viewonly, clocks, the lines). No sign-out line (C368240 already passed).

## 2 · Waiting on the QA lead (see REPORT-staging-2026-10-15.md §4)
C96916, C96920, C96973, C96978, C97003 (his calls) · C590125 (no expected yet) · C368175/C154650 (second company) · C581895 (Chris's names) · C368191 (deleted person).
## 3 · Scheduled
C97033 day 2 — send_later at 19:10 UTC 15 Oct (ga-week.mts PHASE=day2, ga_calc.py, post).
## 4 · Tickets (all reported 15 Oct): see PROJECT-STATE "tickets" sections. Retest each when its ticket is fixed.
