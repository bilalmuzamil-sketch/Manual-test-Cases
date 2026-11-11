# Records created for the live run, 11 Nov 2026

**QA (sv11315, marker v26.45.2-6a8b89c)** - all through the endpoints the front end itself calls (Rule 115), by the one
command `python3 tools/seed.py qa` from `tools/manifest.json`. The ledger `tools/seeded-qa.json` is the checkpoint,
so a re-run carries on from it (proved: the 4th and 5th runs created nothing new). The read-only board `python3 tools/status.py qa [date]`
lists what each customer and vendor holds on the reports (`tools/status-2026-11-11.txt`). Every name includes ZZAUTOTEST.
Location A = Staging Heavy Duty - 9919, B = Staging Lethbridge - 4310. The session was switched to B and back twice
(once by the seeder through `/api/iam/change-location`, once through the screen by V1R-04), and it ended on A.
Dates are counted back from the run day (11 Nov 2026), so a rebuild on another day keeps every case's "N days ago" true.

**Production: nothing was created.** The V1 confirmations used existing records, named in each result.

## Customers and vendors

| Ledger key | Name | Id |
|---|---|---|
| cust:R03 | ZZAUTOTEST AR R03 Location B | 7d2415d9-755e-4d12-b42a-a55be01bcf67 |
| cust:R07 | ZZAUTOTEST AR R07 Future Date | 30dc3298-2fd4-4010-84ef-e374665e7c68 |
| cust:R11 | ZZAUTOTEST AR R11 Date Edge | 9d3bc78a-953c-4ce9-910d-d232e017802b |
| cust:R13 | ZZAUTOTEST AR R13 Payment After | 8d4056a8-79d3-4772-b150-fcaeb052a113 |
| cust:R14 | ZZAUTOTEST AR R14 Paid In Full | 46231439-a825-4990-ac58-fecd3eb12311 |
| cust:R15 | ZZAUTOTEST AR R15 Payment Reversed | ebf5abed-033d-43c2-b2f0-0d1229a94614 |
| cust:R16 | ZZAUTOTEST AR R16 Memo Voided | 1e6ad78b-6950-4900-a5a5-6b8c0e6bbcf4 |
| cust:R17 | ZZAUTOTEST AR R17 Memo Applied | 49cdec5f-4468-4f0a-aa26-cca39489b5d3 |
| cust:R18 | ZZAUTOTEST AR R18 Deposits | 985b38a2-3889-4e25-86dd-da3b700c3c9e |
| cust:R19 | ZZAUTOTEST AR R19 Deposit Reversed | 1fde0ae9-c247-4acf-9afc-3db2f51e349a |
| cust:R22 | ZZAUTOTEST AR R22 Bucket Edges | 00106298-00bf-4dcf-8319-63cf7447cad4 |
| cust:R23 | ZZAUTOTEST AR R23 Memo Aging | 2a56720e-a09c-4f39-b74d-f5785f1bed7c |
| cust:R28 | ZZAUTOTEST AR R28 Credit Only | 5609bc1b-a93f-43c8-ae45-34168bb29c3d |
| cust:R29 | ZZAUTOTEST AR R29 One Bucket | 0fe94c66-ee23-4ed2-bfad-4eae3e26422d |
| cust:R30 | ZZAUTOTEST AR R30 Netting | 94ac2eac-6595-4e78-9255-817e4a371388 |
| cust:R31K | ZZAUTOTEST AR R31 Thousands | 65ead067-1346-4f9d-b5e6-399ffc8c3abc |
| cust:R31N | ZZAUTOTEST AR R31 Negative Total | d14c5380-8182-4399-a9ef-859856915983 |
| cust:R36X | ZZAUTOTEST AR R36 Collect X | 52ed40ae-fe51-4f76-98ca-95baef767b4e |
| cust:R36Z | ZZAUTOTEST AR R36 Collect Z | 076940db-9f6a-4160-b823-a431f90c5577 |
| cust:R41 | ZZAUTOTEST AR R41 Partly Paid | e62fe1a5-9ef8-40e7-860c-c26d2dd844a0 |
| cust:R42 | ZZAUTOTEST AR R42 Memo Line | 4a18211a-fd90-45fc-a7ac-1aad0fbf64a7 |
| cust:R44 | ZZAUTOTEST AR R44 Two Past Due | 1082b9db-35ba-43d9-8c9d-60cdae2f5a70 |
| cust:R45 | ZZAUTOTEST AR R45 Collection Mix | 419fcd73-5aaa-4e53-9982-a5441e7d506e |
| cust:R46 | ZZAUTOTEST AR R46 Collection Credit | 6868d5c0-5f99-47d9-9ae4-8084bd0c9e75 |
| cust:R47 | ZZAUTOTEST AR R47 Oldest First | 758f9ddd-f4c2-4680-8e0c-cabfb53f0eae |
| cust:R48 | ZZAUTOTEST AR R48 Days Past Due | 2a4a8ba2-bdd2-45cd-807d-ab731967b6e0 |
| cust:R51 | ZZAUTOTEST AR R51 Nothing Open | e411b6c0-1a5d-48f2-99ca-681e1726e3eb |
| cust:R71 | ZZAUTOTEST AR R71 Location B Orders | bfa63094-a0a3-427a-8104-719c0fb5931e |
| cust:R74 | ZZAUTOTEST AR R74 Credit Today | f1dde394-3531-4dbd-9a5d-a3a4ada9d860 |
| cust:R76 | ZZAUTOTEST AR R76 Overpaid | 0e33d965-5613-4e57-ae81-00fd14617642 |
| cust:R90 | ZZAUTOTEST AR R90 Many Lines | 30270f44-2f25-4cd1-a53f-7483e134d18f |
| vendor:P12 | ZZAUTOTEST AP P12 Bill Dates | 31f7a48c-f79d-4d4d-8e78-7e1f22843647 |
| vendor:P20 | ZZAUTOTEST AP P20 Payment After | e8bc5079-da94-4cc8-818a-757b76c8232a |
| vendor:P21 | ZZAUTOTEST AP P21 Credit Used | 8e81032a-8305-4275-889e-a3c74422f83d |
| vendor:P24 | ZZAUTOTEST AP P24 Credit Aging | 469c9d78-54c0-4687-8395-360914c05093 |
| vendor:P26 | ZZAUTOTEST AP P26 No Terms | 10fd62d0-da97-40f1-a15f-6f4c2cff4657 |
| vendor:P27 | ZZAUTOTEST AP P27 Overpaid | 36995481-9514-47d7-935b-bbd568b72c15 |
| vendor:P52 | ZZAUTOTEST AP P52 Netting | 95b6f28e-21db-4d25-96c7-3f2132e22705 |
| vendor:P56 | ZZAUTOTEST AP P56 Location B | ef2ccf46-5ad5-4c2c-9a58-c286f402f8e4 |
| vendor:P57 | ZZAUTOTEST AP P57 Not Yet Due | e17ea98d-830d-45fd-8d0d-069c4475c41f |
| vendor:P58 | ZZAUTOTEST AP P58 Credit Line | 011a14d6-9e4e-4aca-a586-36bd847bedff |
| vendor:P60A | ZZAUTOTEST AP P60 Alpha | 3c322e5d-ad9d-4231-9ab3-14e098e3cec1 |
| vendor:P60B | ZZAUTOTEST AP P60 Bravo | 22b3e196-97f2-428b-bdbb-5208de0b13bc |
| vendor:P61 | ZZAUTOTEST AP P61 Mix | 9e0d079f-2919-4619-a2d9-3aca28d6038e |
| vendor:P62 | ZZAUTOTEST AP P62 Oldest First | 09140313-6108-4fc7-94aa-8861d8d63ec5 |
| vendor:P75 | ZZAUTOTEST AP P75 Credit Today | c5e7fe8a-9431-4b36-a179-6fe12e4d871b |
| vendor:P93 | ZZAUTOTEST AP P93 Credit Links | f3ab767f-573b-40bc-bd33-b7d6edd86b5a |

## Documents

| Ledger key | Type | Number | Id | Amount ($) | Document date | Loc | Used by | Notes |
|---|---|---|---|---|---|---|---|---|
| doc:P12:billD | bill | ZZAUTOTEST-P12-A | 6ba3917b-e8ea-4878-9efe-46b7e7488d0e | 51 | 2026-10-20 | A | V1R-12 |  |
| doc:P12:billD1 | bill | ZZT-P12-BILLD1 | 72df7494-95f1-468f-a419-fcd20c0c5dde | 52 | 2026-10-21 | A | V1R-12 |  |
| doc:P20:bill | bill | ZZT-P20-BILL | 6d8e5f24-cf4a-4819-bf50-deba3c4732e6 | 200 | 2026-10-12 | A | V1R-20 |  |
| doc:P20:pay | vpayment |  |  | 80 | 2026-10-16 | A | V1R-20 |  |
| doc:P21:bill | bill | ZZT-P21-BILL | 9895fd2b-5f49-47c5-8cef-c0abb3a9cfa6 | 35 | 2026-10-17 | A | V1R-21 |  |
| doc:P21:use | vapply_credit |  |  | 35 | 2026-10-30 | A | V1R-21 |  |
| doc:P21:vc | vendor_credit | ZZT-VC-P21 | 3341b617-b1e4-4810-a24f-6af5660d6d29 | 35 | 2026-10-22 | A | V1R-21 |  |
| doc:P24:vc | vendor_credit | ZZT-VC-P24 | a44f30f3-4ac3-494f-aabc-11def1bd8f44 | 12 | 2026-09-02 | A | V1R-24 |  |
| doc:P26:bill | bill | ZZT-P26-BILL | 27e82c44-042c-48c6-bd99-cc59bda4ef11 | 26 | 2026-11-06 | A | V1R-26 |  |
| doc:P27:bill | bill | ZZT-P27-BILL | 25f4c539-85d9-4b5d-bc89-e1674f303d90 | 100 | 2026-10-27 | A | V1R-27 |  |
| doc:P52:bill_cur | bill | ZZT-P52-BILL_CUR | 4c342973-cf15-42ee-9ab0-cb22162688c2 | 90 | 2026-11-06 | A | V1R-52 |  |
| doc:P52:bill_late | bill | ZZT-P52-BILL_LATE | 2daac1b6-c492-4861-a37b-8f4e42ff0a23 | 300 | 2026-09-02 | A | V1R-52 |  |
| doc:P52:vc | vendor_credit | ZZT-VC-P52 | 70a01709-d79c-4497-9eba-110e89ad6359 | 20 | 2026-10-07 | A | V1R-52 |  |
| doc:P56:bill | bill | ZZT-P56-BILL | de0bc5f9-8d9e-40a6-ae3c-37f18e89e640 | 56 | 2026-11-05 | B | V1R-56 |  |
| doc:P57:bill | bill | ZZT-P57-BILL | 4801861f-dde8-4d0c-90f3-a2973a9293c2 | 57 | 2026-10-21 | A | V1R-57 |  |
| doc:P58:vc | vendor_credit | ZZT-VC-P58 | 1eda7ce5-5883-4190-96ec-a2d400c960ae | 25 | 2026-11-01 | A | V1R-58 |  |
| doc:P60A:bill | bill | ZZT-P60A-BILL | 23dc3bfa-8559-48b3-9403-f048b212bea7 | 61 | 2026-11-03 | A | V1R-60, V1R-64, V1R-65, V1R-66, V1R-67 |  |
| doc:P60B:bill | bill | ZZT-P60B-BILL | 97e7d42a-7af6-4724-ad19-d43c3e937e4e | 62 | 2026-11-02 | A | V1R-60, V1R-64, V1R-67 |  |
| doc:P61:bill_cur | bill | ZZT-P61-BILL_CUR | eea732f0-1cd0-42b6-8afa-f77f37f9104c | 63 | 2026-11-08 | A | V1R-61, V1R-63 |  |
| doc:P61:bill_late | bill | ZZT-P61-BILL_LATE | 5974039f-2cef-4bbc-8425-82547c4c5ad0 | 64 | 2026-10-02 | A | V1R-61, V1R-63 |  |
| doc:P61:vc | vendor_credit | ZZT-VC-P61 | 262988ae-6f49-4689-8705-ae83b0ad0b79 | 8 | 2026-11-07 | A | V1R-61, V1R-63 |  |
| doc:P62:b_mid | bill | ZZT-P62-B_MID | 7b88df90-754f-400d-84ce-0c3205469b86 | 72 | 2026-11-01 | A | V1R-62, V1R-89 |  |
| doc:P62:b_new | bill | ZZT-P62-B_NEW | 585a0be0-3696-4d2d-b8a0-2d1d3e025f96 | 71 | 2026-11-06 | A | V1R-62, V1R-89 |  |
| doc:P62:b_old | bill | ZZT-P62-B_OLD | f0ff90ac-7d82-4384-b374-b7947cf5d84e | 73 | 2026-10-27 | A | V1R-62, V1R-89 |  |
| doc:P75:vc_today2 | vendor_credit | ZZT-VC-P75-VC_TODAY2 | 7e889bb6-1a4e-48ad-8f98-ad03fc7f2f7f | 9 | 2026-11-11 | A | V1R-75 |  |
| doc:P75:vc_yday | vendor_credit | ZZT-VC-P75-VC_YDAY | 033a1902-4858-48f2-9c28-44c92a4d75e9 | 4 | 2026-11-10 | A | V1R-75 |  |
| doc:P93:bill | bill | ZZT-P93-BILL | 3fa8f874-1b2c-48f8-9147-06a512833f1b | 93 | 2026-11-07 | A | V1R-93, V1R-85 |  |
| doc:P93:vc_direct | vendor_credit_direct | ZZT-DIRECT-P93 |  | 7 | today | A | V1R-93, V1R-85 |  |
| doc:P93:vc_return | vendor_credit | ZZT-VC-P93 | 65827214-82eb-4d75-9267-1669feae413a | 13 | 2026-11-08 | A | V1R-93, V1R-85 |  |
| doc:R03:inv | invoice | S11315-17835 | baa6f9f1-12bc-4c60-84e6-43993eede4b7 | 33 | 2026-11-06 | B | V1R-03, V1R-40 |  |
| doc:R07:inv | invoice | S11315-17848 | 98884022-54cd-4107-9322-d14073218980 | 65 | 2026-11-01 | A | V1R-07 |  |
| doc:R11:cm | credit_memo | CM11315-4202 |  | 15 | 2026-10-21 | A | V1R-11 |  |
| doc:R11:inv | invoice | S11315-17837 | f4978ed2-2723-40ea-bc2b-2feb844de1ce | 60 | 2026-10-20 | A | V1R-11 |  |
| doc:R13:inv | invoice | S11315-17834 | ecedb52d-003f-4fa6-9c2f-d062cd6b8c99 | 100 | 2026-10-10 | A | V1R-13, V1R-35 |  |
| doc:R13:pay | payment |  | 5969d057-15cc-4be1-8e0c-a99e1051d26d | 40 | 2026-10-15 | A | V1R-13, V1R-35 |  |
| doc:R14:inv | invoice | S11315-17838 | b30df962-1843-447d-8166-99791be09637 | 80 | 2026-10-02 | A | V1R-14 |  |
| doc:R14:pay | payment |  | 3fd70738-3bd7-4edc-a158-2bd9d5d0d9ab | 80 | 2026-10-12 | A | V1R-14 |  |
| doc:R15:inv | invoice | S11315-17839 | f68ae95d-3a29-4a9a-9a9a-3c6457d5c14d | 100 | 2026-10-01 | A | V1R-15 |  |
| doc:R15:pay | payment |  | 220db4ba-fad5-43a1-b61c-3e8aec677677 | 100 | 2026-10-06 | A | V1R-15 | reversed_now: True |
| doc:R16:cm | credit_memo | CM11315-4203 | d6a59f5f-f514-4820-8315-512160dbf63b | 25 | 2026-10-22 | A | V1R-16 | voided_now: True |
| doc:R17:apply | apply_credit |  | a9771858-70bf-49c5-b583-ff12522acba5 | 30 | 2026-10-27 | A | V1R-17 |  |
| doc:R17:cm | credit_memo | CM11315-4204 |  | 30 | 2026-10-17 | A | V1R-17 |  |
| doc:R17:inv | invoice | S11315-17840 | 54a5adfb-6ad7-4853-b96a-824f5efc4c4e | 30 | 2026-10-16 | A | V1R-17 |  |
| doc:R18:dep_free | overpay_deposit | DEP11315-4714 | 8320519f-bb83-491a-b99f-1c2164b2b78b | 50 | 2026-11-02 | A | V1R-18, V1R-85 |  |
| doc:R18:dep_wo | wo_deposit | DEP11315-4713 | e370947c-33d9-440f-a94a-eb8a97a035a6 | 70 | 2026-11-03 | A | V1R-18, V1R-85 |  |
| doc:R18:inv_dep | invoice | S11315-17849 | 058ca696-9c34-449a-bc6a-be53951dda82 | 10 | 2026-11-01 | A | V1R-18, V1R-85 |  |
| doc:R19:dep_free | overpay_deposit | DEP11315-4715 | 06b1c0ea-d7fd-44f2-a12b-7b4b3034fdbe | 20 | 2026-10-30 | A | V1R-19 | reversed_via: reverse of its originating payment e37fb746 (deposit reverse refused: refund or apply) |
| doc:R19:inv_dep | invoice | S11315-17850 | fab4f81c-127b-4997-b5a9-2f5a2985085e | 5 | 2026-10-29 | A | V1R-19 |  |
| doc:R22:inv | invoice | S11315-17842 | 0746c9e9-637c-4fea-b905-d21ec7cb1119 | 10 | 2026-08-01 | A | V1R-22, V1R-78 |  |
| doc:R23:cm | credit_memo | CM11315-4205 |  | 15 | 2026-09-15 | A | V1R-23 |  |
| doc:R28:cm | credit_memo | CM11315-4206 |  | 40 | 2026-11-05 | A | V1R-28 |  |
| doc:R29:inv1 | invoice | S11315-17843 | bbcabcbb-1d68-47a5-b39a-6b6b39cea83c | 45 | 2026-10-28 | A | V1R-29 |  |
| doc:R29:inv2 | invoice | S11315-17844 | 03ec15b9-7f28-461a-acdb-107c8c2efb3a | 55 | 2026-10-22 | A | V1R-29 |  |
| doc:R30:cm | credit_memo | CM11315-4208 | dacac1bb-31ef-4611-9abe-625857d419cc | 30 | 2026-11-06 | A | V1R-30 |  |
| doc:R30:inv_cur | invoice | S11315-17852 | 4bc49331-04ff-4cc5-8ed5-a7935c9f3472 | 50 | 2026-11-05 | A | V1R-30 |  |
| doc:R30:inv_late | invoice | S11315-17851 | 69a2d067-2a06-4a3f-ba1d-545df78ccd4a | 100 | 2026-10-02 | A | V1R-30 |  |
| doc:R31K:inv | invoice | S11315-17845 | 58026472-e809-481a-820f-3ddc17948e40 | 1234.56 | 2026-11-09 | A | V1R-31 |  |
| doc:R31N:cm | credit_memo | CM11315-4207 |  | 12 | 2026-11-08 | A | V1R-31 |  |
| doc:R36X:inv | invoice | S11315-17846 | a96a29b2-2a21-4245-9310-1195d2fd34b6 | 110 | 2026-10-27 | A | V1R-36, V1R-49, V1R-50, V1R-88 |  |
| doc:R36Z:inv | invoice | S11315-17865 | 76dfe870-5018-410d-86eb-419e09246b9e | 120 | 2026-10-24 | A | V1R-36, V1R-49, V1R-50, V1R-88 |  |
| doc:R41:inv | invoice | S11315-17853 | 50f1567c-12c6-4588-8118-d193023617a0 | 250 | 2026-11-03 | A | V1R-41 |  |
| doc:R41:pay | payment |  | 86132f24-784b-4e8c-a4ac-6991466edaa1 | 100 | 2026-11-07 | A | V1R-41 |  |
| doc:R42:cm | credit_memo | CM11315-4209 | 2f293a68-279a-4e4e-8f4d-84aa9811e58b | 5 | 2026-10-26 | A | V1R-42, V1R-80, V1R-85 |  |
| doc:R44:inv1 | invoice | S11315-17854 | c7f31210-0c29-41ee-aa7c-ac37bbe1bf7b | 40 | 2026-11-01 | A | V1R-44 |  |
| doc:R44:inv2 | invoice | S11315-17855 | 368fcaa5-d819-491f-9b00-1a33711efef4 | 41 | 2026-10-22 | A | V1R-44 |  |
| doc:R45:cm | credit_memo | CM11315-4210 | 984e4905-1423-4be9-8899-4cb965cf5e9b | 9 | 2026-11-04 | A | V1R-45 |  |
| doc:R45:invA | invoice | S11315-17856 | c13690f0-4671-4d89-b72b-e249cc408007 | 71 | 2026-10-07 | A | V1R-45 |  |
| doc:R45:invB | invoice | S11315-17857 | 7dd3f876-4c98-4fdd-96cf-de68e96a5e38 | 72 | 2026-10-12 | A | V1R-45 |  |
| doc:R45:invC | invoice | S11315-17858 | 32c8a95c-e093-4de0-a5ea-fe56bff90f9e | 73 | 2026-10-19 | A | V1R-45 |  |
| doc:R46:cm | credit_memo | CM11315-4211 | 086e2710-2bfe-44b0-bb85-1111128c2679 | 11 | 2026-11-04 | A | V1R-46 |  |
| doc:R47:inv_mid | invoice | S11315-17859 | b0d4f8d7-a5b3-41b2-9dfd-ca206ed2a671 | 22 | 2026-10-23 | A | V1R-47 |  |
| doc:R47:inv_new | invoice | S11315-17860 | 2e7c2f5a-9230-4d06-b5bb-6935a04ba788 | 21 | 2026-11-02 | A | V1R-47 |  |
| doc:R47:inv_old | invoice | S11315-17861 | 92e81f96-dbe0-48d5-bd5e-4c6f66e4866e | 23 | 2026-10-13 | A | V1R-47 |  |
| doc:R48:cm | credit_memo | CM11315-4212 | a44cbdf5-c82e-4da3-9d83-7ce2f46488db | 3 | 2026-11-08 | A | V1R-48 |  |
| doc:R48:inv | invoice | S11315-17862 | c2fa8f54-23b6-4c16-aa50-ffccb2b0c450 | 48 | 2026-10-30 | A | V1R-48 |  |
| doc:R71:ps | part_sale |  | 1bd264cf-141a-474d-8b2a-48099f539b5f |  | today | B | V1R-71, V1R-72 |  |
| doc:R71:wo | open_wo | S-17836 | f8c96432-47c0-4362-bacf-1f52a4a06ee3 |  | today | B | V1R-71, V1R-72 |  |
| doc:R74:cm_today | credit_memo | CM11315-4316 | 06ec7091-c480-40d4-9db1-a17d2002e411 | 8 | 2026-11-11 | A | V1R-74, V1R-86 |  |
| doc:R74:cm_yday | credit_memo | CM11315-4214 | fb2aab00-3f09-42e8-a3d1-702b88fe2d74 | 6 | 2026-11-10 | A | V1R-74, V1R-86 |  |
| doc:R74:inv | invoice | S11315-17863 | 43eb2801-5034-495f-ac85-8f097972db3c | 86 | 2026-11-01 | A | V1R-74, V1R-86 |  |
| doc:R76:inv | invoice | S11315-17864 | f8da379e-feda-400c-8cd8-44c9438a0cc4 | 100 | 2026-10-22 | A | V1R-76 |  |
| doc:R90:cms | credit_memo_many |  |  | 1 | 2026-11-06 | A | V1R-90 | count: 101; first: CM-4215; last: CM-4315 |
| retired:P75:vc_today_1800 | vendor_credit | ZZT-VC-P75 | 638fc80e-98c3-4f53-8227-ebf7266614b9 | 9 | 2026-11-11 | A | - | _why: dated 18:00Z today = future until 18:00Z; cannot be voided through the API; will appear on the report after 18:00Z on 11 Nov 2026 |
| retired:R74:cm_today_1800 | credit_memo | CM11315-4213 | 7f5d9eca-fd08-46d6-a253-fe877550be06 | 8 | 2026-11-11 | A | - | voided_now: True; _why: dated 18:00Z today = in the future until 18:00Z; voided and replaced |

## Also created while finding the payloads (no case uses them)

- Customer "ZZAUTOTEST AR Probe" (2b6ff852-1a2e-4f61-8bbb-5316e417a773), its contact and vehicle; work order S-17832 (set to
  Complete with no line), work order S-17833 (estimate, one $100.00 line).
- Purchase order I-1560 for ZZAUTOTEST AP P12 (its bill is the ledger's doc:P12:billD).

## Records the app would not let us create (reported as BLOCKED, with the rungs tried)

- An invoice with no due date (V1R-25), a bill with no due date (V1R-26): the due date is always computed.
- An overpaid bill (V1R-27): "Vendor transaction cannot be overpaid." An overpaid invoice (V1R-76): "Transaction cannot be overpaid."

## Payload facts for the next rebuild (from the code at 8e35ee0d02, then proved live)

- Invoice: `POST /api/invoices/create {{work_order_id, created_on}}`; due date = created_on + the customer's credit term.
  Exact amounts: a line with `labour_type_id` + `fixed_price` (string), the work order's tax set to "Exempt"
  (`POST /api/work-orders/{{id}}/tax`), and shop supplies set to 0. At location B the line uses `fixed_line_total` + labour/parts parts (no labour type).
- Credit term: `POST /api/customers/change` works ONLY with the full CustomerDialog payload including the `tax` block; without it, 500.
- Credit memo: `POST /api/credit-memos` with `origin_date`; the response key is `creditMemoId`.
- Free deposit: what the app makes from an overpayment (pay an invoice plus the extra, dated payment_date). It cannot be
  reversed on its own ("refund it or apply it"), and the refund route is switched off (SV-9904); reversing the payment
  that made it ends it now.
- A document dated TODAY must have a time already past (the as-of instant for today is now). Two "today" credits made
  at 18:00Z were retired: the credit memo was voided; the vendor credit cannot be voided and appears on the reports
  after 18:00Z on 11 Nov 2026 (ledger `retired:*`).
- Bill: `POST /api/inventory/orders/create` (each item needs id/is_core/part_number/quantity/price/description), then
  `POST /api/inventory/orders/accept` with key `id` and `invoice_date` as `Y-m-d\TH:i:s.v\Z`.
- Back-dated vendor credit: a manual return (`POST /api/part/manual-return-request/create`, then
  `POST /api/part/manual-return/{{id}}/create` with `creditDate`). `vendor/credit/create` has no date field.
