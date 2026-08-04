# TICKET 4 — FILED as SV-8821

| Field | Value |
|---|---|
| **Project** | SV (shopview.atlassian.net) |
| **Issue type** | Bug |
| **Summary** | Creating an invoice from a completed work order fails with a server error |
| **Suggested parent** | **NONE — file as a standalone bug, not under epic SV-8582** |
| **Parent reasoning** | **This is not Report Suite work.** Invoicing is an existing core flow; the reports merely read what it produces. Parenting it to SV-8582 would misattribute a core-flow defect to the reporting epic and would put it in front of the wrong team. It should be linked to SV-8582 as **"blocks"** (and specifically it blocks SV-8592 `[A4] Denormalized invoice financial columns + backfill + clock subscriber`, whose invoiced-hours data cannot be produced at all while this fails), but it should not be parented there. If the SV project has a component for Invoicing / Work Orders, that is the right home. |
| **Suggested severity / priority** | **High** |
| **Severity reasoning** | A core money flow does not complete on this branch, and it blocks 15 QA test cases from being graded in either direction. Not Critical: this is a QA branch, and nothing indicates the same fault is on a release build. |
| **Affects build** | `v3.4.1-0ed4433` on `sv8582.qa.shopview.com` |
| **Observed** | 2026-08-03 / 2026-08-04 |
| **Labels (suggested)** | `invoicing`, `blocks-qa`, `qa-found` |
| **FILED AS** | **SV-8821** — https://shopview.atlassian.net/browse/SV-8821 |
| **Ticket format** | The organisation's required 7-section format (see `build/APP-ACTIONS-PLAYBOOK.md` § "Filing a defect ticket") |

> **This file mirrors what is actually filed in Jira.** It carries the organisation's required
> seven sections in order: Description · Branch/Environment · Steps to reproduce · Expected
> behaviour · Current behaviour · Images · Technical details for developers. Two things are
> deliberately ABSENT from the ticket by standing instruction: any reference to our test cases,
> and any "this branch is not final / finding is provisional" disclaimer. The case mapping is
> kept in `CASE-IMPACT.md` in this folder instead.

---

## 1. Description

You cannot create an invoice. On a work order that has been taken all the way through to complete, with
a finished, priced job line on it, pressing **Create Invoice** fails with a server error. No invoice is
produced.

Two reasons, and the second is the reason QA raised it.

**For users:** invoicing is how a shop gets paid. On this branch that step does not complete.

**For the new reports:** several of the new reports read their figures off invoices, so with invoicing
broken those figures cannot exist. Concretely, the **Inv. Hrs**, **Hrs Worked** and **Hrs Invoiced**
columns read **0.0 on every single row, everywhere, in every date range, across the whole company** —
because the only way to put hours into that pipeline is to create an invoice. And on the Sales By
Representative report, a new invoice is the **only** way a salesperson can get a line in the report at
all, because the credit is stamped onto the invoice at the moment it is created.

The practical effect on testing: a group of checks on invoiced hours and on sales-representative
credit **cannot be run at all** until this is fixed — they are not failing, they simply cannot be
exercised.

---

## 2. Branch / Environment

- **Branch / environment tested:** QA branch `sv8582` — app `https://sv8582.qa.shopview.com`, API `https://sv8582api.qa.shopview.com`
- **Build marker:** `v3.4.1-0ed4433`
- **Organisation:** `d55bc308-e61a-438d-b5f1-c7a73c89d49f` — location **Staging Heavy Duty - 9919** (`b3c8c820-f815-4cf1-8938-10956c5ee71a`)
- **Observed:** 2026-08-03 and 2026-08-04
- **Area affected:** Work Orders → Create Invoice (and, downstream, every report that reads invoice figures)

---

## 3. Steps to reproduce

The work order this needs can be made from scratch in a couple of minutes — the whole chain works, right
up to the invoicing step.

1. Create a work order for any customer and any of their vehicles, at the Heavy Duty location.
2. Add a job line to it from the **New Line** dialog, choosing a pre-set (canned) job so it carries a
   price.
3. Take the work order through to **Complete**.
4. Open the work order's **Finance** tab and press **Create Invoice**.
5. **It fails with an error and no invoice is created.**

Everything before step 4 works normally, which is what makes the failure easy to isolate.

---

## 4. Expected behaviour

An invoice is created from the completed work order.

There is no report requirement to quote here, because invoicing is not part of the reporting work — and
that is exactly why this is raised as a standalone bug. What the reports then require **of** an invoice
is this, from the Sales By Representative specification, version 15:

> "**S19-R6:** At invoice creation, the WO's Sales Rep is snapshotted onto the resulting invoice, and
> that snapshot is what the report reads."

That is why a broken invoice-create makes a whole area of the report untestable rather than merely
inconvenient.

---

## 5. Current behaviour

Pressing **Create Invoice** fails with a server error and no invoice is produced. The work order stays
as it was.

Because several of the new reports read their figures off invoices, the knock-on effect is that the
**Inv. Hrs**, **Hrs Worked** and **Hrs Invoiced** columns read **0.0 on every single row, everywhere, in
every date range, across the whole company** — there is no other way to put hours into that pipeline.
And on the Sales By Representative report, a salesperson cannot appear at all, because the credit is
stamped onto the invoice at the moment it is created.

---

## 6. Images

No screenshot is attached, and we would rather say why than attach something that does not show the
fault: the failure is a server error returned to the browser, so the screen simply stays as it was with
a generic error notification — a picture of it would add nothing to the exact request, response body and
request ids recorded in the technical section below.

---

## 7. Technical details for developers

### The failing calls

```
POST /api/invoices/create
{"work_order_id":"<completed work order with a priced, completed line>"}
-> HTTP 500
```

The UI's own **Create Invoice** button fails the same way through a different route:

```
POST /api/work-orders/invoices/estimate
{"work_order_id":"72bf3305-cbf8-44bb-ad52-3e983dd930e7","type":"html","isEstimate":1,
 "includeDeclined":0,"issueDate":"","dueDate":"","historyEvent":null}
-> HTTP 500
```

**Request ids captured:**
```
24dbd181-7ed7-489c-b1f2-ae7e878b0dbe
a7ab157a-dc44-48fb-8440-b7a92576645c
8d0e2a06-7727-4c89-9b43-e719154ab327
818265ba-7cc1-4dfc-8d58-2c5f5c470d9a
b7bf4a22-eff4-4b71-9c68-c0792be63a48
```

### The exact working chain up to that point (so the state is reproducible in one run)

Scripted at `build/report-suite/viu-2026-08-03/batch-sbc-sbr/tools/seed_invoiced_wo.mjs`. 264 work
orders were created this way and all 264 deleted and verified absent afterwards.

```
1. POST /api/iam/change-location {workplace_id, workplace_timezone}          -> 200
   (⚠️ do this FIRST — later writes on a work order in another workplace return 201 and SILENTLY do
    nothing; four of twelve rep assignments landed nowhere while reporting success.)

2. POST /api/work-orders/create
   {company_id, vehicle_id, workplace_id, start_date, is_vehicle_here:true}  -> 201
   ⚠️ the id comes back as data.work_order_id, NOT data.id.

3. POST /api/work-orders/{woId}/lines/create-from-canned-line
   {canned_line_id, status:'authorized'}                                     -> 201 {line_id}

4. drive the work order to Complete through the UI wizard
   (POST /api/work-orders/change was not usable: {id} -> 400 "Work Order ID is missing.",
    {work_order_id} -> 500)

5. POST /api/invoices/create {work_order_id}                                 -> 500   ← THE DEFECT
```

### Two adjacent 500s found on the same chain — recording them here, not claiming they are the same bug

- **`POST /api/work-orders/lines/create` returns 500** as soon as validation is satisfied — supply
  `line_name` plus any price field and it crashes rather than returning a 400. Request ids
  `ecdf8b8d-c754-4282-9bd7-5df45ffade8c`, `0b0f8bd9-8de7-44f6-828a-eb76235beaf3`,
  `e97df1d1-bf61-4cd0-ae50-9b467170fbfb`, `07c300f0-a2db-40ae-8d44-0b94a7eabec5`. The
  `create-from-canned-line` route above works, which is the workaround.
- **`POST /api/work-orders/lines/change` returns 500** too; the tech-story equivalent
  `POST /api/work-orders/lines/change-story` returns 201.

Whether these share a cause with the invoice 500 is **not established**. They are listed because a
developer reproducing the chain will hit them, and because if they do share a cause that is useful to
know early.

### What is NOT established — an honest gap in this reproduction

Every attempt used an **API-created** work order. The UI's own **Create Invoice** button then failed on
that same work order, through its own endpoint — so the fault is not merely in the API entry point. But
a work order created **entirely through the UI wizard** from the start was **not** tried. If invoicing
works for those, the defect is narrower than this ticket describes, and that would be worth knowing
before anyone digs deep.

Also not established: the cause of the 500 (the request ids above should say), and whether this is
intentional unfinished work on this branch.

### Evidence files (in the QA repo)

- `build/report-suite/viu-2026-08-03/batch-sbc-sbr/ENV-DEFECTS.md` §1, §3, §4
- `build/report-suite/viu-2026-08-03/batch-sbc-sbr/VERDICTS.md` finding **F15**
- `build/report-suite/viu-2026-08-03/batch-sbc-sbr/verdicts.csv` — per-case verdicts and reasons
- `build/report-suite/viu-2026-08-03/batch-sbc-sbr/tools/seed_invoiced_wo.mjs` — the working chain

### Clean-up already done

All 264 work orders created while probing this were deleted and verified absent; three staff sales-rep
flags and twelve borrowed rep assignments were restored from a pre-write snapshot; the live work-order
census after clean-up showed **zero** Complete work orders remaining, i.e. none of ours survived.
