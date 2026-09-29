# SEED MANIFEST — Global Search V2 "Fibridge" universe · staging

**Read back off the environment, not typed.** Build marker: `v26.39.2-e31ce3b`.
Regenerate with `python3 dump_seed_manifest.py > SEED-MANIFEST-GS-V2-<env>.md`.

### Customers

| key | name | id | telephone | address |
|---|---|---|---|---|
| cust_fib_commercial | ZZAUTOTEST Fibridge Commercial | 6866e85d-630a-45a5-9517-fb14b0a0b2e0 | (264) 328-6723 | 4120 Fibridge Commerce Way |
| cust_fib_logistics | ZZAUTOTEST Fibridge Logistics | ff0d207b-0747-471f-b09d-92f6abdd88ce | (264) 555-0143 | 77 Fibridge Yard Road |
| cust_fib_retail | ZZAUTOTEST Fibridge Retail | 0ef86eb0-142b-4650-a5b3-6220d3861a76 | (264) 555-0145 | 9 Fibridge Market Street |
| cust_peterson | ZZAUTOTEST Peterson Hauling | 5796b6ee-c09d-421e-8ca0-2c384441e19c | (264) 555-0151 | 210 Peterson Ridge |
| cust_aabridge | ZZAUTOTEST Aabridge Freight | 24e29b18-cde3-40f6-8ca4-1760beea1294 | (264) 555-0152 | 14 Aabridge Loop |
| cust_toboro | ZZAUTOTEST Toboro Industries | 38b485c5-7014-4001-9dee-75f2f1807eb0 | (264) 555-0153 | 3300 Toboro Bend |
| cust_deshawn_named | ZZAUTOTEST Deshawn Freight Lines | 848b9203-884a-4c02-812d-b1805e8197d3 | (264) 555-0154 | 88 Deshawn Crossing |
| cust_bryan_smith | ZZAUTOTEST Bryan Smith Hauling | bedb384b-efc4-4e35-a5f1-9af3246278c0 | (264) 555-0155 | 51 Smithfield Row |
| cust_adale | ZZAUTOTEST Adale Transport | dec329f1-41c1-4416-bac2-dd2737305e2f | (264) 555-0157 | 12 Adale Way |
| cust_fisquare | ZZAUTOTEST Fisquare Farms | f0a06229-09d8-4337-89b0-ae374a21f9f8 | (264) 555-0158 | 7 Fisquare Lane |

### Contacts (people AT a customer company)

| key | name | id | title | telephone | email |
|---|---|---|---|---|---|
| contact_deshawn | Deshawn Oyelaran | 8d556bdf-e986-43fb-8ca3-eaa695673f1a | Fleet Manager | (264) 555-0142 | deshawn@fibridge-commercial.test |
| contact_logistics | Ama Boateng | 38944d68-da8a-421a-805e-21079ed7ecf9 | Dispatcher | (264) 555-0144 | ama@fibridge-logistics.test |
| contact_retail | Iris Vandenberg | 308553e6-bd4e-4726-8337-7835f154b9cd | Owner | (264) 555-0146 | iris@fibridge-retail.test |
| contact_bryan | Bryan Smith | cb0792ab-1c4f-497f-b52e-743403d9ef23 | Owner | (264) 555-0156 | bryan@bryansmithhauling.test |
| contact_fisquare | Nadia Fisquare | 7874ede2-1483-444a-a8e8-48261f10712b | Owner | (264) 555-0159 | nadia@fisquare-farms.test |

### Assets

| key | year make model | id | unit | VIN |
|---|---|---|---|---|
| asset_trk412 | 2019 Freightliner Cascadia | d236bbe9-8e80-4431-bff7-0049f519380a | TRK 412 | 1FUJGLDR9CLBP8834 |
| asset_nounit | 2021 KEN WORTH T680 | 59f8c6c1-b176-421e-a68c-c447dd6623fc | (none — deliberate) | 1XKYDP9X1MJ441077 |
| asset_fib_3 | 2022 PETERBILT 579 | 7b423e30-1304-4e2c-9985-a42fde34fb42 | TRK 413 | 1XPBDP9X5ND441078 |
| asset_fib_4 | 2020 VOLVO VNL760 | 5ff96539-7ba5-4b81-972d-651a91ccfbe7 | TRK 414 | 4V4NC9EH8LN441079 |
| asset_fib_5 | 2023 MACK ANTHEM | 3c656685-edb9-45df-ab77-98b0341706e8 | TRK 415 | 1M1AN07Y5PM441080 |
| asset_fib_6 | 2024 INTERNATIONAL LT625 | 51b735ed-2340-49f8-9859-a34e8c0e6379 | TRK 416 | 3HSDJAPR5RN441081 |
| asset_m2_bryan | 2025 Freightliner M2 | 48460ee9-52ae-4430-a52e-a9894af46150 | BSH 001 | 1FVACWDT5SH441082 |
| asset_fisquare | 2024 Freightliner M2 | b8fe6589-63fb-466e-bb5e-e67cf18af7a0 | FSQ 001 | 1FVACWDT5RH441083 |

### Vendor

| name | id | email | credit term |
|---|---|---|---|
| ZZAUTOTEST Fibridge Mining | 1fe64204-94e0-4252-a352-d97aaf0c66cf | parts@fibridge-mining.test | Net 30 |

### Inventory parts (the three stock states + the exact part number)

| key | part number | description | id | on hand | reorder level |
|---|---|---|---|---|---|
| part_instock | ZZT-FIB-1001 | ZZAUTOTEST Fibridge Brake Shoe Kit | 92f82307-550e-478a-ac66-6e7c2b40c568 | 40 | 5 |
| part_low | ZZT-FIB-1002 | ZZAUTOTEST Fibridge Wheel Seal | 76024ede-1657-46bf-850f-58431333b459 | 2 | 5 |
| part_out | ZZT-FIB-1003 | ZZAUTOTEST Fibridge Air Dryer Cartridge | 9d035b77-4af6-4604-b3d1-fd2a81f0a02b | 0 | 5 |
| part_65547 | 65547 | Rear Shock | 7460a6fb-797f-4ba5-8157-ce519a406532 | 12 | 2 |

### Work orders (numbers are ASSIGNED BY THE BRANCH — they cannot be chosen)

| key | number | id | status | customer |
|---|---|---|---|---|
| work_orders_fib_main | S-34132 | 047e2e32-857b-4f9a-a417-dfc8f235f0c9 | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-34133 | 8eda530a-18ce-41b0-a0ef-273fdebb40ad | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-34134 | 55dac528-7074-4e9d-bcc4-40d5d214ea06 | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-34135 | f1e2dc46-9faf-4ab9-b5b7-be18000b992c | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-34136 | 11d366dd-5593-420f-b963-d09381953d83 | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-34137 | e11ec59c-c96d-4274-a077-d58039ccbcee | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-34138 | 8f8f9e6f-cd93-4f1d-a41d-c0f32ef1820c | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-34139 | bb5c9bae-69a9-4cc7-96bc-0aa06801461b | In Progress | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-34140 | aa062cf1-3fc8-468e-894f-07a341ff9c9e | In Progress | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-34141 | 506305f2-0937-4c10-a6b3-00480e81db20 | In Progress | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-34142 | 37d7dd28-3208-49b7-a4a5-8029d848c10c | Review | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-34143 | f23af6b6-1c65-4b48-b09c-1dba24b3f05d | Review | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-34144 | 327e461f-8038-4cc2-aa42-1e1d4cbd3664 | Review | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-34145 | 770cfb90-f83d-40d9-9a26-b14099e1a2c7 | Declined | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-34146 | c9ee36bd-617c-493c-8a06-69283b51fc1f | Declined | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-34147 | 432299fb-a5eb-4766-ae11-98ba3920dd8f | Complete | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-34148 | e6171bcc-b9f6-477e-998c-7879f9e3c101 | Invoiced | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-34149 | c1bc9eec-377d-4773-a668-71c5f539e337 | Estimate | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_nounit | S-34150 | 0bd8d48d-772d-4618-93bf-ed2d8f58e82b | Approved | ZZAUTOTEST Fibridge Logistics |
| work_orders_fib_nounit | S-34151 | a5ee7e12-cfa0-445f-8e30-922d533945a3 | Complete | ZZAUTOTEST Fibridge Logistics |
| work_orders_fib_nounit | S-34152 | 6526f177-8949-42d1-8256-5705fb1ffdd4 | Estimate | ZZAUTOTEST Fibridge Logistics |
| work_orders_fib_nounit | S-34153 | 85543b03-2db0-4a1d-8e6e-7f2fb037b46d | Estimate | ZZAUTOTEST Fibridge Logistics |

### Part sales

| P-number | id | customer | status |
|---|---|---|---|
| P2-2249 | 5a749558-8d07-4ba8-8ee1-c596266422ba | ZZAUTOTEST Fibridge Commercial | estimate |

### Purchase orders (on the Fibridge vendor)

| number | id | status | total |
|---|---|---|---|
| I-1513 | 3b55034b-4e93-4e6d-8153-30346004675f | ordered | 90 |
| I-1512 | 3e124268-6f1b-4471-9a14-0b2640d87df1 | ordered | 100 |

### Vendor invoices (a delivery IS the vendor invoice)

| invoice number | id | from PO | total |
|---|---|---|---|
| 55+5+6+5 | 18bab30f-720e-4781-a81c-b704728c827b | S-34132 | 2,150.40 |
| ZZTINV-GSV2-1001 | d79095ad-876e-4c87-b544-ac4c024100a3 | I-1516 | 90.00 |
| ZZTINV-GSV2-1003 | e8a5321a-dcfc-4dcb-8654-e3b34fcaf9ff | I-1515 | 90.00 |
| ZZTINV-GSV2-1002 | 494a65e0-90ef-4415-8b1c-433c53d66420 | I-1514 | 100.00 |
| ZZT-INV-GSV2-ZZT-FIB- | 4613015f-5030-4a6e-b331-97b284cc1b50 | I-1511 | 90.00 |

> The payment badge is not stored on the invoice — it is `vendor_transaction.vendor_transaction_status`, joined by the indexer. Read the live badge from a search, not from this table.

### What each purchase-order row was seeded FOR

| tag | PO | route | invoice | payment |
|---|---|---|---|---|
| inv_partial | I-1514 | stock | ZZTINV-GSV2-1002 | 200 paid 50.0 of 100.0 (partial) |
| inv_paid | I-1515 | stock | ZZTINV-GSV2-1003 | 200 paid 90.0 of 90.0 (full) |
| inv_unpaid | I-1516 | stock | ZZTINV-GSV2-1001 | — |

### Work-order status spread actually reached

| status | count |
|---|---|
| approved | 8 |
| estimate | 5 |
| in_progress | 4 |
| ready_for_review | 3 |
| declined | 2 |
