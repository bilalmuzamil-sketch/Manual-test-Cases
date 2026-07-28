# Report Suite — Chris Ward Answers Ingested — 2026-07-28

**Source:** Public Google Sheet, doc id `1Zz40yegTtpt3s5gfUZhvjpIYiXEVEgdm`, linked tab gid `2030595911`.
**Downloaded:** 2026-07-28 as `Chris-ReportSuite-Answers.xlsx` (full workbook, all tabs) + `Chris-ReportSuite-Answers-linked-tab.csv` (linked tab).
**PO:** Chris Ward. **Project:** Report Suite (epic SV-8582).
**Our questions doc:** `build/report-suite/PO-Questions-Chris-ReportSuite-2026-07-27.md`.

## Completeness (Standing Rule 17)

- **Total tabs in the workbook: 1** — `Questions for PO`.
- That single tab holds all 3 of the questions we asked; Chris answered **all 3** (none blank / TBD).
- Chris did NOT add any extra questions beyond our 3.
- Q3's answer contains a forward-looking commitment (a new click-through video to be filmed) — see the flag below.

---

## Tab 1 — `Questions for PO`

Sheet dimensions A1:F6. Row 1 = title banner. Row 2 = column headers: `# | Topic | What happens now | The question | Options | Your answer`.
Below are the three question rows, VERBATIM.

### Row 1 (Q1) — Topic: The "deactivate a sales rep" pop-up: how it closes

- **What happens now (verbatim):** "On the Sales By Representative report, when someone turns off a sales rep who still has customers assigned to them, a warning pop-up appears (it asks you to type \"YES\" to confirm). The written description says this pop-up should also close if you press the \"Esc\" key on the keyboard. But the app has a general house rule that pop-ups do NOT close with the \"Esc\" key. So the two say different things, and we don't know which one the finished app should follow."
- **The question (verbatim):** "For this \"deactivate a sales rep\" pop-up, should pressing the \"Esc\" key close it, or not?"
- **Options (verbatim):**
  - "A) Yes - pressing \"Esc\" should close the pop-up (matches the written description)."
  - "B) No - pressing \"Esc\" should NOT close it (matches the app's general house rule); use only the Cancel and X buttons."
- **Chris's answer (verbatim):** **"B."**

### Row 2 (Q2) — Topic: Each report uses a different permission to view it

- **What happens now (verbatim):** "These reports do not all use the same \"who is allowed to see this\" setting. The Sales By Customer report has its OWN dedicated permission. The Parts Velocity report and the Inventory Value report both reuse the existing inventory-reports permission. The Sales By Representative report is opened by anyone who can already see the other performance reports. We want to make sure this mix is on purpose before we lock in our tests for who can and cannot open each report."
- **The question (verbatim):** "Is it intended that each report is controlled this way (some have their own permission, some share an existing one), rather than all six using one single \"Reports\" permission?"
- **Options (verbatim):**
  - "A) Yes - this mix is intended; keep it as described."
  - "B) No - it should work differently (please tell us how)."
- **Chris's answer (verbatim):** **"B -- these should be gated by normal reports access"**

### Row 3 (Q3) — Topic: Are there any pictures or videos to check the reports against?

- **What happens now (verbatim):** "We wrote all of these report tests from the written descriptions only. There are no design pictures anywhere for these reports. Two of the written descriptions (Technician Utilization and Inventory Value) mention a \"companion video\" as a visual reference, but that video was never shared with us, so we cannot check the look-and-feel against it."
- **The question (verbatim):** "Are there any design pictures, mock-ups, or videos for these reports that we should test the screens against - including the \"companion video\" mentioned for the Technician Utilization and Inventory Value reports?"
- **Options (verbatim):**
  - "A) No - there are no pictures or videos; test from the written descriptions only."
  - "B) Yes - designs or a video exist and can be shared (please send them so we can check the screens)."
- **Chris's answer (verbatim):** **"B -- currently the best is my kickoff video that's pinned in the chat, though there's some visual issues with the kickoff as well (explained verbally). I'm going to film a much more condensed click-through tonight to make this easier :)"**

---

## Blank / ambiguous / TBD flags

- **No blank or "TBD" answers** — all 3 answered.
- **Q3 answer is time-dependent / not yet actionable as a static reference:** Chris points to an existing "kickoff video pinned in the chat" (which he says has its own visual issues) and commits to filming "a much more condensed click-through tonight." So the definitive visual reference does NOT exist in this sheet yet — a follow-up is needed to obtain (a) the pinned kickoff video and (b) the promised condensed click-through video once filmed. Treat the visual-conformance reference as PENDING those artifacts.

---

## Mapping to the 3 questions we asked

| Our Q# | Topic | Chris's answer | Resolution for our cases |
|---|---|---|---|
| Q1 | SBR "deactivate sales rep" pop-up — Esc vs Golden Rule | **B** — Esc should NOT close it (follow the app house rule; Cancel + X only) | **Golden Rule wins.** Reword SBR-DEACT-04 (C30255) so pressing Escape does NOT dismiss the confirm dialog; dismissal is via Cancel and the X only. VIU-confirm the shipped behaviour before finalizing. (Was authored to the spec's Esc-dismiss; that spec line is now overridden by Chris.) |
| Q2 | Per-report view permission model (mix of dedicated + shared) vs one Reports permission | **B** — "these should be gated by normal reports access" | Chris does NOT confirm the described mixed permission model. He wants the reports gated by **normal reports access** (a single/standard reports permission), not a per-report mix. This CONTRADICTS the engineering "as-designed" mix (SBC dedicated atom, PV/IV inventory-reports, SBR performance group, etc.). Needs reconciliation: our permission cases (SBC-PERM-01/02 C30098/C30099; SBR-PERM-01/02 C30198/C30199; PV-PERM-01/03 C30325/C30327; TU-NAV-01/07 C30392/C30397; WIP-PERM-01/02 C30526/C30527; IV-PERM-01/02 C30603/C30604) were authored to the mixed model. Flag the conflict (Chris's product intent vs engineering's shipped atoms) to the user/dev — determine whether the code will change to "normal reports access" or whether Chris's answer needs a follow-up clarification, and VIU-confirm the actual live gating per report. |
| Q3 | Any designs/videos (incl. the TU + IV "companion video") | **B** — yes, a video exists: the pinned kickoff video (has some visual issues), plus a condensed click-through Chris will film "tonight" | A visual reference DOES exist / is coming, so visual-conformance cases are NOT spec-only-forever. Obtain the pinned kickoff video now and the promised condensed click-through when filmed, then run a design/video-reconciliation pass with VIU on all Visual Conformance cases (SBC-VIS-01..03 C30185–C30187; SBR-VIS-01..05 C30305–C30309; PV-VIS-01..03 C30385–C30387; TU-VIS-01/02 C30447/C30448; WIP-VIS-01..07 C30519–C30525; IV-VIS-01..07 C30596–C30602). |

### Coverage check vs our doc
- **All 3 of our questions were answered** (none left unanswered).
- **Chris added no extra questions.**
- The sheet is a verbatim copy of our PO-Questions doc (same #, Topic, What-happens-now, Question, Options) with the "Your answer" column filled in.
