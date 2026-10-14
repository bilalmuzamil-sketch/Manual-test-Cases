# PRD diff — Confluence 788430850 "Dashboard": our v42 copy (7 Oct 2026) vs version 44 (last modified 13 Oct 2026 18:37)

Old: `build/dashboards/sources/CONFLUENCE-788430850-Dashboard-v1-2026-10-07-v42.md`  
New: `build/dashboards/currency-2026-10-14/CONFLUENCE-788430850-2026-10-14.md`  
Method: script `prd_diff.py` — requirement codes extracted from `**S#-R#/N#/E#:**` bullets, whitespace and link-markup normalised; every other line diffed after the same normalisation.

**Counts:** 146 codes in v42, 149 in v44 — **3 added, 0 removed, 0 reworded, 146 identical.**

## Added (3)

  - **S4-R11a** — NEW: On Revenue and the count tiles, a bucket with no sales is a point at 0. Only a ratio tile's "-" (S3-E3) contributes no point.
  - **S8-N1a** — NEW: In the same case the table under the chart is hidden too, rather than shown with no rows.
  - **S8-R5a** — NEW: The table under the chart follows the same filter: it lists only the selected technicians, or only the selected advisor. With no advisor chosen it lists every advisor, as the chart does.

## Removed (0)

None.

## Reworded (0)

None.

## Other sections (Key Decisions, Terminology, Assumptions, context notes, tables, Change Log)

```diff
--- v42
+++ v44
@@ -3 +3,2 @@
-| Epic | SV-490 | | Owner | Chris Ward | | Demo Branch | https://sv8311.qa.shopview.com | | Design | https://claude.ai/artifact/Wae9DFQ8PJQBy8mbLsL5ge | # Dashboard v1 ## 1.
+| Epic | [SV-490](https://shopview.atlassian.net/browse/SV-490)
+| | Owner | Chris Ward | | Demo Branch | https://sv8311.qa.shopview.com | | Design | https://claude.ai/artifact/Wae9DFQ8PJQBy8mbLsL5ge | # Dashboard v1 ## 1.
@@ -78,2 +79,2 @@
-Design: https://sv8311.qa.shopview.com Jira:
-SV-9573 Prerequisites:
+Design: https://sv8311.qa.shopview.com Jira: [SV-9573](https://shopview.atlassian.net/browse/SV-9573)
+Prerequisites:
@@ -96,2 +97,2 @@
-Design: https://sv8311.qa.shopview.com Jira:
-SV-9574 Prerequisites:
+Design: https://sv8311.qa.shopview.com Jira: [SV-9574](https://shopview.atlassian.net/browse/SV-9574)
+Prerequisites:
@@ -105,2 +106,2 @@
-Jira:
-SV-9575 Prerequisites:
+Jira: [SV-9575](https://shopview.atlassian.net/browse/SV-9575)
+Prerequisites:
@@ -154,2 +155,2 @@
-Design: https://sv8311.qa.shopview.com Jira:
-SV-9576 Prerequisites:
+Design: https://sv8311.qa.shopview.com Jira: [SV-9576](https://shopview.atlassian.net/browse/SV-9576)
+Prerequisites:
@@ -168,2 +169,2 @@
-Design: https://sv8311.qa.shopview.com Jira:
-SV-9577 Prerequisites:
+Design: https://sv8311.qa.shopview.com Jira: [SV-9577](https://shopview.atlassian.net/browse/SV-9577)
+Prerequisites:
@@ -182,2 +183,2 @@
-Design: https://sv8311.qa.shopview.com Jira:
-SV-9578 Prerequisites:
+Design: https://sv8311.qa.shopview.com Jira: [SV-9578](https://shopview.atlassian.net/browse/SV-9578)
+Prerequisites:
@@ -193,2 +194,2 @@
-Design: https://sv8311.qa.shopview.com Jira:
-SV-9579 Prerequisites:
+Design: https://sv8311.qa.shopview.com Jira: [SV-9579](https://shopview.atlassian.net/browse/SV-9579)
+Prerequisites:
@@ -201,2 +202,2 @@
-Design: https://sv8311.qa.shopview.com Jira:
-SV-9580 Prerequisites:
+Design: https://sv8311.qa.shopview.com Jira: [SV-9580](https://shopview.atlassian.net/browse/SV-9580)
+Prerequisites:
@@ -210,2 +211,2 @@
-Design: https://sv8311.qa.shopview.com Jira:
-SV-9581 Prerequisites:
+Design: https://sv8311.qa.shopview.com Jira: [SV-9581](https://shopview.atlassian.net/browse/SV-9581)
+Prerequisites:
@@ -221,2 +222,2 @@
-Design: https://sv8311.qa.shopview.com Jira:
-SV-9582 Prerequisites:
+Design: https://sv8311.qa.shopview.com Jira: [SV-9582](https://shopview.atlassian.net/browse/SV-9582)
+Prerequisites:
@@ -241,2 +242,2 @@
-Design: https://sv8311.qa.shopview.com Jira:
-SV-9583 Prerequisites:
+Design: https://sv8311.qa.shopview.com Jira: [SV-9583](https://shopview.atlassian.net/browse/SV-9583)
+Prerequisites:
@@ -253,2 +254,2 @@
-Design: https://sv8311.qa.shopview.com Jira:
-SV-9584 Prerequisites:
+Design: https://sv8311.qa.shopview.com Jira: [SV-9584](https://shopview.atlassian.net/browse/SV-9584)
+Prerequisites:
```

## Identical codes (146)

S1-E1, S1-E2, S1-N1, S1-N2, S1-N5, S1-N6, S1-N7, S1-N8, S1-N9, S1-R1, S1-R2, S1-R3, S1-R4, S1-R5, S1-R6, S1-R7, S1-R8, S10-E1, S10-N1, S10-R1, S10-R2, S10-R3, S10-R4, S10-R5, S10-R6, S10-R7, S10-R8, S11-E1, S11-R1, S11-R2, S11-R2a, S11-R3, S11-R4, S11-R5, S11-R6, S11-R7, S12-N1, S12-R1, S12-R2, S12-R3, S12-R4, S12-R5, S2-N1, S2-N2, S2-N3, S2-N4, S2-N5, S2-R1, S2-R2, S2-R3, S2-R4, S3-E1, S3-E2, S3-E3, S3-N1, S3-R1, S3-R2, S4-E1, S4-E2, S4-E3, S4-N1, S4-N2, S4-R1, S4-R10, S4-R11, S4-R12, S4-R13, S4-R14, S4-R15, S4-R16, S4-R17, S4-R18, S4-R2, S4-R3, S4-R4, S4-R5, S4-R6, S4-R7, S4-R8, S4-R9, S5-E1, S5-E2, S5-E3, S5-N1, S5-N2, S5-R1, S5-R10, S5-R11, S5-R12, S5-R13, S5-R14, S5-R15, S5-R16, S5-R2, S5-R3, S5-R4, S5-R5, S5-R6, S5-R7, S5-R8, S5-R9, S6-E1, S6-E2, S6-E3, S6-N1, S6-N2, S6-R1, S6-R10, S6-R11, S6-R12, S6-R13, S6-R14, S6-R15, S6-R16, S6-R2, S6-R3, S6-R4, S6-R5, S6-R6, S6-R7, S6-R8, S6-R9, S7-E1, S7-R1, S7-R2, S7-R3, S7-R4, S7-R5, S7-R6, S7-R7, S7-R8, S8-N1, S8-R1, S8-R2, S8-R3, S8-R4, S8-R5, S8-R6, S9-R1, S9-R2, S9-R3, S9-R4, S9-R5, S9-R6, S9-R7, S9-R8
