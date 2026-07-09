# Fees & Discounts — A Few Quick Questions for You

Hi! This is about the new **Fees & Discounts** feature.

While checking it over, we found a handful of spots where the app behaves a
little differently than the original write-up described. None of these are
problems on their own — we just want your quick call on each one so we know
which way you'd like it to work.

There are **no wrong answers**. For each item below, pick an option (or write
your own) on the **"Your answer"** line. It should take just a few minutes.

---

## 1. The Stats page shows one combined total instead of a line-by-line list

**What happens now**
On the Statistics page, fees and discounts are shown as a single rolled-up
total (for example, "Fees (3): $227.90"). They are not listed out one at a time.

**What we'd like you to decide**
Is the combined total what you want for this release, or should each fee and
discount be listed separately with its own row?

**Options**
- A) Keep it as it is — one combined total is fine for now.
- B) Change it so each fee and discount is listed on its own row.

**Your answer:** _______________________________________________

---

## 2. A customer's default fee now adds only once — please confirm that's what you want

**What happens now**
Previously there was a worry that a customer's default fee could get added
twice to a new work order. In our testing it now adds **only once**, which
looks fixed.

**What we'd like you to decide**
Can you confirm that adding it only once is the intended behavior?

**Options**
- A) Yes — adding it only once is correct. Treat this as settled.
- B) No — it should behave differently (please describe).

**Your answer:** _______________________________________________

---

## 3. "Processing Fee" isn't visible in the app yet, but is partly ready

**What happens now**
The "Processing Fee" option isn't available to pick in the app yet. However,
the underlying system will already partly accept it.

**What we'd like you to decide**
Is Processing Fee meant to be part of this release, or is it planned for a
later one?

**Options**
- A) It's coming in a later release — leave the visible option out for now.
- B) It should be part of this release — the visible option needs to be added.

**Your answer:** _______________________________________________

---

## 4. The "Add" button on the fee form is clickable before the form is filled in

**What happens now**
When adding a fee, the "Add" button can be clicked even before the form is
complete. If you click it too early, it shows an error message instead of
staying greyed out until everything is filled in correctly.

**What we'd like you to decide**
Is showing an error on click acceptable for this release, or should the "Add"
button stay greyed out until the form is valid?

**Options**
- A) Keep it as it is — showing an error on click is fine for now.
- B) Change it so the button is greyed out until the form is filled in correctly.

**Your answer:** _______________________________________________

---

## 5. When a line has several fees/discounts, they all show at once (no "show more")

**What happens now**
When a single line has more than one fee or discount, all of them are shown at
the same time. There's no "show more / show less" option to collapse the list.

**What we'd like you to decide**
Is showing them all at once fine for this release, or should there be a "show
more" collapse when there are several?

**Options**
- A) Keep it as it is — showing them all at once is fine.
- B) Change it so extra ones collapse under a "show more" option.

**Your answer:** _______________________________________________

---

## 6. On the customer-defaults screen you add templates one at a time from a dropdown

**What happens now**
On the customer-defaults screen, you pick fee/discount templates from a
dropdown one at a time. There isn't a checklist where you can tick several and
add them all together.

**What we'd like you to decide**
Is picking them one at a time acceptable for this release, or should there be a
checklist to add several at once?

**Options**
- A) Keep it as it is — adding one at a time is fine.
- B) Change it so you can tick several and add them all at once.

**Your answer:** _______________________________________________

---

## Thank you!

That's everything. Your answers will help us finish this feature the way you
want it. Feel free to add any notes alongside your choices.

---
---

## Internal — for QA only, not for the PO

This mapping links each plain-English question above to the case IDs and
deviation references it covers, so answers can be actioned. **Do not include
this section in the PO-facing copy or the PO tab of the workbook.**

| Q# | Source thread | Cases / refs covered |
|----|---------------|----------------------|
| 1 | Part 1 #1 | FD-STATS-001 (BUG-FD-2 / FDBUG-6); also settles FD-STATS-002, FD-STATS-004 |
| 2 | Part 1 #4 | FD-CUST-016 / FD-VAL-007 (BUG-FD-1 double-add; did not reproduce — confirm S9 dedupe shipped) |
| 3 | Part 1 #5 | NOTE-FD-4 (Story 8 Processing Fee — backend accepts it, builder UI missing) |
| 4 | Part 1 #6 | FD-WO-005 / FD-VAL-001 (BUG-FD-4 — confirm button enabled; validation on submit) |
| 5 | Part 1 #7 | FD-INLINE-003 (BUG-FD-5 — no "Show N more" collapse on line adjustments) |
| 6 | Part 1 #8 | FD-CUST-005 (NOTE-FD-5 / FDBUG-7); ruling also settles FD-CUST-003/004/006/007 |

Notes:
- Two threads from the earlier draft were intentionally **removed** from this
  PO document because they are dev bugs, not product decisions, and are already
  captured in `build/fees-discounts/jira-bug-drafts.md`:
  the whole-WO permission "hidden but not backend-enforced" item (BUG-FD-3), and
  the customer total/estimate leaving out the fee/discount amount (FDBUG-1).
- The pure code-bug tickets and the Part 2 case-update wording proposals are
  intentionally excluded from this PO document — they go to dev tickets / QA
  case updates, not the PO. Source:
  `build/fees-discounts/Deviations-and-Questions-for-PO.md`.
