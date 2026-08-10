# The parts scenario cannot demonstrate SV-8814 — in **either** environment. Here is the proof.

The QA lead asked for the test to be run on a work order containing **labor and parts**. I built
that on both sides using his canned lines and ran it. The conclusion is not a pass or a fail: **the
product does not permit any trigger that would fire the invoice rebuild on a parts work order**, and
that is true on production *and* staging. Four separate doors, three of them deliberate guards.

## The four doors, each proven live

| # | What I tried | Production | Staging | What the product says |
|---|---|---|---|---|
| 1 | Invoice while a part is **on order** (so receiving it later is the trigger) | — | **400** | *"Line can`t be completed with unfulfilled part requests."* |
| 2 | Edit the part's quantity/sell price on the invoiced work order | **400** | **400** | *"Part requests can't be modified once received."* |
| 3 | **Add** a part to the invoiced work order | — | **400** | *"Part requests can`t be modified on completed line."* |
| 4 | Edit the **labor** on the invoiced work order (`lines/change`) | **500** | **500** | *(server error, no message)* |

**Door 1 is the important one.** The developer's own most-realistic trigger — *"Receive parts on an
invoiced work order… invoicing while parts are still arriving is routine"* — is unreachable, because
a line **cannot be completed while a part request is unfulfilled**, and an incomplete line blocks
completing the work order, which blocks invoicing. So a work order simply cannot be invoiced with
parts still outstanding under this configuration.

**Doors 2 and 3** are deliberate, sensible guards. Together they mean nothing about the parts on an
invoiced work order can be changed at all.

**Door 4 is the only actual error** — and it is the one that matters for testing, because it means
even the labor trigger dies before the rebuild listener can run.

## Door 4, isolated with a control

The 500 is **not** caused by my earlier bad call corrupting a work order — I proved that by seeding a
clean one:

| Work order | Shape | `POST /api/work-orders/lines/change` |
|---|---|---|
| Production **S-754** (the QA lead's own, untouched) | labor + part | **500** |
| Production **S-754**, no-op edit (same values sent back) | labor + part | **500** |
| Production **S2-833** | **labor only** | **201** ✅ |
| Staging **S-38** | labor + part | **500** |
| Staging **S-39** (freshly seeded, clean, never touched) | labor + part | **500** |

**Same behaviour on both environments.** A trigger that errors identically on the fixed and the
unfixed build cannot tell them apart — which is exactly why this scenario yields no verdict.

## What this does NOT mean

It does **not** mean SV-8814 is unverified. The **labor-only** work orders reproduce the bug on
production and prove the fix on staging, cleanly, with annotated before/after screenshots on both
sides. That evidence is unaffected by anything here — see `RESULT-SV-8814.md`.

It also does **not** mean the 500 is a regression from this branch: it is present on production
(the released build) and on staging (the fixed build) alike.

## The 500 is a finding in its own right — not raised

**Any line edit on an invoiced work order that carries a part returns HTTP 500, including an edit
that changes nothing.** It is not in the combined test plan, it is not something SV-8814 or SV-8813
claims to fix, and it reproduces on both builds. Whether it deserves its own ticket is the QA lead's
call; **nothing has been filed.**

Honest caveat: this was observed with the current org settings on each environment. A different
configuration — for example one that permits completing a line with unfulfilled part requests —
might open door 1 and change the picture.

## State left behind

| Environment | Work order | State |
|---|---|---|
| Production | **S-754** (the QA lead's) | Invoiced, **pending**, one invoice, parts untouched |
| Production | S2-834 | Invoiced, pending — **abandoned**, its part was corrupted by my own bad call |
| Staging | **S-39** | Invoiced, pending, clean, parts untouched |
| Staging | S-38 | Invoiced, pending — part quantity altered by the same bad call |

The throwaway staging work order built for door 1 (S-40) was deleted, then **recreated as S-41** at
the QA lead's request so he can inspect the block himself. Every invoice was checked against
`GET /api/invoices/list` — one per work order, no duplicates, none paid.

## Links, for inspection

| What | Link |
|---|---|
| **Door 1** — line will not complete with a part on order (staging **S-41**) | https://app.staging.shopview.com/workorders/1d799fd8-eeef-49c5-9592-e0a3831c389d/lines |
| **Door 4** — labor edit 500s, production **S-754** (the QA lead's, untouched) | https://app.shopview.com/workorders/4e082b17-b1d2-48ff-afa6-1ac25f47e7dd/lines |
| **Door 4** — labor edit 500s, staging **S-39** (clean, seeded from BilalCT) | https://app.staging.shopview.com/workorders/897191f8-7ab5-4607-96e7-8d4239e765d9/lines |
| Damaged by my own bad call — ignore, production **S2-834** | https://app.shopview.com/workorders/7a3bf816-a09a-4b22-bac0-057cca691a4e/lines |
| Damaged by my own bad call — ignore, staging **S-38** | https://app.staging.shopview.com/workorders/d91dcf7d-9241-4b50-8afd-d621dc6b6f1a/lines |

## The open question for the QA lead

Is door 1 expected? If a work order can **never** be invoiced while a part is on order, then the
developer's *"receive parts on an invoiced work order"* trigger cannot occur in the product at all,
and section 5 of the combined plan may rest on a state only his local database could produce. If a
setting exists that permits completing a line with unfulfilled part requests, that reopens the
scenario and it can be run immediately.
