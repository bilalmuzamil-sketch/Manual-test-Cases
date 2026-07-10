# Fees & Discounts — Round 2: Four Quick Questions for You

Hi Chris! Thanks for your answers to the first set — they are all
actioned. While finishing our checks we found **four** more spots where
we need your call on how it should work.

There are **no wrong answers**. For each item, pick an option (or write
your own) on the **"Your answer"** line. It should take just a few
minutes.

---

## 1. A discount bigger than the bill saves with no warning

**What happens now**
If someone applies a discount that is larger than the whole work order's total, it just saves — there is no warning or "are you sure?" step. The bill's total becomes $0.00 and the extra amount is quietly kept as a credit on the customer's account. The credited amount itself is exact — nothing is lost — but the user is never told any of this is happening. The original write-up expected a warning first.

**The question**
Should the app warn the user and ask them to confirm before saving a discount bigger than the bill, or is saving silently fine as long as the extra amount is kept as an exact customer credit?

**Options**
- A) Add the warning - the user must see what will happen (total becomes $0.00, the extra becomes a customer credit) and confirm before it saves.
- B) Silent is fine - no warning needed, as long as the credited amount is exact (which it is today).

**Your answer:** ______________________________________________

---

## 2. Typing 0 as a fee's maximum removes the limit instead of applying it

**What happens now**
When creating a percentage fee or discount, there is a "maximum amount" box so the charge can never go above a chosen ceiling. If someone types 0 into that box today, the 0 is saved but then ignored - the fee is applied with NO maximum at all, as if the box had been left empty.

**The question**
What should typing 0 into the maximum box mean: no limit (as it works today), a limit of zero (so nothing is charged), or should the app simply not accept 0 in that box?

**Options**
- A) 0 means "no limit" - keep it working the way it does today.
- B) 0 means "cap at zero" - the fee/discount amount becomes $0.00 (charge nothing).
- C) Don't allow it - the app should refuse 0 in the maximum box and ask for a real amount (or an empty box).

**Your answer:** ______________________________________________

---

## 3. Very small percentages are quietly rounded up

**What happens now**
The smallest percentage the app is meant to work with is 0.01%. If someone types in something even smaller - for example 0.005% - the app accepts it and quietly changes it to 0.01% without saying anything. The user thinks they saved 0.005% but the app is actually using 0.01%.

**The question**
Is quietly rounding tiny percentages up to 0.01% acceptable, or should the app keep exactly what was typed, or refuse values that small?

**Options**
- A) Rounding is fine - quietly using 0.01% for anything smaller is acceptable.
- B) Keep the exact value - the app should save and use exactly what was typed (for example 0.005%).
- C) Refuse it - the app should reject anything smaller than 0.01% with a clear message, so the user knowingly picks a valid value.

**Your answer:** ______________________________________________

---

## 4. A processing fee's "minimum amount" is quietly thrown away

**What happens now**
A processing fee (the fee that covers card-processing costs) is not supposed to have a minimum amount. But if someone does type a minimum amount on one, the app doesn't complain - it just saves the fee WITHOUT the minimum and never tells the user the number they typed was thrown away.

**The question**
Should processing fees support a minimum amount, or - if they shouldn't - should the app make that clear instead of silently dropping the number?

**Options**
- A) Support it - a processing fee should be able to have a minimum amount, and the app should honor it.
- B) Don't support it - but make that clear: remove/disable the box for processing fees (or show a message) so nothing a user types is ever silently thrown away.

**Your answer:** ______________________________________________

---

## Thank you!

That's everything for this round. Your answers will help us finish this
feature the way you want it. Feel free to add any notes alongside your
choices.

---
---

## Internal — QA-only mapping (NOT for the PO)

This section links each plain-English question above to its internal
bug/case refs, TestRail cases, spec refs and current status, so the
answers can be actioned. **Do not include this section (or any IDs/codes
in it) in the PO-facing copy or the "Questions for PO" tab.**

### Q1

- **Internal refs:** FDBUG-15 (over-discount saves silently, no warn/confirm). Primary case FD-QB-014; companion over-discount thread FD-QB-012 (floor worked example, Verified) + FD-QB-015 (excess -> customer credit; in-app half VERIFIED 2026-07-10: credit of exactly -117.24; QB goodwill-memo half Blocked-Env). Customer-document (FD-DOC) surfaces show the floored $0.00 totals per S6-R10 - only the warning step is missing.
- **TestRail cases:**
  - FD-QB-014 — [C28557](https://shopview.testrail.io/index.php?/cases/view/28557)
  - FD-QB-012 — [C28555](https://shopview.testrail.io/index.php?/cases/view/28555)
  - FD-QB-015 — [C28558](https://shopview.testrail.io/index.php?/cases/view/28558)
- **Spec refs:** requirements.md §7.1: S6-R12 (mandatory warn/confirm before saving when discounts exceed the net subtotal); context S6-R10 (subtotal floors at $0.00) + S6-R11/R13 (excess recorded as customer credit / QB tax-exempt goodwill credit memo).
- **Current status:** FD-QB-014 = VIU-Deviation (FDBUG-15 CONFIRMED AGAIN 2026-07-10: over-discount saves 201 with no warning payload; batch-6 UI shots show no warn/confirm dialog). Currently bucketed case-update pending this PO ruling. A=defect ticket + keep spec expected; B=case-update FD-QB-014 to silent-carry expected.

### Q2

- **Internal refs:** FDBUG-9 (maxCap 0 accepted as "no cap"). Cases FD-CALC-008 (0 must force $0.00), FD-VAL-006 (0/empty edge behavior), FD-TMPL-011 (template dialog stores 0). Jira draft exists: jira-bug-drafts.md TICKET 4 (not filed).
- **TestRail cases:**
  - FD-CALC-008 — [C28575](https://shopview.testrail.io/index.php?/cases/view/28575)
  - FD-VAL-006 — [C28604](https://shopview.testrail.io/index.php?/cases/view/28604)
  - FD-TMPL-011 — [C28512](https://shopview.testrail.io/index.php?/cases/view/28512)
- **Spec refs:** Spec contradiction the PO answer settles: §5-R6 (Max $0 forces resolve to $0.00) vs S7-R12e/R14 (0 treated as empty / never sent; design-notes §6 "Max cap min=0"). Live build matches NEITHER reading for 0 (0 = unlimited).
- **Current status:** FD-CALC-008 / FD-VAL-006 / FD-TMPL-011 = VIU-Deviation (FDBUG-9 CONFIRMED AGAIN 2026-07-10: maxCap 0 stored, 10% resolved 34.15 = uncapped). A=case-update all 3 to "0 = no cap" + drop TICKET 4; B=file TICKET 4 as drafted (§5-R6); C=new validation requirement + case updates.

### Q3

- **Internal refs:** FDBUG-10 (below-minimum percent silently rounded up, not rejected). Case FD-CALC-006. Jira draft exists: jira-bug-drafts.md TICKET 5 (not filed).
- **TestRail cases:**
  - FD-CALC-006 — [C28573](https://shopview.testrail.io/index.php?/cases/view/28573)
- **Spec refs:** requirements.md §7: §5-R1 (minimums - Flat $0.01 / Percentage 0.01%; below-minimum input is rejected, expected HTTP 400).
- **Current status:** FD-CALC-006 = VIU-Deviation (FDBUG-10 CONFIRMED AGAIN 2026-07-10: pct 0.005 accepted 201 and coerced to 0.01, resolved 0.02; flat 0.005 stored as 0.01). A=case-update to expect coercion + drop TICKET 5; B=dev change (store exact, likely new precision spec); C=file TICKET 5 as drafted.

### Q4

- **Internal refs:** FD-PROC-014 (Processing Fee minimum-amount rejection). No FDBUG - the §8 no-minimum invariant holds; the deviation is silent-ignore vs explicit reject. Related Story-8 context: builder UI absent (TICKET 11, PO round-1 Q3=B in-scope).
- **TestRail cases:**
  - FD-PROC-014 — [C28532](https://shopview.testrail.io/index.php?/cases/view/28532)
- **Spec refs:** requirements.md §9.2: S8-N6 (system rejects a Processing Fee carrying a minimum amount) + §5-R6 Min Amount data-model note (min supported for fee/discount kinds, not processing fees).
- **Current status:** FD-PROC-014 = VIU-Verified with a standing wording note (fresh pass 2026-07-10: pfee minimum silently STRIPPED on create - 201, no min field persisted). A=spec/data-model change + new cases for pfee minimums; B=case-update FD-PROC-014 to expect explicit reject/absent field vs today's silent strip (minor dev tweak or accepted-behavior wording).

**Notes:** Round-2 questions raised after the FRESH FULL VIU PASS
2026-07-10 (`FeesDiscounts_FreshVIU_2026-07-10.xlsx`). TestRail IDs
sourced from `testrail-id-map.csv` (standing rule 8). Round-1 (6
questions) was answered by Chris Ward 2026-07-09 — see
`PO-Questions-SIMPLE.md` / `spec-v1-reconciliation.md`. Related unfiled
Jira drafts: `jira-bug-drafts.md` TICKET 4 (maxCap 0) and TICKET 5
(tiny-percent rounding) — hold both until these rulings land.
Bugs/defects stay OUT of the PO-facing content (standing rule 7); these
4 items are genuine product decisions (which behavior is intended), not
defect reports.
