# Filters (Work Orders page) — Questions for Branko — 2026-07-17

Plain-language product questions only (no bugs, no test jargon).
Please pick an option (or write your own answer) for each.

## Question 1 — Filters on the Parts and Reports pages

**What happens now:** The final design pictures show the same new filter buttons not only on the Work Orders page, but also on nine Parts pages and on all the Reports pages. However, the written description we received only talks about the Work Orders page - it says nothing about Parts or Reports.

**The question:** Are the filters on the Parts pages and the Reports pages part of this release, and should we test them now? If yes, is there a written description for them like the one we have for Work Orders?

**Options:**

- A) Yes - they are part of this release; a write-up exists or will be provided, and they should be tested now.
- B) No - only the Work Orders page is in this release; Parts and Reports come later.

**Your answer:** ____________________

## Question 2 — How long the app remembers your filters

**What happens now:** The write-up says two slightly different things. In one place it says your chosen filters are kept only until you close the browser. In another place it says they are saved for you and come back whenever you return to the page - which sounds like they would still be there even after closing the browser or logging out.

**The question:** When someone picks filters on the Work Orders page, how long should the app remember them?

**Options:**

- A) Only until they close the browser - after that the page starts fresh.
- B) Remembered for that person permanently - the filters are still there the next day, even after closing the browser or logging out.

**Your answer:** ____________________

## Question 3 — Spelling of "Lead Technician"

**What happens now:** In several of the design pictures the word is misspelled as "Lead Tehnician" (the letter c is missing) - for example in the list column heading and in the mobile filter list. In other places in the same designs it is spelled correctly.

**The question:** Can you confirm the app will ship with the correct spelling "Lead Technician" everywhere, and that the misspelling in the designs will be fixed?

**Options:**

- A) Yes - it must read "Lead Technician" everywhere; the design will be corrected.
- B) Something else (please explain).

**Your answer:** ____________________

## Question 4 — The Status filter on the Estimates and Completed tabs

**What happens now:** The write-up says that on the Estimates and Completed tabs the Status filter button should be hidden completely (those tabs already show only one status). But the design picture of the Estimates tab shows the Status button still there - greyed out, pre-filled with "Status: Estimate", and not clickable.

**The question:** On the Estimates and Completed tabs, what should the Status filter button do?

**Options:**

- A) Hidden completely - the button is not there at all (as the write-up says).
- B) Shown but greyed out, pre-filled with the tab's status, and not clickable (as the design picture shows).

**Your answer:** ____________________

---

## QA Internal Mapping (QA-only — not for the PO)

TestRail C-ids are blank until a permitted push (`build/filters/testrail-id-map.csv`, Standing Rule 8).

| Q# | Affected internal case IDs | Spec / design refs | Resolves to |
|---|---|---|---|
| 1 | (no cases authored - deliberate) | design-notes.md §B.5 (9 Parts screens) + §B.6 (22 Reports screens) are in the final ZIP design set but NO spec story covers them (requirements.md Stories 1-12 are all Work Orders page). Scope ruling recorded in coverage-matrix.md §C. | A -> request the Parts/Reports spec from Branko, then author dedicated case sections (est. +30-50 cases) as a scope extension. B -> keep the 79-case WO-only suite; Parts/Reports screens stay listed as excluded-with-reason in coverage-matrix.md §C. |
| 2 | FLT-PERS-02, FLT-PERS-01, FLT-PERS-03 | requirements.md OQ-5: S10-R2 ('for the duration of the browser session') vs §2/§4 ('saved per user and reloaded when they return'). FLT-PERS-02 is authored to the common ground (same-session persistence) with the tension flagged in its notes. | A -> FLT-PERS-02 stays as-is; add an explicit negative expectation that a browser restart clears the filters. B -> extend FLT-PERS-02 (or add a case) to verify filters survive browser close + re-login, per user. |
| 3 | FLT-BAR-02, FLT-TECH-01, FLT-MOB-02, FLT-MOB-06 | design-notes.md §C.1: 'Lead Tehnician' recurs in the final ZIP set (WO table column header + mobile sheet rows); the filter chip itself is spelled correctly. All cases are authored with the CORRECT 'Lead Technician' and carry typo-flag notes. | A -> no case change; at VIU, if the build shows 'Tehnician' anywhere, file a bug (do NOT rewrite cases to the typo). B -> per Branko's explanation. |
| 4 | FLT-TAB-02, FLT-TAB-03, FLT-BAR-03 | Spec S2-N1/S2-N2/S9-R2/S9-R3 say the Status chip is HIDDEN on Estimates/Completed; final design frame 11972:32318 shows a pale/disabled 'Status: Estimate' chip (design-notes §C.7). Cases authored to the spec's intent (no USABLE Status filter) so they hold under either answer. | A -> tighten FLT-TAB-02/03 expected to 'chip not present at all'. B -> rewrite FLT-TAB-02/03 expected to 'chip shown disabled, pre-filled with the tab status, not clickable'. |
