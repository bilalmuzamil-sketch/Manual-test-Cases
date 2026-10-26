# Read-through notes (working file)
Approach: per-case hand fixes + global precondition-bullet map, applied in authoring/readthrough.py after pattern.py.
## S1 (read 1-235)
- S1-02 pre "at least one term is deactivated, term A" -> plain. 
- S1-06/07 "(new terms hold only this case's customers)" -> create three/two new terms with exact holders.
- S1-18 result "It reads the name term A" wording.
- S1-19 result "The count is right aligned" -> name Net 30's Customers count; pre "(it is new)" -> create new.
- S1-21 pre: create term A, held by 2 customers, make default.
- S1-22 step 3 result compares with Payment Methods address: add steps to open it.
- S1-26 setup order (create term, customer, invoice, move customer to Net 30).
- S1-32/33/34 steps: Settings menu then New Customer from Customers page -> add a step to open Customers.
## S2 (236-565)
- S2-07/17/18 "The Inactive tab shows the term" -> name.
- S2-12 setup order like S1-26.
- S2-17/18 "Make sure the shop has its own term A (made for this test)" -> Create.
- S2-21/23/24 "Make sure customer A (made for this test) holds" -> Create.
- S2-28 "Make sure the shop's own term A (made for this test) has" -> Create.
- S2-29/36 "Choose a new name for it, term B (made for this test)" -> plain.
- S2-31 customer changed but not made for the test -> create customer A.
- toast texts with "term A" inside quotes: decide global clarification.
## S3 (566-923)
- S3-03 step 5 result "now ending "is due" date A plus 15 days (for example Nov 5)" -> plainer.
- S3-14 pre "Make sure the shop's own term B ... is deactivated" -> Have.
- S3-24 "The term A is created" wording; names that read like Net terms -> concrete (start with Net and a number, not a standard one).
- S3-26 customer changed by user B not made for test -> create customer A.
- global: "Choose a new name for term A (made for this test) that no term has." -> plain.
## S4 (924-1229)
- S4-01/04/05/08/09/10/12/13/14/16/17/18/19/20: "Make sure the shop's own term A (made for this test) ... is held by exactly N customers (a new term holds only this case's customers)" -> Create term + Create customers. S4-13 duplicate create line -> merge.
- S4-02/03: "Type the start their names share" -> precondition must say the names share a first word; S4-02 result has an embedded extra search action -> own step; "the case's customers" jargon.
- S4-06: one bullet bundles 4 states -> split.
- S4-10 "The page opens" -> customer A's page.
- S4-16 bundled bullet split; "exactly as before" -> the values set up.
- S4-21 bundled bullet, "Its other own term B".
- S4-23 result "One move has no customer limit." -> plain.
- S4-26/27/28/29: role bullet "(and whatever it needs to reach Settings), and nothing else that matters here" -> concrete toggles; "Net 30 held by.. and term A by none" split.
- S4-31 duplicate create line merge.
## S5 (1434-)
- S5-01 "Make sure the shop's own term A, ..., is the default" -> Have + set as default (global).
- S5-02 bundled bullet split.
- S5-09 setup order (customer on Net 60, then deactivate Net 60, then invoice).
- S5-12 "The window opens" -> Edit Customer window. S5-13/14 setup order. S5-15 split bullet. S5-16 "looks as it did before the release" -> could not make concrete (keep). S5-20 Have+default.
## S6
- S6-01/03/07 bundled bullets split; S6-02 "It reads COD" -> Credit Terms reads; S6-03 step 6 "It reads Net 30"; S6-06 window name.
## S7
- S7-01/01b/01c create; "It still shows" -> Invoice A. S7-02 setup rewrite (term A, vendor A, vendor B, start with new vendor invoice). S7-04 user B needs second browser at location B. S7-06 setup order.
- S7-06 "It shows" -> printed invoice. S7-07 setup order. S7-09 "Make sure Net 30 is active" unrelated -> remove.
## S8
- S8-02 dup create merge; step 7 "open each of the two invoices" -> 2 steps. S8-03/04 bundled bullets. S8-04 step 1 "the way the shop does today" -> could not make concrete. S8-05/06 "open the customer A". S8-07 step 4 needs Inactive tab click -> split; setup wording. S8-07b window name. S8-08 needs control (check 3) - read S8 quotes. S8-09 refusal reason vague -> check setup file. S8-11 "It holds".
## S9
- S9-04/S9-10 bundled split; S9-10 "the picked customer" -> customer B.
- S8-08: rewrite with control term B used on a synced invoice (S8-R1 added quote); term A held by nobody (PRD Trigger: a customer created in QuickBooks sends its term).
## S10
- S10-02 "It reads" -> customer B/C. S10-03 step 4 bullet about import -> step 1. S10-11/12 API results "The window closes" wrong -> request accepted, customer created. S10-11 default wording. S10-16 pre duplicates/unneeded key+tool; "They are unchanged" -> customer requests; note "sends a request" wrong for S10-16.
## S11
- S11-01 pre circular with step 3 -> "nobody has changed the default"; "The page opens" names. S11-03 step order (customer page then Credit Terms page) + conditional result -> other COD customer precondition. S11-06 split. S11-10 page name. S11-12 non-visible bullets -> note; split bullet. S11-13 step 1 count "includes customer A" -> could not make concrete. S11-15 "It has" -> statement. S11-16 split; window name.
- S11-16/S11-18 window names; S11-18 step 7 negative -> write down newest log row + compare. S11-20 (held) odd "so look for" wording.
## S12
- "The window opens" -> name the window (S12-02..05, 13c, 15, 17). S12-10 "the move crosses midnight" -> the shift. S12-11 setup how to get rows. S12-14 step 4 user B's. S12-15 term A must be unused (Edit). S12-18 unrunnable by hand (like deleted) -> flag to QA lead, not deleted.
## DATA
- "Make sure work order 1 is complete..." -> Have (global). DATA-05/06b/10 split bullets. DATA-11/12/14 "the work order belongs to the test location" ordering. DATA-17 setup rewrite. DATA-19/24 window name. DATA-20 create term A; "The customer is inactive" -> customer B. DATA-21 wording "with them included". DATA-22 vendor A "NET 45" can only be from before the release (import normalises); "It reads". DATA-23 dup create.
## DESIGN
- D-18 step 3 "Look under Move To" read-only -> fold. D-20 setup how. D-25/D-36 "a balance above it" -> unpaid invoices totalling more than $500.00; D-36 "work order 1 is open" ambiguous. D-26/D-42 order. D-40 create. "question 12" bullets (D-01, D-11, D-12, D-13, D-16, D-17, D-19) -> could not make concrete (two pictures disagree, PO question 12 open).
- D-38 + S12-18: a manual tester cannot set them up (same reason as the deleted cases) -> flag to QA lead.
## Check 3 decisions
- S8-08: control term B on a synced invoice (+S8-R1 quote). S8-06: control = invoice for customer A after the move syncs (S8-R6 already quoted). Others listed.
