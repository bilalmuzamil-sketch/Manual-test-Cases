# Internal Work Orders — cases a manual tester cannot set up (proposal)

The QA lead's standing decision (Bill To, 10 Nov 2026): *"If a tester can not set it up then they should not be in testrail."* These 22 cases are kept in the case library (`authoring/`, marker `AUTOMATION: HOLD - a tester cannot set this up ...`) so the PRD item stays covered and visible, and `create.py` leaves them out of TestRail. Proposed: hand them to the developers' own checks (each verify ticket of epic SV-11665 lists the same behaviours), and decide again when a build exists.

Round 3 (12 Nov 2026): S2-90 [C1112004](https://shopview.testrail.io/index.php?/cases/view/1112004) and S8-26 [C1112153](https://shopview.testrail.io/index.php?/cases/view/1112153) joined this list because PRD v1.1 makes them impossible to set up by hand. Both are already live in TestRail (held); recommended: delete them (needs the QA lead's go-ahead). Until then the update script leaves them untouched.

| Case | Title | PRD items | Why a tester cannot set it up |
|---|---|---|---|
| S1-79 | A failed flag save shows an alert and keeps the window open | EH-S1-1, UFS-43 | the save has to fail, which only a developer can make happen |
| S1-80 | A partly failed Make internal keeps the flag and names the count | EH-S1-2 | some conversions have to fail, which only a developer can make happen |
| S1-81 | While a flag save runs, the button shows a spinner and ignores a second press | EH-S1-3 | the save finishes too fast to press twice; it needs a slowed connection a developer sets up |
| S1-82 | Every flag write is refused without the permission | PM-R1 | the refusal is only reachable with a request sent outside the page |
| S2-90 | An imported work order of a flagged customer is internal | S2-E3 | ShopView has no work order import today (PRD v1.1 S2-E3: the data import covers contacts and vehicles) |
| S2-96 | A failed conversion shows an alert and keeps the classification | EH-S2-1, UFS-43 | the change has to fail, which only a developer can make happen |
| S2-97 | While a conversion runs, the button shows a spinner and ignores a second press | EH-S2-2 | the change finishes too fast to press twice; it needs a slowed connection a developer sets up |
| S3-53 | A failed Close shows an alert and posts nothing | EH-S3-1, UFS-43 | Close has to fail, which only a developer can make happen |
| S3-54 | While Close runs, its button shows a spinner and ignores a second press | EH-S3-2 | Close finishes too fast to press twice; it needs a slowed connection a developer sets up |
| S4-13 | A failed Reopen shows an alert and leaves the work order closed | EH-S4-1, UFS-43 | Reopen has to fail, which only a developer can make happen |
| S4-14 | While Reopen runs, its button shows a spinner and ignores a second press | EH-S4-2 | Reopen finishes too fast to press twice; it needs a slowed connection a developer sets up |
| S5-14 | A failed save follows today's QuickBooks settings error handling | EH-S5 | the save has to fail, which only a developer can make happen |
| S6-08 | A failed mapping save follows today's Account Mappings error handling | EH-S6 | the save has to fail, which only a developer can make happen |
| S7-34 | A retried entry never creates a second entry in QuickBooks | S7-E1, S7-R6 | the same Close has to reach the sync twice, which only a developer can make happen |
| S8-26 | A mapped account made inactive holds the event | S6-E1, S8-N2 | the hub refuses to deactivate a mapped account, so an inactive mapped account needs a database change (PRD v1.1 S6-E1) |
| S8-27 | A replay of history never turns a closed internal work order into revenue | S8-E1, S8-R5 | a replay of historical events is run by the AccountingHub team, not from the screens |
| S10-13 | A failed Shop supplies save follows today's error handling | EH-S10 | the save has to fail, which only a developer can make happen |
| S12-42 | A failed mark leaves the line as it was | EH-S12 | the change has to fail, which only a developer can make happen |
| S13-06 | The migration and its reruns create no duplicates | S13-N1, S13-R4 | the migration and the operator command are run by engineering, not from the screens |
| API-24 | The internal invoice list used by the app leaves the closed record out | S3-R6 | this is the app's own request, which needs a signed-in session token a tester does not handle |
| D-44 | Design: A failed close shows an alert that must be dismissed | EH-S3-1 | Close has to fail, which only a developer can make happen |
| S1-91 | A failed category save shows an alert and keeps the window open | S1-R14 | the save has to fail, which only a developer can make happen |

Also not written as cases (no screen): the server's 403 refusal of each permission-matrix write (PM-R1, case S1-82 stands for all of them), the idempotency key (S7-R6, S7-E1: S7-34), a replay of hub history (S8-R5, S8-E1: S8-27), the app's own invoice list request (S3-R6: API-24), and the migration and operator-command reruns (S13-R4, S13-N1: S13-06).

## OUTSTANDING — what I need from you

- (Recommended) Confirm these stay out of TestRail, as for Bill To: they need a developer to make something fail, a slowed connection, or a request outside the screens. If you want them in TestRail anyway, they go in as held cases in their story folders.
