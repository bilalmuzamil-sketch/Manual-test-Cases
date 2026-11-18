# C715471 / C715472 re-check after SV-12663 - staging, as of 12 Nov 2026, screen zone UTC

Data pulled 2026-11-18T15:26:15Z on build v26.45.5-b6a5d15 (same at the end).

## 1. PRD S1-R5a: Past Due = as-of date minus the due date shown, bucket agrees
### TODAY, timezone=UTC sent, dates read in UTC
- A/R Detail: 1760 documents, **0 wrong**
- A/P Detail: 14724 documents, **0 wrong**
- A/R Collection: 1609 documents, **0 wrong**
- A/P Unpaid: 14724 documents, **0 wrong**
  - no due date shown (Past Due None, Vendor Credit) - not a rule failure, counted only: 1320

## 2. Before the feature (12 Nov 06:46Z, old version) vs today, document by document
### A/R Detail: before 1564, today 1760
- matched: 1564
- new today (not in the before snapshot): 196
  - ('SMQ123-40382', 'ZZAUTOTEST One Location Customer') QB Location dated 2024-12-02 open 3300
  - ('S2-40067', 'ZZAUTOTEST AR R22 Bucket Edges') Staging Heavy Duty - 9919 dated 2026-08-02 open 1000
  - ('S2-40379', 'ZZAUTOTEST PDF Buckets Customer') Staging Heavy Duty - 9919 dated 2026-08-31 open 21000
  - ('CM2-4546', 'ZZAUTOTEST AR R23 Memo Aging') Staging Heavy Duty - 9919 dated 2026-09-16 open -1500
  - ('S2-40056', 'ZZAUTOTEST AR R15 Payment Reversed') Staging Heavy Duty - 9919 dated 2026-10-02 open 10000
  - ('S2-40052', 'ZZAUTOTEST AR R13 Payment After') Staging Heavy Duty - 9919 dated 2026-10-11 open 6000
- amount or open balance differs: 6
  - ('CM2-4524', 'TestVT1') amount -5657->-17398, open -5657->-5657
  - ('CM2-4526', 'TestVT1') amount -2500->-19898, open -2500->-2500
  - ('CM2-4404', 'ZZAUTOTEST SV-9647 Credit Split BEFORE') amount -15496->-30000, open -15496->-15496
  - ('CM2-4353', '4 Star Truck Repair') amount -15000->-20000, open -15000->-15000
  - ('CM2-4354', '4 Star Truck Repair') amount -7000->-20000, open -7000->-7000
  - ('DEP2-4713', '4 Star Truck Repair') amount -705112->-1975083, open -705112->-705112
- bucket moved - INTENDED (credit dated on the as-of date -> Current, PRD section 2): 1
  - ('CM2-4541', 'ZZAUTOTEST SV11315 Staging CM') days1to30->current Staging Heavy Duty - 9919 due 2026-11-12T06:38:47Z
### A/P Detail: before 14663, today 14724
- matched: 14632
- Past Due differs (-1) - NOT intended: 464
  - ('1133534', 'Willoughby Mechanical Services') 0->-1 Staging Heavy Duty - 9919
  - ('9654', 'Parts Authority') -2->-3 Staging Heavy Duty - 9919
  - ('fghfghfght', 'AC Truck Repair - Branford') -2->-3 Staging Heavy Duty - 9919
  - ('A-9658', 'Apex Truck & Trailer Repair') -3->-4 Staging Heavy Duty - 9919
  - ('12442555', 'AC Truck Repair - Branford') -14->-15 Staging Heavy Duty - 9919
  - ('ZZQA10301-2', 'ZZQA10301-B') -14->-15 Staging Heavy Duty - 9919
- new today (not in the before snapshot): 64
  - ('C-13913', 'ZZAUTOTEST AP P24 Credit Aging') Staging Heavy Duty - 9919 dated 2026-09-03 open -1200
  - ('ZZS35447846', 'ZZAUTOTEST PDF Buckets Vendor') Staging Heavy Duty - 9919 dated 2026-08-31 open 21000
  - ('ZZT-P52-BILL_LATE', 'ZZAUTOTEST AP P52 Netting') Staging Heavy Duty - 9919 dated 2026-09-03 open 30000
  - ('C-13914', 'ZZAUTOTEST AP P52 Netting') Staging Heavy Duty - 9919 dated 2026-10-08 open -2000
  - ('ZZS35440266', 'ZZAUTOTEST Special & "Quoted" \'Single\' <Less> Greater> Vendor Two PDF Blocks') Staging Heavy Duty - 9919 dated 2026-09-25 open 9000
  - ('ZZS35443542', 'ZZAUTOTEST Unpaid PDF Vendor B') Staging Heavy Duty - 9919 dated 2026-09-30 open 5500
- missing today: 3
  - ('E2E-P8197vr', '4Refuel') current 100
  - ('E2E-INV-1794217548388', '4Refuel') current 100
  - ('E2E-Pitcq2q', '4Refuel') days31to60 100
- amount or open balance differs: 2
  - ('055-541861', 'Stillwater Diesel Repair') amount 64336->64336, open 64338->64336
  - ('069-855902', 'Stillwater Diesel Repair') amount 429->429, open 431->429
- bucket moved - INTENDED (credit dated on the as-of date -> Current, PRD section 2): 1
  - ('C-13911', 'ZZAUTOTEST SV11315 Staging VC') days1to30->current Staging Heavy Duty - 9919 due 2026-11-12T06:29:54Z
- Past Due differs - INTENDED (credit dated on the as-of date -> 0): 1
  - ('C-13911', 'ZZAUTOTEST SV11315 Staging VC') 1->0 Staging Heavy Duty - 9919
### A/R Collection: before 1457, today 1609
- matched: 1457
- new today (not in the before snapshot): 152
  - ('CM3-4545',) Staging Lethbridge - 4310 dated 2026-11-12 open -19500
  - ('CM3-4657',) Staging Lethbridge - 4310 dated 2026-11-12 open -19500
  - ('CM3-4658',) Staging Lethbridge - 4310 dated 2026-11-12 open -19500
  - ('S3-40035',) Staging Lethbridge - 4310 dated 2026-11-07 open 3300
  - ('S2-40046',) Staging Heavy Duty - 9919 dated 2026-10-21 open 6000
  - ('CM2-4542',) Staging Heavy Duty - 9919 dated 2026-10-22 open -1500
- amount or open balance differs: 6
  - ('CM2-4404',) amount -15496->-30000, open -15496->-15496
  - ('CM2-4524',) amount -5657->-17398, open -5657->-5657
  - ('CM2-4526',) amount -2500->-19898, open -2500->-2500
  - ('CM2-4353',) amount -15000->-20000, open -15000->-15000
  - ('CM2-4354',) amount -7000->-20000, open -7000->-7000
  - ('DEP2-4713',) amount -705112->-1975083, open -705112->-705112
- Past Due differs - INTENDED (credit dated on the as-of date -> 0): 1
  - ('CM2-4541',) 1->0 Staging Heavy Duty - 9919
### A/P Unpaid: before 14663, today 14724
- matched: 14632
- Past Due differs (-1) - NOT intended: 464
  - ('ZZPV10282011', '123 Cannabis Forestlawn') -14->-15 DVI Test
  - ('E2E-INV-1791977645410', '4Refuel') 0->-1 Staging Lethbridge - 4310
  - ('E2E-INV-1791977646671', '4Refuel') 0->-1 Staging Lethbridge - 4310
  - ('E2E-INV-1791977654121', '4Refuel') 0->-1 Staging Lethbridge - 4310
  - ('E2E-INV-1791977655132', '4Refuel') 0->-1 Staging Lethbridge - 4310
  - ('E2E-INV-1791977662450', '4Refuel') 0->-1 Staging Lethbridge - 4310
- new today (not in the before snapshot): 64
  - ('P1-NEW-1', '1-1ABC-New-Vendor') Staging Heavy Duty - 9919 dated 2026-11-12 open 11200
  - ('SP-NEW-1-ABC-vendorP1', '1-1ABC-New-Vendor') Staging Heavy Duty - 9919 dated 2026-11-12 open 12320
  - ('E2E-INV-1794467800262', '4Refuel') Staging Lethbridge - 4310 dated 2026-11-12 open 5000
  - ('E2E-INV-1794467801436', '4Refuel') Staging Lethbridge - 4310 dated 2026-11-12 open 3000
  - ('E2E-INV-1794467811218', '4Refuel') Staging Lethbridge - 4310 dated 2026-11-12 open 10000
  - ('E2E-INV-1794467812219', '4Refuel') Staging Lethbridge - 4310 dated 2026-11-12 open 3000
- missing today: 3
  - ('E2E-Pitcq2q', '4Refuel') 4Refuel 100
  - ('E2E-P8197vr', '4Refuel') 4Refuel 100
  - ('E2E-INV-1794217548388', '4Refuel') 4Refuel 100
- amount or open balance differs: 2
  - ('069-855902', 'Stillwater Diesel Repair') amount 429->429, open 431->429
  - ('055-541861', 'Stillwater Diesel Repair') amount 64336->64336, open 64338->64336

## 3. Before vs today, Summary reports per customer / vendor
- A/R Summary: before 269 parties, today 306; only before 0, only today 37; same name, any column differs: 5
  - E2E Term Customer: current 367588->534613, total 4195183->4362208
  - E2E Credits Customer: current 0->159948, total 3660080->3820028
  - E2E COD Customer: current 0->61425, total 1474200->1535625
  - TestVT1: current 3020001->3576750, total 16169828->16726577
  - ZZAUTOTEST SV11315 Staging CM: current 0->-300, days1to30 -300->0
- A/P Summary: before 474 parties, today 496; only before 0, only today 22; same name, any column differs: 6
  - 4Refuel: current 720975->832975, days31to60 2159577->2149577, total 4845227->4947227
  - Butautas' Truck & Trailer Repair LLC: current 0->1050, total 3030287->3031337
  - Liberal Truck & Trailer Repair: current 0->500, total 818938->819438
  - Stillwater Diesel Repair: days61to90 779039->779037, days91Plus 8818685->8818683, total 10360018->10360014
  - ZZAUTOTEST Staged Parts Vendor: current 96000->120000, total 144000->168000
  - ZZAUTOTEST SV11315 Staging VC: current 0->-700, days1to30 -700->0
