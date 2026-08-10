# RESUME — source accuracy, SBR · PV · IV, 2026-08-11

**Scope: ours 251** (SBR 112 · PV 71 · IV 68) of **live 257** under group 4281 (6 foreign, Rule 38).
Counted from live TestRail, set-equal both directions.

## Position at the start
- Provenance version stale on **249 of 251**; 2 carried no version at all.
- `refs` spec version stale on **229 of 230** that name one; **21** name none.
- Anchors that do not exist in the live spec: **0**, checked two ways.
- Raw markup: **0 of 251** (pre-pass census).

## Live spec versions (Confluence `version.number`, never the in-body field)
SBR **18** · PV **6** · IV **5**, all last edited 2026-08-07.
Out of scope but read in the same call: **SBC 17** and **WIP 11** — both moved AFTER the
handed-off pass stamped them 16 and 10.

## State
- Plan built and dry-run clean: **234 writes, 0 errors, 1 no-op (C38925)**.
- **16 cases HELD** — `hold.json` — their assertions turn on the Location-column rule that changed.
- Working files in `/tmp/rs5` (ephemeral): plan.json, hold.json, all-cases.json (= pre-snapshot),
  pre-run359.json, defs.json.
- Rebuild from cold: `tools/reqx.py` (requirement diff), `tools/restamp.py` + `tools/dryrun.py`.
