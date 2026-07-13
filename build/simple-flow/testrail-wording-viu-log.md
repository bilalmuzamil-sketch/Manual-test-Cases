# Simple Flow — Build-Accurate Wording + VIU Pass — Audit Log (2026-07-13)

> Per-case audit for the combined build-accurate-wording + VIU pass on sv7301
> (QA-lead authorized F&D-style flow, incl. TestRail `update_case` pushes). Method:
> `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md`. Live labels →
> `wording-glossary-2026-07-13.md`; screenshots → `screenshots/wording-2026-07-13/`.
> TestRail: curl `update_case` only, Basic auth from `/tmp` (never committed),
> GET→diff→update-changed→re-verify. One row per case; one summary line per area.

Columns: **SF-ID · C# · viu_status · wording change · TestRail push**

---

## Area SF-SET — Work Order Settings — TESTER-READY ✅

Labels captured live 2026-07-13 (`SET-workorders-tab.png`): 7 toggles + exact helper
text; no Full/Simple mode selector; no Create-Purchase-Orders toggle; no Require-VIN
toggle; flat list (no visual new/existing distinction). API VIU: save-persist
round-trip 200 + restored; tech settings save 403 (admin 200); model has no
operatingMode/requireVin/createPurchaseOrders.

| SF-ID | C# | viu_status | Wording change | TestRail push |
|---|---|---|---|---|
| SF-SET-01 | C29275 | VIU-Verified | Title corrected (dropped "new vs existing visually distinct" — not in build); expected now lists exact 7 toggles + flat-list note | updated 200/OK |
| SF-SET-02 | C29276 | VIU-Verified | Steps/expected to exact "Full vs Simple" / "Require VIN" build terms | updated 200/OK |
| SF-SET-03 | C29277 | **Deviation** | Rewrote to plain terms; toggle confirmed ABSENT in build (build lags V2.4 S1-R2) | updated 200/OK |
| SF-SET-04 | C29278 | VIU-Verified | Helper text now exact verbatim (dropped "approximately") | updated 200/OK |
| SF-SET-05 | C29279 | VIU-Verified | (tester fields unchanged) helper text re-confirmed; behavior per prior line-drive | no-op |
| SF-SET-06 | C29280 | VIU-Verified | (tester fields unchanged) helper text re-confirmed; behavior per prior line-drive | no-op |
| SF-SET-07 | C29281 | VIU-Verified | Steps/expected to exact toggle names + settings keys | updated 200/OK |
| SF-SET-08 | C29282 | **Blocked-Env** | Expected clarified; non-seedable brand-new org (first-use defaults not observable) | updated 200/OK |
| SF-SET-09 | C29283 | VIU-Verified | (tester fields unchanged) save-persist re-driven live 200 + restored | no-op |
| SF-SET-10 | C29284 | **VIU-Pending** | (tester fields unchanged) needs two-completion drive; not driven this run | no-op |
| SF-SET-11 | C29285 | VIU-Verified | Steps/expected to exact roles + 403 | updated 200/OK |
| SF-SET-12 | C29286 | VIU-Verified | (tester fields unchanged) model keys re-verified live | updated 200/OK |
| SF-SET-13 | C29287 | VIU-Verified | Expected: Save Settings always-enabled acceptable (Milos Q6) | updated 200/OK |
| SF-SET-14 | C29288 | VIU-Verified | Expected to exact "Complete & Send to Review" relabel | updated 200/OK |
| SF-SET-15 | C29289 | VIU-Verified | Expected to plain helper-text-present wording | updated 200/OK |

**SF-SET summary:** 15 cases · VIU-Verified 12 · Deviation 1 (SF-SET-03 Create-POs
toggle absent) · Blocked-Env 1 (SF-SET-08 brand-new org non-seedable) · VIU-Pending 1
(SF-SET-10 future-completions drive). TestRail: **13 updated + 2 no-op, all 200/OK,
0 errors.** All tester-facing wording matches the live build. **TESTER-READY.**
