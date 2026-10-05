# SEED MANIFEST — Global Search V2 "Fibridge" universe · sv10740

**Read back off the environment, not typed.** Build marker: `v26.40.3-da63248`.
Regenerate with `python3 dump_seed_manifest.py > SEED-MANIFEST-GS-V2-<env>.md`.

### Customers

| key | name | id | telephone | address |
|---|---|---|---|---|
| cust_fib_commercial | ZZAUTOTEST Fibridge Commercial | 108f17f9-1944-4b85-939f-1520e1959d9b | (264) 328-6723 | 4120 Fibridge Commerce Way |
| cust_fib_logistics | ZZAUTOTEST Fibridge Logistics | 598801f3-73a9-4fc1-b182-b5e9bcea9088 | (264) 555-0143 | 77 Fibridge Yard Road |
| cust_fib_retail | ZZAUTOTEST Fibridge Retail | 03843c9d-23e6-474e-ba67-2ec22f80d3b0 | (264) 555-0145 | 9 Fibridge Market Street |
| cust_peterson | ZZAUTOTEST Peterson Hauling | 9d511984-607b-4840-9106-120147ded0c5 | (264) 555-0151 | 210 Peterson Ridge |
| cust_aabridge | ZZAUTOTEST Aabridge Freight | e31f0c71-92f1-4df1-bb4f-60b97585913c | (264) 555-0152 | 14 Aabridge Loop |
| cust_toboro | ZZAUTOTEST Toboro Industries | 11fa1905-db93-48b6-846f-ae79113ad0b6 | (264) 555-0153 | 3300 Toboro Bend |
| cust_deshawn_named | ZZAUTOTEST Deshawn Freight Lines | c22c96fb-48e9-4e86-8976-1df790a70f21 | (264) 555-0154 | 88 Deshawn Crossing |
| cust_bryan_smith | ZZAUTOTEST Bryan Smith Hauling | 2ebcd8df-7fef-4d1d-92f4-03d9de9b4a88 | (264) 555-0155 | 51 Smithfield Row |
| cust_adale | ZZAUTOTEST Adale Transport | a81934ef-996f-44da-a833-5a15802b8af8 | (264) 555-0157 | 12 Adale Way |
| cust_fisquare | ZZAUTOTEST Fisquare Farms | bd8c68e7-6227-4436-8770-28a0c1a0285d | (264) 555-0158 | 7 Fisquare Lane |

### Contacts (people AT a customer company)

| key | name | id | title | telephone | email |
|---|---|---|---|---|---|
| contact_deshawn | Deshawn Oyelaran | c1455a05-c9f1-401b-ab78-3df3b4b28d21 | Fleet Manager | (264) 555-0142 | deshawn@fibridge-commercial.test |
| contact_logistics | Ama Boateng | 633c7342-1331-4ae7-ab8d-1b5dda9ef887 | Dispatcher | (264) 555-0144 | ama@fibridge-logistics.test |
| contact_retail | Iris Vandenberg | 8eeae797-73c6-4e76-b7dc-964ad0368bf5 | Owner | (264) 555-0146 | iris@fibridge-retail.test |
| contact_bryan | Bryan Smith | b255e2d6-362a-42b8-90e6-0ea7dda5aaee | Owner | (264) 555-0156 | bryan@bryansmithhauling.test |
| contact_fisquare | Nadia Fisquare | 87c1259c-2139-40d9-a152-1f607c4a6952 | Owner | (264) 555-0159 | nadia@fisquare-farms.test |

### Assets

| key | year make model | id | unit | VIN |
|---|---|---|---|---|
| asset_trk412 | 2019 Freightliner Cascadia | d0c2df11-75b1-4b35-868f-91cffe13c588 | TRK 412 | 1FUJGLDR9CLBP8834 |
| asset_nounit | 2021 KEN WORTH T680 | fc054310-0c14-467c-aab4-afbcaf45c274 | (none — deliberate) | 1XKYDP9X1MJ441077 |
| asset_fib_3 | 2022 PETERBILT 579 | f2b153ed-5376-4e80-9d01-01592845d247 | TRK 413 | 1XPBDP9X5ND441078 |
| asset_fib_4 | 2020 VOLVO VNL760 | bd74ad5d-ab48-4952-ab20-dbe57d343560 | TRK 414 | 4V4NC9EH8LN441079 |
| asset_fib_5 | 2023 MACK ANTHEM | fef1960d-ee93-4835-98f3-7b5928064760 | TRK 415 | 1M1AN07Y5PM441080 |
| asset_fib_6 | 2024 INTERNATIONAL LT625 | 6b9fe032-b365-485b-9728-a71cdd1304ce | TRK 416 | 3HSDJAPR5RN441081 |
| asset_m2_bryan | 2025 Freightliner M2 | 3870d9c4-20ae-411b-b297-5ba393f737eb | BSH 001 | 1FVACWDT5SH441082 |
| asset_fisquare | 2024 Freightliner M2 | b1a2a876-c6f3-4a1c-8c58-3bcd777a17ac | FSQ 001 | 1FVACWDT5RH441083 |

### Vendor

| name | id | email | credit term |
|---|---|---|---|
| ZZAUTOTEST Fibridge Mining | cfed812a-70d1-4c5e-a393-288dc4b21fb8 | parts@fibridge-mining.test | Net 30 |

### Inventory parts (the three stock states + the exact part number)

| key | part number | description | id | on hand | reorder level |
|---|---|---|---|---|---|
| part_instock | ZZT-FIB-1001 | ZZAUTOTEST Fibridge Brake Shoe Kit | 1fef8da4-95a4-443a-a102-fb8f39177c28 | 40 | 5 |
| part_low | ZZT-FIB-1002 | ZZAUTOTEST Fibridge Wheel Seal | 29fc8030-ca03-4941-a744-65036f8c5929 | 2 | 5 |
| part_out | ZZT-FIB-1003 | ZZAUTOTEST Fibridge Air Dryer Cartridge | ee4ff676-058f-440a-86f1-25953acfbf31 | 0 | 5 |
| part_65547 | 65547 | Rear Shock | a40a3e5b-9944-446b-9ede-5d52c54163a9 | 12 | 2 |
