# New questions for Chris Ward — Splitting Sales Representatives (tech plan pass, 22 Oct 2026)

**Status: DRAFT. Not written into the sheet and not sent.** Under Rule 131 this question goes into the suite's own sheet
(https://docs.google.com/spreadsheets/d/17Ry1BtRTPEkecBP5TlgAE0T93Ai1TQewdJ7B7WpWDBQ, tab "Questions for Chris") as a new row below row 47,
numbered on from 40, in a colour not yet used there, with a dated heading row and a dated line in the colour guide. The QA lead sends it.
Once written into the sheet it is added to `build/PO-QUESTIONS-OPEN.md` (Rule 132).

Skill 07 §6 check, done before writing (every point answered):
1. **Decomposed:** the question blocks only the expected result of one new case (not yet written); no existing case depends on it.
2. **Real:** PRD v11 S4-R8 says the added Part Sales field "starts with the person new part sales get at that moment (S4-R26)", and S4-R27
   says a person whose switch is off "is not copied … Anyone else leaves that field "Unassigned"". Both read on this state, and they give
   different answers. The tech plan builds one of them (it copies the person).
3. **Not answerable from a document we have not read:** PRD v11, answers 1-40, the report specs and the tech plan were all read in full on
   22 Oct 2026. Answer 14 covers how such a person reads on the customer ("(Inactive)"), not what an added field starts with.
4. **Not self-serviceable:** there is no build, and the build is never a source of expected behaviour (Rule 57).

Every other difference between the tech plan and the PRD or Chris's answers that this pass found is **already ruled** (answers 5, 7, 14,
16, 25 and 39), so no question is drafted for them (they are reported to the QA lead in PASS-REPORT.md, as Rule 30 asks). One item was
considered and **dropped** under §6.3: "a split invoice counts as two rows toward the 10,000-row export limit" (tech plan §8.2(e)) is
already answered by the Sales By Representative spec v28 S14-E2, which counts "invoice detail rows" ("data rows").

---

## Question 41 (reader-facing row)

| Column | Text |
|---|---|
| **#** | 41 |
| **Project** | Splitting Sales Representatives |
| **Feature** | Customer: adding the "Sales Representative - Part Sales" field |
| **What happens now** | A customer's "Sales Representative - Service Parts" field (or its one "Sales Representative" field) holds a person whose "Sales Representative" switch has since been turned off. Their account is still active, so they stay in the field and read, for example, "Elliot Brennan (Inactive)". Someone now opens Edit Customer and adds the "Sales Representative - Part Sales" field. The feature spec says the new field starts with the person new part sales would get, but it also says a person whose switch is off is never copied and leaves the field "Unassigned". The technical plan copies the person into the new field. |
| **The question** | What should the new "Sales Representative - Part Sales" field start with in this case? |
| **Option A** | The same person, reading "Elliot Brennan (Inactive)", as the technical plan builds. The customer can be saved like that. |
| **Option B** | "Unassigned", because a person whose switch is off is never copied into a new field. |
| **Option C** | Not sure — please check with the engineers. |
| **Your answer** | *(blank)* |

## QA mapping (QA only — not for Chris)

| # | Sources that disagree | Cases | What changes when answered |
|---|---|---|---|
| 41 | PRD v11 S4-R8 ("It starts with the person new part sales get at that moment (S4-R26), or "Unassigned".") and S4-R26 against S4-R27 ("Only a staff member whose account is active and whose Sales Representative switch is on is copied (S1-R8). Anyone else leaves that field "Unassigned"…"); answer 14 (customer fields read "(Inactive)"); tech plan §3 Phase 3 `addPartSales = (d) => ({ ...d, partSales: { ...partSalesFollows(d) } })` and D5 ("checks active + sales-rep flag only for ids the customer does not already hold"). | None yet. Related: S4-04 [C665943](https://shopview.testrail.io/index.php?/cases/view/665943) (Part Sales starts with what new part sales get, active people only), S4-20 [C665959](https://shopview.testrail.io/index.php?/cases/view/665959) (switched-off person on a customer). | A new case is written to the answer: "Adding Part Sales when Service Parts holds a switched-off person" (Edit Customer → + → Part Sales; read the field; save). Until then no case asserts this state (Rule 58: held, never resolved from the build). |
