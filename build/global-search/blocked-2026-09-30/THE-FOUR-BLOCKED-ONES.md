# The four checks that are still on hold — one by one

Looked at again on the staging site on 30 September 2026, signed in as an office admin,
workplace **Staging Heavy Duty - 9919**.

**The wording below is the site's own wording**, read off the screen this morning:

| Where | What it says on screen |
|---|---|
| Button at the top of every page | **Search customers, work orders, parts...** (with **Ctrl** **K** beside it) |
| The box once it opens | **Search work orders, customers, parts and more** |
| The row of headings under the box | **All · Work orders · Customers · Assets · Parts · Vendors · Part sales · Purchase orders · Vendor invoices** |
| Grey line under a result's name | **Matched:** … or **Category:** … or **Contact match:** … |
| Bottom of the panel | **Navigate · Select · Close** |

---

## Why these four never got a pass or a fail

All four say the same thing in their own Expected Behaviour box:

> *"Do not pass or fail it. Record what you saw."*

They were written that way on purpose, because **the written requirement does not say what should
happen**. So the hold is not something going wrong on the site and it is not something I lacked
access to — it is a question nobody has answered yet. I have now done the whole check and written
down what the screen does. The only thing left is the decision.

**I cannot lift these myself.** Not because of a permission, a login or missing data — I have all of
those. Marking one of these passed or failed would mean me deciding what the product ought to do, and that is not mine to
decide.

**None of the four is hiding a problem.** In every one of them the screen did something sensible.
That is the important part: these are unanswered questions, not unexamined risks.

---

## 1 · A customer found by postcode

**What it is checking:** if I find a customer by typing their postcode, does the result line tell me
that is why it came back?

**How to do it yourself**
1. Click **Search customers, work orders, parts...** at the top of the page.
2. Into **Search work orders, customers, parts and more**, type: `H8A3X9`
3. Click the heading **Customers**.
4. Look at the one result, without opening it.

**What it should do (the written requirement):** *"Each result row carries enough context to pick the
right record without opening it."*

**What it actually does:** the result reads

> **7 Star Truck Repair**  ·  30 open
> 305 Harris Cape, Priscillabury, Nunavut  ·  **Matched: H8A3X9**

So the postcode is there, in full, highlighted. But the little label in front of it is the generic
word **Matched**, rather than the name of the thing it matched — it does not say *postcode*. On other
kinds of records the site does name the field (see the next two), so the site is inconsistent with
itself rather than wrong.

**Two extra things I found while I was in there**
- The postcode only matches **whole**. `H8A3`, `8A3X9`, `H8A3X`, `A3X9` all return nothing at all.
- If you type it with a space — `H8A 3X9` — it still finds the customer, **and the grey line still
  reads `Matched: H8A3X9`**, the postcode as it is stored, not as you typed it.

**The decision needed:** should that grey label name the field it matched (*Postcode: H8A3X9*), or is
the generic *Matched:* good enough?

---

## 2 · A part found by its category

**What it is checking:** the same question, for a part found by the category it sits in.

**How to do it yourself**
1. Click **Search customers, work orders, parts...**
2. Type: `.Brake Parts`
3. Click the heading **Parts**.
4. Look down the list.

**What it should do:** same sentence as above.

**What it actually does:** the parts that came back *because of the category* read

> **E2E fixed-price inventory part**  ·  49 Available  ·  INVFIXED-1789476537669  ·  **Category: .Brake Parts**

This one is the good example — it **names the field** and shows the **whole value**. Two other parts
higher up the list came back because the words *Brake* and *Parts* are in their own names instead,
which is correct and not a problem.

**The decision needed:** confirm this is the wanted behaviour, so the other two can be made to match it.

---

## 3 · A supplier found by email address

**What it is checking:** the same question again, for a supplier found by their email address.

**How to do it yourself**
1. Click **Search customers, work orders, parts...**
2. Type: `zzhidden.vendor@staging.shopview.local`
3. Click the heading **Vendors**.
4. Look at the one result.

**What it should do:** same sentence as above.

**What it actually does:**

> **Rowcheck Quiet Fields Supply**  ·  **Contact match: zzhidden.vendor@staging.shopview.local**  ·  (264) 400-0900  ·  21 Result Row Way, Fernvale, Ohio

The whole email address is shown. The label says **Contact match** — which is halfway: it tells you
the match came from the contact details, but not that it was the email address specifically rather
than the phone number or the address.

**The decision needed:** is *Contact match* enough, or should it say *Email*?

---

## 4 · Typing one character, then two

**What it is checking:** everybody types one letter on the way to typing six. Does the site cope?

**How to do it yourself**
1. Click **Search customers, work orders, parts...**
2. Type a single **9** and wait a moment.
3. Type a second **9** and wait a moment.
4. Watch what happens at each step.

**What it should do:** the written requirement only sets a short pause before it searches. It does not
say whether one character should search at all. What the check does insist on is that it **must not
show an error, must not freeze, and must not leave the previous results sitting on screen**.

**What it actually does:** one **9** brings back results straight away. A second **9** replaces them
with a different, larger set. Nothing errored, nothing froze, and the first set did not linger. All
three of the things it must not do, it did not do.

**The decision needed:** should searching wait until two or three characters have been typed, or is
searching from the first character wanted?

---

## What I would do next

Three of these four are really **one question**: *should the grey line under a result name the field
it matched?* Today it says **Matched**, **Category** and **Contact match** for three different kinds
of record. If the answer is yes, that is a single small piece of work and one report, not three.

The fourth is separate and is only a yes/no: search from the first character, or wait for a couple.

Nothing here needs testing again once those two answers exist — the observations are recorded and the
screens are photographed.

---REFERENCE---

Run 415 — https://shopview.testrail.io/index.php?/runs/view/415

| Case | Result to date | Case link | Test in the run |
|---|---|---|---|
| C146221 SRI-CUST-C8 | Blocked — held by its own Expected | https://shopview.testrail.io/index.php?/cases/view/146221 | https://shopview.testrail.io/index.php?/tests/view/3298130 |
| C146241 SRI-PART-C4 | Blocked — held by its own Expected | https://shopview.testrail.io/index.php?/cases/view/146241 | https://shopview.testrail.io/index.php?/tests/view/3298150 |
| C146250 SRI-VEND-C1 | Blocked — held by its own Expected | https://shopview.testrail.io/index.php?/cases/view/146250 | https://shopview.testrail.io/index.php?/tests/view/3298159 |
| C146301 SRI-ALL-G4  | Blocked — held by its own Expected | https://shopview.testrail.io/index.php?/cases/view/146301 | https://shopview.testrail.io/index.php?/tests/view/3298210 |

Build: staging `v26.39.2-51a35e1`, observed 2026-09-30. Story SV-9170. Open questions Q1 and Q10.
Raw observations: `build/global-search/blocked-2026-09-30/observations.json`.
Pictures: `build/global-search/blocked-2026-09-30/pics/`.
Rule 58 (a silent source is never resolved from the build) and Rule 114 (the Expected is never
edited) are why these stay Blocked rather than being given a verdict.
