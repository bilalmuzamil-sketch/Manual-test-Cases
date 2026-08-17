# POST-WRITE ASSERTION RE-AUDIT (core §2.10) — Schedule v30-alignment — 2026-08-17

**Population:** the **28 existing cases updated to v30 this pass**. The audit runs AFTER the writes
(core §2.10 — an audit committed before the repair does not audit the repair). Method: split each
`custom_expected` into body / provenance / marker; a case is **MATERIAL** only if title / preconds /
steps / the EXPECTED BODY moved. **All 28 are material** (this pass changed bodies/labels), except the
two title-only fixes (SCH-NAV-07 C29931, SCH-REAS-03 C30054) whose bodies were sent verbatim.

For every material case, four checks (core §2.10): (1) the new assertion **quotes back to its cited
source** (v30 spec + owning story); (2) the assertion is **reachable by the case's own steps**;
(3) the content **belongs to this case**; (4) note paragraphs diffed, not only numbered assertions.

## Result — 28 of 28 PASS

| Check | Result |
|---|---|
| (1) new assertion quotes back to v30 / the story | **28/28 PASS** — every body was authored FROM the v30 storage body (`SPEC-REINGEST-v25-v30.md` §2); no assertion rests on the build (build deferred). Sample quote-backs below. |
| (2) reachable by the case's own steps | **28/28 PASS** — steps were updated alongside bodies where a new assertion needed a new step (e.g. SCH-SPREAD-03 step 3 now picks 'Today only'; SCH-WOL-04 step 4 now searches the vehicle; SCH-DAY-01 step 4 changes the grid range). |
| (3) content belongs to this case | **28/28 PASS** — no case gained text naming another screen/report; the PANEL bodies are the case's own numbered items with the pre-v30 build-observation paragraph removed. |
| (4) note-paragraph diff | **the build-observation / "what you should see today" paragraphs were REMOVED** from SCH-START-07, SPREAD-04, SPREAD-08, DAY-04, EDGE-05 and all six PANEL cases — because build verification is deferred (Rule 69) and the observation was against a superseded build (v3.5-65d6500). The tickets they named are preserved in `KNOWN-FAILURES-FOR-SYNC.md` so the later build-verify sync re-establishes them. **No waiver ("known and accepted"/"on purpose for now") was added to any case** (the §2.10 disarm signature). |

**Sample quote-backs (requirement text ↔ case assertion, side by side, Rule 45(e)):**
- **SCH-DND-01 C29955** asserts *"sized by the line's remaining hours (its estimate minus any hours
  already clocked)"* ↔ v30 §4.2 *"A shift is sized by the scope's estimate minus the hours already
  clocked against it."* ✔
- **SCH-SPREAD-03 C29979** asserts the six options incl *"Today only"* and *"offered ONLY when that
  span's capacity is less than the scope's hours"* ↔ v30 §4.5 *"Full estimate, Today only, 1 week … Today
  only, 1 week, and 2 weeks appear only when the span's capacity is less than the scope's hours."* ✔
- **SCH-CONF-02 C30024** asserts *"evaluated against a single source … never both together. When
  neither is set there is no hours conflict"* ↔ v30 §4.11 *"Hours conflicts are evaluated against a
  single source … The two are never checked together. When neither is set there is no hours conflict."* ✔
- **SCH-SPREAD-07 C29983 / SCH-EDGE-05 C30089** assert *"skips weekends … shop closures, public
  holidays and booked days are NOT skipped"* ↔ v30 §4.5/§12 *"skipping weekends. Nothing else is
  skipped: shop closures, public holidays, and days the technician is already booked all receive
  shifts."* ✔

## CROSS-CASE CONTRADICTION SWEEP (Rule 28 dimension 2) — 0 delivered unresolved

Full-suite opposite-assertion sweep across all **195** Schedule cases (bulk `get_cases`, grouped by the
control asserted on). Five stale-v27 phrasings searched; **0 real contradictions.** Three raw hits, all
verified benign:

| Case | Why flagged | Verdict |
|---|---|---|
| **C29931** (my updated SCH-NAV-07) | matched "separate tray" | **FALSE POSITIVE** — it NEGATES it (*"not a separate tray or panel"*), the correct v30 assertion. |
| **C30075** (SCH-PERM view-only) | lists "Create Event"/"New Work Order" absent, not "Assign work order" | **NOT a contradiction, OUT OF SCOPE** — a view-only user sees NO creation menu at all, so all items are absent; the case is merely INCOMPLETE against v30's third menu item. **Flagged for a follow-up 1-line touch** (add "no 'Assign work order'"); it is a permission case (owning story SV-8703), not in the SCH-FR-2 alignment list. |
| **C30015** (SCH-MODAL-08 Delete-only) | provenance says "two different ways / PO decision awaited" | **GENUINE SEPARATE OPEN QUESTION, OUT OF SCOPE** — about the modal Reassign action (§4.9 vs §7 stacking), NOT shop-closures. v30 does not clearly resolve it. **Left untouched** per the task ("a genuine PO product decision … DO NOT act on it; keep it flagged"). |

**The 5 quality-gate contradiction pairs are RESOLVED IN CONTENT** (not just in direction): the updated
existing cases now carry the v30 assertion their newer counterpart carries — six-option spread
(SPREAD-03), truncated capacity tooltip (CAP-04), single-source conflicts (CONF-02/03), remaining-hours
sizing (DND-01/04), and the department-header unassigned lane (NAV-07, START-07). **0 contradictions
remain live.**

## Verdict
**28/28 material cases re-audited PASS; 0 unsourced assertions; 0 disarming waivers added; 0 live
contradictions.** Two out-of-scope items flagged (C30075 incomplete, C30015 open PO question).
