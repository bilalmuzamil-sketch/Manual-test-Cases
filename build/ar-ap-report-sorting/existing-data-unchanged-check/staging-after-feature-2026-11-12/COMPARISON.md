# Staging before (06:46Z) vs after (13:44Z), as of 12 Nov 2026 — document level

## A/R Detail: before 1564 documents, after 1745
- same: 1545
- new after: ZZAUTOTEST party created after the snapshot (excluded): 141
- new after: other: 40
- CHECK: bucket moved: 18
- amount/balance differs: 6
- INTENDED: credit dated on the as-of date -> Current (S1-R5a): 1
### A/R — amount/balance differs (6)
  CM2-4524 | TestVT1 | -5657 | -17398 | -5657 | -5657 | 2026-10-21 14:05:54
  CM2-4526 | TestVT1 | -2500 | -19898 | -2500 | -2500 | 2026-10-21 14:06:55
  CM2-4404 | ZZAUTOTEST SV-9647 Credit Split BEFORE | -15496 | -30000 | -15496 | -15496 | 2026-09-22 00:00:00
  CM2-4353 | 4 Star Truck Repair | -15000 | -20000 | -15000 | -15000 | 2026-09-07 11:52:52
  CM2-4354 | 4 Star Truck Repair | -7000 | -20000 | -7000 | -7000 | 2026-09-07 11:55:40
  DEP2-4713 | 4 Star Truck Repair | -705112 | -1975083 | -705112 | -705112 | 2026-09-11 11:16:40
### A/R — CHECK: bucket moved (18)
  P3-2458 | E2E Credits Customer | days_1_to_30 | current | Invoice | 2026-11-11T19:01:37Z | 2026-11-11T19:01:37Z | 0
  P3-2459 | E2E Credits Customer | days_1_to_30 | current | Invoice | 2026-11-11T19:01:48Z | 2026-11-11T19:01:48Z | 0
  P3-2460 | E2E COD Customer | days_1_to_30 | current | Invoice | 2026-11-11T19:01:58Z | 2026-11-11T19:01:58Z | 0
  CM3-4538 | E2E Credits Customer | days_1_to_30 | current | Credit Memo | 2026-11-11T19:02:41Z | 2026-11-11T19:02:41Z | 0
  S3-39986 | E2E Credits Customer | days_1_to_30 | current | Invoice | 2026-11-11T19:02:49Z | 2026-11-11T19:02:49Z | 0
  S3-39987 | E2E Credits Customer | days_1_to_30 | current | Invoice | 2026-11-11T19:02:55Z | 2026-11-11T19:02:55Z | 0
  P3-2461 | E2E Credits Customer | days_1_to_30 | current | Invoice | 2026-11-11T19:59:56Z | 2026-11-11T19:59:56Z | 0
  P3-2462 | E2E Credits Customer | days_1_to_30 | current | Invoice | 2026-11-11T20:00:08Z | 2026-11-11T20:00:08Z | 0
  P3-2463 | E2E COD Customer | days_1_to_30 | current | Invoice | 2026-11-11T20:00:17Z | 2026-11-11T20:00:17Z | 0
  CM3-4539 | E2E Credits Customer | days_1_to_30 | current | Credit Memo | 2026-11-11T20:00:57Z | 2026-11-11T20:00:57Z | 0
  S3-40012 | E2E Credits Customer | days_1_to_30 | current | Invoice | 2026-11-11T20:01:06Z | 2026-11-11T20:01:06Z | 0
  S3-40013 | E2E Credits Customer | days_1_to_30 | current | Invoice | 2026-11-11T20:01:11Z | 2026-11-11T20:01:11Z | 0
  S2-17154 | Desert Edge Truck Service & Repair | days_31_to_60 | days_1_to_30 | Invoice | 2026-08-28T21:56:39Z | 2026-10-12T21:56:39Z | 30
  S2-16836 | Desert Edge Truck Service & Repair | days_61_to_90 | days_31_to_60 | Invoice | 2026-07-29T19:47:26Z | 2026-09-12T19:47:26Z | 60
  S3-17149 | Tucson Truck Center | days_61_to_90 | days_31_to_60 | Invoice | 2026-08-13T22:01:06Z | 2026-09-12T22:01:06Z | 60
  S3-17238 | Tucson Truck Center | days_61_to_90 | days_31_to_60 | Invoice | 2026-08-13T22:02:13Z | 2026-09-12T22:02:13Z | 60
  S3-17147 | Tucson Truck Center | days_61_to_90 | days_31_to_60 | Invoice | 2026-08-13T22:57:01Z | 2026-09-12T22:57:01Z | 60
  S3-17148 | Tucson Truck Center | days_61_to_90 | days_31_to_60 | Invoice | 2026-08-13T22:58:28Z | 2026-09-12T22:58:28Z | 60
### A/R — INTENDED: credit dated on the as-of date -> Current (S1-R5a) (1)
  CM2-4541 | ZZAUTOTEST SV11315 Staging CM | days_1_to_30 | current | Credit Memo | 2026-11-12T06:38:47Z | 2026-11-12T06:38:47Z | 0
### A/R — new after: other (40)
  CM3-4545 | E2E Credits Customer | current | -19500 | 2026-11-12T07:17:51Z | Credit Memo
  CM3-4657 | E2E Credits Customer | current | -19500 | 2026-11-12T08:05:22Z | Credit Memo
  CM3-4658 | E2E Credits Customer | current | -19500 | 2026-11-12T10:41:55Z | Credit Memo
  P3-2465 | E2E Credits Customer | current | 15225 | 2026-11-12T07:16:43Z | Invoice
  P3-2466 | E2E Credits Customer | current | 20475 | 2026-11-12T07:16:53Z | Invoice
  P3-2467 | E2E COD Customer | current | 20475 | 2026-11-12T07:17:04Z | Invoice
  P3-2468 | E2E Credits Customer | current | 15225 | 2026-11-12T08:04:12Z | Invoice
  P3-2469 | E2E Credits Customer | current | 20475 | 2026-11-12T08:04:25Z | Invoice
  P3-2470 | E2E COD Customer | current | 20475 | 2026-11-12T08:04:37Z | Invoice
  P3-2471 | E2E Credits Customer | current | 15225 | 2026-11-12T10:40:40Z | Invoice
  P3-2472 | E2E Credits Customer | current | 20475 | 2026-11-12T10:40:52Z | Invoice
  P3-2473 | E2E COD Customer | current | 20475 | 2026-11-12T10:41:05Z | Invoice
  S2-40179 | TG pay fixture (delete me) | current | 20067 | 2026-11-12T12:32:15Z | Invoice
  S3-40048 | E2E Term Customer | current | 37117 | 2026-11-12T07:16:19Z | Invoice
  S3-40058 | E2E Term Customer | current | 18558 | 2026-11-12T07:17:18Z | Invoice
  S3-40063 | E2E Credits Customer | current | 18558 | 2026-11-12T07:18:00Z | Invoice
  S3-40065 | E2E Credits Customer | current | 18558 | 2026-11-12T07:18:07Z | Invoice
  S3-40068 | TestVT1 | current | 37117 | 2026-11-12T07:18:53Z | Invoice
  S3-40069 | TestVT1 | current | 18558 | 2026-11-12T07:19:00Z | Invoice
  S3-40071 | TestVT1 | current | 55674 | 2026-11-12T07:19:07Z | Invoice
  S3-40073 | TestVT1 | current | 27838 | 2026-11-12T07:19:13Z | Invoice
  S3-40074 | TestVT1 | current | 46396 | 2026-11-12T07:19:20Z | Invoice
  S3-40117 | E2E Term Customer | current | 37117 | 2026-11-12T08:03:51Z | Invoice
  S3-40124 | E2E Term Customer | current | 18558 | 2026-11-12T08:04:52Z | Invoice
  S3-40127 | E2E Credits Customer | current | 18558 | 2026-11-12T08:05:32Z | Invoice
  S3-40128 | E2E Credits Customer | current | 18558 | 2026-11-12T08:05:38Z | Invoice
  S3-40129 | TestVT1 | current | 37117 | 2026-11-12T08:06:28Z | Invoice
  S3-40130 | TestVT1 | current | 18558 | 2026-11-12T08:06:35Z | Invoice
  S3-40131 | TestVT1 | current | 55674 | 2026-11-12T08:06:42Z | Invoice
  S3-40132 | TestVT1 | current | 27838 | 2026-11-12T08:06:49Z | Invoice
  S3-40133 | TestVT1 | current | 46396 | 2026-11-12T08:06:55Z | Invoice
  S3-40159 | E2E Term Customer | current | 37117 | 2026-11-12T10:40:16Z | Invoice
  S3-40166 | E2E Term Customer | current | 18558 | 2026-11-12T10:41:20Z | Invoice
  S3-40169 | E2E Credits Customer | current | 18558 | 2026-11-12T10:42:04Z | Invoice
  S3-40170 | E2E Credits Customer | current | 18558 | 2026-11-12T10:42:09Z | Invoice
  S3-40171 | TestVT1 | current | 37117 | 2026-11-12T10:42:52Z | Invoice
  S3-40172 | TestVT1 | current | 18558 | 2026-11-12T10:42:58Z | Invoice
  S3-40173 | TestVT1 | current | 55674 | 2026-11-12T10:43:04Z | Invoice
  S3-40174 | TestVT1 | current | 27838 | 2026-11-12T10:43:10Z | Invoice
  S3-40175 | TestVT1 | current | 46396 | 2026-11-12T10:43:16Z | Invoice
## A/P Detail: before 14663 documents, after 14712
- same: 14631
- new after: other: 27
- new after: ZZAUTOTEST party created after the snapshot (excluded): 25
- missing after: 3
- INTENDED: credit dated on the as-of date -> Current (S1-R5a): 1
### A/P — missing after (3)
  E2E-P8197vr | 4Refuel | current | 100 | 2026-10-14 11:35:02
  E2E-INV-1794217548388 | 4Refuel | current | 100 | 2026-11-09 09:45:48
  E2E-Pitcq2q | 4Refuel | days31to60 | 100 | 2026-09-01 15:19:52
### A/P — INTENDED: credit dated on the as-of date -> Current (S1-R5a) (1)
  C-13911 | ZZAUTOTEST SV11315 Staging VC | days_1_to_30 | current | Vendor Credit | 2026-11-12T06:29:54Z | 2026-11-12T06:29:54Z | 0
### A/P — new after: other (27)
  E2E-INV-1794467800262 | 4Refuel | current | 5000 | 2026-11-12T07:16:40Z | Invoice
  E2E-INV-1794467801436 | 4Refuel | current | 3000 | 2026-11-12T07:16:41Z | Invoice
  E2E-INV-1794467811218 | 4Refuel | current | 10000 | 2026-11-12T07:16:51Z | Invoice
  E2E-INV-1794467812219 | 4Refuel | current | 3000 | 2026-11-12T07:16:52Z | Invoice
  E2E-INV-1794467821560 | 4Refuel | current | 10000 | 2026-11-12T07:17:01Z | Invoice
  E2E-INV-1794467823217 | 4Refuel | current | 3000 | 2026-11-12T07:17:03Z | Invoice
  E2E-INV-1794467845333 | ZZAUTOTEST Staged Parts Vendor | current | 5000 | 2026-11-12T07:17:25Z | Invoice
  E2E-INV-1794467846320 | ZZAUTOTEST Staged Parts Vendor | current | 3000 | 2026-11-12T07:17:26Z | Invoice
  E2E-INV-1794470649205 | 4Refuel | current | 5000 | 2026-11-12T08:04:09Z | Invoice
  E2E-INV-1794470650317 | 4Refuel | current | 3000 | 2026-11-12T08:04:10Z | Invoice
  E2E-INV-1794470662644 | 4Refuel | current | 10000 | 2026-11-12T08:04:22Z | Invoice
  E2E-INV-1794470663610 | 4Refuel | current | 3000 | 2026-11-12T08:04:23Z | Invoice
  E2E-INV-1794470675018 | 4Refuel | current | 10000 | 2026-11-12T08:04:35Z | Invoice
  E2E-INV-1794470676045 | 4Refuel | current | 3000 | 2026-11-12T08:04:36Z | Invoice
  E2E-INV-1794470698356 | ZZAUTOTEST Staged Parts Vendor | current | 5000 | 2026-11-12T08:04:58Z | Invoice
  E2E-INV-1794470699370 | ZZAUTOTEST Staged Parts Vendor | current | 3000 | 2026-11-12T08:04:59Z | Invoice
  E2E-INV-1794480037095 | 4Refuel | current | 5000 | 2026-11-12T10:40:37Z | Invoice
  E2E-INV-1794480038618 | 4Refuel | current | 3000 | 2026-11-12T10:40:38Z | Invoice
  E2E-INV-1794480049286 | 4Refuel | current | 10000 | 2026-11-12T10:40:49Z | Invoice
  E2E-INV-1794480050318 | 4Refuel | current | 3000 | 2026-11-12T10:40:50Z | Invoice
  E2E-INV-1794480062357 | 4Refuel | current | 10000 | 2026-11-12T10:41:02Z | Invoice
  E2E-INV-1794480063363 | 4Refuel | current | 3000 | 2026-11-12T10:41:03Z | Invoice
  E2E-INV-1794480091363 | ZZAUTOTEST Staged Parts Vendor | current | 5000 | 2026-11-12T10:41:31Z | Invoice
  E2E-INV-1794480092669 | ZZAUTOTEST Staged Parts Vendor | current | 3000 | 2026-11-12T10:41:32Z | Invoice
  E2E-Pd7u3m2 | 4Refuel | current | 10000 | 2026-11-12T07:17:47Z | Invoice
  E2E-Pd9j6x0 | 4Refuel | current | 10000 | 2026-11-12T08:05:17Z | Invoice
  E2E-Pdf4isb | 4Refuel | current | 10000 | 2026-11-12T10:41:51Z | Invoice
