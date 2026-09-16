# SEED MANIFEST — Global Search V2 "Fibridge" universe · prod

**Read back off the environment, not typed.** Build marker: `v26.36.7-cf5012e`.
Regenerate with `python3 dump_seed_manifest.py > SEED-MANIFEST-GS-V2-<env>.md`.

### Customers

| key | name | id | telephone | address |
|---|---|---|---|---|
| cust_fib_commercial | ZZAUTOTEST Fibridge Commercial | 3f224b19-b5a8-4bd7-bd4b-fdb956a996fc | (264) 328-6723 | 4120 Fibridge Commerce Way |
| cust_fib_logistics | ZZAUTOTEST Fibridge Logistics | 85eb885c-0b69-4102-9610-d93a199d316c | (264) 555-0143 | 77 Fibridge Yard Road |
| cust_fib_retail | ZZAUTOTEST Fibridge Retail | 58c8ff0a-6244-48c8-9920-dff1e502547e | (264) 555-0145 | 9 Fibridge Market Street |
| cust_peterson | ZZAUTOTEST Peterson Hauling | 11c2c1a0-f806-40d6-8b62-da11970d2eee | (264) 555-0151 | 210 Peterson Ridge |
| cust_aabridge | ZZAUTOTEST Aabridge Freight | bd77eaa6-963f-43fc-9a91-b950810ebf67 | (264) 555-0152 | 14 Aabridge Loop |
| cust_toboro | ZZAUTOTEST Toboro Industries | c49c533a-f971-447d-9443-1ab3a1b96a98 | (264) 555-0153 | 3300 Toboro Bend |
| cust_deshawn_named | ZZAUTOTEST Deshawn Freight Lines | 97407eac-dd5b-490f-8ba6-4da45706e82c | (264) 555-0154 | 88 Deshawn Crossing |
| cust_bryan_smith | ZZAUTOTEST Bryan Smith Hauling | 85a34911-7c02-43cc-bf2c-8fabbb283a00 | (264) 555-0155 | 51 Smithfield Row |

### Contacts (people AT a customer company)

| key | name | id | title | telephone | email |
|---|---|---|---|---|---|
| contact_deshawn | Deshawn Oyelaran | fb358964-b338-44c3-9cdd-19ea682f38e5 | Fleet Manager | (264) 555-0142 | deshawn@fibridge-commercial.test |
| contact_logistics | Ama Boateng | 48fe770d-fea7-4e5d-8f7a-484a83d1e3dc | Dispatcher | (264) 555-0144 | ama@fibridge-logistics.test |
| contact_retail | Iris Vandenberg | 99ad42e1-5c9d-4864-89ce-e9162ec71ff1 | Owner | (264) 555-0146 | iris@fibridge-retail.test |
| contact_bryan | Bryan Smith | 6dce31c5-a9b9-4d1f-97b9-3437b634b0dd | Owner | (264) 555-0156 | bryan@bryansmithhauling.test |

### Assets

| key | year make model | id | unit | VIN |
|---|---|---|---|---|
| asset_trk412 | 2019 Freightliner Cascadia | c9f5461b-751d-4514-bbeb-f89a53865d94 | TRK 412 | 1FUJGLDR9CLBP8834 |
| asset_nounit | 2021 KEN WORTH T680 | 5b281173-66ac-4c86-85d5-e658368b63af | (none — deliberate) | 1XKYDP9X1MJ441077 |
| asset_fib_3 | 2022 PETERBILT 579 | 11f8ead0-1fb4-4659-954b-4e303e720f90 | TRK 413 | 1XPBDP9X5ND441078 |
| asset_fib_4 | 2020 VOLVO VNL760 | b77a7044-d65e-41d5-a143-d6308ff60234 | TRK 414 | 4V4NC9EH8LN441079 |
| asset_fib_5 | 2023 MACK ANTHEM | 22e0ab6f-afe2-410b-ae8e-9cf3d6a554ee | TRK 415 | 1M1AN07Y5PM441080 |
| asset_fib_6 | 2024 INTERNATIONAL LT625 | c4bbb818-d465-4701-bee3-c655ba43af09 | TRK 416 | 3HSDJAPR5RN441081 |
| asset_m2_bryan | 2025 Freightliner M2 | 701d1146-0ac8-4137-9965-c90516cd5e62 | BSH 001 | 1FVACWDT5SH441082 |

### Vendor

| name | id | email | credit term |
|---|---|---|---|
| ZZAUTOTEST Fibridge Mining | 3e9b6c1d-b6be-476a-b252-ea29730df1fe | parts@fibridge-mining.test | Net 30 |

### Inventory parts (the three stock states + the exact part number)

| key | part number | description | id | on hand | reorder level |
|---|---|---|---|---|---|
| part_instock | ZZT-FIB-1001 | ZZAUTOTEST Fibridge Brake Shoe Kit | 613af7a3-de62-4c28-b264-907fb6c1a9b5 | 40 | 5 |
| part_low | ZZT-FIB-1002 | ZZAUTOTEST Fibridge Wheel Seal | 0fd577b1-d57b-4806-b5a3-068c247dde03 | 2 | 5 |
| part_out | ZZT-FIB-1003 | ZZAUTOTEST Fibridge Air Dryer Cartridge | 10fe3707-db86-4154-b9d2-8bf6bee0b47a | 0 | 5 |
| part_65547 | 65547 | ZZAUTOTEST Fibridge Air Filter Element | 71fa1674-ab85-4459-bb5c-30c1ca8e1d73 | 12 | 2 |

### Work orders (numbers are ASSIGNED BY THE BRANCH — they cannot be chosen)

| key | number | id | status | customer |
|---|---|---|---|---|
| work_orders_fib_main | S-889 | 2e2d8a27-b7a8-493e-878a-e8757c652ac2 | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-890 | 1dc70394-50cc-4a95-8a78-a63040d77853 | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-891 | 8560a55f-30f6-4d97-ade6-cbf5b5599417 | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-892 | f76634e8-497e-49ac-b51a-10445229bd41 | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-893 | d99fefe0-5eff-4e20-8a76-db1034aa4f5f | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-894 | 9cc0dd48-a9f4-48bb-b5ee-897ca4e18748 | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-895 | 7bbd1b99-f614-4144-939d-0dcb8da49600 | In Progress | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-896 | 2e9c7cb1-bdb7-468f-a638-ddd67fb76aad | In Progress | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-897 | 66f0f456-c529-44d4-b8d0-a6c01b196e31 | In Progress | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-898 | 7954c3df-0148-46bf-8706-d4c02415dd7c | In Progress | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-899 | 6746f660-a0f0-4211-bec6-11e6083b34de | Review | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-900 | f59810fd-03f9-4cb5-a928-795ff394929f | Review | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-901 | 55aa4b8b-a367-40ab-a8ea-2d0398880c3b | Review | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-902 | 4720a9ae-747e-44cb-ad0c-6244a93d6d63 | Declined | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-903 | 69478f23-9550-4477-9b68-abdba46dbded | Declined | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-904 | a9503872-5283-4b08-86b7-05fdf103c953 | Estimate | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-905 | b1fe9c52-2392-4626-a1dd-a2b3d1420aa3 | Estimate | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-906 | 39441b10-b9bb-44ed-bd43-0c5c7f192578 | Estimate | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-907 | f2461bb0-3da8-484e-99ba-53a1329c2dab | Estimate | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_nounit | S-885 | 00c7fc8e-cea2-4228-883c-72bc92593bdd | Approved | ZZAUTOTEST Fibridge Logistics |
| work_orders_fib_nounit | S-886 | 2effee23-b4ce-4cc1-ba1f-6c693a479daf | Approved | ZZAUTOTEST Fibridge Logistics |
| work_orders_fib_nounit | S-887 | fc1daf7e-d97e-4488-9fb2-9191175682c0 | Estimate | ZZAUTOTEST Fibridge Logistics |
| work_orders_fib_nounit | S-888 | 993f7d68-da9b-4a0f-b646-aef103fe6d33 | Estimate | ZZAUTOTEST Fibridge Logistics |

### Part sales

| P-number | id | customer | status |
|---|---|---|---|
| P2-69 | 07e852ef-cf58-432f-92b3-30bf47316beb | ZZAUTOTEST Fibridge Commercial | estimate |

### Purchase orders (on the Fibridge vendor)

| number | id | status | total |
|---|---|---|---|
| S-889 | 3ab236da-aca4-449c-a2b9-53d450c770cb | ordered | 240 |

### Vendor invoices (a delivery IS the vendor invoice)

| invoice number | id | from PO | total |
|---|---|---|---|
| ZZT-INV-3 | 1f58c69b-0920-43a9-ad20-ff115eca7192 | I-33 | 90.00 |
| ZZT-INV-2 | f5543047-8bba-46fd-8012-6c5c9f75dfb9 | I-32 | 100.00 |
| ZZT-INV-1 | a659d1f3-50d6-403e-b577-b48512f7545c | I-31 | 90.00 |

> The payment badge is not stored on the invoice — it is `vendor_transaction.vendor_transaction_status`, joined by the indexer. Read the live badge from a search, not from this table.

### What each purchase-order row was seeded FOR

| tag | PO | route | invoice | payment |
|---|---|---|---|---|
| po_ordered | S-889 | work_order | — | — |
| inv_unpaid | I-31 | stock | ZZT-INV-1 | — |
| inv_partial | I-32 | stock | ZZT-INV-2 | 200 paid 50.0 of 100.0 (partial) |
| inv_paid | I-33 | stock | ZZT-INV-3 | 200 paid 90.0 of 90.0 (full) |

### Work-order status spread actually reached

| status | count |
|---|---|
| approved | 8 |
| estimate | 5 |
| in_progress | 4 |
| review | 2 |
| declined | 2 |
| null | 1 |
