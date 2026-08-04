# Environment / branch defects found while running the SBC + SBR VIU (2026-08-04)

Build **`v3.4.1-0ed4433`** on `sv8582.qa.shopview.com`. **The branch is NOT FINAL** (Standing Rule 49),
so several of these may simply be work in progress — they are recorded as observed facts with their
request ids so a developer can look them up, not as accusations.

These are **write-path defects in other areas of the app**, not defects in the two reports. They
matter here only because they are what stopped me producing certain data states, and nine test cases
are labelled EXTERNAL-DEPENDENCY because of them.

---

## 1. Invoice creation returns HTTP 500 — the blocker that mattered most

`POST /api/invoices/create {work_order_id}` returns **500** on a work order that has been driven all
the way to Complete with a completed, priced line.

The UI's own **"Create Invoice"** button on the work order's Finance tab fails the same way, through a
different endpoint:

```
POST /api/work-orders/invoices/estimate
{"work_order_id":"72bf3305-cbf8-44bb-ad52-3e983dd930e7","type":"html","isEstimate":1,
 "includeDeclined":0,"issueDate":"","dueDate":"","historyEvent":null}
-> 500
```

Request ids captured: `24dbd181-7ed7-489c-b1f2-ae7e878b0dbe`, `a7ab157a-dc44-48fb-8440-b7a92576645c`,
`8d0e2a06-7727-4c89-9b43-e719154ab327`, `818265ba-7cc1-4dfc-8d58-2c5f5c470d9a`,
`b7bf4a22-eff4-4b71-9c68-c0792be63a48`.

**Why it blocked test work.** SBR spec **S19-R6** snapshots the work order's Sales Rep onto the
invoice *at invoice creation*, and **S19-N2** says changing the rep afterwards does not move an
existing invoice. Both are correct in this build (see §5) — which means **a new invoice is the only
way to create a new rep row**. With invoicing broken, the report could not be given more than the two
rep rows that already existed (`Parth Fadadu` with one invoice, plus the `Unassigned` bucket of
3,237). Everything reachable from those two rows *was* verified; the cases that genuinely need a
third, inactive, or newly-credited rep are the ones left at EXTERNAL-DEPENDENCY.

Everything up to invoicing works, and the working chain is recorded in
`tools/seed_invoiced_wo.mjs` so nobody has to re-derive it.

## 2. Customer update returns HTTP 500 when called with `sales_rep_id`

`POST /api/customers/change` returns **500** when sent `sales_rep_id`. It returns **200** when sent
the shape the UI actually uses, which does **not** contain a rep id at all:

```
POST /api/customers/change
{"name":"Aaborough Works","telephone":"573-219-5819",...,
 "sales_rep_first_name":"Dalton","sales_rep_last_name":"Daniel",...,"id":"7af75d7c-…"}
-> 200
```

Two findings fall out of this and are recorded against the cases they bear on:

- **A customer's sales rep is stored as a NAME PAIR, not a rep id.** The read-back keeps
  `sales_rep_id: null` with `sales_rep_first_name` / `sales_rep_last_name` populated. Anything that
  needs to know whether a customer's rep is still active (the Assignments export's
  `Rep is active?` column, `SBR-ASGN-04`) cannot follow a link — it would have to match by name.
- **The customer's "Sales Representative" picker offers the WHOLE staff list, including staff flagged
  inactive** (Louis Mccoy, Mary Higgins both appear), rather than the `is_sales_rep`-toggled set that
  `GET /api/sales-reps` returns and that the work-order selector correctly uses. Worth a ticket; it is
  not what `SBR-WO-02`'s sibling requirement `S19-R2` intends.

## 3. Work-order line creation returns HTTP 500 (use the canned-line route instead)

`POST /api/work-orders/lines/create` returns **500** as soon as validation is satisfied — supply
`line_name` plus any price field and it crashes rather than 400s. Request ids:
`ecdf8b8d-c754-4282-9bd7-5df45ffade8c`, `0b0f8bd9-8de7-44f6-828a-eb76235beaf3`,
`e97df1d1-bf61-4cd0-ae50-9b467170fbfb`, `07c300f0-a2db-40ae-8d44-0b94a7eabec5`.

**The working route** — found by watching the UI's New Line dialog — is
`POST /api/work-orders/{woId}/lines/create-from-canned-line {canned_line_id, status:'authorized'}`
→ **201 `{line_id}`**. Also note `POST /api/work-orders/lines/change` → **500**; the tech story has
its own endpoint, `POST /api/work-orders/lines/change-story` → **201**.

## 4. Two silent / shape-sensitive contracts worth knowing

- **`POST /api/work-orders/change-sales-rep` returns 201 but SILENTLY DOES NOTHING** for a work order
  that belongs to a workplace other than the session's active one. Four of my twelve assignments
  landed nowhere while reporting success. Switch first with
  `POST /api/iam/change-location {workplace_id, workplace_timezone}`.
- **`POST /api/work-orders/change-mileage` needs `mileage` as a STRING.** `{mileage: 123456}` → 500;
  `{mileage: "123456"}` → 201.
- **A missing work order answers `400 {"workOrderId":"Not found"}`, not 404.** A cleanup verifier that
  checks for 404 will wrongly report that everything is still present — mine did, until corrected.

## 5. The one thing this section is NOT: a report defect

Worth stating plainly, because it is easy to misread the above as the reports being broken. While
chasing the seeding path I accidentally produced a clean live proof of two report requirements:

> **S19-R6:** "At invoice creation, the WO's Sales Rep is snapshotted onto the resulting invoice, and
> that snapshot is what the report reads."
> **S19-N2:** "Changing a WO's Sales Rep does not retroactively alter invoices already created from it."

I changed invoice **S-15826**'s work-order Sales rep from `Parth Fadadu` to `Daniel Padilla`,
confirmed the change on the work order, and re-read the report: it **kept crediting Parth Fadadu**.
That is both requirements behaving exactly as specified — recorded as the PASS basis for
`SBR-WO-05` ([C30314](https://shopview.testrail.io/index.php?/cases/view/30314)).

## 6. PDF header date range is off by one day

Requested `end_date=2026-08-04`; every PDF printed `Date Range: Jun 1, 2026 – Aug 5, 2026`. The data
itself respects the requested range (the CSV rows stop at Aug 4). Looks like a timezone conversion in
the PDF header renderer. Affects all four PDFs on both reports. Carried as a re-check row and worth a
ticket.

---

## Clean-up performed (Rule 5 / Rule 6)

| What | Result |
|---|---|
| Work orders created while probing the seeding chain | **264 created, 264 deleted and verified absent** (`seed_invoiced_wo.mjs --cleanup`, which reverts Complete → Estimate first because a completed work order cannot be deleted) |
| Sales-rep flags set on 3 staff (Timothy Ortiz, Wesley Mcclure, Daniel Padilla) | **all 3 restored**; `GET /api/sales-reps` is back to its original 2 entries |
| Sales reps borrowed on 12 existing invoiced work orders | **all 12 restored** from a pre-write snapshot |
| Invoice **S-15826**'s work-order rep | **restored to `Parth Fadadu`** (its true original, re-set by hand because my snapshot was taken after early probing) |
| Customer `Aaborough Works` | **unchanged** — rep still `Dalton Daniel`; my picked value was never in the offered list so nothing was written |
| Live work-order status census after cleanup | `approved 1 · paid 44 · estimate 55` — **zero** Complete work orders left, i.e. none of mine survive |

No test data was left tagged or untagged behind, and **no TestRail write of any kind** was made.
