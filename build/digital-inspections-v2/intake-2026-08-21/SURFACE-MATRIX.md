# Surface Matrix — Digital Inspections V2 (Rule 40)

Mostly on-screen Vue/Quasar UI (template builder desktop, inspection filling desktop+phone, asset
Inspections tab, work-order note/Lines tab) plus one customer-facing **PDF report** (S13). No CSV export.
No API-only content a tester couldn't reach (Rule 4 not triggered; the ShopCoach brief is verified via
its stated contract, not as an endpoint payload). ShopCoach gating (present/absent) is a cross-cutting surface.

| Story / area | Builder (desktop) | Fill desktop | Fill phone | Asset tab | WO note/Lines | PDF report | ShopCoach gate |
|---|---|---|---|---|---|---|---|
| S1 note required | ✅ authoring | ✅ enforce | ✅ (S14) | — | — | — | — |
| S17 photo required | ✅ authoring | ✅ enforce | ✅ | — | — | — | — |
| S8 per-axle | ✅ authoring | ✅ fill | ✅ (S14/DINV-PHONE) | — | — | ✅ output (S8-R24) | — |
| S11 reference file | ✅ upload | ✅ open | ✅ full-screen | — | — | — | — |
| S2 turn-to-lines | — | ✅ | ✅ (S3-R3) | ✅ (S6) | ✅ (S4) | — | ✅ required (S2-R0) |
| S3/S4/S6 entry points | — | ✅ S3 | ✅ | ✅ S6 | ✅ S4 | — | ✅ absent w/o SC |
| S7 provenance | — | — | — | — | ✅ note+Audit Log | — | — |
| S15 ShopCoach drafting | — | ✅ panel | ✅ | ✅ | ✅ Lines tab | — | ✅ the whole story |
| S5 asset history | — | — | — | ✅ (4) | link to WO | link to report | ✅ action-gated |
| S12 template builder | ✅ (5) | — | — | — | — | — | — |
| S13 report | — | — | — | — | — | ✅ (2) | — |
| S14 phone filling | — | — | ✅ (2) | (tab phone in S5) | — | — | — |

**N/A with reason:** CSV/email export — none in this epic. Non-inspection Line Builder (WO with no inspection) — out of scope (S15-N5). Native mobile app — the phone flow is responsive web (S14).
