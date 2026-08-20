# FOR VLAD — WIP Story-5 Automated-case change hand-off (2026-08-13 design review)

**Why this list:** these cases feed automation. An un-communicated change that breaks
automation gets blamed on us, so here is the precise change + the source reference for
every AUTOMATED (`custom_atmstatus=3`) case touched this pass (QA-lead authorised
2026-08-20). Source of record for all of it:
`build/report-suite/wip-design-review-2026-08-13/DESIGN-REVIEW-AUG-13.md`
(artifact https://claude.ai/code/artifact/42c35f46-2796-467e-9723-7daa5385446e).
Broader automated-case register: `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`.

## Automated cases UPDATED this pass

| C-id | atm | What changed (title / preconds / steps / expected) | Source reference |
|---|---|---|---|
| [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) | 3 | **Title** old "Total Earned is the hero figure and equals the started-stage figures summed" → new "Total Completed Work is the hero total equal to its two completed-work figures". **Preconds** "non-zero earned values" → "non-zero completed values". **Steps** renamed the two summed figures (Started — Earned + Ready to Invoice → Completed Work on Open Work Orders + Work Orders Ready to Invoice) and re-pointed the hero-styling look-check to Total Completed Work. **Expected** now: (1) Total Completed Work is the headline (hero) total the completed-work equation resolves to (Completed Work on Open Work Orders + Work Orders Ready to Invoice = Total Completed Work); (2) Total Completed Work equals those two, to the cent. **`refs` set** to `SV-8661 (WIP Story 5; WIP design review 13 Aug 2026 - Total Completed Work hero = Completed Work on Open Work Orders + Work Orders Ready to Invoice; epic SV-8582)`. | Epic SV-8582; WIP design review 13 Aug 2026 (boxes 1/4/6 + grouped math equation 1). Live-verified: build v3.8-d0e135e, 2026-08-20 — $672,816.52 + $418,300.75 = $1,091,117.27. |

### ⚠️ Automation impact to note on C30488
- **The old assertion "Total Earned is shown LARGER with a COLOURED UNDERLINE" is REMOVED.**
  The 13 Aug design review replaced the big-figure-plus-underline hero styling with the
  **grouped-equation layout**, in which Total Completed Work is simply the total the first
  equation resolves to. **Do NOT keep an automation check for a coloured underline / larger
  font on this figure** — assert the **equation** (component sum = Total Completed Work) and
  that Total Completed Work is the equation's result, not a specific font size or underline.
- The live build (v3.8-d0e135e) showed uniform figure styling (no distinct coloured
  underline) — consistent with the new grouped-equation design, so this is **not** a
  deviation, it is the intended new look.

## Aug-20b pass — tab-glow rework + label-wrap new case

| C-id | atm | New / changed | Source reference |
|---|---|---|---|
| [C43838](https://shopview.testrail.io/index.php?/cases/view/43838) | 1 (manual) | **RE-SCOPED.** Old: amber glow on the active TAB element. New: selecting a line-state tab puts a faded amber glow BEHIND the composing summary widget(s) per the mapping — Approved - Partially Completed -> Completed Work on Open Work Orders + Remaining Work on Open Work Orders; Approved - Not Started -> Work Orders Not Started; Completed -> Work Orders Ready to Invoice; Estimates -> Estimates. **Title changed** to "Selecting a bucket tab glows its composing summary widgets (amber)". **`refs` moved** from SV-8593 (shell) to SV-8661 (WIP Story 5). Marker now **`AUTOMATION: HOLD - needs one live build check`** (glow not yet observed live; exact amber shade/style TBD — do NOT pin a hex until confirmed). | Epic SV-8582; WIP design review 13 Aug 2026 (artifact https://claude.ai/code/artifact/42c35f46-2796-467e-9723-7daa5385446e), "Tab click highlights its widgets". NOT build-verified (session dead; build v3.8-d0e135e). |
| [C43984](https://shopview.testrail.io/index.php?/cases/view/43984) | 1 (manual) | **NEW.** Long summary-figure / column labels wrap to a second row (no mid-word truncation, no ellipsis). Section 4361 (WIP — Visual & Accessibility). Marker **`AUTOMATION: HOLD - needs one live build check`**. | Epic SV-8582; SV-8661 (WIP Story 5); WIP design review 13 Aug 2026, "Labels wrap to two rows". NOT build-verified (session dead; build v3.8-d0e135e). |

**Automation note:** both are `AUTOMATION: HOLD` — do not automate yet; they flip to READY (or the
under-development treatment) once cookies return and the behaviour is confirmed live
(Rule-49 queue `RECHECK-QUEUE.md`).

## Automated cases left UNCHANGED
- None. C30488 is the only `custom_atmstatus=3` case among the ten held Story-5 cases; all
  nine others are `custom_atmstatus=1` (manual) and were handled in the main pass.

## Format note for whoever automates these
All ten cases now store the **interim `<br>` line-break form** (TestRail hazard #6,
`APP-ACTIONS-PLAYBOOK.md` §J) — numbered items are joined with literal `<br>`, the
provenance line follows `<br><br>---<br>`, and the `AUTOMATION:` marker is last after
`<br><br>`. Parse on `<br>`, not on newlines.
