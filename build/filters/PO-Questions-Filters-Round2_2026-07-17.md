# Filters (Work Orders page) — Questions for Branko — Round 2 — 2026-07-17

Plain-language product questions only (no bugs, no test jargon).
Please pick an option (or write your own answer) for each.

## Question 1 — Two older sentences in the write-up to correct

**What happens now:** When you update the write-up to add the other pages (as you mentioned), two older sentences in it no longer match your decisions. First, the write-up still says the Status choice is hidden on the Estimates and Completed tabs - but your decision was that it shows greyed-out and pre-filled there. Second, the write-up still says your chosen filters are kept only until the browser is closed - but your decision was that they are remembered permanently.

**The question:** When you update the write-up, will you also correct these two places so the write-up matches your decisions?

**Options:**

- A) Yes - I'll fix both sentences in the new write-up.
- B) Something else (please explain).

**Your answer:** ____________________

## Question 2 — A status called "Reported" in the interactive demo

**What happens now:** In the interactive design demo you shared, the list of work-order statuses shows a status called "Reported". The Figma design shows "Imported" instead - and "Reported" doesn't exist there.

**The question:** Which is correct - "Imported" or "Reported"?

**Options:**

- A) "Imported" is correct - the demo has a typo.
- B) "Reported" is a real status - please tell us more.

**Your answer:** ____________________

## Question 3 — Do the filter lists depend on the user's role?

**What happens now:** The write-up doesn't say whether what a person can pick in the filters depends on their role. For example, should a technician see every customer and advisor in the filter lists, or only what their role allows?

**The question:** Do the filter lists depend on the user's role?

**Options:**

- A) No - everyone sees the same filter options.
- B) Yes - some roles see fewer options; please describe which.

**Your answer:** ____________________

---

## QA Internal Mapping (QA-only — not for the PO)

TestRail C-ids from `build/filters/testrail-id-map.csv` (populated 79/79, Standing Rule 8).

| Q# | Affected internal case IDs | Spec / design refs | Resolves to |
|---|---|---|---|
| 1 | FLT-TAB-02 (C29609 - https://shopview.testrail.io/index.php?/cases/view/29609), FLT-TAB-03 (C29610 - https://shopview.testrail.io/index.php?/cases/view/29610), FLT-PERS-02 (C29614 - https://shopview.testrail.io/index.php?/cases/view/29614) | Stale spec passages: S2-N1/S2-N2 + S9-R2/S9-R3 ('Status chip hidden on Estimates/Completed' - superseded by Branko 2026-07-17 answer Q4=B: disabled pre-filled chip) and S10-R2 ('kept for the duration of the browser session' - superseded by answer Q2=B: permanent per-user persistence). Cases C29609/C29610/C29614 were ALREADY updated + pushed to TestRail 2026-07-17 (branko-answers-2026-07-17/testrail-update-log.md); this question is a spec-cleanup reminder riding on his announced PRD update (Q1=A - Parts/Reports sections coming). | A -> no QA action beyond re-checking the new PRD text against the already-updated cases when it arrives. B -> reconcile whatever he says against the Q2=B/Q4=B rulings (last-update-wins) and re-open the 3 cases only if he reverses himself. |
| 2 | FLT-STAT status-list cases, esp. FLT-STAT-01 (C29560 - https://shopview.testrail.io/index.php?/cases/view/29560) | Design-system zip prototype status-list anomaly (new-inputs-inventory-2026-07-17.md; PROJECT-STATE WHAT'S-LEFT item 4): the coded prototype's 9-status list ends in 'Reported' where the Figma 9-status list (design-notes.md) ends in 'Imported'; 'Reported' exists nowhere in the Figma frames. Zip = reference prototype only, not authoritative frames. | A -> no case change (cases are authored to the Figma/spec list with 'Imported'); note the demo typo and move on. B -> update the status option list in the FLT-STAT cases (and any case enumerating the 9 statuses) to include 'Reported' per Branko's detail; TestRail edits need fresh user authorization. |
| 3 | FLT-CUST-01 (C29566 - https://shopview.testrail.io/index.php?/cases/view/29566) + FLT-CUST dropdown-content cases, FLT-TECH-01 (C29575 - https://shopview.testrail.io/index.php?/cases/view/29575) + FLT-TECH dropdown-content cases, FLT-ADV-01 (C29582 - https://shopview.testrail.io/index.php?/cases/view/29582) + FLT-ADV dropdown-content cases | requirements.md OQ-4 (permissions): the spec has NO permissions/role section - S1 prerequisite is only 'The user has access to the Work Orders page'. Affects what the Customer / Lead Technician / Service Advisor dropdowns list per role. | A -> OQ-4 closed; dropdown-content cases stay role-agnostic; at VIU verify the lists once as any role. B -> author new role-based filter cases at VIU (per-role dropdown scoping), extend the dropdown-content cases with role preconditions; add_case push needs fresh user authorization. |
