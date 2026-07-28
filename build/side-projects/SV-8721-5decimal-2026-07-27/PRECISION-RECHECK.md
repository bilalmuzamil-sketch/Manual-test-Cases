# SV-8721 — PRECISION RE-CHECK (whole-number / precision-loss concern) — FINDINGS

**[SIDE PROJECT]** Date: 2026-07-28 · Env: app.staging.shopview.com / api.staging.shopview.com (admin)
Live, evidence-based (Rules 10/12/13/14). NO TestRail writes. Seeded + torn down a ZZAUTOTEST WO.

## The concern being tested (user's words)
A cost like **124.96545** might be shown/stored as **125.00000** (rounded to a whole number), or a value
that should be **122.99656** might show as **123.00000** — i.e. the number appears with 5 decimal places
but the real value has actually been rounded (losing precision). Critical because these figures sync to
QuickBooks.

## Plain verdict (read this first)
- **NO whole-number / precision-loss bug.** Every value entered was preserved to its exact 5 decimals.
  **124.96545 stayed 124.96545** (it did NOT become 125.00000). **122.99656 stayed 122.99656** (it did NOT
  become 123.00000). I could not reproduce the reported symptom on any surface I observed.
- The **Cost** column (the vendor cost that matters for QuickBooks) shows the **true full 5-decimal value**
  on both the **Receive Parts** screen and the **Purchase Order Details → Remaining Parts** screen, and the
  backend stores it exactly in the `*_decimal` fields.
- A **>5-decimal** input (0.123456) is correctly rounded to **5 dp = 0.12346** (that rounding is expected),
  NOT collapsed to a whole number or to 2 dp.
- Line **Total** = cost × qty rounded to 2 dp, computed from the FULL cost (e.g. 124.96545 → line total
  $124.97) — matches the SV-4543 rule ("show 5 decimals on item cost, round for the line total").

## How I tested (live)
Seeded ZZAUTOTEST WO **S9-26211** (id beb64d5e…, deleted at the end) in the Staging Heavy Duty workplace,
added one approved line, then added **6 vendor parts** whose costs are specifically chosen to expose the
bug, ordered them into one PO (id 7eb7717d…), and read the value at three surfaces: backend order-detail
JSON, the Receive Parts UI, and the PO Details → Remaining Parts UI. Also opened the row edit state.

## Per-value results (input → backend → Receive UI → PO Details UI)

| Part | Cost SENT | Backend `cost_decimal` / `total_cost_decimal` | Receive UI **Cost** | PO Details **Cost** | Line **Total** | Verdict |
|------|-----------|-----------------------------------------------|---------------------|---------------------|----------------|---------|
| PR1 | 124.96545 | **124.96545** | **$124.96545** | **$124.96545** | $124.97 | PASS (not 125.00000) |
| PR2 | 122.99656 | **122.99656** | **$122.99656** | **$122.99656** | $123.00 | PASS (not 123.00000) |
| PR3 | 40.99885  | **40.99885**  | **$40.99885**  | **$40.99885**  | $41.00 | PASS |
| PR4 | 0.123456 (>5dp) | **0.12346** | **$0.12346** | **$0.12346** | $0.12 | PASS (5dp round, expected) |
| PR5 | 999.00001 | **999.00001** | **$999.00001** | **$999.00001** | $999.00 | PASS (not 999.00000) |
| PR6 | 1000.55555 | **1000.55555** | **$1,000.55555** | **$1,000.55555** | $1,000.56 | PASS |

- The legacy 2-dp field (`price`/`cost`) still exists alongside (124.97 / 123 / 41 / 0.12 / 999 / 1000.56),
  but the surfaces that show the cost display the full-precision `*_decimal` field, not the rounded one.
- Evidence: `evidence/precision-recheck/PR-receive-screen.png`, `PR-po-details.png`,
  `order-detail.json` (backend), `part-requests.json` (WO part-request storage).

## Where the "123.00000 with 5 decimals" idea likely came from — and why it's NOT that bug
On the Receive screen the **editable input column is "Sell"** (the sell price), and those inputs are
pre-filled at **2 dp** (123, 999, 41, 1000.56 …). That is a normal 2-decimal currency sell price shown as
"123", **not** the 5-decimal Cost shown as "123.00000". The read-only **Cost** column right beside it keeps
the full precision ($122.99656). So no field shows "5 decimals but secretly rounded"; the 5-decimal Cost is
genuine and the 2-decimal value is a separate (Sell) currency field. Evidence:
`evidence/precision-recheck/PR-edit-dialog-PR1.png` (Cost $122.99656 read-only next to Sell input "123").

## One minor, unrelated observation (not the reported bug)
The **Receive screen Subtotal = $2,288.64** (sum of the full-precision costs, then rounded), while the PO
record's API `total_price_decimal = 2288.65` (sum of the per-line 2-dp-rounded totals). That is a **1-cent
subtotal-method difference** (round-then-sum vs sum-then-round), not a whole-number/precision-loss defect,
and both are penny-accurate. Flagging for awareness only; the SV-4543 rule ("round for the line total")
technically favours the per-line 2288.65. Worth a dev confirm if subtotal-to-the-penny matters, but it does
NOT corrupt the stored 5-decimal cost.

## QuickBooks angle (honest)
- I could **not drive a live QuickBooks round-trip** on this staging org this run: there is no reachable QB
  connection-status endpoint, the seeded WO was not carried through receive→invoice→sync, and (per project
  memory) a real QB push needs a connected QB company + a human in QuickBooks. The workplace reports
  `bookkeeping_enabled: true`, but that is not proof of a live, mappable QB connection.
- **What ShopView STORES and would send** (this is ShopView-side precision, NOT an observed QB round-trip):
  the vendor **cost is stored at full 5-decimal precision** (`cost_decimal` / `total_cost_decimal` =
  124.96545, 122.99656, …). What actually transmits to QuickBooks for a bill/invoice line is a **2-decimal
  currency amount computed from that full cost** (e.g. 124.96545 → $124.97), i.e. a correctly-rounded penny
  value, **never a whole-number collapse (never $125.00)**. So QB would receive $124.97, not $125.00 and not
  a corrupted figure. A full live QB verification still needs a QB-connected company + human (flag if you
  want that leg driven).

## Overall verdict
**PASS — no precision-loss / whole-number-rounding defect reproduced.** 124.96545 stays 124.96545;
122.99656 stays 122.99656; the full 5-decimal cost is preserved end-to-end through the ShopView backend,
the Receive Parts screen, and the PO Details screen, and line totals round correctly to 2 dp from that full
cost. The only caveats are honest limits, not defects: (1) the live QuickBooks round-trip was not driven
here (QB-connected company + human needed); (2) a 1-cent Receive-subtotal vs PO-record rounding-method
difference worth a dev confirm.

## Honest limits (Rule 12)
- Live-observed with evidence: backend `*_decimal` storage; Receive Parts UI cost + totals; PO Details cost.
- NOT driven this run: the live QuickBooks sync (see QB angle); the WO Parts tab errored to a crash page on
  navigation this run (location-context glitch, not a precision result) so it was not used as evidence.
