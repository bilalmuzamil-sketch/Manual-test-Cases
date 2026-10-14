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

No difference in any non-code line after normalisation.

## Identical codes (146)

S1-E1, S1-E2, S1-N1, S1-N2, S1-N5, S1-N6, S1-N7, S1-N8, S1-N9, S1-R1, S1-R2, S1-R3, S1-R4, S1-R5, S1-R6, S1-R7, S1-R8, S10-E1, S10-N1, S10-R1, S10-R2, S10-R3, S10-R4, S10-R5, S10-R6, S10-R7, S10-R8, S11-E1, S11-R1, S11-R2, S11-R2a, S11-R3, S11-R4, S11-R5, S11-R6, S11-R7, S12-N1, S12-R1, S12-R2, S12-R3, S12-R4, S12-R5, S2-N1, S2-N2, S2-N3, S2-N4, S2-N5, S2-R1, S2-R2, S2-R3, S2-R4, S3-E1, S3-E2, S3-E3, S3-N1, S3-R1, S3-R2, S4-E1, S4-E2, S4-E3, S4-N1, S4-N2, S4-R1, S4-R10, S4-R11, S4-R12, S4-R13, S4-R14, S4-R15, S4-R16, S4-R17, S4-R18, S4-R2, S4-R3, S4-R4, S4-R5, S4-R6, S4-R7, S4-R8, S4-R9, S5-E1, S5-E2, S5-E3, S5-N1, S5-N2, S5-R1, S5-R10, S5-R11, S5-R12, S5-R13, S5-R14, S5-R15, S5-R16, S5-R2, S5-R3, S5-R4, S5-R5, S5-R6, S5-R7, S5-R8, S5-R9, S6-E1, S6-E2, S6-E3, S6-N1, S6-N2, S6-R1, S6-R10, S6-R11, S6-R12, S6-R13, S6-R14, S6-R15, S6-R16, S6-R2, S6-R3, S6-R4, S6-R5, S6-R6, S6-R7, S6-R8, S6-R9, S7-E1, S7-R1, S7-R2, S7-R3, S7-R4, S7-R5, S7-R6, S7-R7, S7-R8, S8-N1, S8-R1, S8-R2, S8-R3, S8-R4, S8-R5, S8-R6, S9-R1, S9-R2, S9-R3, S9-R4, S9-R5, S9-R6, S9-R7, S9-R8

## Version, Change Log and when each change was made

- **Our copy:** saved 7 Oct 2026 and recorded as **v42** in `PROJECT-STATE.md` (its own header line reads `version {}` —
  the integer was not captured in the file itself). **Now:** **version 44** (from the page metadata,
  `fetch` of `ari:cloud:confluence:19fdd96d-…:page/788430850`), last modified **13 Oct 2026 18:37**
  (Confluence "yesterday at 6:37 PM" read on 14 Oct), by Chris Ward. Two versions since our copy (v43, v44).
- **Change Log (§8):** an empty table (header + one blank row) — identical in v42 and v44. **No change is named in
  the Change Log**, so the dates below come from other sources. Older page versions cannot be opened with the tools.
- **S4-R11a** — not in our 7 Oct copy. Chris Ward, Jira SV-11076 comment 78401, **2026-10-09 10:39**: "I'm adding a
  line to the PRD to make this explicit (S4-R11a)." → added between 9 Oct 10:39 and 13 Oct 18:37 (most likely v43).
- **S8-R5a, S8-N1a** — Chris Ward, Slack #fs-dashboard, **2026-10-13 17:37 (+04)**: "I've added it to the PRD (v44)"
  (https://shopview.slack.com/archives/C0C45KCLS92/p1791898668424119). → added in **v44**, 13 Oct.
- Everything else (146 codes, Key Decisions, Terminology, Assumptions, every context note, the measure table, §7,
  §8) is word-for-word unchanged after normalising export markup (bullet characters, `*\*` vs `_\*` italics,
  link markup on Jira keys). The only non-code differences in the raw diff were those markup forms.
- **Glossary / open questions:** the page has no separate glossary or open-questions section beyond §4 Terminology;
  §4 is unchanged.
