# SEED MANIFEST — Global Search V2 "Fibridge" universe · qa

**Read back off the environment, not typed.** Build marker: `v26.36.8-d146c39`.
Regenerate with `python3 dump_seed_manifest.py > SEED-MANIFEST-GS-V2-<env>.md`.

### Customers

| key | name | id | telephone | address |
|---|---|---|---|---|
| cust_fib_commercial | ZZAUTOTEST Fibridge Commercial | 4b6f7023-e1f5-42db-95e0-9168d94c4fb5 | (264) 328-6723 | 4120 Fibridge Commerce Way |
| cust_fib_logistics | ZZAUTOTEST Fibridge Logistics | 9f7ee11a-c943-49b2-9c06-929f8506f858 | (264) 555-0143 | 77 Fibridge Yard Road |
| cust_fib_retail | ZZAUTOTEST Fibridge Retail | 77b9cc71-9661-4e6d-b105-fcce83f3ffc6 | (264) 555-0145 | 9 Fibridge Market Street |
| cust_peterson | ZZAUTOTEST Peterson Hauling | 5f60c514-b6e9-4028-aa8b-ac3b1f02d9da | (264) 555-0151 | 210 Peterson Ridge |
| cust_aabridge | ZZAUTOTEST Aabridge Freight | bf3f2d64-fd9d-4da8-be30-941fd49abc86 | (264) 555-0152 | 14 Aabridge Loop |
| cust_toboro | ZZAUTOTEST Toboro Industries | 26d7ddb1-16a1-41ba-a786-740b67c18381 | (264) 555-0153 | 3300 Toboro Bend |
| cust_deshawn_named | ZZAUTOTEST Deshawn Freight Lines | 5107713c-ade4-42d5-9995-6fd097cd2d69 | (264) 555-0154 | 88 Deshawn Crossing |
| cust_bryan_smith | ZZAUTOTEST Bryan Smith Hauling | 664fb6d4-3386-4da0-a185-82fde3a143c5 | (264) 555-0155 | 51 Smithfield Row |
| cust_adale | ZZAUTOTEST Adale Transport | 3c91cea7-f353-4a9e-8aab-f72244f730ab | (264) 555-0157 | 12 Adale Way |
| cust_fisquare | ZZAUTOTEST Fisquare Farms | b6eeee82-2ece-4fa6-a082-45eae3e5c73d | (264) 555-0158 | 7 Fisquare Lane |

### Contacts (people AT a customer company)

| key | name | id | title | telephone | email |
|---|---|---|---|---|---|
| contact_deshawn | Deshawn Oyelaran | 721b39eb-3949-45cc-9a3d-baff244cbe40 | Fleet Manager | (264) 555-0142 | deshawn@fibridge-commercial.test |
| contact_logistics | Ama Boateng | cabd3d3a-5683-40ab-89e4-165940dc9f34 | Dispatcher | (264) 555-0144 | ama@fibridge-logistics.test |
| contact_retail | Iris Vandenberg | 8f17fa9a-f70e-49fb-86c8-372854890eb6 | Owner | (264) 555-0146 | iris@fibridge-retail.test |
| contact_bryan | Bryan Smith | a23e3b48-09d6-4366-87c6-3191bed4d470 | Owner | (264) 555-0156 | bryan@bryansmithhauling.test |
| contact_fisquare | Nadia Fisquare | 9c3b94a1-be4a-4872-8bc8-ac4c793e7bdc | Owner | (264) 555-0159 | nadia@fisquare-farms.test |

### Assets

| key | year make model | id | unit | VIN |
|---|---|---|---|---|
| asset_trk412 | 2019 Freightliner Cascadia | 291e5fc9-bb7c-406c-b67d-5a4e7a1382b6 | TRK 412 | 1FUJGLDR9CLBP8834 |
| asset_nounit | 2021 KEN WORTH T680 | 6af0fc81-69ca-4c1c-8386-db0413d63176 | (none — deliberate) | 1XKYDP9X1MJ441077 |
| asset_fib_3 | 2022 PETERBILT 579 | 5b9fd152-818a-448d-88d8-7fa2863561bb | TRK 413 | 1XPBDP9X5ND441078 |
| asset_fib_4 | 2020 VOLVO VNL760 | 9acf7f5d-aea0-45da-9fc9-61511a4ed82b | TRK 414 | 4V4NC9EH8LN441079 |
| asset_fib_5 | 2023 MACK ANTHEM | fe883417-7a1f-4f84-b9d5-6b3e875d7928 | TRK 415 | 1M1AN07Y5PM441080 |
| asset_fib_6 | 2024 INTERNATIONAL LT625 | da4b8995-fe76-447b-b8ff-29b88163b513 | TRK 416 | 3HSDJAPR5RN441081 |
| asset_m2_bryan | 2025 Freightliner M2 | 6108d3ff-e199-4293-8107-6459207f5706 | BSH 001 | 1FVACWDT5SH441082 |
| asset_fisquare | 2024 Freightliner M2 | 1118d37f-38b1-40e0-9e6e-fe3c2b11a913 | FSQ 001 | 1FVACWDT5RH441083 |

### Vendor

| name | id | email | credit term |
|---|---|---|---|
| ZZAUTOTEST Fibridge Mining | 61d43b54-4456-428e-877b-f412e400a971 | parts@fibridge-mining.test | Net 30 |

### Inventory parts (the three stock states + the exact part number)

| key | part number | description | id | on hand | reorder level |
|---|---|---|---|---|---|
| part_instock | ZZT-FIB-1001 | ZZAUTOTEST Fibridge Brake Shoe Kit | 0f538908-d881-412d-88ed-6b14254105a3 | 40 | 5 |
| part_low | ZZT-FIB-1002 | ZZAUTOTEST Fibridge Wheel Seal | 4f862507-5fdb-406b-9673-7e355dd9d964 | 2 | 5 |
| part_out | ZZT-FIB-1003 | ZZAUTOTEST Fibridge Air Dryer Cartridge | 55d34cca-d806-4340-a0e5-c1c744f280ab | 0 | 5 |
| part_65547 | 65547 | Rear Shock | f47a5189-cb2e-4094-aa0c-1599f22124b4 | 12 | 2 |

### Work orders (numbers are ASSIGNED BY THE BRANCH — they cannot be chosen)

| key | number | id | status | customer |
|---|---|---|---|---|
| work_orders_fib_main | S-17652 | b746502a-b48c-4730-bcac-6ef88b9270cf | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17653 | 297f171a-1216-4255-a12d-0570af864ea9 | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17654 | edb63ecb-d707-4a1e-b8f4-5d46ec57d633 | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17655 | 564bf822-0e89-43dd-9acd-5d168c4f2f94 | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17656 | 2c36d7af-a522-46fa-bca7-17f95d36e4e8 | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17657 | 1391ec5c-7638-4454-b906-1a02b97946ba | Estimate | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17658 | 36e9e5eb-ee74-4747-a354-a5d850164d66 | In Progress | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17659 | 4194d905-59ba-4e18-beae-93086f3c3de1 | In Progress | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17660 | 3169709d-73f0-484d-ae11-4c8f3b6738f0 | In Progress | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17661 | 6cffa4c0-8e4a-426d-bce9-8efad6d5ed1b | Paid | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17662 | 3725fae3-d0ee-4e00-9c64-13a40dd39693 | Review | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17663 | f4145843-f947-4f38-9825-eccc948b9f6b | Review | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17664 | a8c08563-237d-427a-8f22-1728817dcdda | Review | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17665 | 58be8992-daf5-4f75-80e5-ad323fa263e3 | Declined | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17666 | ac7f18e7-d49e-4359-a4d3-f9bd9868ae69 | Declined | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17667 | 9e5796e6-50c6-4b7f-9a22-d4ee4bc579b9 | Complete | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17668 | 603f0a86-07aa-444b-baf3-b52adad8a506 | Invoiced | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17669 | 636f7fc0-d7d6-4a47-ae0b-710376d9de58 | Estimate | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_nounit | S-17670 | 02fd66df-a97a-4bb7-a8de-b983cb065670 | Approved | ZZAUTOTEST Fibridge Logistics |
| work_orders_fib_nounit | S-17671 | 4a4eae21-1786-4056-a680-493f374061b3 | Approved | ZZAUTOTEST Fibridge Logistics |
| work_orders_fib_nounit | S-17672 | fa32b0f0-1cc9-4162-b42f-2ceed19a6503 | Estimate | ZZAUTOTEST Fibridge Logistics |
| work_orders_fib_nounit | S-17673 | 36a8d352-8261-48b6-ba51-a641679d3b41 | Estimate | ZZAUTOTEST Fibridge Logistics |

### Part sales

| P-number | id | customer | status |
|---|---|---|---|
| P9160-258 | 87cff77c-48fd-477a-89b1-2e5b1d23fcde | ZZAUTOTEST Fibridge Commercial | estimate |

### Purchase orders (on the Fibridge vendor)

| number | id | status | total |
|---|---|---|---|
| S-17652 | 342f6e2a-6a5e-429f-af45-26f7ada197e9 | partial_delivery | 480 |

### Vendor invoices (a delivery IS the vendor invoice)

| invoice number | id | from PO | total |
|---|---|---|---|
| 5445546 | f1cb8145-bb66-4a55-9b74-0cab71002926 | S-17652 | 240.00 |
| ZZT-INV-3 | 806df545-afea-4fa4-8f28-41f682bdf4f8 | I-1397 | 90.00 |
| ZZT-INV-2 | a33c9a5b-9891-4056-a64a-57c20d8585a7 | I-1396 | 100.00 |
| ZZT-INV-1 | 4e9509a9-83d0-4186-909d-6b00a74ad284 | I-1395 | 90.00 |

> The payment badge is not stored on the invoice — it is `vendor_transaction.vendor_transaction_status`, joined by the indexer. Read the live badge from a search, not from this table.

### What each purchase-order row was seeded FOR

| tag | PO | route | invoice | payment |
|---|---|---|---|---|
| inv_partial | I-1396 | stock | ZZT-INV-2 | 200 paid 50.0 of 100.0 (partial) |
| inv_paid | I-1397 | stock | ZZT-INV-3 | 200 paid 90.0 of 90.0 (full) |
| inv_unpaid | I-1395 | stock | ZZT-INV-1 | — |

### Work-order status spread actually reached

| status | count |
|---|---|
| approved | 8 |
| in_progress | 4 |
| ready_for_review | 3 |
| estimate | 3 |
| declined | 2 |
| complete | 1 |
| invoiced | 1 |
