# Defect candidates — Inline Add and Edit Parts, run R418

**HELD. Nothing is filed.** The QA lead files these one at a time, after all execution is finished,
on his explicit per-defect go-ahead, and verifies each before the next.
Build for all of them: **`v26.36.0-f43b2fd`** on `sv9315.qa.shopview.com`, Full View, administrator.

---

## Candidate 1 — CONFIRMED TWICE · story SV-9316

**Cases:** [C44993](https://shopview.testrail.io/index.php?/cases/view/44993) / [T2724196](https://shopview.testrail.io/index.php?/tests/view/2724196) · [C44994](https://shopview.testrail.io/index.php?/cases/view/44994) / [T2724197](https://shopview.testrail.io/index.php?/tests/view/2724197)

**The rule (S1-N1, S1-N2, as re-verified 2026-09-09):** the "Add Part" button and the Edit control
are not displayed when the work order status is Complete, Invoiced, Paid, **Declined** or Imported.

**What the build does:** on Declined work order **S9315-15897** the Add Part button is shown, and
pressing it genuinely opens the inline row. The Edit controls are present on the part rows and come
to full opacity on a real mouse hover — i.e. fully functional.

**Controls that prove the check is sound:** Complete (S9315-15856), Invoiced (S2-15828) and Paid
(S9315-15894) all correctly show **zero** of both controls, with their Parts sections rendered on
screen. Approved shows 3 Add Part and 5 Edit controls, as it should.

**The case's own instruction:** *"if the button is hidden on Complete, Invoiced, and Paid but SHOWN
on Declined, mark the case FAILED on the Declined check and report the deviation."* That is exactly
what happened.

Evidence: `evidence/21-c44993.json`, `evidence/23-statusmatrix.json`, `evidence/25-declined.json`.

---

## Candidate 2 — CONFIRMED, ISOLATED · story SV-9319

**Case:** [C45058](https://shopview.testrail.io/index.php?/cases/view/45058) / [T2724261](https://shopview.testrail.io/index.php?/tests/view/2724261)

**The rule (S4-N5):** the message names the field — "Cost must be a number.", "Cost cannot be
negative.", "Sell price must be a number.", "Sell price cannot be negative." as applicable.

**What the build does — two of the four are right, two are wrong:**

| Input | Message required | Message shown | |
|---|---|---|---|
| Cost `-5` | "Cost cannot be negative." | **"Cost cannot be negative."** | correct |
| Sell price `-4` | "Sell price cannot be negative." | **"Sell price cannot be negative."** | correct |
| Cost `abc` | "Cost must be a number." | **"Enter a cost to save this part."** | wrong message |
| Sell price `xyz` | "Sell price must be a number." | **"Enter a sell price to save this part."** | wrong message |

The letters are **not rejected at the field** either — `abc` and `xyz` stay in the boxes. The message
shown is the *empty-field* message, which is misleading: it tells the user to enter a cost when they
have entered one, just not a number. Each case was run on its own with a page reload first, so no
leftover state could confuse it.

Evidence: `evidence/33-fv-g.json`, `evidence/31-fv-e.json`.

---

## Candidate 3 — NEEDS ONE MORE CHECK before it can be called · story SV-9319

**Case:** [C45046](https://shopview.testrail.io/index.php?/cases/view/45046) / [T2724249](https://shopview.testrail.io/index.php?/tests/view/2724249)

**The rule (S4-R11):** saving from the part details window adds the part, closes the window AND
closes the inline row, and opens no new row.

**What was seen:** with a complete row (description, quantity 1, cost 3.00, sell price 6.00),
"More options" then "Save part" left the **window open**, the **inline row open**, no toast, and the
part not added.

**Why it is not yet a defect:** the window carries a Source of "Vendor" and a Vendor field that may
be required and empty, in which case the correct behaviour is exactly this refusal — with a message
I did not capture. **Before filing: re-run and read the window's own validation messages.**

Evidence: `evidence/33-fv-g.json`.

---

## Candidate 4 — NEEDS ONE MORE CHECK before it can be called · story SV-9319

**Case:** [C45040](https://shopview.testrail.io/index.php?/cases/view/45040) / [T2724243](https://shopview.testrail.io/index.php?/tests/view/2724243)

**The rule (S4-R5) clause 2:** a part saved with no category is assigned "Uncategorized".

**What was seen:** a part saved from the inline row without choosing a category opens in "Edit Part
Request" with the Category box **empty**, not "Uncategorized". Clause 1 is fine — the category
control is a genuine select listing the shop's categories.

**Why it is not yet a defect:** the inline row *displays* "Uncategorized" as its category placeholder,
so the stored value may well be Uncategorized while the edit window simply renders the box blank.
**Before filing: read the saved part's category from the parts list or the part record, not from the
edit window alone.**

Evidence: `evidence/33-fv-g.json`.

---

## Review item (not a defect) — for the QA lead

**Case:** [C45047](https://shopview.testrail.io/index.php?/cases/view/45047) / [T2724250](https://shopview.testrail.io/index.php?/tests/view/2724250) — **passed**, with a wording question.

The case says the part details window is cancelled *"via Cancel, the X, or Escape"*. There is **no
button labelled "Cancel"** in that window — its buttons are **×**, **"AI ShopCoach Parts"** and
**"Save part"**. Both routes that do exist behave correctly (nothing discarded, row intact, modal
changes not carried back), so the behaviour under test holds and the case passed. The question is
whether the case wording should drop "Cancel", or whether the window should have that button.
