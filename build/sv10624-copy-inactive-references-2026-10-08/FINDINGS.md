# SV-10624 — copied invoices/bills with inactive references (8 Oct 2026) — STOPPED, NOT POSTED

**Stopped by instruction:** QA lead, 8 Oct 2026, relaying Stefan Mitrovic (engineering manager): *"we don't need anyone testing Accounting tickets for now, because that is more or less MVP for now and it's not being released to everyone, so until we finish with MVP it will be like this."* Nothing was posted on SV-10624; production was not touched.

**Where it stood:**
- Branch sv10360, build `v26.40.8-e20f5ff`; core PR ShopView/shopview#3498 (head `151fedabe`) is in the build (40 ahead / 0 behind); accounting PR ShopView/shopview-accounting#69 (head `beaeba1c1`, open) deployed with it. Fix = option (a): reject inactive references on create, show them by name as "(inactive)" on the copy.
- Product question on the PRD (footer comment 900071430, 29 Sep, a vs b) is **unanswered**. PRD v7 S4-E1: *"An unavailable customer or account must be corrected using normal creation validation before saving"* supports (a) for customers; silent on tax codes and locations.
- Verified so far: copying source invoice M-1002 with everything active prefilled every field by name and saved as M-1003 (C0.json).
- Set-up on sv10360 (left in place, no cleanup needed): ZZAUTOTEST SV-10624 Customer / Vendor / Tax (deactivated), ZZAUTOTEST SV-10624 Location (workplace `bc33ae57…`, still ACTIVE — ShopView refused to delete it: "Workplace is being used by a Staff enrollment."), source invoices M-1001, M-1002, copy M-1003, bill ZZ10624-BILL-1.
- Not tested: the copy with inactive references, the save refusals, bills, production before.
