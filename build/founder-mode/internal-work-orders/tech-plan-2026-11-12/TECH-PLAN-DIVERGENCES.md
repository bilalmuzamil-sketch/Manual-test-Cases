# Internal Work Orders: where the tech plan and the PRD disagree (12 Nov 2026)

**Sources.** Tech plan revision 5 (2026-11-10, built on PRD v1.0 page 39), `sources/TECH-PLAN-Internal-Work-Orders-upload-2026-11-12.md`.
PRD Final v1.0 (2026-11-09, Milos Vasic), `sources/CONFLUENCE-942243841-read-2026-11-12.md`. Both read in full (see
`TECH-PLAN-READING-RECORD.md`). Every quote below is word for word: plan quotes checked by `tools/assemble.py`, PRD quotes by
`tools/prd_quotes.py`.

**Which wins.** The PRD is the source for the test cases. The QA lead's ruling of 12 Aug 2026 (Rule 30): "Technical design is the
authority but if that contradicts with specs/tickets/answer sheet/claude design/figma ... consider the specs ... as the authority for
the test cases but let me know where it contradicts with the tech design." So every case follows the PRD sentence, every item below
is reported to the QA lead, and a real conflict about behaviour becomes a question for Milos Vasic (`QUESTIONS-DRAFT.md`). A
code fact that contradicts the PRD is a PO decision item, never a silent case change (Rule 96).

**Count.** 10 DIVERGE statements in `TECH-PLAN-TESTABLE.json`, on 9 topics: 4 need a question, 5 do not (stale wording inside the
plan or a release-run detail no tester sees).

---

## A. Real disagreements that change what a tester sees (question needed)

### D-1. Create invoice confirmation: one row per move, or one row per pair of accounts? (TP-255)

- **PRD S7-R8:** "Create invoice first opens "Create invoice [number]?" with one "Moved from [account] to [account]" row per move and the buttons Cancel and "Create invoice""
- **Plan, Appendix A §2.11 (line 2503):** "grouped into `moves[]`: one entry per distinct from → to pair, because one invoice can move cost both ways"
- Also line 2833 ("`moves` has one entry per distinct from → to pair (S7-R8 v1.0)") and line 3471 ("two moves in opposite directions render two rows").
- **In plain words:** two lines whose vendor bill cost both moves from Cost of Parts to Warranty show **one** row in the plan's build; read literally, the PRD could expect **two** rows.
- **Which wins:** the PRD, but its wording is open to both readings, so the case is held and the question asked. Question 1.

### D-2. "Closed" in the Status chip before the shop has used the feature (TP-459)

- **PRD S2-R10:** "The Status chip on the All tab gets the value "Closed", which matches only closed internal and no-charge work orders; Invoiced and Paid do not match them."
- **Plan, Appendix B FE-B4 (line 3368):** "Status options (`:177-182`) gain `{ label: 'Closed', value: 'closed' }` when `hasFirstClose || isEnabled` (E-7)"
- **In plain words:** in a shop that has never turned the setting on and never closed a work order, the plan shows no "Closed" option; the PRD sets no condition.
- **Which wins:** the PRD; question 2 asks whether the plan's condition is acceptable.

### D-3. The message when the completion step fails inside Close (TP-538)

- **PRD Story 3, Error Handling:** "If Close fails before the internal invoice is created, display "Could not close the work order. Try again." as an alert toast that must be dismissed; the work order stays where it was and nothing is posted."
- **Plan, Appendix B risk 16 (line 3723):** "**Completion failure inside Close** uses the completion error toast, not the Close copy (as Create invoice today)."
- **In plain words:** when Close first runs the completion steps (PRD S3-R3: "When the work order is not yet Complete, Close first runs the same completion steps as Create invoice today") and one of them fails, the plan shows today's completion error, not "Could not close the work order. Try again."
- **Which wins:** the PRD; question 3.

### D-4. Imported work orders (S2-E3): the plan says no import exists (TP-205, TP-218)

- **PRD S2-E3:** "An imported work order takes the classification of its customer at import: internal for a flagged customer while the setting is on, billable otherwise."
- **Plan, §10 traceability (line 1867):** "none — `WorkOrderImportedFactory` has no caller (Appendix A corrections)"; **Appendix A C20 (line 2293):** "Nothing imports live work orders: `WorkOrderImportedFactory` has no caller in `src/`"
- **In plain words:** engineering found no live work-order import in the code, so nothing is built for S2-E3 and a tester has no screen to run it on.
- **Which wins:** this is a code fact against a document (Rule 96): a PO decision item. The S2-E3 case is held. Question 4.

---

## B. Disagreements that need no question (report to the QA lead; the PRD wins)

### D-5. "No charge" on the hub's Closed record summary (TP-030)

- **PRD S8-R1:** "a summary (number, customer, asset, classification, category, original work order when set, posting date, "No Charge", and the posted Parts cost and Shop supplies totals)"
- **Plan, §3 D39 (line 501):** "a summary (number, customer, asset, classification, category, original work order, posting date, "No charge", posted Parts cost and Shop supplies totals)"
- **In plain words:** capital C in the PRD, small c in decision D39. The plan's own frontend appendix (FE-E, line 3507) and its E2E spec 9B (line 1627) say "No Charge", but the plan also says "Where an appendix and Section 3 disagree, **Section 3 wins**" (line 54). The case checks "No Charge"; engineering should align D39.

### D-6. "No charge" on the asset Invoices tab, in the plan's answer history (TP-010)

- **PRD S3-R6:** "The asset Invoices tab lists the closed work order with status Closed, the badge, Total balance "No Charge" and Discount and Tax rate empty (rows on that tab have no actions)."
- **Plan, §1 clarification Q17 (line 365):** "the asset Invoices tab shows "No charge" in Total balance with Discount and Tax rate empty, and its rows have no actions"
- Stale answer text from 29 Oct; the build sections (line 1570, line 3626) say "No Charge". No question.

### D-7. Old report name in the plan's answer history (TP-011)

- **PRD S9-R6:** "Parts cost and shop supplies of these work orders are in the Internal Work Orders report (S9-R2), not in this export."
- **Plan, §1 clarification Q19 (line 367):** "S9-R6 adds "Parts cost and shop supplies of these work orders are in the No-Charge Work Orders report, not in this export.""
- Stale v0.17 wording; nothing in the plan builds the old name. No question.

### D-8. Account 6510 in the plan's answer history (TP-013)

- **PRD S6-R2:** "Warranty and Goodwill both default to 6430 Warranty & Goodwill Expense, already in the newer chart."
- **Plan, §1 clarification Q29 (line 377):** "ANSWERED: 6510 Warranty & Goodwill Expense is now in the PRD and the design."
- The same row's question says it is superseded by D40 (6430), and D40 (line 502) and the hub seeder (line 4651) build 6430. No question. The design pass should check that no frame still shows 6510.

### D-9. Release-run order: the hub seeding may run before core's categories (TP-103)

- **PRD S13-R4:** "The steps run before the release is visible to users, in this order: categories, QuickBooks rows, hub accounts and mappings."
- **Plan, §6 Phase 13 runbook (line 1062):** "(4a) after hub Release B reaches each environment: `accounting:seed-work-order-categories`, then `--verify` (this run can precede step (2); the starting keys are fixed, D50, so it does not depend on core's seed)"
- The plan runs the hub command twice; the launch run is in the PRD order (line 4901: "— the PRD order (S13-R4: categories, QuickBooks rows, hub accounts and mappings)"). No tester sees the difference; reported as an FYI.

---

## C. Code facts that change what a tester can run (not a plan-vs-PRD conflict, but reported)

| Topic | PRD | Plan | Effect on the cases |
|---|---|---|---|
| A mapped hub account made inactive (S6-E1) | "If a mapped account is made inactive, events are held with that reason (Story 8) until the row is changed." | Line 3884: "`AccountUsageInspector` refuses an account any mapping row points at … Phase A3 adds the category mapping rows to that check." Line 3885: "So S6-E1 is a defensive path for direct-DB data" | A tester cannot make the account inactive; the hub refuses with "category mapping '<list>: <name>'" (line 4183). Question 6. |
| Portal deposit paid after the work order became no charge | "If the work order has a deposit, "Convert to No Charge" is disabled with the tooltip "Reverse the deposit first", as the Change Customer button on the customer card is today." | Line 5298: "a checkout is opened on a billable work order, the work order is converted to no charge, then the customer pays. Core rejects … and the money stays in Stripe until an admin refunds (PE-12)." | PRD silent on this race; the customer is charged. Question 5. |
| Earlier line marks after Convert to No Charge | "If the work order already carries no-charge lines (Story 12), converting it makes every line No Charge under the chosen category; the lines' own categories are replaced and the note names them." | Line 2385: "Converting the whole work order to No Charge clears every line's mark and line reference" | PRD silent on what a later Convert to Billable brings back. Question 7. |

---

## D. Design frames that differ from the PRD (the plan builds the PRD text; for the design pass)

The plan lists these itself (Appendix B header, line 3127; Appendix C line 3878 and Q50 line 4988; Appendix D line 5025). Each
is marked `design_differs_from_prd` in the JSON:

1. Categories page editable while the setting is off; frame 2e draws it read-only (PRD S1-R13).
2. Starting categories exist from the release; frames 2a/2b say "seeded when the setting is first turned on" (PRD S1-R13, S13-R1).
3. New Work Order tooltips: frames 2a/2e show retired wording (PRD S2-R1, S2-R2).
4. Close confirmation note "No account set for [category]"; frame 7b says "internal work orders" (PRD S3-N4).
5. By technician row "Unassigned"; frames 4/6 say "Not in ShopView / no technician" (PRD S9-R2).
6. Held reason "[Category] row not mapped"; frame 5/4 says "expense account is not mapped" (PRD S8-N2).
7. Hub billable invoice: frame 5/3c draws revenue and parts cost as one entry; the hub posts separate entries (PRD silent).
8. Portal frame 7b is missing from the v6.1 export; the v5.12 frame says "Reason: Warranty" where the PRD says "Category:" (PRD S2-R16).

## OUTSTANDING

- Questions 1-7 in `QUESTIONS-DRAFT.md` for Milos Vasic, not sent (the QA lead is travelling; the sheet is built, not shared).
- D-5 to D-9 reported to the QA lead for his information (Rule 30).
