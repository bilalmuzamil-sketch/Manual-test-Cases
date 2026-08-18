# Schedule — COVERAGE CURRENCY (both directions, Rule 43) — 2026-08-17

**Baseline:** the Fabian pass (`../fabian-review-2026-08-17/`) already ran the full v25→v30 requirement→
case re-derivation for the 14 new stories and re-validated every anchor (**0 orphaned**). This pass
extends that to the **whole suite**: it re-reads all 195 live cases against v30 and classifies each by
whether its content, or only its version pin, was stale.

## Direction 1 — requirement/story → case
Handled by the Fabian COVERAGE-REDERIVATION for the new scope (SV-9231…SV-9244). No NEW requirement is
uncovered by this pass (its job was currency of existing cases, not new authoring). The v27→v30 ladder
(from `../fabian-review-2026-08-17/SPEC-REINGEST-v25-v30.md`) is: **v26** label-only · **v27** §5.3 panel
collapse (covered) · **v28** notes "per shift" · **v29** the Schedule-V2 rewrite (the new stories) ·
**v30** "Business hours" label restore.

## Direction 2 — case → requirement (the whole-suite re-read this pass added)
Every one of the 195 cases was read against v30. Result:

| Classification | Count | Action taken |
|---|---|---|
| **Already current** (content correct AND provenance cites v30) | **47** | Left untouched (the Fabian pass cases). |
| **Content stale** (expectation diverged from v30) | **5** | Rewritten to v30 (see below). |
| **PO-question hold** (expectation genuinely unsettled) | **1** | Minimal v30 re-stamp, HOLD kept. |
| **Version-pin stale only** (content valid under v30, provenance cited v27) | **142** | Re-stamped to v30. |
| **Orphaned anchors** | **0** | — every §-anchor our cases cite still exists in v30. |

### The 5 content-stale cases and WHY (v30 wording each deviated from)
1. **SCH-DEL-01 (C30057)** — §7: options stated *"hours returned ('returns 8h' / 'returns 56h')"*; v30
   §7 says *"Each option states how many scheduled hours it removes."* (the remaining-hours model does
   not "return hours to the estimate"). → rewritten.
2. **SCH-DEL-02 (C30058)** — asserted *"the removed day's hours return to the estimate's remaining"*; v30
   §4.2 makes scheduled/estimate/clocked **three separate quantities**. → rewritten (scheduled hours drop;
   estimate/clocked unaffected).
3. **SCH-MODAL-06 (C30013)** — asserted notes are kept **per work order** and treated the build's
   per-shift behaviour as a bug; **spec v28** changed §4.9 to *"add, edit, and delete per shift."* The
   build is now correct against the spec. → rewritten to per-shift; the stale expect-fail removed
   (preserved in `KNOWN-FAILURES-FOR-SYNC-currency.md`). **This case is a genuine coverage gap the Fabian
   delta noted but did not fix** ("no dedicated existing case asserts the per-work-order form" — but this
   one did).
4. **SCH-START-05 (C29973)** — asserted a **separate "Unassigned" row** and the shift used **"the same
   anatomy as a regular shift"**; v30 §3.2/§4.2: the **department header row IS the unassigned lane** and
   the shift renders as a **fixed-width chip**. → rewritten; re-anchored SV-8688 → **SV-9234**.
5. **SCH-START-06 (C29974)** — asserted the unassigned start uses "business hours" only, tied to the old
   separate row; v30: dept-header lane, **business hours or the app-level default of 7:00 AM**, target
   date recorded. → rewritten; re-anchored → **SV-9234**.

### The 1 PO-question hold
- **SCH-DND-09 (C43555)** — Month-view drag-create behaviour is **genuinely unsettled** (v30 §4.1 does
  not name the view; story SV-8688 names only Week; open on **SV-8870**). Minimal v30 re-stamp only; its
  `HOLD - waiting on the product owner's answer` marker is **kept** (its blocker is a PO answer, not build
  availability). Listed as a blocker in the report.

## Contradiction sweep (Rule 28) — 0 live contradictions
- **Unassigned-lane group** (SCH-START-05/06/07, SCH-NAV-07, SCH-UNAS-01/02/03): all agree — dept-header
  lane + fixed-width chip; **none** asserts a separate row or "same anatomy". (SCH-START-05 explicitly
  says *"there is no separate 'Unassigned' row"* — a negation, not a contradiction.)
- **Notes group**: only SCH-MODAL-06 asserts notes — now **per shift**; no per-work-order assertion remains.
- **Delete-scope group**: no residual "returns hours to the estimate" language anywhere.
