# Customer record — "Sales Representative" field, observed live 2026-08-04 (build v3.4.1-0ed4433)

Captured by driving `/customers/7af75d7c-c9f8-4209-860a-e685e9bd7c1c` and opening the edit dialog,
logging every non-GET request the page made.

## The card on the customer record
The customer detail page carries a card whose subtitle is the literal text **`Sales Representative`**
(title case, spelled out in full). Compare the WORK ORDER left panel, which labels the same concept
**`Sales rep`** (lower-case r) beside `Lead technician` and `Service advisor`. Three surfaces, three
spellings, once the export's `Representative` is counted.

## The Edit Customer dialog
Opening the edit control (`data-test-id="button_base"`, glyph `edit_note`) shows a dialog titled
**`Edit Customer`** whose field list, verbatim from the rendered text, is:

```
Name * · Phone · Address 1 · Address 2 · City · ZIP/Postal Code · State/Province · Country ·
Credit Terms · $ Credit Limit · Sales Representative · Default Labor Rate ·
% Default Shop Supplies of labor · $ Min · $ Max · Notes · Website · IBS ·
Taxes Default Tax Settings · PO is required          [Delete] [Save]
```

## Finding 1 — the picker offers ALL STAFF, including inactive staff
The `Sales Representative` dropdown's first twelve options were:

```
Louis Mccoy · Eddie Gibbs · Mary Higgins · Edward Brown · Jennifer Watkins · Jennifer Dorsey ·
Dusan Bulovan · Henry Hess · Stefan Vukovic · Admin ShopView · Brianna Brown · Lisa Morrow
```

That is the **staff list**, not the sales-rep list. `Louis Mccoy` and `Mary Higgins` are both flagged
`is_active: false` in `GET /api/staff`. The three staff I had toggled on as sales reps were not at the
top of the list, and `GET /api/sales-reps` at that moment returned only 5 entries — so this control is
plainly not driven by the sales-rep toggle that the WORK ORDER selector correctly honours.

## Finding 2 — the value is saved as a NAME PAIR, not a rep id
Saving sends:

```
POST /api/customers/change   -> 200
{"name":"Aaborough Works","telephone":"573-219-5819","address_1":"6622 Donna Knoll Apt. 574",
 "city":"Michellefort","state_or_province":"Nova Scotia","postal_code":"A3P7S3","country_code":"",
 "sales_rep_first_name":"Dalton","sales_rep_last_name":"Daniel","ibs":"","require_po":false,
 "credit_term":"COD","credit_limit":0,"shop_supplies_charge":null,
 "min_shop_supplies_charge":null,"max_shop_supplies_charge":null,"pin_notes":false,"notes":null,
 "id":"7af75d7c-c9f8-4209-860a-e685e9bd7c1c",
 "tax":{"id":null,"isEnabledLabor":false,"isEnabledParts":false,"isEnabledShopSupplies":false}}
```

There is **no `sales_rep_id` in the payload at all**, and reading the customer back confirms it:

```
GET /api/customers/view/{id}?   -> 200   (note: the body nests under data.company)
  sales_rep_first_name = "Dalton"
  sales_rep_last_name  = "Daniel"
  sales_rep_id         = null
```

Sending `sales_rep_id` to the same endpoint returns **HTTP 500**, which is why the API-only attempt to
seed customer assignments failed before this dialog was inspected.

## Consequence for the test cases
- `SBR-WO-06` ([C30315](https://shopview.testrail.io/index.php?/cases/view/30315)) — the row exists,
  so the case passes, but it must use each surface's own label and should note the all-staff picker.
- `SBR-ASGN-04` ([C30295](https://shopview.testrail.io/index.php?/cases/view/30295)) — a
  `Rep is active?` column cannot be derived from a staff link, because there is no link; it would have
  to be matched by name. Recorded for whoever builds the Assignments export, which does not exist yet.
- No change was persisted to this customer: the value I picked was never in the offered list, so the
  save carried the customer's original `Dalton Daniel` straight back. Verified by re-reading it after.
