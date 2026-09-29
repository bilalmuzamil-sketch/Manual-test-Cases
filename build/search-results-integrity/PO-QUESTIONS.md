# PO questions — Search Results Integrity (Global Search)

**Project:** Global Search · **Feature:** search result rows · **Raised:** 2026-09-29
**Asked against:** Global Search - Product Requirements, **v1.5 (2026-09-08)**, and SV-9170

Every question below exists because a test case could not be written without inventing an
expectation. Rule 113 forbids inventing one, and Rule 58 forbids resolving it by looking at the
build — so the case is written, marked HELD, and waits here.

**Each row names the project and the feature, and is answerable without reading code.**

---

## Q1 — THE BIG ONE. When a search result matches on something the row does not show, what should the row do?

**Project:** Global Search · **Feature:** search result rows

**The situation, in plain words.** The search looks inside far more information than the result row
displays. A vendor can be found by typing their contact's phone number; a work order can be found by
typing a part that is on it; an asset can be found by its VIN. In each of those cases the row comes
back and **shows no sign of what you typed** — the name and address are there, but the phone number
you searched is nowhere on the row.

**Why it matters.** This is the single biggest cause of the complaints coming from UAT and support.
The row looks wrong or random, because from the user's side it *is* random — they typed something and
got back a row that does not contain it.

**What the spec says today.** §5.3 says the matched text is highlighted "in the primary and secondary
text". It does not say what happens when the matched value is in neither.

**What we need decided — please pick one:**

| | Option | What the user would see |
|---|---|---|
| **A** | Show the matched value on the row | The row gains a line like "Contact phone: 857-496-5067" when that is what matched |
| **B** | Label the match without showing the value | The row gains a small label like "Matched on contact phone" |
| **C** | Leave it as it is | The row shows nothing about why it came back (today's behaviour) |
| **D** | Something else | Please describe |

**How many cases are waiting on this:** 32 — every case in Class C across all eight tabs.

---

## Q2 — Should a customer found by their phone number show that phone number?

**Project:** Global Search · **Feature:** Customers result row

**The situation.** PRD §4 says a Customer row displays "telephone on hover". The build does not show
a customer's telephone anywhere — not on hover, not on the row. Vendor rows *do* show a telephone.

**Why it matters.** Typing a phone number is the most common way a service advisor finds the person
who is on the phone right now. Today they type a number, get a customer, and the number is not on the
row to confirm it is the right one — and when two customers share the last four digits there is no
way to tell which is which.

**What we need decided:** should the customer row show the telephone — and if so, always visible or
only on hover? (If "on hover", note that a hover cannot be seen while scanning a list, and cannot be
used on a phone at all.)

**Cases waiting on this:** `SRI-CUST-C1`, and it is the direct cause of SV-10619's scenario.

---

## Q3 — When the search reports "what matched", should it be the matched part or the whole value?

**Project:** Global Search · **Feature:** match highlighting

**The situation.** The system reports, per row, which piece of text matched. Today it sometimes
reports **just the characters you typed** and sometimes **the whole field value** — the same field,
the same kind of match, both behaviours. Measured on staging on 2026-09-29; details in
`WHY-SEARCH-RESULTS-DISAPPOINT-Root-Cause-Analysis.md` §3.

**Why it matters.** This inconsistency is the mechanism behind SV-10619. Whatever the screen is meant
to show, it cannot show it reliably while the same field means two different things.

**What we need decided:** should that report always be the matched fragment, always the full value,
or does the screen not depend on it at all? **This one may need engineering in the room.**

**Cases waiting on this:** every Class A case (24 across the eight tabs).

---

## Q4 — Should the Assets row show the unit number? The spec does not list it; the build shows it.

**Project:** Global Search · **Feature:** Assets result row

PRD §4 says an Asset row displays "year + make + model (primary), customer name (secondary)". The
build also shows the **unit number**, in bold, leading the row.

We think the build is more useful here — the unit number is what a shop calls the truck by, and
SV-10551 is a complaint that it is not shown *completely*. But the spec does not say so, so the case
cannot assert it.

**What we need decided:** add the unit number to §4's displayed list for Assets, or remove it from the
row?

---

## Q5 — Is licence plate meant to be searchable?

**Project:** Global Search · **Feature:** Assets

Typing a licence plate returns assets. **Licence plate is not in PRD §4's indexed list for Assets.**
It is also not displayed, so an asset found this way shows nothing about why.

**What we need decided:** is this intended (add it to the spec), or not (remove it from the search)?

---

## Q6 — Is postal code meant to be searchable for customers?

**Project:** Global Search · **Feature:** Customers

The same shape as Q5. Typing a postal code returns customers; postal code is not in §4's indexed list
for Customers. The code carries a deliberate note that Canadian postal codes are handled specially,
so this looks intentional but undocumented.

**What we need decided:** add it to the spec, or remove it?

---

## Q7 — Are "number variants" meant to be searchable for purchase orders?

**Project:** Global Search · **Feature:** Purchase Orders

A purchase order can be found by a number form that appears nowhere on its row. This is not in §4.

**What we need decided:** add it to the spec, or remove it? If it stays, Q1's answer matters doubly
here, because the number that matched is by definition not the number on screen.

---

## Q8 — Which date should a Vendor Invoice row show?

**Project:** Global Search · **Feature:** Vendor Invoices result row

PRD §4 says "total + **invoice date**". The build shows the **received** date. These are usually
different days.

**What we need decided:** which one belongs on the row?

---

## Q9 — What should an asset row show when it has no year, make or model?

**Project:** Global Search · **Feature:** Assets result row

§4 covers the work-order version of this ("when the asset has no unit number, the year/make/model
stands alone") but not the asset row's own version. Real data has vehicles with none of the three.

**What we need decided:** what identifies the row then — the unit number, the customer, or something
else?

---

## Q10 — Is there a minimum number of characters before search runs?

**Project:** Global Search · **Feature:** search input

The old search ignored queries under two characters. PRD v1.5 sets a typing delay (150ms) but **no
minimum length**. So we cannot say whether typing a single character should search, wait, or do
nothing.

**What we need decided:** is there a minimum, and what is it?

---

## OUTSTANDING — what I need from you

### On YOU

1. **Answer Q1.** It is the one that unblocks the most — 32 cases, and the whole class of complaint
   from UAT and support. **What to do:** reply with A, B, C or D from the table in Q1. If you would
   rather the PO decided, say so and I will put it in a sheet for them.
2. **Tell me whether to send these to the PO at all**, or whether you want to answer some yourself.
   **What to do:** reply "send all to PO", or answer the ones you can and tell me to send the rest.
3. **Q3 may need a developer.** **What to do:** tell me whether to raise it with engineering, and
   with whom.

### On ME

- Nothing is blocking. The 110 cases are written and committed. 32 of them are HELD pending Q1 and
  are clearly marked so no tester runs them expecting a verdict.
- When Q1 is answered I rewrite those 32 Expected Results to quote whatever the answer becomes —
  and the answer must be written into the PRD first, because Rule 113 quotes the SOURCE, not a
  reply in a chat.
