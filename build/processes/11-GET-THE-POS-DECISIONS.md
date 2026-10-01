# GET THE PO'S DECISIONS `<feature>` — one sheet, in plain words, sent LAST

> **Call it:** `GET THE PO'S DECISIONS on Invoicing`
>
> **The rule that shapes it:** this goes out **only once everything we can answer ourselves has been
> answered.** A question sheet that asks things we could have measured wastes the one person whose
> time we cannot replace, and it teaches them that our questions are cheap.

---

## THE GATE — what I ask you for

| What I need | Why |
|---|---|
| **The PO's name** | Questions go to a named person, never "the PO" |
| **Confirmation we are at the end** | It is the last thing sent (Rule 66). If cases are still being written, it is too early |
| **Where to send it** — email, Confluence, a sheet | Format follows the destination |
| Any **previous answers** from them | So we never ask the same thing twice |

---

## WHAT IT PRODUCES

**One sheet.** Every row:

- **Names the project and the feature** — a PO works on several, and a bare question is unanswerable.
- **Is answerable by a non-technical person** — no case ids, no spec anchors, no HTTP terms, no
  internal field names.
- 🔴 **Carries a worked example they can type and see for themselves.** Your instruction, and it is
  what makes a question answerable in thirty seconds instead of a meeting: *"Type `Fernvale` in the
  search box. You get two rows that look identical. Which one should come first?"*
- **Says what we will do with each answer** — which cases it unblocks, or which deviation it settles.
- **States what we assumed meanwhile**, so nothing is blocked waiting.

---

## THE STEPS

1. **Collect the held cases.** Every case that stopped because the source does not decide the outcome
   (Rules 58, 64) is a candidate question — those are the real ones.
2. **Remove everything we can answer ourselves.** Measure it, read the code, check the playbook.
   Whatever survives that is worth his time.
3. **Merge duplicates.** Several held cases usually come down to one decision.
4. **Write each in plain words, with the example to type**, and the environment to type it on.
5. **Say what each answer unblocks**, so the PO can see the cost of not answering.
6. **Send once**, and record the answers as a dated source — a PO answer is a source, and usually the
   newest one, so it outranks an older document (Rule 32).

---

## THE TRAPS

| Trap | Symptom | Fix |
|---|---|---|
| Asking what we could have measured | The PO answers "isn't that your job?" and trusts the next sheet less | Step 2 |
| A question with no example | It sits unanswered for a week because answering needs a meeting | Give them something to type |
| Jargon | They answer a different question than the one asked | Plain words, the build's own labels |
| Sending it early | It gets answered, then the answer goes stale as the suite changes | It is the LAST thing sent |
| Treating silence as agreement | A case ships on a guess | Silence leaves the case HELD and the register open |

---

## DONE WHEN
Every held case is either covered by a question or has been resolved without one; every question has
a worked example and names the project; the sheet has gone to a named person; the answers come back
recorded with their date as a source.

**Canonical:** `build/skills/07-PO-QUESTIONS.md`. **Rules:** 55, 66, 7, 9, 58, 64, 32.
**Worked example:** `build/search-results-integrity/PO-QUESTIONS.md` and the questions sheet inside
the manual-QA workbook, where each row carries the exact term for the PO to type.
