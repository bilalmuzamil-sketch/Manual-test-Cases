# TICKET 5 — ready to paste into Jira

| Field | Value |
|---|---|
| **Project** | SV (shopview.atlassian.net) |
| **Issue type** | Bug |
| **Summary** | Saving a customer returns a server error instead of a validation error when a sales-rep id is supplied |
| **Suggested parent** | **NONE — file as a standalone bug, not under epic SV-8582** |
| **Parent reasoning** | Customer saving is an existing core flow, not Report Suite work. It is worth linking to SV-8582 as **"relates to"** because it was found while trying to build report test data, but parenting it to the reporting epic would misattribute it. If the SV project has a Customers component, that is the right home. |
| **Suggested severity / priority** | **Low** |
| **Severity reasoning** | **No user can hit this from the screen** — the Edit Customer dialog sends a different shape, and that shape works (HTTP 200). It is a robustness defect: an unsupported field should be rejected with a validation error, not crash the request. **Honest note: this did not actually block any test case** — see below. It is filed for completeness and because a 500 in a save path is worth a look, not because it is urgent. |
| **Affects build** | `v3.4.1-0ed4433` on `sv8582.qa.shopview.com` |
| **Observed** | 2026-08-04 |
| **Labels (suggested)** | `customers`, `api-robustness`, `qa-found` |

---

## What's wrong

Saving a customer record crashes with a server error if the request includes a sales-representative
**id**. The same save works normally when it carries the representative's **name** instead — which is
what the screen actually sends.

## Why it matters

Modestly, and we would rather say so plainly than overstate it.

**Nobody using the product can hit this.** The Edit Customer dialog sends the name version, and that
works. So there is no user-facing breakage here today.

What it does mean is that the save is not defending itself: a request carrying an extra or unexpected
field brings back a server error rather than a clear "that field is not valid" message. That is the kind
of thing that turns into a support puzzle later, and it briefly misled our own testing into thinking
customer assignments could not be created at all, when in fact they can.

It also surfaced something worth knowing, which is not a defect but is a design fact: **a customer's
sales representative is stored as a first-name and last-name pair, not as a link to a staff record.**
Anything that later needs to know whether a customer's representative is still an active member of staff
cannot follow a link to find out — it would have to match on the name.

## What should happen instead

An unrecognised or unsupported field should be answered with a validation error explaining what is
wrong, not a server error.

**No written requirement covers this** — stating that plainly rather than dressing it up. This is a
general robustness expectation, not a quoted requirement, and if the team's view is that it does not
matter, that is a reasonable answer and this can be closed.

## How to see it yourself

This one is only reachable through the interface behind the screen, so there are no on-screen steps —
which is exactly why its impact is low. The technical reproduction is below.

---
---

# FOR ENGINEERING — technical evidence

**Environment.** API `https://sv8582api.qa.shopview.com`, build `v3.4.1-0ed4433`. Org
`d55bc308-e61a-438d-b5f1-c7a73c89d49f`. Customer used: `Aaborough Works`,
id `7af75d7c-c9f8-4209-860a-e685e9bd7c1c`.

⚠️ **This QA branch was declared NOT FINAL by engineering.** This finding is provisional. **If it is
already fixed or still in progress, please close saying so.**

## Reproduction

```
1. GET /api/customers/view/{id}
   -> 200   (⚠️ the body nests under data.company, not data)

2. Re-post the same body to POST /api/customers/change WITH sales_rep_id added
   -> HTTP 500

3. Re-post it WITHOUT sales_rep_id, carrying the name pair instead — the shape the
   Edit Customer dialog actually sends:

POST /api/customers/change
{"name":"Aaborough Works","telephone":"573-219-5819","address_1":"6622 Donna Knoll Apt. 574",
 "city":"Michellefort","state_or_province":"Nova Scotia","postal_code":"A3P7S3","country_code":"",
 "sales_rep_first_name":"Dalton","sales_rep_last_name":"Daniel","ibs":"","require_po":false,
 "credit_term":"COD","credit_limit":0,"shop_supplies_charge":null,"min_shop_supplies_charge":null,
 "max_shop_supplies_charge":null,"pin_notes":false,"notes":null,
 "id":"7af75d7c-c9f8-4209-860a-e685e9bd7c1c",
 "tax":{"id":null,"isEnabledLabor":false,"isEnabledParts":false,"isEnabledShopSupplies":false}}
   -> HTTP 200

4. GET /api/customers/view/{id}
   -> 200   sales_rep_first_name = "Dalton"
            sales_rep_last_name  = "Daniel"
            sales_rep_id         = null        <-- stored by NAME, not by id
```

**⚠️ Honest limit: no request id was captured for the 500.** The probe was not logging response ids at
that moment. The reproduction above regenerates one in about a minute.

## Honest correction — this did NOT block the 15 test cases

An earlier framing paired this with the invoice-create 500 as *"what stopped the invoiced-hours pipeline
and the sales-rep deactivation prerequisites"*. On the evidence that is not right, and the record should
say so: **this 500 blocked one API-only shortcut**, which was then completed successfully through the
shape the UI uses. **The load-bearing blocker for all 15 cases is the invoice-create 500** (filed
separately). Nothing depends on this one. It is filed on its own merits and rated Low accordingly.

## A related observation, NOT filed, flagged for your view

While inspecting this dialog: the customer's **Sales Representative** dropdown offers the **whole staff
list, including staff flagged inactive** (`Louis Mccoy`, `Mary Higgins` both appear), rather than the
sales-rep-toggled set that `GET /api/sales-reps` returns and that the **work-order** selector correctly
uses. That is a genuine inconsistency between two surfaces of the same concept, and arguably more
user-visible than the 500 in this ticket — but it is outside what QA was asked to raise, so it has not
been filed. Say the word and it will be.

## Evidence files (in the QA repo)

- `build/report-suite/viu-2026-08-03/batch-sbc-sbr/evidence/deactivation/customer-edit-dialog.md` — the
  full dialog inspection, the working payload, and the read-back showing `sales_rep_id: null`
- `build/report-suite/viu-2026-08-03/batch-sbc-sbr/ENV-DEFECTS.md` §2
- `build/report-suite/viu-2026-08-03/batch-sbc-sbr/VERDICTS.md` finding **F50**

> **Note on attachments:** files were not attached — the full working request body and the read-back
> field values are inlined above.

## Clean-up already done

No change was persisted to the customer: the value picked was never in the offered list, so the save
carried the customer's original `Dalton Daniel` straight back. Verified by re-reading the record
afterwards.
