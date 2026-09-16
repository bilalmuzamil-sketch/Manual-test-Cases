# Global Search — source-verify of two more folders (Quick Actions 6774, V1 Regression derived 8056), 2026-09-16

**Order (QA lead):** also source-verify "Quick Actions on Hover (v1)" (6774) and "Global Search V2 - V1
Regression (derived from V1 automated tests)" (8056); add them to the run; hand off for build verification.

## 6774 — Quick Actions on Hover (v1): 8 cases (C44866–C44873), all created_by=3, atm=1
- **Source = PRD §5.4** (Global Search v1.5, 576978945). PRD unchanged since the 2026-09-09 verify.
- Content re-verified: each case follows PRD §5.4 (quick actions shown per entity: WO → Add new line;
  Customer → New work order/New contact; Asset → New work order + history/invoices; Part → View part
  history only; Vendor → Add contact; Part Sale → Add part; PO → Receive; Vendor Invoice → none) and
  already DISCLOSES the epic conflict. **Re-stamped read-date → 16 September 2026.** fr-view verified.
- **🛑 LIVE SPEC-vs-TICKET CONFLICT (carry to build-verify):** PRD §5.4 (v1.5) lists quick actions in v1,
  but epic story **SV-9173 is OBSOLETE / "later release"** (updated 2026-09-10). Per Rule 57 the PRD is the
  authority and the cases stand; per the epic the feature is deferred, so **quick actions may not be built**.
  All 8 carry `AUTOMATION: Not available on Build to test Yet`, which correctly parks them until a build
  exists. PO decision item.

## 8056 — V1 Regression (derived from V1 automated tests): 1 case (C55684), created_by=3, atm=1
- **Rule 109 parity case — V1 CODE is the specification, NEVER the PRD.** Source: ShopView product repo at
  commit **55767168**, `useGlobalSearch.ts:286-299` + V1's own automated test ("drops the previous location
  rows while the re-fetch is in flight"). Its provenance explicitly states the V2 requirements are context
  only, never the authority (Rule 109).
- **Already source-verified (V1-based) AND build-checked** by the parity lane: marker
  `AUTOMATION: READY - Last checked against the V2 QA branch sv9160 on 15/9/2026`. Confirmed from committed
  evidence (Rule 86); **not re-sourced against the PRD (Rule 109); left unchanged.**
- Note: the QA lead offered V1 = production (app.shopview.com) for observing V1 behaviour. Not used —
  production is not a test environment and the case is already sourced to the V1 code commit; any future V1
  check there would be read-only. Credentials were NOT stored, logged or committed (Rule 82).

## Run membership
Both folders' cases are **already in run R415** (verified live: R415 holds C55684 and C44866–C44873). No
add needed — "part of the run" is satisfied.

**⇒ Both folders source-verified. 6774 ready for build-verify (parked until quick actions are built); 8056
already build-checked on sv9160.**
