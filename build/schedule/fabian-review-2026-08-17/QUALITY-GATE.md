# Ruthless Usefulness Audit (Rule 28) — Schedule Fabian-review pass — 2026-08-17

**Population: the 21 cases this pass touched** — 19 new (C43795–C43813) + 2 updated (C30054, C29931).
Cold-read, no sampling. Three dimensions scored together. **The audit only RECOMMENDS.**

## Dimension 1 — USEFUL (KEEP / MERGE / WEAK-KEEP / CUT)
All 19 new cases: **KEEP.** Each asserts a distinct observable behaviour whose failure is a real,
reportable bug, and none is covered elsewhere (verified: zero SV-92xx coverage existed before this
pass). Load-bearing coverage credited: the resolved-hours *model* (SCH-START-09) underpins sizing,
spread, capacity and conflicts; remaining-hours sizing (SCH-DND-10/11) is a calculation contract;
capacity/conflict *exclusion* of unassigned shifts (SCH-UNAS-02, SCH-CAP-05) is exactly the kind of
edge a suite usually misses. No near-duplicate slop: the two-per-story splits (DND-10/11, UNAS-01/02,
SPREAD-13/14, WOL-07/08, MODAL-09/10, DAY-08/09) each assert genuinely different things (Rule 45(e)),
not a sort-direction/per-column explosion. **0 MERGE / 0 CUT / 0 WEAK-KEEP.**
Both updates: **KEEP** — they correct assertions a tester would actively mis-mark on a correct build.

## Dimension 2 — MAKES SENSE (SENSIBLE / FIX-WORDING / NONSENSE)
All 21: **SENSIBLE.** Every case's steps are executable in order, each precondition is reachable
(seedable per Rule 14), and each expected result follows from the steps. Spot embarrassment-check
(KEEP-but-NONSENSE): none — e.g. SCH-DND-11's "below 0.25h → told nothing remains" is reachable by its
own precondition (a WO with <15 min remaining). No impossible maths, no cost/sell conflation, no
control referenced that is absent from spec v30 or the owning story (every label — "Today only",
"Assign work order", "Create {N} shifts", "{N}h left to schedule", "+N more / click to view all",
"Hide panel"/"Show panel", the 7am–7pm default — is quoted from the story/spec, not invented; anything
not pinned is marked VIU-confirm in the case notes/design_ref).

### CROSS-CASE CONSISTENCY SWEEP — the important part
Grouping by the control asserted on surfaced **5 CONTRADICTION groups** between a NEW case and an
EXISTING (not-yet-updated) case. **Each is RESOLVED IN DIRECTION by Rule 32 (the newer authoritative
story wins) and the existing case is flagged for the follow-up UPDATE batch** — so the suite is NOT
delivered with a silent contradiction; every one is named with its resolution:

| New case (authoritative) | Existing case in tension | The contradiction | Resolution |
|---|---|---|---|
| SCH-SPREAD-12 (six options incl "Today only") | SCH-SPREAD-03 = C29979 (old preset list, Full-estimate default) | Different option sets | **Update SCH-SPREAD-03** to the new six-option set (SV-9236). Deferred → flagged. |
| SCH-CAP-05 (tooltip TRUNCATED + click-to-modal) | SCH-CAP-04 = C30033 (tooltip shows full per-tech breakdown) | Tooltip completeness | **Update SCH-CAP-04** to the truncated form (SV-9241). Deferred → flagged. |
| SCH-CONF-08 (one hours source; neither set = no conflict) | SCH-CONF-02/03 = C30024/C30025 (before/after-hours, no single-source qualifier) | Whether both sources can fire | **Update SCH-CONF-02/03** to single-source (SV-9233). Deferred → flagged. Note: complementary on WHICH conflicts fire, but the single-source qualifier must be added. |
| SCH-DND-10 (sized by estimate MINUS clocked) | SCH-DND-01/04 (sized by estimate) | Sizing basis for a started WO | **Update SCH-DND-01/04** to remaining-hours (SV-9232). Deferred → flagged. (They agree for a not-started WO.) |
| SCH-REAS-08 + updated C30054 (three menu items) | — | RESOLVED THIS PASS: C30054 updated to three items | ✅ aligned |
| SCH-UNAS-01 + updated C29931 (dept header = unassigned lane) | — | RESOLVED THIS PASS: C29931 updated | ✅ aligned |

**Also flagged for alignment (no live contradiction, but the existing case is now incomplete against
the newer story):** SCH-SPREAD-04/05/08 (derive fields, summary/confirm labels — SV-9237),
SCH-WOL-02/04 (vehicle + clocked + vehicle-in-search — SV-9239), SCH-MODAL-02/03 (per-line + typed —
SV-9240), SCH-DAY-01/04/05 (auto-scroll triggers, 15-min snap + time chip — SV-9244),
SCH-START-03/07 (7am–7pm default; parked-shift assign — SV-9231/9235), SCH-PANEL-01…06 (re-anchor
refs SV-8686 → SV-9243).

**⇒ 0 contradictions delivered unresolved.** The 5 above are resolved in direction (Rule 32) with the
existing case explicitly queued for the UPDATE batch; the pass report carries the full list.

## Dimension 3 — GENUINE + LAYMAN-RUNNABLE
All 21 trace to ticket + spec (refs = owning story + spec anchor; provenance line names epic + story +
spec v30 + read-date). All are written in plain layman English, numbered preconditions/steps/expected,
titles ≤ 80 chars, build-accurate labels quoted from the sources. A non-technical manual tester can
run each — subject only to the build-availability caveat the Rule-69 marker states honestly.

## The tally that ships (the proof against "AI slop")
**21 touched · KEEP 21 · MERGE 0 · CUT 0 · WEAK-KEEP 0 · NONSENSE 0 · FIX-WORDING 0.**
Is the critic right? **Waste: 0% of this pass's cases.** **Makes-no-sense: 0%.** Contradictions found
5, all resolved in direction with the counterpart flagged for update (0 delivered unresolved).

**Honest limit:** this audit scores the 21 cases this pass touched. It does NOT re-audit the other 155
Schedule cases; and because build verification was deferred, "runnable on the current build" is
unproven for all 21 (that is what the Rule-69 marker records, and what the later sync resolves).

---

## RE-RUN over the 28 v30-alignment UPDATES — 2026-08-17 (this pass)

**Population: the 28 existing cases updated to v30 this pass** (list in the completion report). Cold-read,
no sampling; three dimensions together. Full method + evidence in `POST-WRITE-AUDIT.md`.

- **Dimension 1 (USEFUL):** 28/28 **KEEP** — each corrects an assertion a tester would actively mis-mark
  on a v30 build (e.g. remaining-hours sizing, six-option spread, single-source conflicts, truncated
  capacity tooltip, weekends-only skip). 0 MERGE / 0 CUT / 0 WEAK-KEEP.
- **Dimension 2 (MAKES SENSE):** 28/28 **SENSIBLE** — steps reachable, expected follows from steps,
  labels quoted from v30. **CROSS-CASE SWEEP over all 195 cases: 0 live contradictions.** The **5
  contradiction groups the prior pass resolved only IN DIRECTION are now resolved IN CONTENT** — the
  updated existing case carries the same v30 assertion as its newer counterpart (SPREAD-03↔six-option,
  CAP-04↔truncated tooltip, CONF-02/03↔single-source, DND-01/04↔remaining-hours, NAV-07/START-07↔dept
  unassigned lane). Two raw sweep hits were verified benign/out-of-scope (C30075 incomplete-not-
  contradictory; C30015 a separate open PO question) — neither is a delivered contradiction.
- **Dimension 3 (GENUINE + LAYMAN-RUNNABLE):** 28/28 — refs = owning story + v30 anchor; provenance
  names epic + story + spec v30 + read-date 17 Aug 2026; plain layman English; titles ≤ 80 chars.

**Tally: 28 touched · KEEP 28 · MERGE 0 · CUT 0 · NONSENSE 0 · contradictions delivered 0.**
Waste 0% · makes-no-sense 0%. **The 5 prior in-direction contradictions are now 0, resolved in content.**
Honest limit: build verification deferred, so "runnable on the current build" is unproven for all 28
(what the Rule-69 marker records; the later sync resolves it).
