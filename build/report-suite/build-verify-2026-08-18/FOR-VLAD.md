# AUTOMATED CASES CHANGED — FOR VLAD (Vladimir Tomovic, id 1)

Build-verify pass 2026-08-18, Sales By Customer (Report Suite, group 4281), build **v3.8-2bf8d14**.
These are cases flagged **Automated** (`custom_atmstatus = 3`) that this pass edited. All are
`created_by = 3` (ours) but Automated-flagged, so per Standing Rule 65/71 they are reported here.
Coupled edit+build-verify was authorised for this pass. `custom_atmstatus = 3` confirmed LIVE per case.

| C-id | link | atm (live) | what changed (plain) | affects an automated assertion? |
|---|---|---|---|---|
| C30107 | https://shopview.testrail.io/index.php?/cases/view/30107 | 3 | Product Type multi-select. Marker `READY - EXPECT FAIL (SV-9074)` → `READY`; removed the known-failure/three-outcome note. SV-9074 is now **QA Complete** and the build behaves correctly (both toggles on by default, Clear all present) — no live ticket backs an expect-fail (§15.1). Numbered expectations unchanged. | No — expected behaviour unchanged; only the failure-prediction note removed. Build now matches the case. |
| C30114 | https://shopview.testrail.io/index.php?/cases/view/30114 | 3 | Customer pinned control (All customers / Clear all). Marker `READY - EXPECT FAIL (SV-8991)` → `READY`; removed the known-failure note. SV-8991 is **OBSOLETE**. Numbered expectations unchanged. | No — expectation unchanged; only the prediction note removed. |
| C30121 | https://shopview.testrail.io/index.php?/cases/view/30121 | 3 | Customer summary row / invoice count. Metadata only: added the build-check provenance sentence "Last checked against build v3.8-2bf8d14 on 8/18/2026." Marker stays `READY`. Testable content byte-identical. | No — metadata refresh only. |
| C30123 | https://shopview.testrail.io/index.php?/cases/view/30123 | 3 | Expand-customer / asset rows. Metadata only: added the build-check provenance sentence. Marker stays `READY`. Testable content byte-identical. | No — metadata refresh only. |

**NOT touched:** C30138 (Automated, invoice-number link) — deliberately left unchanged this pass
because the invoice-number link-vs-plain-text behaviour is an **open PO question** (the build shows a
`text_sbc_invoice_<id>` element, suggesting plain text; the spec states both link and plain-text). See
FINDINGS.md. C30138 keeps its existing `AUTOMATION: READY` marker; not re-stamped.

---

# Sales By Representative (SBR) — build-verify 2026-08-18, build v3.8-bd246fd

**AUTOMATED SBR cases changed by this pass: NONE.**

All 4 SBR cases flagged Automated (`custom_atmstatus = 3`) were **HELD, verified live, and NOT
written** (per this pass's instruction + Standing Rule 71 ask-first): C30217, C30221, C30262, C30314.
They are recorded with their live verdict and intended change in `SBR-HELD-AUTOMATED.md` for the QA
lead's ask-first ratification. `custom_atmstatus = 3` confirmed live per case; all 4 byte-unchanged
(updated_on identical to pre-pass).

The 51 SBR cases this pass DID write are all `custom_atmstatus = 1` (Not Automated) — nothing an
automated suite runs against changed.

---

# Parts Velocity (PV) — build-verify 2026-08-18, build v3.8-bd246fd

**AUTOMATED PV cases changed by this pass: NONE.**

All 8 PV cases flagged Automated (`custom_atmstatus = 3`) were **HELD, verified live, and NOT written**
(per this pass's instruction + Standing Rule 71 ask-first): C30326, C30328, C30333, C30338, C30346,
C30352, C30353, C30390. They are recorded with their live verdict and intended change in
`PV-HELD-AUTOMATED.md` for the QA lead's ask-first ratification. `custom_atmstatus = 3` confirmed live per
case; all 8 byte-unchanged (updated_on identical to pre-pass).

**Intended changes awaiting ratification (would affect what an automated run concludes):**
- C30346, C30353 → lift `Not available on Build to test Yet` → `AUTOMATION: READY` (features now built).
- C30352 → strip stale `EXPECT FAIL (SV-8938)` → `AUTOMATION: READY` (ticket OBSOLETE; but Location
  position is an open PO question — confirm first).
- C30328 → **needs review, do NOT auto-lift** — possible "All types" vs "Both" label + single- vs
  multi-select deviation (a `READY - EXPECT FAIL` candidate).

The 26 PV cases this pass DID write are all `custom_atmstatus = 1` (Not Automated) — nothing an automated
suite runs against changed.

---

# Technician Utilization (TU) — build-verify 2026-08-18, build v3.8-bd246fd

**AUTOMATED TU cases changed by this pass: NONE.**

All 8 TU cases flagged Automated (`custom_atmstatus = 3`) were **HELD, verified live, and NOT written**
(per this pass's instruction + Standing Rule 71 ask-first): C30398, C30399, C30401, C30404, C30410,
C30424, C30429, C30449. They are recorded with their live verdict and intended change in
`TU-HELD-AUTOMATED.md` for the QA lead's ask-first ratification. `custom_atmstatus = 3` confirmed live per
case; all 8 byte-unchanged (never passed to the writer).

**Intended changes awaiting ratification (would affect what an automated run concludes):**
- **C30424** (TU-TECH-02) → strip stale `EXPECT FAIL (SV-8946)` → `AUTOMATION: READY` (SV-8946 OBSOLETE;
  deselect hides row + recalcs Summary — verified correct live).
- **C30429** (TU-LINK-02) → **needs review, do NOT auto-keep READY** — the Total Hours link feature is
  ABSENT from the build (TU-FINDINGS §F7), so this case asserts a feature that is not there; it likely
  should be `Not available on Build to test Yet`.

The other six (C30398 HOLD-valid, C30399, C30401, C30404, C30410, C30449) are correctly marked; only a
metadata build-check stamp was withheld.

The 42 TU cases this pass DID write are all `custom_atmstatus = 1` (Not Automated) — nothing an automated
suite runs against changed.
