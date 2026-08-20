# Sinisa Nogic's answer on the credit question — SV-8815, 2026-08-20

Posted under comment 75278, in reply to my question *"is the vendor credit meant to carry the workplace
purchase tax as built, or the customer's frozen sales tax as the handoff reads?"*

## His answer, verbatim

> As built is right nothing to change.
> Two different credits, and my sentence in the plan mixed them up:
>
> * **Vendor credit** - what you walked (Parts > Returns > Post credit): workplace purchase tax on the
>   part's cost. This ticket doesn't touch it. The tax figure is computed on the screen and posted in
>   the payload, the backend only reads the tax name off it, and none of the code we changed runs on
>   that path.
> * **Customer credit** - what I meant: crediting the customer for a part on their invoice, pro-rated
>   from the frozen invoice tax. That one only engages under Invoice total.
>
> So the vendor credit carrying purchase tax is correct, not a gap. The ticket says nothing about
> credits because the customer-side pro-rata is just what keeps a credit in step with the invoice it
> credits. My wording sent you to the wrong screen - my fault, not the build's.

## What this settles

**The vendor credit is CORRECT AS BUILT — my open question is answered and there is nothing to raise.**
It also confirms an observation of ours independently: the Process Return screen's Tax field is
**computed client-side and posted in the payload** (we saw it pre-filled at 5% of cost and recompute
when a restocking fee was entered), and the backend only reads the tax *name* from it. So it is outside
this change by construction, not merely by coincidence.

## What this OPENS — and it is in scope

**The customer credit has never been tested, and it is the one that depends on this setting.**
"Crediting the customer for a part on their invoice, pro-rated from the frozen invoice tax", and it
**only engages under Invoice total** — that is a tax calculation gated on the very mode this ticket
adds. Comment 75278 does not list it as untested, because until his answer we believed the credit
question referred to the vendor credit we had walked.

**Why our earlier part-return check does not cover it.** On the return we ran, the two candidate methods
give the **same** answer, so the test could not have distinguished them:

| | frozen tax on $244.00 at 9.75% = **$23.79**; return one $80.00 part |
|---|---|
| pro-rata from the frozen tax | 23.79 x (80 / 244) = 7.7996 -> **7.80** |
| recompute the remainder and difference | 23.79 - round(164 x 9.75%) = 23.79 - 15.99 = **7.80** |

Identical - which is also why the "Line by line" control read the same, and why we wrongly concluded
the setting does not reach a credit. **A distinguishing case needs amounts where the rounding of the
pro-rata and the rounding of the recompute disagree by a cent.**

## Standing instruction that arrived with this answer — from the QA LEAD, not from Sinisa

⚠️ **ATTRIBUTION CORRECTED 2026-08-20.** This line was appended by **the QA lead (Bilal)** when he
relayed Sinisa's answer. It is **his** instruction, not part of Sinisa's message — I first recorded it
as Sinisa's and he corrected me:

> Do not comment in the ticket without my permission.

So: no Jira write of any kind on SV-8815 until **the QA lead** says so.

**Worth keeping as a lesson:** when a message *quotes* someone and then adds a line, the added line
belongs to the sender. Attribute by **who typed it**, not by proximity to the quote — this project
already treats mixed-up attributions as a defect (per-project PO attributions, Standing Rule 33's
precedence order), and a relayed developer answer is the easiest place to get it wrong.
