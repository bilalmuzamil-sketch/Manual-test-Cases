# Batch A — DIVERGENCES (Schedule build-verify, 2026-08-18, `v3.8-bd246fd`)

**The category test, asked of every difference between source and build:**
*Would a reader of the SOURCE recognise what the BUILD offers as the same thing?* — YES = cosmetic
(correct + log), NO = substantive (record both texts, raise, never silently rewrite).

**61 cases walked. Cosmetic label/route drift found: 0** (every on-screen label, route and control
matched the case wording — no label correction was needed; the writes changed only the provenance line
and the automation marker). **Substantive divergences: 1 (D1 below).** Additionally, 3 features were not
found in the build and 1 could not be established — these are recorded as Rule-69 deferrals in
`A-FINDINGS.md §3` and `DEFERRED-RUN.md`, not as label divergences.

## D1 (SUBSTANTIVE) — the sidebar Filters panel is missing the Priority group
| | |
|---|---|
| Cases | **C29942** (https://shopview.testrail.io/index.php?/cases/view/29942), **C29945** (https://shopview.testrail.io/index.php?/cases/view/29945) |
| **SOURCE says (spec §5.1 / story SV-8687)** | the Filters panel offers *"three groups: Assignment (Assigned, Unassigned), Status … and Priority (High, Medium, Low)"* |
| **BUILD offers (live)** | Filters popup = Assignment (Unassigned/Assigned) + Status (Approved/Declined/In Progress/Ready for Review) **only**. No Priority group; no High/Medium/Low. Detector proven able to fire (found Assignment + Status checkboxes; a Priority section would render identically). |
| Category | **SUBSTANTIVE** — a reader of §5.1 would NOT recognise a two-group panel as the three-group Priority-bearing panel. The Priority sub-feature does not exist on the build. |
| What was done | **C29945** (tests the Priority filter itself) → **Rule-69 DEFERRED** (`AUTOMATION: Not available on Build to test Yet - Last checked 8/18/2026` + under-development line + `DEFERRED-RUN.md` row). **C29942** (tests the panel composition) → **kept plain `AUTOMATION: READY`** — the panel + Assignment/Status + badge + narrowing are present and runnable, so a manual tester executes it and sees 2 of 3 groups. Neither expectation was rewritten (guard 1). |
| Raised to QA lead | **YES — flagged here + in `A-FINDINGS.md §D1`. NO Jira filed** (creation on hold). Recommendation: confirm with Branko whether sidebar Priority filtering is in V1 scope. |

## Not label-divergences, recorded elsewhere (Rule 69, `A-FINDINGS.md §3`)
- **C43812** day-view zoom control — not found in the build.
- **C30005** shift edge-resize — no `fc-event-resizer` handles; not enabled.
- **C43813** day-view continuation chevron on a clipped block — mechanism exists in Week view; the
  day-view clip scenario could not be produced (no data / no zoom) → NOT-ESTABLISHED, kept deferred.

---

# Batch B — DIVERGENCES (Schedule build-verify, 2026-08-19, `v3.8-bd246fd`)

**The category test, asked of every difference: *Would a reader of the SOURCE recognise what the
BUILD offers as the same thing?* YES → COSMETIC; NO → SUBSTANTIVE.**

Batch B walked 66 cases. **1 cosmetic layout divergence** (scope-picker wording), **0 substantive
route/screen absences that strand a tester**, plus **2 build-vs-source deviations** and **1
environment-limited observation** already recorded in `B-FINDINGS.md §2` (not label divergences).

### D-B1 — Scope picker: "pinned whole-order row" vs a two-TAB layout (COSMETIC)
- **Cases:** C29963 [/29963](https://shopview.testrail.io/index.php?/cases/view/29963), C29964
  [/29964](https://shopview.testrail.io/index.php?/cases/view/29964), C29965
  [/29965](https://shopview.testrail.io/index.php?/cases/view/29965).
- **What the SOURCE/case says:** a *"pinned whole-order row"* at the top with the line rows below it;
  *"Schedule whole work order"*; *"tapping a line row"* creates a single-line shift.
- **What the BUILD offers:** two tabs — **"Entire work order"** (`tab_drop_whole_order`) and
  **"Choose lines"** (`tab_drop_choose_lines`); under Choose lines the lines are **checkbox rows**
  with **Select all**, a **search** box and **All / Unscheduled** scope chips, confirmed with a
  **"Select lines"** button; whole order confirms with **"Create 1 shift"**.
- **Verdict: COSMETIC** — a reader recognises "schedule the whole order vs pick individual lines" as
  the same choice; the concept and outcome are identical, only the layout (tabs + checkboxes) differs.
- **Action:** recorded, **body left byte-identical this pass** (build-verify sets marker + provenance
  only, as batch A did). Marker `READY`. **Recommend a light authoring touch-up** (skill 01/02) to
  re-word the scope-picker steps to the tab/checkbox labels so a tester reads exactly what is on
  screen — noted rather than rewritten here to avoid changing expected wording during a build-verify
  pass.

### Not label-divergences, recorded in `B-FINDINGS.md §2` (Rule 69 / §15.1)
- **C29962** click-to-arm — absent from the build; **SV-8957 OBSOLETE** → plain `READY`, deviation.
- **C43555** Month-view drag-create — does nothing; **SV-8870 OBSOLETE** → plain `READY`, open PO
  question preserved in the provenance.
- **Spread cases (C29979/29982/29983/29984/43802/43804)** — the multi-day spread dialog reports
  *"Couldn't read this shop's working hours"* on Heavy Duty 9919 while the board API resolves them;
  feature present, resolved-hours preview not driven (honest N-of-M). No label change.
