# ROOT CAUSE — how we missed the cases Vlad found

**Written for a non-technical reader (Standing Rule 7). Plain words, no jargon.**
**Date:** 2026-08-06 · **Asked for by:** the QA lead · **Raised by:** Vlad (automation engineer)

---

## THE SHORT ANSWER, IN FIVE SENTENCES

**We checked that the 110 test cases we already had were correct. We never went back and checked
whether 110 was the right NUMBER of cases.** The list that maps every rule in the written spec to the
test case covering it — the thing that would have shown a rule with no case next to it — **was last
written on 17 July, when the spec had 81 rules and we had 79 cases. The spec now has 132 rules and the
spec document has been rewritten eight times since.** Nobody rebuilt that list, so **nothing in our
process was looking in the direction Vlad was looking.** And separately, on one of his rows we did
something worse than miss a case: **we changed two test cases to say the opposite of what the product
owner had decided, because we mis-read which of two sources was the newer one.**

---

## WHAT HE WAS RIGHT ABOUT, AND WHAT HE WAS NOT

Of his eleven rows (twelve once one row is split, because it makes two separate points):

- **He is right on 6.** One of those six is not a gap at all but a **defect** — our cases were asserting
  a behaviour that had been rejected.
- **He is wrong on 5** — the coverage exists. **But four of those five are still our fault**, because he
  could not find it. More on that below.
- **One row was never a gap** — it is a deliberate wait, on the QA lead's own instruction.

**Full detail, with both texts quoted side by side for every row, is in `ROW-BY-ROW.md`.**

---

## THE FOUR THINGS THAT WENT WRONG

### 1. The map from "rules in the spec" to "cases we have" was three weeks and eight spec versions out of date

This is the big one, and it explains most of the genuine gaps.

Our coverage map, `build/filters/coverage-matrix.md`, was written on **17 July**. It says so at the top:
*"Total cases authored: 79 across 14 sections"*, covering *"Stories 1–12"* and *"81 requirement lines"*.

Since then:

| | 17 July | today |
|---|---|---|
| Rules in the spec | 81 | **132** |
| Whole new sections of the spec | — | **Story 13 "Page Search" (30 rules) and Story 14 "Global Search" (7 rules)**, both added on 26 July |
| Cases we have | 79 | **110** |
| Times the spec has been republished | — | **8** (v11 → v19) |

**The map has never been rebuilt.** Searching it for the rule numbers Vlad raised returns **zero hits
for anything in Stories 13 or 14.** So the two newest, largest sections of the spec have **never once**
been checked in the direction "here is a rule — which case covers it?"

**Three of his four genuine gaps live in exactly that unmapped territory**, and the fourth lives in a
part the 17 July map had deliberately ruled out of scope.

**We had a rule for this and it was not run.** Standing Rule 43 says coverage maps are *"RE-DERIVED PER
SPEC VERSION, NEVER INCREMENTALLY PATCHED"*, in **both** directions. It was not re-derived — not for
v12, not for v18, not for v19.

**Why not, honestly:** every pass since 17 July was pointed at the cases rather than at the spec. The
big pass of 5 August drove all 110 cases live and got all 110 right — and its own notes admit it *"did
NOT re-derive whether 110 is the RIGHT SET"*. **A perfect score on the wrong exam.**

### 2. One sentence that makes six promises got one tick instead of six

This is the same mistake as the one Vlad caught in July, on a different project. It has recurred.

The product owner answered a parity question on 31 July with a single sentence:

> *"Yes - **multi-select, clearing, collapse, persistence, shareable URL and mobile** all match Work
> Orders."*

**That is six separate promises.** We recorded it as one fact — "parity: yes" — and wrote cases for
three of the six. **Collapse, shareable link and mobile behaviour on the Parts and Reports pages have
no case at all.** Vlad spotted it.

The identical thing happened to a rule in the spec:

> *"Filter selections are stored server-side… **They sync across the user's devices. Where two devices
> write different state, last write wins.**"*

**Two promises.** We covered the syncing. **Nothing anywhere tests what happens when two devices
disagree.**

**We had a rule for this too.** Standing Rule 45(e): *"a requirement making two assertions gets one row
PER ASSERTION"*. It was written after the July incident — **and it was only ever applied to the spec, never
to a product owner's answer.** A promise in an email counts exactly as much as a promise in the spec.

### 3. We treated a page's publication date as if it were the rule's own date — and reversed a decision because of it

**This is the serious one, and it is a defect rather than a gap.**

The spec says the Status filter is **hidden** on two tabs. The product owner, asked directly on 17 July,
said the opposite: it is **shown, greyed out, and already filled in**. The QA lead confirmed the same on
30 July. The design drawing shows the same.

On 5 August one of our passes changed two test cases from the product owner's answer to the spec's
wording, and wrote down its reason:

> *"The specification is the newer authoritative source, so the cases follow it."*

**That reason is wrong, and it is easy to prove wrong.** We fetched that sentence out of ten different
versions of the spec page. **It is identical in all ten. It has not been edited since 14 May** — two and
a half months *before* the product owner's answer.

**What actually happened: the pass compared the date the PAGE was republished (4 August) with the date of
the answer (17 July), and concluded the spec was newer.** The page was newer. **The rule inside it was
much older.** Nobody checked when that particular sentence was last touched.

The result is the worst kind of error we can make: **a test case that will fail a correctly-built product,
while looking freshly reviewed and carrying a confident explanation of itself.** Vlad's row 1 is exactly
this, and he is entirely right about it.

It also **quietly reversed two recorded decisions** — the product owner's and the QA lead's. Our rules
forbid that outright.

### 4. Five of his eleven rows are false alarms, and four of those are still our fault

He said five things were missing that are not. But look at **why** he could not find them:

- The case that fully covers *"Back to my view"* is **titled after a different rule**. Anyone scanning
  titles finds only the negative case — which is what he reported.
- The case covering *"a search is never remembered next time"* has it as **point 4 of a five-point list**.
- The single-date-range rule he says is missing is **point 6 of a seven-point list**.
- The 42-surface sweep he says is thin is **one case that visits all 42** — we counted them against the
  spec's own list, group by group: 5 + 11 + 10 + 12 + 2 + 2 = 42.

**There is no published list he could have checked**, so his only option was to read 110 case bodies
looking for sentences buried in the middle of them. **He did that and got 6 of 11 right, which is a good
hit rate for an impossible task.** The reason he had to do it at all is that **we never gave anyone a map.**

**And one row is purely a communication failure of ours.** His row 7 — the Parts and Reports filter
chips — is a **deliberate wait**, decided by the QA lead himself (*"lets wait for Brankos PRD"*), written
down properly in our own decisions register, and stated on all ten affected cases. **He simply never saw
that register, because it lives in our repository and was never sent to him.** Our own Rule 46 warns
about precisely this: *"an undocumented deliberate omission is indistinguishable from a miss"* — and a
document nobody outside the team reads is, to him, undocumented.

---

## IS THIS THE SAME FAILURE AS JULY, OR A NEW ONE? BOTH.

The QA lead asked for this comparison, and the honest answer has two halves.

**The July failure has RECURRED.** In July, Vlad found a missing export column because a requirement
making two promises got one verdict, and a "covered" tick nobody had to prove. **That is rows 3b and 9,
almost exactly.** Rule 45(e) was written to stop it. **It stopped it in the spec and not in the answer
sheets** — we fixed the specific door and not the corridor.

**But the sharpest finding today is genuinely NEW.** Nothing in our rules told us to check **when a
particular sentence in a document was last edited.** Rule 31 already warns that the version number
*printed inside* a Confluence page lies — this page still says "1.6" while the page is at 19. **Today's
trap is the mirror image: the page's real version number is honest, and it still tells you nothing about
whether the rule you are reading is new or five months old.** We had no defence against that, and it cost
us two reversed decisions.

**The pattern across the week is worth saying out loud.** This is the **fourth** time in seven days that
someone outside our own work found something our checks did not — Vlad in July on the export columns,
Ahtasham twice on Filters, and Vlad again now. **The common thread is not carelessness inside a pass; every
one of those passes did its own job well.** It is that **all our checks look at the cases, and none of them
looks at the spec and asks what is not there.** Outsiders come from the other direction, so they keep
finding the same class of thing. Two of today's five false alarms even came from **Ahtasham finding a brand
new requirement before we did** — he updated one of our cases at 11:27 this morning for a rule the product
owner did not publish until 11:48.

---

## WHAT WOULD HAVE CAUGHT EACH OF THESE

| What went wrong | The check that would have caught it | Did the rule exist? |
|---|---|---|
| Rules in Stories 13/14 with no case | Rebuild the rule → case map from the current spec, **both directions**, every time the spec is republished | **Yes — Rule 43. It was not run.** |
| Six promises in one sentence, three tested | One row **per promise**, including promises in answer sheets, not only in the spec | **Yes — Rule 45(e). It was applied to the spec only.** |
| A five-month-old rule used to override a three-week-old decision | Before using a rule to overrule anything, **check when that sentence was last edited**, not when the page was republished | **No. This is new.** |
| Mobile Imported, and the six named toolbars | Treat **desktop vs phone** and **each named page** as separate surfaces needing their own verdict | **Yes — Rule 40. It was read as "screen vs export", not "desktop vs phone".** |
| Five false alarms nobody could have avoided | **Publish** the rule → case map so an outsider can check a list instead of reading 110 case bodies | **No. This is new.** |
| A deliberate wait mistaken for a miss | **Send** the decisions register to the people who review us | **Half — Rule 46 says write it, not send it.** |

**Two of the six are genuinely new**, and one more needs widening. Suggested as rule changes for the QA
lead's decision, not applied by this pass:

1. **When a document is used to overrule anything, quote the rule AND the date that rule itself was last
   edited.** For Confluence that is a single extra call per requirement, and it is what settled row 1
   today in about two minutes.
2. **Publish the rule → case map** with every suite, and re-derive it whenever the spec is republished.
   It turns an outsider's review from archaeology into a one-page check.
3. **Widen Rule 45(e) explicitly to cover PO answers, videos and tech plans** — any source that can make
   more than one promise in one sentence.

---

## OUTSTANDING — what I need from you

1. **Branko must settle the Status chip** — is it hidden on the Estimates and Completed tabs, as the spec
   has said since 14 May, or shown greyed out and pre-filled, as he told us on 17 July and you confirmed
   on 30 July? **Five cases are on hold waiting for one sentence.** Question 1 in
   `QUESTIONS-FOR-BRANKO.md`.
2. **Your view on the reversal of your own 30 July ruling.** Our 5 August pass overturned it on a
   mistaken reading of which source was newer. This pass has put the cases back to your ruling. **If you
   would rather they wait at "hidden" until Branko answers, say so and it is one write to change.**
3. **Branko owes the Parts and Reports write-up.** Ten cases are held on it, and it is Vlad's row 7. This
   is the fourth week of asking.
4. **A fresh sign-in for `.qa.shopview.com`.** Nothing in this document needed it, but nothing new
   authored today could be observed either.
5. **Two new questions for Branko** — the date filter's web-address format (row 8) and the phone
   behaviour when Imported is de-selected by picking another status (row 11). Both are in
   `QUESTIONS-FOR-BRANKO.md`.
6. **Your decision on the three rule changes above.**
7. **Separate from Vlad's rows, and needing its own go-ahead:** **15 of the 110 cases currently show raw
   formatting code to the tester**, and **all 110 now name a superseded spec version** (v18; the live spec
   went to v19 this morning). Neither was repaired here — 110 writes is its own pass. Detail in
   `SOURCE-CURRENCY.md`.
