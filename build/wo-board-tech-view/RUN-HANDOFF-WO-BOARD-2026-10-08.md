# Run hand-off — WO Board / Tech View — 8 Oct 2026 (build sv10043 v26.40.8-7a95011)

Suite: TestRail group 13204 (feature, 170 ours + 18 Vladimir's) and 47109 (regression, 83). Run 498 (253 tests; Vladimir's 18 not in the run).
**Ready for testers:** 225 READY cases (feature 158 + regression 62 + … see live markers). **Not ready:** 28 HOLD with plain reasons.

## Before testing
- Sign in with the Admin quick-login button; a second user (where a case needs one) is invited and accepts the invitation (QA lead, 8 Oct).
- Each case builds its own data with its own "ZZAUTOTEST …" customer — run them in any order.
- Expected results are the documents' words. Where the build differs, the case says "What you should see today" and what to mark.

## Known build differences (mark as the case says)
- No clear-shifts question when the lead changes, even with a whole-work-order shift (feature C96965, C154888, C154889, C368133–C368136).
- Blocked, not Failed (developer: not in this release): C368160, C368162, C368164.
- No-match wording C96918; regression: C368165, C368181, C368204, C368211, C368216, C368221, C368233–C368236, C368242.

## Test data left on the site (all tagged ZZAUTOTEST)
Customer "ZZAUTOTEST Fibridge Commercial" (contact, assets TRK-118, 1999 Ford Explorer); customer "ZZAUTOTEST Regression Walk" (assets RW-1, RW-2,
work orders S10043-17582…17593 — 17586 Paid, 17587 Invoiced, 17592 at Lethbridge); part sale P10043-248; technicians ZZAUTOTEST Cal Charlie, Dan Delta,
Ezra Echo; users Vera Viewonly, Nate Nofinance; roles "ZZAUTOTEST WO View Only", "ZZAUTOTEST No Financial"; Dan Delta photo; two shifts on 9 Oct on
S10043-17588 (Dan Delta 9 AM, Ezra Echo 1 PM). Changed: "Set working hours for this technician" on for ZZAUTOTEST Ana Alpha / Ben Bravo; Admin ShopView
has a 0.07 h timesheet entry on S10043-17584. Restored: Admin's Work Orders view, Parts/report filters, location, leads on S2-14294 / S2-13556.
