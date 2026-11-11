# Records created on QA (sv11315, marker v26.45.2-6a8b89c), 11 Nov 2026

Every name includes ZZAUTOTEST. The records were created through the API endpoints the front end itself calls (Rule 115), by
`tools/seed.py qa` from `tools/manifest.json`. The ledger `tools/seeded-qa.json` is the checkpoint, so a later run carries on from it.
Location A = Staging Heavy Duty - 9919, B = Staging Lethbridge - 4310. "Document date" is the record's own back-dated date.

**Seeding stopped part-way: the QA session answered HTTP 401 at 2026-11-11T10:43Z.** None of these records has
been checked on a report screen yet. Nothing was created on production.

| Ledger key | Type | Number / name | Id | Amount ($) | Document date | Loc |
|---|---|---|---|---|---|---|
| cust:R03 | record | ZZAUTOTEST AR R03 Location B | 7d2415d9-755e-4d12-b42a-a55be01bcf67 |  |  | A |
| cust:R07 | record | ZZAUTOTEST AR R07 Future Date | 30dc3298-2fd4-4010-84ef-e374665e7c68 |  |  | A |
| cust:R11 | record | ZZAUTOTEST AR R11 Date Edge | 9d3bc78a-953c-4ce9-910d-d232e017802b |  |  | A |
| cust:R13 | record | ZZAUTOTEST AR R13 Payment After | 8d4056a8-79d3-4772-b150-fcaeb052a113 |  |  | A |
| cust:R14 | record | ZZAUTOTEST AR R14 Paid In Full | 46231439-a825-4990-ac58-fecd3eb12311 |  |  | A |
| cust:R15 | record | ZZAUTOTEST AR R15 Payment Reversed | ebf5abed-033d-43c2-b2f0-0d1229a94614 |  |  | A |
| cust:R16 | record | ZZAUTOTEST AR R16 Memo Voided | 1e6ad78b-6950-4900-a5a5-6b8c0e6bbcf4 |  |  | A |
| cust:R17 | record | ZZAUTOTEST AR R17 Memo Applied | 49cdec5f-4468-4f0a-aa26-cca39489b5d3 |  |  | A |
| cust:R18 | record | ZZAUTOTEST AR R18 Deposits | 985b38a2-3889-4e25-86dd-da3b700c3c9e |  |  | A |
| cust:R19 | record | ZZAUTOTEST AR R19 Deposit Reversed | 1fde0ae9-c247-4acf-9afc-3db2f51e349a |  |  | A |
| cust:R22 | record | ZZAUTOTEST AR R22 Bucket Edges | 00106298-00bf-4dcf-8319-63cf7447cad4 |  |  | A |
| cust:R23 | record | ZZAUTOTEST AR R23 Memo Aging | 2a56720e-a09c-4f39-b74d-f5785f1bed7c |  |  | A |
| cust:R28 | record | ZZAUTOTEST AR R28 Credit Only | 5609bc1b-a93f-43c8-ae45-34168bb29c3d |  |  | A |
| cust:R29 | record | ZZAUTOTEST AR R29 One Bucket | 0fe94c66-ee23-4ed2-bfad-4eae3e26422d |  |  | A |
| cust:R30 | record | ZZAUTOTEST AR R30 Netting | 94ac2eac-6595-4e78-9255-817e4a371388 |  |  | A |
| cust:R31K | record | ZZAUTOTEST AR R31 Thousands | 65ead067-1346-4f9d-b5e6-399ffc8c3abc |  |  | A |
| cust:R31N | record | ZZAUTOTEST AR R31 Negative Total | d14c5380-8182-4399-a9ef-859856915983 |  |  | A |
| cust:R36X | record | ZZAUTOTEST AR R36 Collect X | 52ed40ae-fe51-4f76-98ca-95baef767b4e |  |  | A |
| cust:R36Z | record | ZZAUTOTEST AR R36 Collect Z | 076940db-9f6a-4160-b823-a431f90c5577 |  |  | A |
| cust:R71 | record | ZZAUTOTEST AR R71 Location B Orders | bfa63094-a0a3-427a-8104-719c0fb5931e |  |  | A |
| doc:P12:billD | bill | ZZAUTOTEST-P12-A | 6ba3917b-e8ea-4878-9efe-46b7e7488d0e | 51 | 2026-10-20 | A |
| doc:P56:bill | bill | ZZT-P56-BILL | de0bc5f9-8d9e-40a6-ae3c-37f18e89e640 | 56 | 2026-11-05 | B |
| doc:R11:cm | credit_memo | CM-4202 | 06308d72-5333-464a-ae00-cab9056a4044 | 15 | 2026-10-21 | A |
| doc:R11:inv | invoice | S-17837 | f4978ed2-2723-40ea-bc2b-2feb844de1ce | 60 | 2026-10-20 | A |
| doc:R13:inv | invoice | S-17834 | ecedb52d-003f-4fa6-9c2f-d062cd6b8c99 | 100 | 2026-10-10 | A |
| doc:R13:pay | payment |  | 5969d057-15cc-4be1-8e0c-a99e1051d26d | 40 | 2026-10-15 | A |
| doc:R14:inv | invoice | S-17838 | b30df962-1843-447d-8166-99791be09637 | 80 | 2026-10-02 | A |
| doc:R14:pay | payment |  | 3fd70738-3bd7-4edc-a158-2bd9d5d0d9ab | 80 | 2026-10-12 | A |
| doc:R15:inv | invoice | S-17839 | f68ae95d-3a29-4a9a-9a9a-3c6457d5c14d | 100 | 2026-10-01 | A |
| doc:R15:pay | payment |  | 220db4ba-fad5-43a1-b61c-3e8aec677677 | 100 | 2026-10-06 | A |
| doc:R17:apply | apply_credit |  | a9771858-70bf-49c5-b583-ff12522acba5 | 30 | 2026-10-27 | A |
| doc:R17:cm | credit_memo | CM-4204 | 34f7eaf8-b036-455b-b61b-bf67178e3aaf | 30 | 2026-10-17 | A |
| doc:R17:inv | invoice | S-17840 | 54a5adfb-6ad7-4853-b96a-824f5efc4c4e | 30 | 2026-10-16 | A |
| doc:R18:dep_wo | wo_deposit | DEP-4713 | e370947c-33d9-440f-a94a-eb8a97a035a6 | 70 | 2026-11-03 | A |
| doc:R22:inv | invoice | S-17842 | 0746c9e9-637c-4fea-b905-d21ec7cb1119 | 10 | 2026-08-01 | A |
| doc:R23:cm | credit_memo | CM-4205 | baf3f3d0-b038-4d84-804e-6723dfa2a5f6 | 15 | 2026-09-15 | A |
| doc:R28:cm | credit_memo | CM-4206 | 657f5ba8-dd4e-4162-97c1-f7e897b415f4 | 40 | 2026-11-05 | A |
| doc:R29:inv1 | invoice | S-17843 | bbcabcbb-1d68-47a5-b39a-6b6b39cea83c | 45 | 2026-10-28 | A |
| doc:R29:inv2 | invoice | S-17844 | 03ec15b9-7f28-461a-acdb-107c8c2efb3a | 55 | 2026-10-22 | A |
| doc:R31K:inv | invoice | S-17845 | 58026472-e809-481a-820f-3ddc17948e40 | 1234.56 | 2026-11-09 | A |
| doc:R31N:cm | credit_memo | CM-4207 | 573d6aa5-d189-441c-88d6-189806bf4de6 | 12 | 2026-11-08 | A |
| doc:R36X:inv | invoice | S-17846 | a96a29b2-2a21-4245-9310-1195d2fd34b6 | 110 | 2026-10-27 | A |
| doc:R71:wo | open_wo | S-17836 |  |  |  | B |
| vendor:P12 | record | ZZAUTOTEST AP P12 Bill Dates | 31f7a48c-f79d-4d4d-8e78-7e1f22843647 |  |  | A |
| vendor:P56 | record | ZZAUTOTEST AP P56 Location B | ef2ccf46-5ad5-4c2c-9a58-c286f402f8e4 |  |  | A |

## Test records created while working out the payloads (also ZZAUTOTEST, no case uses them)

- Customer "ZZAUTOTEST AR Probe" (2b6ff852-1a2e-4f61-8bbb-5316e417a773), with its contact and vehicle "ZZT PROBE".
- Work order S-17832: set to Complete with no line, because the line create had failed. It cannot be invoiced.
- Work order S-17833: an estimate with one $100.00 fixed-price line, tax set to Exempt.
- One location switch to B and back (`POST /api/iam/change-location`) at about 10:40Z, made to create the location-B records.

## Payload facts learned (for the next run; read from the code at 8e35ee0d02, then confirmed live)

- Invoice: `POST /api/invoices/create {work_order_id, created_on}`. `created_on` back-dates the invoice. The due date
  is ALWAYS created_on + the customer's credit term; the request's due_date is not used. COD = due the same day.
- Exact invoice amounts: create the line with `POST /api/work-orders/lines/create` using `labour_type_id` + `fixed_price` (string),
  set the work order's tax to "Exempt" with `POST /api/work-orders/{id}/tax {tax:{id}}`, and set shop supplies to 0 with
  `/api/work-orders/change-shop-supplies-charge`.
- Customer payment: `POST /api/customer-account/create-customer-payment` with an ISO `payment_date`; back-dating works.
- Credit memo: `POST /api/credit-memos` with `origin_date`, which back-dates it. The response key is `creditMemoId`, not `id`
  (so the R16 void failed with "Invalid UUID": fix seed.py to read `creditMemoId`).
- Bill: `POST /api/inventory/orders/create` (each item needs id/is_core/part_number/quantity/price/description; the TS type is
  wrong), then `POST /api/inventory/orders/accept` with key `id` (not order_id) and `invoice_date` as `Y-m-d\TH:i:s.v\Z`.
  Due date = invoice date + the vendor's term.
- A free deposit made as a payment with no transactions is refused ("Transactions are missing."), so another route is needed.
- `POST /api/customers/change` answered 500 every time it was used to set a Net 30 term, so the Net 30 customers (R07, R30, R45) are not seeded.
- R16: a $25.00 credit memo WAS created (dated 22 Oct 2026) but the void failed, so it is not in the ledger and is still open. A rerun will make a second one unless the ledger entry is added first.
- A line at location B needs that location's own labour type ("Labor type not found for this workplace").
