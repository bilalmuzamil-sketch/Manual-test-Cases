# SV-11744 — production check after release, and what we missed (29 Oct 2026)

QA lead, 29 Oct: compare our test with Nemanja's comments, find what we missed and why, patch it; then test on
production. **Instruction: nothing is posted to the ticket.** Nothing was posted.

## Sources read (live, 29 Oct)
- SV-11744: status **Done**, labels `QAComplete_Mudassir_Qamar`, `QAcomplete`, `bug-report`; QA assignee Bilal Muzamil.
  13 comments, newest 79735 (Mudassir, prod verification), 79729 (Matthew Barge), 79726 + 79723 (Nemanja).
- SV-11960 (Bug, Open, Nemanja, 29 Oct 05:29 CDT): "Invoice lists a split deposit's full amount instead of the invoice's own share".

## What Nemanja found (comment 79726 → SV-11960)
After the Prime Results data correction he opened the invoices **themselves**. Deposit DEP-4749 ($2,769.62, an overflow
deposit, not tied to a work order) was split by ONE payment across three invoices. Each invoice's **Payments** section prints
the deposit's **whole** amount, not its share. Balance stays right, so payment lines + balance no longer equal the total
(S-10270: $633.70 + $2,769.62 + $808.77 = $4,212.09 vs total $2,336.39). Pre-existing, code fix needed. Same bug family
was fixed twice before on other payment lines: **SV-9778** (work-order deposit) and **SV-9647** (credit memo split).

## Did we miss it? Yes.
1. **We had the exact shape in our own test and never looked at it.** 28 Oct checklist 3b (branch, customer S5):
   overflow deposit DEP-4705 ($387.80) + $12.36 cash in ONE payment over S11744-17588 and S11744-17589. While that payment
   stood, both invoices would have listed $387.80. We read only the customer's Invoices/Payments tabs and the server
   balances, then reversed. **We never opened either invoice itself.**
2. **We skipped a named check.** Nemanja's handoff (79595) Regression hotspot 3: *"Invoice owed amount and status in the
   customer's invoice list **and on the invoice itself**."* We did the list, not the invoice. Rule 91 says a named check is
   not ours to drop; the pre-post gate walked the checklist 1–3 but **not the "Regression hotspots" list**.
3. **We had seen this bug family and did not carry it forward.** On SV-9647 (22 Sep) we tested credit-memo splits and a
   deposit **tied to one work order** — never an **overflow deposit split across invoices**. No matrix of payment sources
   (cash · credit memo · work-order deposit · overflow deposit · mixed) was ever written, so the missing cell was invisible.
4. **"API way" made the gap easier**: the reading was done by script, and the script read balances, not the invoice
   document. Speed choice, coverage gap (Rule 88's honest-line).
5. **No arithmetic check.** "Payment lines + Balance = Total" on each invoice would have flagged it in one line.

Bucket for SV-11960 now: (b) already tracked — Open, Nemanja.

## Production test, 29 Oct 2026 — build v26.43.3-439ddb6 (last-modified Thu 29 Oct 09:48:11 GMT)
Org 72b2cc90…, location Trucks Hill 2. Payments, reversals and New Payment done on screen; seeding by API. Every check
read the customer's tabs, both work orders, **and each invoice itself (Finance tab)** before and after the reversal.

| # | Customer / invoices | What was done | Result after Reverse | Verdict |
|---|---|---|---|---|
| 1 | Q1: S2-1778 $149.95 (sorts first — the order that broke on prod 28 Oct), S2-1780 $118 | $120 cash on S2-1778; CM2-4405 $147.95 pays rest of both; reverse credit payment | S2-1778 **$29.95 Partially Paid** (yesterday prod gave $147.95); S2-1780 **$118 Unpaid**; memo −$147.95 Unapplied; WOs Invoiced; invoice itself: Cash $120 + Balance $29.95 = $149.95; New Payment opens ($29.95/$118) | PASS |
| 2 | Q2: S2-1779 $149.95, S2-1781 $118 (opposite order) | $50 cash on S2-1781; CM2-4406 $217.95 pays rest of both; reverse | S2-1781 $68 Partially Paid; S2-1779 $149.95 Unpaid; memo back; WOs Invoiced; invoice itself Cash $50 + Balance $68; New Payment opens | PASS |
| 3 | Q3: S2-1782 $149.95, S2-1783 $118 | one payment $67.95 cash + CM2-4407 $200; reverse | both full + Unpaid; memo −$200 Unapplied; payment gone; WOs Invoiced; New Payment opens | PASS |
| 3x | Q3 | credit only, $185.95 of the $200 memo (S2-1782 left part-paid $82); reverse | both full + Unpaid; memo −$200 back | PASS |
| 4 | Q4: S2-1784 $149.95, S2-1785 $118; WO S2-1786 $118 with $300 deposit → overflow DEP2-5037 $182 | one payment: DEP2-5037 $182 + $85.95 cash over both; reverse | both full + Unpaid; DEP2-5037 back to −$182 unapplied and offered again by New Payment; WOs Invoiced | PASS |
| 4i | Q4, **invoice itself while the payment stood** | Finance tab of each invoice | S2-1784 lists Cash $85.95 + "(Deposit) Oct 29, 2026 - CASH **$182.00**"; S2-1785 lists "(Deposit) … **$182.00**" — full amount on both, lines exceed the total | **SV-11960 reproduced on production** (already tracked) |
| 5 | Q2 | $118 cash only on S2-1781; reverse | S2-1781 $118 Unpaid; WO back to Invoiced | PASS |

Evidence: `ev-production-2026-10-29/` (tabs, Finance tab per invoice, reverse dialogs, New Payment).
**Honest note:** an earlier $50 cash payment on Q2 disappeared between two reads (my interrupted command may have run
before it stopped); not counted — check 5 was redone with a fresh $118 cash payment observed end to end.

## Harness facts learned today
- **Production allows one session per login.** Parallel runs on the same user expired each other (`session_expired`, my-workplaces
  undefined). QA lead supplied a second admin login (credentials in /tmp only) for parallel work.
- `pay_credit.mjs` 7th argument fills `input_payment_amount`, which is the **first invoice row's** amount, not the cash box.
  For cash + credit, leave it out and let the dialog compute the cash (NORETYPE=1).
