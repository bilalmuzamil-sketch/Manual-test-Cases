# Report Suite — WHOLE-CASE CURRENCY REPORT (2026-08-17)

Goal (QA lead point 11): make EVERY Report Suite case fully CURRENT to its report's current spec
version + epic SV-8582 + Chris Ward's design-review decisions — expected behaviour, steps, labels AND
refs/provenance, not just references. Build verification DEFERRED by instruction (documents-only; app
never opened; no quick-login/switch-user). Touched cases carry the Rule-69 marker
`AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` (was READY) or keep their
live-backed EXPECT-FAIL / genuine HOLD marker; a later build-verify sync lifts the Rule-69 markers.

## SOURCE CURRENCY (live 2026-08-17)
SBC v20 · SBR v22 · Parts Velocity v10 · Technician Utilization v9 · WIP v21 · Inventory Value v10 —
all CURRENT, none moved past the expected versions. Epic SV-8582 = 114 children (live). Design = QA
lead's private Claude artifact (undated share link, unfetchable — PARTIAL/escalated). Tech plan =
MISSING (reminded). Full table: SOURCE-CURRENCY.md.

## Per-report outcome (reconciles to 507)
| Report | Content-updated | Version-pin | Already-current (untouched) | Skipped (raw markup) | Total |
|---|---|---|---|---|---|
| Sales By Customer | 2 | 76 | 18 | 0 | 96 |
| Sales By Representative | 1 | 90 | 27 | 0 | 118 |
| Parts Velocity | 13 | 58 | 1 | 0 | 72 |
| Technician Utilization | 3 | 57 | 1 | 0 | 61 |
| Work In Progress | 1 | 56 | 33 | 1 | 91 |
| Inventory Value | 16 | 50 | 1 | 2 | 69 |
| TOTAL | 36 | 387 | 81 | 3 | 507 |

Content-updated (36): PV Avg Cost/Avg Sell rename + CSV null (13) · IV date-range->"as of" date model
(16) · TU Total-Hours link scope-gate (3) · WIP Total=Earned+Remaining+Adjustments (1) · SBC/SBR
toggleable-column counts nine->ten / seven->eight (3). Documents-sourced (Rule 57), quote-back
verified, nothing invented; Rule-56 divergence notes where a behaviour reversed.
Version-pin (387): content already correct; provenance spec version + all source read-dates bumped to
17 Aug 2026 + refs spec pin bumped to current version. Includes 9 content-worklist cases with no stale
assertion, routed as version-pin.
Already-current (81): Fabian-pass cases already at current version — left byte-identical (0 writes).
Skipped (3): raw HTML markup (TestRail deferred re-render) — a plain-text re-stamp would risk a
duplicated line; left for a dedicated demark pass.

## Marker distribution live after pass (507)
Rule-69 "Not available on Build to test Yet" 386 · EXPECT-FAIL 83 · HOLD 37 · plain READY 1 (a skipped
raw-markup case). EXPECT-FAIL/HOLD preserved (Rule 15.1a); only plain-READY cases became Rule-69.

## Marker-policy decision (reported)
Applying "set Rule-69 for all touched" literally would convert 83 live-ticket EXPECT-FAIL + 37 genuine
HOLD markers to Rule-69, losing ticket links/HOLD reasons. Per Rule 15.1a I preserved EXPECT-FAIL/HOLD
and applied Rule-69 only to plain-READY cases; EXPECT-FAIL tickets remain in refs. One deliberate
deviation from a literal reading — flag if uniform Rule-69 is preferred and I will convert.

## Verification (Rule 50)
423 update_case writes, all HTTP 200 + re-GET byte-compared field-by-field vs intended payload; every
untouched field proven byte-identical to snapshot; refs under declared comma-normalisation. 0
mismatches, 0 collateral. Post-write census over 507: exactly one provenance line each (0 duplicated),
0 raw markup introduced, every touched case at current spec version. Foreign 12: 0 touched (proven
byte-identical incl updated_on/updated_by). Run 359 NOT written, membership unchanged. 0 add_case, 0
delete, 0 Jira.

## Contradiction sweep (Rule 28): 0 live contradictions
0 "Inv. Hrs"; 0 PV "Unit Cost"/"Sell Price"; 0 IV date-range-preset cases (except the 2 skipped);
column counts consistent (SBC ten, SBR eight).

## Deliverables + hygiene
import 507 case-rows / id-map 507 (0 blank C-ids, refs 507/507), shredding guard 0, header sha256 ==
all 6 peers, four counts set-equal both ways, 0 VIU/flag words, 0 dup titles, API in API sections.

## Is EVERY case current (content + refs)?
YES for 504 of 507 — content + refs current to live spec version, "current" meaning documents-verified
(not build-verified; Rule-69 markers await the sync). 3 cases could NOT be made current:
- WIP-SCOPE-03 / C30458 — raw markup + open PO-question HOLD (Fabian deliberate skip); needs demark +
  Chris tab-placement answer.
- IV-EXP-02 / C30588 — raw markup; still pinned IV v5; needs demark first.
- IV-API-02 / C30606 — raw markup; still pinned IV v5; needs demark first.

## OUTSTANDING — what I need from you
1. Missing sources: Report-Suite Claude design artifact (undated share link, unfetchable) — 3 visual
   cases stay "confirm live"; tech plan not provided (Rule 30).
2. Unanswered PO (Chris): WIP tab placement (C30458); PV Location-column spec contradiction
   (S3-R10 vs S4-R2/R3) behind PV-COL-02/C30352.
3. Go-aheads: demark pass for the 3 raw-markup cases; the build-verify sync to lift 386 Rule-69
   markers; confirmation of the marker-policy decision above.
4. Access: fresh .qa.shopview.com sign-in for the build-verify sync (none needed this pass).
5. Deferred/HELD: C30458. Jira creation on HOLD (Rule 62 + 2026-08-10) — no tickets filed.
6. Another team owes: Chris (WIP tab-placement + PV Location-column); engineering (dated design export).
