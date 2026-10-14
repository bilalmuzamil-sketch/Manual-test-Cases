# WO Board & Tech View — behaviour changes from PRD v49 → v52 (14 Oct 2026, night)

Spec: `../po-defects-2026-10-14/CONFLUENCE-845185030-now-2026-10-14.md` (v52). Full text diff v49→v52 read 100%:
`../po-defects-2026-10-14/PRD-TEXT-DIFF-v49-vs-v52.txt` (12 rules added: S1-R9a, S1-R9b, S1-R15, S1-R15a, S1-R15b, S2-R19, S2-R20,
S2-R21, S2-R22, S3-R23, S6-R2a, S9-R1a; 2 rewritten: S5-R4, S7-R7; Feature Overview filter sentence and Tech View description
reworded; Out of Scope adds Department filter, retired Customer/Service Advisor chips, rank numbers). Every other line identical.
Live snapshot of the 248 run-498 cases: `snapshots-before/live-cases.json` (taken 14 Oct night). Vladimir's 18 cases not in run
498: `snapshots-before/not-in-run.json`.

Ownership (QA lead, 14 Oct): edit cases CREATED by Bilal (created_by 3), even if automated (tell Vladimir); never touch cases
created by Vladimir (created_by 1).

## A · Our cases to update (each is converted in full to the current Rule 117 structure, with its own setup doc)

| Case | atm | What changes | Quotes |
|---|---|---|---|
| C96979 Tech View starts with List's default columns… | 1 | Retitle (e.g. "A new user's Tech View opens on the design's 13 columns"). A brand-new user's Tech View shows exactly, in order: Status, Waiting On Parts, Number, Customer, Unit, Asset, Progress, Service Advisor, Clocked In, Lines, Assigned Techs, Created on, Total price. On Site, VIN/Serial # and Lead Technician are not shown. A brand-new user WITHOUT See Financial Data sees the same list without Total price (setup recipe as in C96980: custom role with Work Orders view and See Financial Data off). List's columns are unchanged (production defaults) and saved List choices stay. | S5-R4 (v52), S7-R7 (v52), S5-R12 |
| C96927 Tech View offers List's columns plus Assigned Techs… | 1 | Tech View's menu offers every List column plus Assigned Techs; On Site, VIN/Serial # and Lead Technician are offered and each shows as a column when turned on; Assigned Techs is on by default and can be turned off. Remove the old "if the build matches the design … it is a fail" note (the design and spec now agree). | S2-R4, S5-R4 (v52), S7-R7 (v52) |
| C96983 If saved field choices can't load… | 1 | "Tech View shows its starting columns" now = the 13 of S5-R4 (not the List defaults). Keep the honest 'load failure not checked by hand' handling. | S5-N2, S5-N3, S5-R4 (v52) |
| C96975 Tech View keeps its own column choice… | 1 | Assigned Techs is now ON by default, so the step that changes Tech View must turn Service Advisor off and Assigned Techs OFF (a choice different from the default), and the expected results say Tech View keeps both off after logging back in, in the second browser and at the second location; List unaffected. | as now, plus S7-R7 (v52) |
| C96993, C96994, C96995, C96996 | 3 (Automated) | The step "turn Assigned Techs on" becomes "check Assigned Techs is on (it is on by default; turn it on if it was turned off)". Behaviour otherwise unchanged. Tell Vladimir (Rule 65). | as now, plus S7-R7 (v52) where Assigned Techs is cited |
| C368141 Tech View's Assigned Techs column sits right after Lines | 1 (created Bilal, last updated Vladimir) | Expected: for a user who has never changed Tech View's columns, Assigned Techs is ON, directly after Lines; it can be turned off in the column chooser and back on. Precondition: a user who has never changed Tech View columns (new staff user). | S7-R7 (v52), S5-R4 (v52) |
| C96911 Switching display keeps the same tab, search, filters… | 3 (Automated) | Behaviour unchanged (no Technician filter used). The quoted Feature Overview sentence changed in v52: re-quote it verbatim (it now names the Technician filter as the second exception). Tell Vladimir. | Feature Overview (v52) |
| C96913 The four tabs … work in every display | 1 | Same re-quote of the Feature Overview sentence. | Feature Overview (v52) |

Not ours, report only: **C228763** (Vladimir, Automated, not in run 498): its preconditions say Tech View's defaults have
"Assigned Techs off"; under S5-R4/S7-R7 (v52) a user's Tech View starts with Assigned Techs ON. It will fail a correct build.

## B · New behaviour cases — Technician filter (section 13236 "S1 — Switch between display options")

1. **Tech View and Board View offer a Technician filter; List does not** — chip right after Assigned to me in Tech View and Board
   View; list shows Unassigned first, then the location's technicians by first name then last name (use two technicians with the
   same first name and one with a later first name, for example "Ana Brooks", "Ana Carter", "Ben Adams", all ZZAUTOTEST-tagged in
   the email or a field, to prove the tie-break); more than one can be ticked; List shows no Technician chip and its chips are as in
   production. Quotes S1-R15, S1-R15b.
2. **Choosing technicians shows only their groups or columns, pinned ones too** — {Technician-A}, {Technician-B}, {Technician-C}
   each lead one work order of {Customer-A}; {Work-order-4} has no lead; {Work-order-5} is led by {Technician-C} with
   {Technician-A} on a line (crew, not lead). {Technician-C} is pinned in Board View. Tick {Technician-A} and Unassigned: Tech
   View shows only those two groups; {Work-order-5} is not shown (lead only); Board View shows only those two columns, the pinned
   {Technician-C} column is hidden. Quote S1-R15.
3. **The Technician filter works together with other filters, and Clear all filters clears it** — tick {Technician-A}; also turn on
   Assigned to me while signed in as a user who is not on {Technician-A}'s work orders → nothing matches → empty state reads "No
   work orders match these filters", then "Try removing a filter to widen your results.", with a Clear all filters button; click it
   → Technician chip shows no choice and all groups come back. Also: Technician + Search of {Customer-A} shows only the matching
   rows. Quotes S1-R15a, S1-N1a, S1-R13.
4. **Switching to List ignores the Technician choice; switching back restores it** — tick {Technician-A} in Tech View; switch to
   List → every work order of {Customer-A} shows (as if none chosen) and no Technician chip; back to Tech View → the chip still
   shows {Technician-A} and only that group shows; reload the page → the choice is still there, the same as the other filters
   (compare: set Asset on Site and reload, and record whether it is remembered too — the Technician choice must behave the same).
   Quote S1-R15b.

All new cases: Rule 117 structure, own setup doc, marker `AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build`,
source line "PRD … Confluence 845185030, version 52 (14 Oct 2026, Chris Ward), S1-R15 … (added in version 52 on 14 Oct 2026)".
