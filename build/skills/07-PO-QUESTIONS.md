# 07 · PO-QUESTIONS — one sheet, in plain words, sent last

> **🔴 READ [`00-COMMON-CORE.md`](00-COMMON-CORE.md) FIRST** — especially **§11.4, prove a blocker
> before you write it down**, and **§12, reader-facing standards**.

---

## PURPOSE, IN PLAIN ENGLISH

**Ask a product owner only the things we genuinely cannot settle ourselves — once, at the end, on one
sheet a non-technical person can answer without a meeting.**

**Two costs make this a skill rather than an afterthought, and both are real:**

**(a) A QUESTION SENT EARLY GETS ANSWERED AGAINST A STATE THAT HAS SINCE CHANGED.** Between the ask and
the answer the spec moves, the build redeploys, another source lands — and the answer comes back
addressed to a question we would no longer ask in those words. **That is not hypothetical: a PO edited
all six specifications within a single hour, one of them a minute before it was fetched.**

**(b) IT SPENDS THE PO's PATIENCE ON SOMETHING WE COULD HAVE RESOLVED OURSELVES.** A PO's willingness
to answer is **a finite resource shared across every project he owns** — **Branko owns three, Chris
owns two** — and every question we could have answered from a document we had not yet read is drawn
against the questions only he can answer.

---

## TRIGGER PHRASES

> *"Write the questions for [PO]"* · *"question sheet for [project]"* ·
> *"what do we need from Branko / Chris / Milos?"* · *"the PO answers are unclear — ask again"* ·
> *"is the sheet ready to send?"*

---

## KICKOFF PROMPT

```
Run PO-QUESTIONS for [PROJECT], for [PO NAME].

Open items: [list, or "sweep the outstanding register"]
Is everything else on this project finished? [yes -> the sheet can be SENT | no -> WRITE and HOLD]
Existing sheet to extend: [path, or none]
```

---

## ORIGINATING INSTRUCTIONS AND CORRECTIONS

| Date | Verbatim | Effect |
|---|---|---|
| **2026-08-12** | *"This should be the last thing once you give me the report that everything else has been done only this part is left and save it as a rule for now and for the future projects too."* | **WHEN it is sent** — the whole of §1 |
| **2026-08-05** | *"Anything which is not clear we need to ask him again. Make sure that thre is a possibility that one PO is handling more than one project/feature so whenever you create a questionnaire for them do mention for them the project name/feature name, and the questions should be extremely simplified for a non technical PO to understand and answer and use the references from stories/epic too if needed."* | **HOW it is written** — §2, §3, §4 |
| **standing** | *"Each question = plain 'What happens now' + 'the question' + simple A/B options + a blank answer. NO case IDs, API/HTTP terms, bug codes, enum names, or jargon"* | The row shape |
| **standing** | *"Include ONLY genuine PRODUCT DECISIONS for the PO — never put bugs/defects in front of the PO"* | §5 |

---

# 1 · 🛑 WHEN — the sheet is the LAST thing sent

**A PO or dev question sheet is SENT only when everything we can settle ourselves is settled and the
sheet is the ONLY remaining item** — and it is reported to the QA lead as exactly that: *"everything
else on this project is done; the only thing left is these questions."*

**Until then the questions are WRITTEN, HELD, and LOGGED in the outstanding register.** **Writing the
sheet early is not merely permitted, it is WANTED. What is deferred is SENDING it.**

### What "everything else is done" means, so it cannot be stretched

> every source **re-read and current** · every requirement carrying a **coverage verdict** · every case
> we can author **authored** and every case we can correct **corrected** · every deliverable
> **regenerated** · and the remaining items **each traced to a named external dependency**.

**If work remains that we could do, the sheet is not ready to send — however finished the sheet itself
looks.**

### 🔴 THE COUNTER-LIMIT — and it points in a dangerous direction if forgotten

**THIS DOES NOT LICENSE SITTING ON A GENUINE BLOCKER.** An item that **actually stops work** — a
missing source, an access blocker, an unanswered authorisation, a contradiction with no defensible
resolution order — is **RAISED IMMEDIATELY**, and where it stops us creating or correcting a test case
it is escalated **in the same breath** (his 2026-08-11 duty: *"anything that stops you from
creating/updating a test case You MUST let me know"*).

**What is deferred is the QUESTION SHEET — a batched, considered, end-of-work deliverable. It is NOT
the escalation of a blocker, and the two must never be conflated to justify silence.**

> **THE DISTINGUISHING TEST, IN ONE LINE:**
> **if the answer would change what we do NEXT — raise it now.**
> **If it would change what a case ASSERTS once everything else is done — it belongs on the sheet.**

### And a deferred sheet is never a reason to stall a case silently

A case waiting on an unsent question carries **`AUTOMATION: HOLD`** and **says in its own words that
the question has NOT BEEN SENT YET** — **never wording that implies the PO is sitting on it.**

**We have had that exact embarrassment:** the Schedule shop-closures question was drafted on **22 July**
and **had never been sent**, while the register had to record plainly that ***"the blocker is US, not
him."***

---

# 2 · 🔑 NAME THE PROJECT AND THE FEATURE ON EVERY ROW — not just in a header

**A PO answers ROW BY ROW, often days later, often on a phone — and one PO owns more than one thing.**

| PO | Owns |
|---|---|
| **Branko Cicovic** | Filters · Schedule · Global Search |
| **Chris Ward** | Report Suite · Fees & Discounts |
| **Milos** | Simple Flow |

**So *"the date filter"* or *"the export"* is GENUINELY AMBIGUOUS to him**, and a mis-scoped answer
costs **a whole round trip** — days, on a source we are blocked on.

**⇒ Every row carries its own project name + feature/report name, in plain words, so a row read in
isolation is still unambiguous.**

**The deeper harm, which is why this is not fussiness:** a PO answering the wrong feature's question in
good faith produces **a confidently-wrong test case**, and nothing downstream catches it — **because
the answer file itself then reads as authority.**

---

# 3 · EXTREMELY SIMPLIFIED — plainer than feels necessary

**Each question = "What happens now" + the question + simple A/B options + a blank for the answer.**

**🔑 IF A QUESTION CANNOT BE MADE SIMPLE, IT IS PROBABLY TWO QUESTIONS — SPLIT IT.**

**Nothing the PO reads may contain:** case IDs · spec anchors (`S13-R19`) · HTTP terms · endpoint names
· enum or internal names · bug codes · **and never the word "VIU"**.

**Use story or epic references ONLY where they help him PLACE the question** — *"the story about saving
your filters"*, with the key alongside. Where they add nothing, omit them. **This is a judgement call
and is stated as such:** the test is whether the reference helps **him** find the context, **never
whether it looks rigorous to us.**

### The row shape

| Column | Contents |
|---|---|
| **Project** | *Filters* |
| **Feature / report** | *The filter bar on the Parts pages* |
| **What happens now** | Plain description of today's behaviour, no jargon |
| **The question** | One question, answerable |
| **Option A** | A plain statement of one outcome |
| **Option B** | A plain statement of the other |
| **Your answer** | *(blank)* |

**The question→case mapping lives on a SEPARATE QA-ONLY TAB** — internal ID + C-id + link — **never in
the columns the PO reads.**

---

# 4 · ASK AGAIN WHENEVER AN ANSWER IS UNCLEAR — an interpreted answer is not an answer

**Whenever a PO's answer is unclear, partial, answers a neighbouring question, or is something we find
ourselves INTERPRETING rather than READING, it goes straight back to him as a follow-up.**

**We do not convert an ambiguity into a case and hope. We do not record *"we read this as meaning X"*
and move on.** And **we never resolve it by looking at the build** — that is how build behaviour
becomes expected behaviour without anyone deciding to do it, and the resulting edit **looks sourced**,
so it survives every later review.

**⇒ Sweep EVERY open ambiguity onto ONE sheet** so he answers in a single sitting rather than a drip of
separate asks — and **log each in the outstanding register until answered.**

**⚠️ AND ONE ANSWER CAN CONTRADICT ITSELF.** One of Chris Ward's said **both yes and no about the same
person**, so the case it was meant to unblock **was deliberately not authored** and went back as a
question. **Recording that is the correct outcome, not a failure.**

---

# 5 · PRODUCT DECISIONS ONLY — never a defect

**A PO sheet carries genuine PRODUCT DECISIONS.** Bugs go to developer tickets (skill `06`).

**The line, and it is decidable:**
- *"Which of these two behaviours do you want?"* → **a question.**
- *"The product does not do what your own document says."* → **a defect.**
- **And the borderline that matters most: if the answer decides whether it IS a defect at all, it is a
  QUESTION, not a ticket** — filing that as a defect is exactly how a ticket comes to *"not make
  sense"*.

**A document-vs-document mismatch is always a question.** Where the PRD, the design and Figma disagree
— all three are authoritative sources of expected behaviour — **that disagreement is a defect IN THE
DOCUMENTS**, and it goes to the PO. **Meanwhile the case follows the most recent authoritative source
and DISCLOSES the divergence in its own text.** **We never silently pick a side.**

**And where the latest artefact is clear, dated and simply DOES NOT MAKE SENSE**, that too is a
question sheet — never a decision of ours. His words: *"the latest wins or if latest does not make
sense we can create a question sheet for the PO to respond."*

**✅ AND ONE ITEM THAT USED TO BELONG HERE IS ANSWERED — DO NOT PUT IT ON A SHEET.** The technical
design's authority was **closed by the QA lead on 2026-08-12**, verbatim: *"Technical design is the
authority but if that contradicts with specs/tickets/answer sheet/claude design/figma … consider the
specs/tickets/answer sheet/claude design/figma … as the authority for the test cases but let me know
where it contradicts with the tech design."* So **on a contradiction the other five win**; **where
nothing contradicts it the technical design sources a case on its own**; and **every contradiction is
REPORTED TO HIM** — that is an instruction, and it goes to him directly, **not onto a PO sheet**
(it is our-side reporting, not a product decision for the PO to rule on).
**⚠️ SUPERSEDED WORDING, KEPT AND DATED:** this block previously read *"One open item belongs here
rather than being answered for him: does a TECHNICAL DESIGN carry PRD-level authority … Do not answer
it on his behalf."* **Asking it again would spend the PO's patience on a question already settled** —
exactly what §6 below exists to prevent.

---

# 6 · 🛑 PROVE THE QUESTION IS NECESSARY BEFORE IT REACHES THE SHEET

**This is where a false blocker becomes a PO's problem** — the last hop in the migration chain, and the
one where it stops being recoverable.

**Before any row is written:**
1. **Decompose it** (core §11.4) — a missing PO answer blocks the **VERDICT**, not the **RUNNABILITY**.
   **A case can be fully walked and made tester-ready while its question is open.**
2. **Prove it real and TOTAL** — *"we tried A, B and C and here is what each returned"*, never *"we
   could not see a way"*.
3. **Check we cannot answer it from a document we have not yet read** — that is cost (b), and it is the
   commonest form.
4. **Check it is not self-serviceable.**

**THE SCAR:** **14 Filters cases were classified *"waiting on Branko"* and treated as untouchable. They
were not** — the next pass walked all 14 surfaces. **Roughly 60% of a reported remainder was
self-inflicted.** Had those rows reached a sheet, **they would have spent his patience on questions
that were not blocking anything.**

**A falsely-blocked item MIGRATES** — into a "what is left" row, into the register, into an ask
forwarded to the PO — **gathering authority at every hop while nobody re-tests the premise. By the time
it reaches him it is a fact.**

---

## THE DELIVERABLE

**Mirror the established format 1:1.** Canonical examples:
- `build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx`
- `build/report-suite/rulings-2026-08-05/Follow-up-Question-for-Chris-Ward_2026-08-05.xlsx`
- `build/filters/PO-Questions-Branko-PartsReports-2026-07-27.md` / `.xlsx`

**Filename: human-readable, naming the PO and the date** — e.g.
`Filters_Questions-for-Branko-Cicovic_2026-08-13.xlsx`. **Never a cryptic slug.**

**Tabs:**
1. **Questions** — the reader-facing rows of §3. **Nothing internal.**
2. **QA mapping** — question number → internal ID + **C-id + link** → what changes when it is answered.

**Both `.xlsx` and `.md`**, matching the established pair.

**And it goes out ATTACHED TO THE COMPLETION REPORT** (skill `05`) that says, with a table behind it,
exactly what is done and exactly what is not — **so that when he forwards it he can stand behind it,
and the PO sees one considered ask rather than a project still in motion.**

---

## THE STEPS

1. **Core §0 pass-start checklist.**
2. **Sweep the outstanding register** and every pass's held items, across the whole project.
3. **Test every one against §6** — decompose, prove, check the documents, check self-serviceability.
   **Delete from the sheet anything that survives that test as answerable by us, and go answer it.**
4. **Check whether it is already answered.** A source may have settled it since it was raised —
   **we have already re-asked a question a source had answered.**
5. **Write the rows** — §2 scoping on every row, §3 simplicity, split anything that will not go simply.
6. **Put the mapping on the QA-only tab.**
7. **Mark every waiting case `AUTOMATION: HOLD`**, saying in its own words **that the question has not
   been sent yet** (§1).
8. **Decide SEND or HOLD** by the §1 test, and **say which, and why**, in the report.
9. **Log every question in `build/OUTSTANDING-ITEMS-REGISTER.md`** — same turn.

---

## GUARDRAILS

- **G1 — Never send while work we could do remains** (§1). Write it and hold it.
- **G2 — Never defer a genuine blocker onto the sheet** (§1 counter-limit). Raise it now.
- **G3 — Never put a defect in front of a PO** (§5).
- **G4 — Never resolve an ambiguity by looking at the build** (§4, core §11.2).
- **G5 — No jargon, no case IDs, no anchors in anything he reads** (§3).
- **G6 — Never imply the PO is sitting on an unsent question** (§1).
- **G7 — Never mix PO attributions** (§2). Branko ≠ Chris ≠ Milos.
- **G8 — Prove the question is necessary first** (§6).

---

## HONESTY NOTES

- **Say plainly when the blocker is US.** *"Drafted 22 July, never sent"* is the correct sentence, and
  the register has had to carry exactly it.
- **Say how long each question has been outstanding**, and what it blocks — **concretely**, with C-ids.
- **A question we deleted from the sheet because we could answer it ourselves is worth reporting** —
  it is evidence the sweep was done, and it is the cheapest credibility we have with a PO.
- **If an answer contradicts itself, say so and ask again** rather than choosing the reading that suits
  the case we want to write.
- **A sheet with fewer rows is usually a better sheet.** Every row removed by our own work is a row he
  does not have to answer.

---

## WHAT THIS SKILL DOES **NOT** DO

| Not this | Use |
|---|---|
| Establish whether a source already answers it | **[`02-SOURCE-CHECK`](02-SOURCE-CHECK.md)** — **do this before writing the row** |
| Prove a case is genuinely blocked | **[`03-RUN-CHECK`](03-RUN-CHECK.md)** + core §11.4 |
| Write or hold the affected cases | **[`01-CASE-BUILD`](01-CASE-BUILD.md)** |
| Report what is done and what is left | **[`05-PROJECT-REPORT`](05-PROJECT-REPORT.md)** — **the sheet ships attached to it** |
| Raise a defect | **[`06-DEFECT-PREP`](06-DEFECT-PREP.md)** — never on this sheet |

**And it never sends anything without the QA lead — the sheet goes to him, and he decides when it
reaches the PO.**
