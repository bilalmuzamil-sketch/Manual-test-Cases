# Sell-Price Bug — Honest Coverage Investigation (Simple Flow) — 2026-07-29

**The report (Fabian, founder):** on the Receive Parts screen (the shared PO / Accept-Delivery
receive surface — "Vendor Missing" group, WO S3-25982, staging), the **Sell price stays ZERO no
matter how many times the Cost price is updated**. Per the app's default behavior, changing Cost
should recalculate/update Sell.

**The QA lead's questions:** (1) did we create a test case for that? (2) if not, how did we miss it?

**NO TestRail writes were made in this investigation.**

---

## 1. Do we have the case?

**NO.** No test case in any project asserts that editing Cost recalculates/updates Sell on the
Receive Parts screen (or anywhere else). A case that would have caught "Sell stays 0 when Cost
changes" does not exist.

What we DO have nearby (every sell-related case in the Simple Flow suite was read; this is the
complete list of the relevant ones — they all treat Cost and Sell as two independent fields):

| Case | TestRail | What it actually covers | What it does NOT cover |
|---|---|---|---|
| SF-VEND-06 | [C29442](https://shopview.testrail.io/index.php?/cases/view/29442) | A part cannot be received until a missing cost / sell price is entered (S13-R7 gate) | Says nothing about Sell following Cost — in our own live run we typed cost 10 AND sell 20 **both by hand** |
| SF-RCV-06 | [C29374](https://shopview.testrail.io/index.php?/cases/view/29374) | Accept Delivery receive gates: vendor + part number + cost/sell + invoice # all present before Receive | Presence only, no calculation |
| SF-BULK-06 | [C29355](https://shopview.testrail.io/index.php?/cases/view/29355) | Bulk Receive field editability: qty editable, cost editable ONLY when $0, sell locks after invoiced/paid | Editability/locking only |
| SF-RCV-10 | [C29440](https://shopview.testrail.io/index.php?/cases/view/29440) | Cost editable on Accept Delivery when $0/missing (parity) | Editability only |
| SF-VAL-09 | [C29423](https://shopview.testrail.io/index.php?/cases/view/29423) | Sell field locked after WO invoiced/paid (lock icon + tooltip) | Locking only |
| SF-VAL-06 | [C29420](https://shopview.testrail.io/index.php?/cases/view/29420) | Vendor-missing part not receivable without vendor + PN + cost/sell | Presence only |
| SF-PNFIX-04 | [C29366](https://shopview.testrail.io/index.php?/cases/view/29366) | Inline field-locking parity with the receive screen | Locking only |
| SF-PNFIX-05 | [C29367](https://shopview.testrail.io/index.php?/cases/view/29367) | Can't receive without PN + vendor + cost/sell | Presence only |
| SF-VEND-04 | [C29381](https://shopview.testrail.io/index.php?/cases/view/29381) | Receive enables once PN + cost/sell present after vendor assign | Presence only |
| SF-VPART-01 | [C29331](https://shopview.testrail.io/index.php?/cases/view/29331) | Vendorless part requestable (sell may be left empty in v1) | Manual sell entry |
| SF-VPART-02 | [C29332](https://shopview.testrail.io/index.php?/cases/view/29332) | Add-part validation (sell price not enforced) | Manual sell entry |
| SF-QB-06 | [C29431](https://shopview.testrail.io/index.php?/cases/view/29431) | Cost at completion to avoid $0-cost margins in QuickBooks | About COST being $0, not Sell |
| SF-PERM-09 | [C29413](https://shopview.testrail.io/index.php?/cases/view/29413) | Technician (no See Financial Data) can't see the sell field | Permission gate only |

Also checked, complete (Rule 17): Fees & Discounts cases (adjustment math only — no cost-to-sell),
Custom Roles cases (See-Financial-Data show/hide of costs/margins only), Report Suite cases
(closest anywhere: IV-CALC-01/02/03 — C-ids in build/report-suite/testrail-id-map.csv — which
DESCRIBE the app's pricing model for the Inventory Value report: fixed sell price, else
pricing-matrix markup on cost by category, else sell = cost. They verify the REPORT's math, not
the Receive screen's live recalculation.)

**Verdict: NO — not covered, not even half-covered.** The nearest cases only prove cost/sell are
present/editable/locked at the right times.

## 2. What the spec says (exact quotes)

The Simple Flow spec (`build/simple-flow/requirements.md`) specifies the receive-screen fields
ONLY in terms of editability, locking, and required-to-receive gates. Verbatim:

- **S8-R7 (V2.6):** "Editable + locking: quantity editable (supports partial receive); **cost
  editable ONLY if the cost is $0** ('if cost is not 0 cost filed should not be editable'), pulled
  from WO/PO when available; sell editable until WO invoiced/paid, then locked (lock icon +
  tooltip 'Locked — this part is already invoiced or paid'); after lock only cost editable."
- **S13-R7 (V2.4 Δ3):** "Cost / sell price required. If cost / sell price is missing, the user
  gets an indication to enter one; receiving is blocked until it's filled."
- **S12-R5:** "On the Accept-Delivery screen, **cost is editable when $0/missing** … Quantity
  stays editable; the **sell-price lock rule is unchanged**."
- **§4 field-locking summary:** "quantity editable; cost editable (pulled from WO/PO); sell
  editable until the WO is invoiced/paid, then locked with a lock icon + tooltip; after lock only
  cost is editable."
- **S5-R1:** "Requestable with description + qty + sell mandatory" (sell is a MANUALLY ENTERED
  field at part-add).

**Nowhere does the Simple Flow spec say that changing Cost recalculates or updates Sell.** That
cost-to-sell behavior is a PRE-EXISTING DEFAULT of the application (the pricing-matrix/markup
model the Inventory Value report spec later described), outside the Simple Flow spec's deltas.
No spec requirement + no Jira story = no case was born (our authoring is spec-derived with
Rule-20 traceability on every case).

## 3. How we missed it (the honest answer)

**The structural reason:** our authoring method builds every case from a spec requirement or a
Jira ticket (Rule 20 — every case must be traceable). The Simple Flow spec defined the receive
screen's NEW behaviors (editability, locking, receive gates) and we covered all of those. The
cost-to-sell recalculation is a pre-existing DEFAULT app behavior the spec never mentioned — so
the spec-derived pipeline never produced a case for it. Default-behavior regressions outside a
spec's deltas are exactly the blind spot of pure spec-derived authoring, and exactly the gap the
new execution-discipline loop (creative break-the-feature testing -> tickets -> tickets converted
into test cases, agreed 2026-07-29) exists to close. This bug is that loop working — painful as
the route was (the founder found it before a tester ticket did).

**Three honest near-misses that make this sting — we were CLOSE and did not connect the dots:**

1. **We typed Sell by hand in our own live run and never questioned it.** SF-VEND-06's
   (C29442) VIU note, 2026-07-14: on a vendor-missing part with cost=sell=0 we entered
   "cost (10) and sell (20)" — both manually — to enable Receive. If cost-to-sell auto-calc were
   working we might have seen Sell auto-fill after entering cost; we never looked, because the
   case (per spec S13-R7) only asked "does Receive unblock". Sell staying 0 after a cost entry
   was sitting in front of us and matched our expectation of "a field the user fills".
2. **We saw the $0-sell symptom and framed it as a PRODUCT question, not a calculation bug —
   and the question then got dropped.** The Round-3 draft (PO-Questions-Round3.md, Q5) asked
   Milos: "one of the parts still shows a price of $0 … Should the system let them finish the job
   with a $0 part price?" That question was cut when the sheet was consolidated to the final
   2-question PO-Decisions doc (2026-07-14) and was never answered. We framed "$0 sell" as
   "is $0 allowed at completion?" instead of "why is it $0 — shouldn't cost drive it?".
3. **We even RECORDED the recalculation behavior as an API fact and never made it a case.**
   APP-ACTIONS-PLAYBOOK: `POST /api/work-orders/part/change-request` -> 200 "**recalcs
   sellPrice/margin**". The knowledge that the app recalculates sell from cost edits existed in
   our action-recipe book — it was captured as plumbing for driving tests, not as behavior TO
   test.

No spin: this is a real coverage gap, the suite as shipped would not have caught the bug, and we
had three separate chances to notice the behavior class and did not.

## 4. What we previously observed about Sell on this exact screen

- **PROD (SV-8721 precision recheck, observed 2026-07-27 + PROD run 2026-07-29,
  build/side-projects/SV-8721-5decimal-2026-07-27/PRECISION-RECHECK.md):** on the Receive screen
  "the **editable input column is 'Sell'** … those inputs are **pre-filled at 2 dp** (123, 999,
  41, 1000.56 …)" — i.e. on PROD the Sell inputs carried values close to the rounded Cost (Cost
  $122.99656 read-only next to Sell input "123"). Sell was NOT zero there.
- **Founder's STAGING screenshot (2026-07-29):** Sell = 0 with Cost = 50, and Sell stays 0 across
  repeated Cost updates.
- **Our staging QA-env runs (viu-findings, 2026-07-14):** vendor-missing parts arrived with
  cost=sell=0 and we filled BOTH manually (SF-VEND-06 note); SF-RCV-10 observed "sell editable"
  — no recalculation was ever observed or looked for.

**Caution (Rule 12):** the prod-vs-staging difference could be a genuine regression on staging,
OR an org-configuration difference (the pricing model per the IV spec: fixed sell price -> use
it; else category pricing-matrix markup; **no category / no matrix -> sell = cost or 0**), OR a
data-shape difference (prod parts had catalog sell prices; the staging vendor-missing part may
have none). **We have NOT live-observed the cause and do not claim it.** Deciding
regression-vs-config requires a live staging check including the org's pricing settings.

## 5. Corrective case drafts (NOT pushed)

Three drafts in `corrective-cases-draft.json` (blank C-ids, VIU-Pending, Rule-28 mini-audited
3/3 KEEP + 3/3 SENSIBLE; refs = placeholder "Fabian 2026-07-29 sell-price concern (ticket TBD)"
to be re-pointed at the real Jira key):

1. **SF-RCV-14** (new, no C-ID yet) — Editing Cost on the Receive Parts screen updates the Sell
   price; Sell must not stay 0 after a real cost is entered (with an explicit precondition to
   first check the shop's pricing settings, so a genuinely-zero pricing config isn't a false
   fail).
2. **SF-RCV-15** (new, no C-ID yet) — Repeated Cost edits each recalculate Sell (the "no matter
   how many times" half of the founder's report — first-edit-works/later-edits-stuck is a
   distinct failure mode).
3. **SF-VPART-08** (new, no C-ID yet) — The part edit dialog's Cost edit updates Sell/Margin
   (same default on the other surface; flagged VIU-confirm throughout since we've never observed
   it — if live observation shows that dialog is purely manual, reword to the build per Rule 9).

## 6. Recommended next steps

1. **Get the Jira ticket key** for Fabian's report (or file it) and re-point the drafts' refs
   at it (Rule 20).
2. **Live-verify on staging** (needs fresh cookies): reproduce on WO S3-25982's receive surface,
   AND read the org's pricing settings (category pricing matrix / fixed sell prices) first — so
   we can say regression vs org-config with evidence, not guess.
3. **Also check PROD side-by-side** (same part shape: vendor-missing, no catalog item) before
   calling the direction of the regression.
4. **Push the 3 corrective cases** to TestRail with explicit authorization (add_case; then add
   them to cases/ + testrail-id-map.csv + regenerate the import).
5. **File them under the regression/edge-case convention** (2026-07-29 execution-discipline
   loop: ticket -> test cases) — this is the first live exercise of that loop.
6. **Follow-up suggestion (not done here):** revive the dropped $0-sell product question if the
   live check shows $0 sell is still reachable at completion — it was never answered.
