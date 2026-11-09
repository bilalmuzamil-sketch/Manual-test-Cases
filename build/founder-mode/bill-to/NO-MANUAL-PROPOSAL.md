# Bill To — cases a manual tester cannot set up (proposal)

Lesson L-14 / Rule 138: a behaviour a manual tester cannot set up or reach is not put into a manual run. These cases are kept in the library with their exact text and `AUTOMATION: HOLD - <reason>` so nothing the PRD requires is lost. **QA lead: should they go to TestRail as held cases, or stay in the library only (as Technician Toggle's five did, 2 Nov 2026: "Leave them out")?** `create.py` adds them unless their keys are put in its NO_MANUAL set.

| Key | Title | Why a manual tester cannot run it | PRD items |
|---|---|---|---|
| S1-17 | Saving a default on Counter Sale is refused | no screen offers a default on Counter Sale (the field is hidden there), so only a request sent from outside the screens reaches this refusal | EH-S1-2, KD-CS, UFS-10, UFS-H2 |
| S1-18 | Picking Counter Sale as another customer's default is refused | the Counter Sale customer is never offered in the field, so only a request sent from outside the screens reaches this refusal | EH-S1-3, KD-CS, UFS-09 |
| S1-19 | If saving a default fails, an error toast shows and the window stays open | a save failure cannot be caused from the screens; it needs the save to be made to fail | EH-S1-1 |
| S2-08 | If any part of saving a new customer fails, no customer is created | one part of the save cannot be made to fail from the screens | EH-S1-1, S2-R5 |
| S3-21 | Picking Counter Sale as a Bill To is refused | the Counter Sale customer is never offered in the field, so only a request sent from outside the screens reaches this refusal | EH-S3-1, KD-CS, UFS-09 |
| S3-30 | If the Bill To save fails, an error toast shows and the old value stays | a save failure cannot be caused from the screens; it needs the save to be made to fail | EH-S3-2 |
| S5-11 | Deposits from two customers name the number of customers | deposits from two different customers on one work order cannot be made through the screens, because a held deposit locks the Bill To | S5-R6, S5-R7, UFS-02, UFS-03 |
| S7-15 | Credit Hold is caught whatever the capitalization of its term | a credit term with different capitals cannot be made through the screens; it exists only in older stored data | S7-R10 |
| S9-06 | While the payer's contacts load the window shows a loading state | the contacts load faster than a person can see the loading state | S9-R5 |
| S10-08 | A payment that uses another customer's deposit or credit is refused | the payment window offers only the paying customer's own deposits and credits, so another customer's cannot be picked on screen | EH-S10, KD-DEP, S10-R9, UFS-07 |
| S12-14 | If removing the defaults fails, an error toast shows and the confirmation stays | a removal failure cannot be caused from the screens; it needs the removal to be made to fail | EH-S12 |

Held for other reasons (not in this proposal): waiting on the PO (S3-32, S5-02, S5-07, S5-16, S5-17, S5-18, S5-19, S7-22, S7-23, S7-24, S7-25, S14-13, S18-01, S18-02, S18-03, S18-04, D-17, D-33, D-35, D-61, D-62, D-63, D-64, D-65, D-66, D-67, D-68, D-69, D-70); blocked on the Internal Work Orders release (S15-01, S15-02, S15-03, S15-04, S15-05, S15-06); blocked on the customer portal app release (S16-02, S16-03, S16-04, S16-06); run on production around the release (S8-15, S10-13, S17-07, S19-05, S19-08, REL-01, REL-02, REL-03, REL-04).
