# SEED MANIFEST — Global Search V2 "Fibridge" universe · qa

**Read back off the environment, not typed.** Build marker: `v26.36.7-21b4db9`.
Regenerate with `python3 dump_seed_manifest.py > SEED-MANIFEST-GS-V2-<env>.md`.

### Customers

| key | name | id | telephone | address |
|---|---|---|---|---|
| cust_fib_commercial | ZZAUTOTEST Fibridge Commercial | 68ed76d5-d712-4c7b-a6a8-b830062f58f8 | (264) 328-6723 | 4120 Fibridge Commerce Way |
| cust_fib_logistics | ZZAUTOTEST Fibridge Logistics | db1eb452-5adc-4b8b-a8bc-e1ab9f5d7031 | (264) 555-0143 | 77 Fibridge Yard Road |
| cust_fib_retail | ZZAUTOTEST Fibridge Retail | 3aa49332-6836-4797-a3f2-0fee01849b3d | (264) 555-0145 | 9 Fibridge Market Street |
| cust_peterson | ZZAUTOTEST Peterson Hauling | b6673b3c-dc3d-420f-89e4-e0732010096d | (264) 555-0151 | 210 Peterson Ridge |
| cust_aabridge | ZZAUTOTEST Aabridge Freight | aa70d573-26de-4208-ac28-2c9663ded10d | (264) 555-0152 | 14 Aabridge Loop |
| cust_toboro | ZZAUTOTEST Toboro Industries | b51d9124-4f60-41a7-ac63-64e1a31c9f33 | (264) 555-0153 | 3300 Toboro Bend |
| cust_deshawn_named | ZZAUTOTEST Deshawn Freight Lines | a1198010-6ce8-486a-8666-39c8d853bb64 | (264) 555-0154 | 88 Deshawn Crossing |
| cust_bryan_smith | ZZAUTOTEST Bryan Smith Hauling | fb82208e-0235-4eec-8e99-349fb8a65b6d | (264) 555-0155 | 51 Smithfield Row |

### Contacts (people AT a customer company)

| key | name | id | title | telephone | email |
|---|---|---|---|---|---|
| contact_deshawn | Deshawn Oyelaran | 48d06764-c313-4457-9960-dfd6ea67c202 | Fleet Manager | (264) 555-0142 | deshawn@fibridge-commercial.test |
| contact_logistics | Ama Boateng | f701bcd3-d704-4117-a423-c5e9454de0a3 | Dispatcher | (264) 555-0144 | ama@fibridge-logistics.test |
| contact_retail | Iris Vandenberg | 4b978282-d5ee-444c-b1ca-440fb1f0c1a4 | Owner | (264) 555-0146 | iris@fibridge-retail.test |
| contact_bryan | Bryan Smith | 6aaac293-9bd8-4f6f-9511-f1694b6602e1 | Owner | (264) 555-0156 | bryan@bryansmithhauling.test |

### Assets

| key | year make model | id | unit | VIN |
|---|---|---|---|---|
| asset_trk412 | 2019 Freightliner Cascadia | a3c5024c-d866-49bc-b26e-2fda6fbcb83d | TRK 412 | 1FUJGLDR9CLBP8834 |
| asset_nounit | 2021 KEN WORTH T680 | 88930a47-7090-468e-8336-47109b288276 | (none — deliberate) | 1XKYDP9X1MJ441077 |
| asset_fib_3 | 2022 PETERBILT 579 | 3660ebb7-3ab9-423c-a190-0ee9c57d0a44 | TRK 413 | 1XPBDP9X5ND441078 |
| asset_fib_4 | 2020 VOLVO VNL760 | e05782f0-708b-4347-97e5-d83a429a9816 | TRK 414 | 4V4NC9EH8LN441079 |
| asset_fib_5 | 2023 MACK ANTHEM | 456233ac-5614-4f8d-aec9-495d28872487 | TRK 415 | 1M1AN07Y5PM441080 |
| asset_fib_6 | 2024 INTERNATIONAL LT625 | 9079a0c0-2891-4084-8f92-2c8330a12a67 | TRK 416 | 3HSDJAPR5RN441081 |
| asset_m2_bryan | 2025 Freightliner M2 | ad2208cf-96f5-4946-97ff-84d386cc020d | BSH 001 | 1FVACWDT5SH441082 |

### Vendor

| name | id | email | credit term |
|---|---|---|---|
| ZZAUTOTEST Fibridge Mining | 87919c7d-705b-4b9e-9c25-190f2ac1147c | parts@fibridge-mining.test | Net 30 |

### Inventory parts (the three stock states + the exact part number)

| key | part number | description | id | on hand | reorder level |
|---|---|---|---|---|---|
| part_instock | ZZT-FIB-1001 | ZZAUTOTEST Fibridge Brake Shoe Kit | 76835243-3021-4f1c-abc3-51a84c8cd343 | 40 | 5 |
| part_low | ZZT-FIB-1002 | ZZAUTOTEST Fibridge Wheel Seal | a0d60c65-fce1-4249-8710-fc099162e3b0 | 2 | 5 |
| part_out | ZZT-FIB-1003 | ZZAUTOTEST Fibridge Air Dryer Cartridge | fd70d212-7f47-4346-98ee-b5ced7fd2413 | 0 | 5 |
| part_65547 | 65547 | Rear Shock | b73ff088-7d6f-48ee-bba3-2e645e1d1ddc | 12 | 2 |

### Work orders (numbers are ASSIGNED BY THE BRANCH — they cannot be chosen)

| key | number | id | status | customer |
|---|---|---|---|---|
| work_orders_fib_main | S-17630 | 60e7bbe2-c828-421e-900e-0f87e9d50d4c | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17631 | 0fd8984c-5b3d-44cc-a885-ce719f9f9ece | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17632 | e4f4a156-901c-47da-9ae8-f97c9fe90aa5 | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17633 | 4456247c-fef8-4c36-9d23-20f732aa747d | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17634 | 5aa6ce39-2ace-443c-b188-15a160e4632f | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17635 | 8218d71a-2651-40dc-a46c-2a2574915a04 | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17636 | b5d1913d-32d8-49d7-a83c-436ae13193b3 | In Progress | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17637 | a50ec551-a013-44bf-a633-309b147c4421 | In Progress | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17638 | 5e038ec9-e91c-47fa-a55b-36837f389060 | In Progress | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17639 | 85b7d9e1-10f8-4207-a997-a67300967d70 | In Progress | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17640 | e22a6169-331e-4794-99b3-cdfaef32a53d | Approved | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17641 | 523e6657-487c-4ccf-9192-78cdf777a2c5 | Review | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17642 | 1048559d-b659-424b-b12b-b160dd1e08ea | Review | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17643 | 385a8c5c-59c9-4273-a267-30a28b1536f7 | Declined | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17648 | 245fc707-a667-4895-aab7-e0fa3aac9288 | Declined | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17649 | de86ff9d-338a-4cfd-a8d7-e8d9ef65de5a | Estimate | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17650 | 3d782565-15de-434d-90dc-ac8c8fa01637 | Estimate | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_main | S-17651 | 7ea84526-a270-4490-a543-3b5c36f67ddf | Estimate | ZZAUTOTEST Fibridge Commercial |
| work_orders_fib_nounit | S-17644 | 68d40a24-ee0c-4d08-987c-ed014c4ee4b9 | Approved | ZZAUTOTEST Fibridge Logistics |
| work_orders_fib_nounit | S-17645 | c88b7137-d143-46bb-a1c5-e01176a1fd24 | Approved | ZZAUTOTEST Fibridge Logistics |
| work_orders_fib_nounit | S-17646 | b114f303-da34-4066-95f6-7c9108bc41c5 | Estimate | ZZAUTOTEST Fibridge Logistics |
| work_orders_fib_nounit | S-17647 | 90b2caef-518c-4b60-ad0b-451373f50580 | Estimate | ZZAUTOTEST Fibridge Logistics |

### Part sales

| P-number | id | customer | status |
|---|---|---|---|
| P9160-257 | b78e9136-1a88-499f-b3bb-fd95c80e8957 | ZZAUTOTEST Fibridge Commercial | estimate |

### Purchase orders (on the Fibridge vendor)

| number | id | status | total |
|---|---|---|---|
| S-17640 | cb2938fc-2dcd-4d7b-a5df-66521c777170 | ordered | 67.5 |
| S-17634 | ea97d694-5f05-4add-bb95-c920426b260b | ordered | 90 |
| S-17633 | 8a156f60-60ef-42ba-8db4-3a02ad09f5de | ordered | 100 |
| S-17632 | 95902b44-6021-4493-a87d-76aaf3666849 | ordered | 90 |
| S-17631 | 5360683a-66b4-43c5-a4e9-47b2a83100be | ordered | 240 |
| S-17630 | 0e765cb4-6577-42a7-bc1b-c688c2095e96 | ordered | 610 |

### Vendor invoices (a delivery IS the vendor invoice)

| invoice number | id | from PO | total |
|---|---|---|---|
| ZZT-INV-3 | 6504b7ae-fe24-4695-a7ab-e6112e8487da | I-1398 | 90.00 |
| ZZT-INV-2 | 368b24cb-6d69-4de2-a818-fbbe438ece1e | I-1397 | 100.00 |
| ZZT-INV-1 | 7394a2bb-9617-461a-b043-fd101386b903 | I-1396 | 90.00 |
| ZZT-INV-S1 | c56c14da-a93f-4901-bc9b-1c9ac3a8d123 | I-1395 | 112.50 |

> The payment badge is not stored on the invoice — it is `vendor_transaction.vendor_transaction_status`, joined by the indexer. Read the live badge from a search, not from this table.

### What each purchase-order row was seeded FOR

| tag | PO | route | invoice | payment |
|---|---|---|---|---|
| po_ordered | S-17631 |  | — | — |
| inv_unpaid | I-1396 | stock | ZZT-INV-1 | — |
| inv_partial | I-1397 | stock | ZZT-INV-2 | 200 paid 50.0 of 100.0 (partial) |
| inv_paid | I-1398 | stock | ZZT-INV-3 | 200 paid 90.0 of 90.0 (full) |

### Work-order status spread actually reached

| status | count |
|---|---|
| approved | 8 |
| estimate | 5 |
| in_progress | 4 |
| review | 3 |
| declined | 2 |
