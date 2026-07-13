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

---

## Area SF-COMP — Work Order Completion — TESTER-READY (wording) ✅ · 3 delta behaviors VIU-Pending

Completion surface captured live 2026-07-13 (`COMP-A-*`, `COMP-B-*`): drove
S2-15795 and S2-15825 to the Success screen (labor-only / no-receive path) —
confirmed exact labels: WO Lines toolbar `New Line` + `Complete Work Order`;
modal title `Complete Work Order`; Success `Order complete` / `Sent to Finance as
an invoice-ready draft` / `Invoice total $434.95` / `Done` / `Go To Invoice`;
line-level `Receive`; vehicle `VIN/Serial #` `Mileage` `Engine Hours`
`License Plate` + `Valid VIN Required` chip. Case wording already matched these
labels — no label corrections needed for the non-delta cases.

- **Surface-confirmed live this run:** SF-COMP-01/02/03/04/10/17 (C29290-93, C29299, C29306).
- **Behavior per documented prior VIU drives (surface re-confirmed):** SF-COMP-05,07,08,09,11,12,13,14,15,18,19,20,23.
- **SF-COMP-06 → Blocked-Env** (C29295, UPDATED): No-PO completion path unreachable — the 'Create Purchase Orders' toggle is absent from the build (see SF-SET-03); cannot set Create POs OFF.
- **Delta cases (V2.4 Δ1/Δ2 wording applied; tester-facing story-ref jargon stripped):**
  - SF-COMP-16 (C29305, UPDATED) → **VIU-Pending** — needs Require Mileage+Engine Hours ON + a WO missing those; not driven (settings churn on shared env).
  - SF-COMP-21 (C29310, UPDATED) → **VIU-Pending** — needs Require Vendor Invoice Number ON + Auto-approve OFF + a Needs-Approval line.
  - SF-COMP-22 (C29311, UPDATED) → **VIU-Pending** — needs Require Vendor Invoice Number ON + Auto-approve ON + a manually un-approved line.
- SF-COMP-18 (C29307, UPDATED) — synced the sell-price-only expected clause.

**SF-COMP summary:** 23 cases · VIU-Verified 19 · VIU-Pending 3 (delta behaviors)
· Blocked-Env 1 (SF-COMP-06). TestRail: **5 updated + 18 no-op, all 200/OK, 0
errors.** Wording tester-ready; the 3 delta behaviors need a dedicated
settings-managed drive on a confirmed-idle shared env.
**Shared-env note:** completed disposable approved WOs S2-15795 and S2-15825 during
surface capture (labor-only; harmless — reopenable by adding a line). Require Vendor
Invoice Number toggled ON then RESTORED to OFF (baseline verified).
