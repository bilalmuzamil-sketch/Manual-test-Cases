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
