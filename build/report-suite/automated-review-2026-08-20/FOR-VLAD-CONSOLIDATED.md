# FOR VLAD — consolidated Automated-case hand-off (2026-08-20)

**One list for Vladimir Tomovic (id 1)** of every Automated (or Vlad-bound) case **updated or created
this session**, so his automation adjusts once, correctly (Standing Rule 71 / §6.4 hand-off).

**This 2026-08-20 backlog-classification pass wrote 0 new cases** (see `CLASSIFICATION.md`): under the
2026-08-20 policy no held Automated case had a genuine Title/Preconditions/Steps/Expected content change
that was build-verified-and-held — every pending change was a marker lift, a stale-marker strip, or a
provenance re-stamp (none a content change), or was contested/unverified (REVIEW). So the only cases Vlad
needs from this session are the three already handed off during the WIP Story-5 design pass, consolidated
below.

## Cases changed / created this session (the whole list)

| C-id | Project | atm (live) | What changed (field) | Source reference | Build marker |
|---|---|---|---|---|---|
| [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) | Report Suite / WIP | **3 (Automated)** | **UPDATED** — Title + Preconditions + Steps + Expected re-worded to the Aug-13 design: hero figure renamed "Total Earned" → **Total Completed Work** = Completed Work on Open Work Orders + Work Orders Ready to Invoice; **removed** the old "coloured-underline / larger-font hero" assertion → assert the grouped **equation** instead. `refs` set to `SV-8661 (WIP Story 5; WIP design review 13 Aug 2026; epic SV-8582)`. | Epic SV-8582; WIP design review 13 Aug 2026 (boxes 1/4/6 + grouped equation 1) | **v3.8-d0e135e**, live-verified 2026-08-20 ($672,816.52 + $418,300.75 = $1,091,117.27) |
| [C43838](https://shopview.testrail.io/index.php?/cases/view/43838) | Report Suite / WIP | 1 (manual) | **RE-SCOPED** — Title + Expected: amber glow moved from the active TAB element → BEHIND the composing **summary widgets** per the bucket→widget mapping. `refs` moved SV-8593 → SV-8661. Marker `AUTOMATION: HOLD - needs one live build check` (glow not yet seen live; do NOT pin a hex). | Epic SV-8582; SV-8661 (WIP Story 5); WIP design review 13 Aug 2026 ("Tab click highlights its widgets") | **v3.8-d0e135e** (NOT build-verified — session dead) |
| [C43984](https://shopview.testrail.io/index.php?/cases/view/43984) | Report Suite / WIP | 1 (manual) | **NEW CASE** — long summary-figure / column labels wrap to a second row (no mid-word truncation, no ellipsis). Section 4361 (WIP — Visual & Accessibility). Marker `AUTOMATION: HOLD - needs one live build check`. | Epic SV-8582; SV-8661 (WIP Story 5); WIP design review 13 Aug 2026 ("Labels wrap to two rows") | **v3.8-d0e135e** (NOT build-verified — session dead) |

## Automation notes
- **C30488:** do NOT keep an automation check for a coloured underline / larger font on the hero figure —
  assert the **equation** (component sum = Total Completed Work) and that Total Completed Work is the
  equation's result. Live build shows uniform styling (intended new look, not a deviation).
- **C43838 / C43984:** both are `AUTOMATION: HOLD` — do not automate yet; they flip to READY once the
  behaviour is confirmed live (Rule-49 queue). C43838 is currently `atm=1` (no longer flagged Automated).

## Format note (for whoever automates)
These cases store the **interim `<br>` line-break form** (TestRail hazard #6, `APP-ACTIONS-PLAYBOOK.md`
§J): numbered items joined with literal `<br>`, provenance after `<br><br>---<br>`, marker last. Parse on
`<br>`, not on newlines. (A TestRail-UI Edit→full-stop→Save reflow pass is being applied — see
`FORMATTING-FIX-TODO.md` / the final report for status.)

**Durable register:** these three are already recorded in
`build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md` and
`build/report-suite/wip-design-review-2026-08-13/FOR-VLAD.md`.
