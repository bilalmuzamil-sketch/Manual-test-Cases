# Assessment of the existing R418 results — asked for by the QA lead, 2026-09-09

**Who wrote what.** Every result row in run R418 was authored by **TestRail user 4, Viktoria
Videnovic** — 11 rows, dated 8 and 9 September. Our account (user 3) has written **nothing** to this
run except the empty run-creation row of 25 August. This session has written nothing to TestRail at all.

## 1 · The statuses are wrong, consistently

Ten of the eleven rows are set to **Blocked** while the comment on each one opens with **"Passed"** /
**"PASSED"**. Blocked means the tester could not run the case. She ran them and they passed; what she
actually wanted was a case-text correction.

| Case | Test | Status she set | Her comment opens with |
|---|---|---|---|
| C44988 | T2724191 | Blocked | "Passed." |
| C44989 | T2724192 | Blocked | "PASSED" |
| C44990 | T2724193 | Blocked | "PASSED." |
| C44991 | T2724194 | Blocked | "PASSED." |
| C44992 | T2724195 | Blocked | "Passed." |
| C44993 | T2724196 | Blocked | "Passed." |
| C44994 | T2724197 | Blocked | "Passed." |
| C44995 | T2724198 | Blocked | "Passed." |
| C44997 | T2724200 | Blocked | "Passed" |
| C45250 | T2807342 | Blocked | "Passed, but edit the test case" |
| C45220 | T2785868 | **Passed** | (no comment) — Vladimir's case |

Effect: the run reads **10 Blocked / 1 Passed** when the truth is ten passes with case-text edits owed.

## 2 · Her observations agree with mine

I executed six of these independently on `v26.36.0-f43b2fd` before reading her rows, with positional
and computed-style evidence: C44988, C44989, C44990, C44991, C44992, C44997 — **all Pass**. No conflict
between her findings and mine on a single case.

## 3 · Her case-text corrections are correct — and sharper than they look

She spotted that two cases carry **different, each-incomplete** status lists:

| Case | Its precondition actually says | Her correction | Verdict |
|---|---|---|---|
| C44988 | "Estimate, Approved, In Progress, or **Declined**" | add "Review" | **Correct** |
| C44989 | "Estimate, Approved, In Progress, or **Review**" | add "Declined" | **Correct** |

Both lists are missing a real status, and they are missing *different* ones.

**Live status scan of this branch, 2026-09-09:** Estimate, Approved, Ready for Review, **Declined**,
Complete, **Invoiced**, **Paid**. So "Declined" is a real status.

## 4 · Two case notes are stale, and she only caught half of it

C44993 and C44994 both carry this note:

> *"of those three statuses only Paid exists in the data on this test system, so check it on a Paid
> work order and mark the case Blocked saying so … (Two statuses this case used to name, "Declined"
> and "Imported", are not statuses this product has at all …)"*

Both halves are false on this branch today:

- **"Declined … not a status this product has at all"** — Declined exists. She caught this.
- **"only Paid exists in the data"** — **Complete, Invoiced and Paid all exist**: a whole Completed
  tab, Invoiced `S2-15828`, Paid `S9315-15894`. She did not catch this, and marked the two cases
  Blocked in obedience to a stale instruction.

I have already run C44993 and C44994 against a **Complete** work order (S9315-15856) with a controlled
comparison, and both hold:

| | Complete WO S9315-15856 | Approved WO (control) |
|---|---|---|
| Parts headings rendered | 5 | 6 |
| Expanded line panels | 2 | 2 |
| **Add Part controls** | **0** | 3 |
| **Edit controls** | **0** | 5 |

Invoiced and Paid still to run, and both now exist, so neither case needs to be Blocked at all.

## 5 · One item is a case-design change, not a text fix

**C45250** — she says the case is about a **Work Order**, not a Line, and supplies replacement steps
plus a title change. That is a redesign of the case and is the QA lead's call, not a tidy-up.

## Recommendation

1. Write our own **Passed** results on the cases independently verified, each naming that Viktoria also
   ran it and recorded "Passed" in her comment while setting Blocked.
2. Action her case-text corrections — case editing is permitted and expected — and **also** strike the
   "only Paid exists" note from C44993/C44994, which she left in place.
3. Hold C45250's rename/redesign for the QA lead.
