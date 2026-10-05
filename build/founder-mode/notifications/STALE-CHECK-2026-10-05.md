# Founder Mode Notifications — source check and update (2026-10-05)

**Trigger:** QA lead suspected the Notifications cases were stale.
**Cause confirmed:** Confluence 817463297 "Notifications Update V1" was edited (last modified **2 Oct 2026**)
after our read of 30 Sep (which held the 25 Sep version). No change-log entry. Live copy:
`sources/CONFLUENCE-817463297-Notifications-Update-v1-2026-10-05.md`.
Requirements **197 → 208**: 11 added, 0 removed, 7 changed in meaning; 33 others differed only in arrows
("->" → "→") or escape characters.

## Updated (6) — quotes no longer matched the specification
| Case | Requirement | Change |
|---|---|---|
| C154680 | S5-N1 | Without work order/part sale View the inbox is no longer "empty": customer and asset notes still show |
| C154698 | S8-R3 | Email help text now "...when you're tagged on a note." |
| C154702 | S9-N2 | Part sale notes need Part Sales View; Work Orders View alone is not enough |
| C154704 | S10-R4 (+S10-R3 arrows) | Adding a part sale note requires Part Sales View only |
| C154705 | S10-R5a | Part sale notes deleted with Part Sales Delete; portal and system notes cannot be deleted |
| C154706 | S10-R7 (+S6-E7) | Admin can rename/re-member/delete a public group; only the owner switches public/personal (toggle shown on and disabled for the admin) |
All six setups rewritten step by step (roles via Roles & Permissions + Edit Staff Member).

## New (12) — folder 30738 "Specification update 2 October 2026 (QA Additions)"
C236963 S1-R6a · C236964 S1-R10a · C236965 S1-R21 · C236966 S1-R22 · C236967 S1-N9 · C236968 S2-R7a/b ·
C236969 S2-R13a · C236970 S2-R13b · C236971 S3-R10 (new sentence) · C236972 S10-R5b ·
C236973 bug SV-10274 (many images, menu on screen) · C236974 task SV-10739 (portal part sale notes).

## Epic children not given a case
- SV-10323 (bug): attachment For Customer endpoint checks the wrong organisation — only reachable by automation.
- SV-10764 (bug, Open): customer report that For Customer notes are missing on portal/emailed invoice — a
  defect against existing behaviour the specification does not change; not a new requirement.

## Coverage proof (L5)
Live suite 68 cases (56 + 12). All **208/208** requirement anchors of the 2 Oct specification are cited;
every quote is verbatim against it; one AUTOMATION marker per case. Design: published version dated
23 Sep 2026 (before our 30 Sep drive) — unchanged. Tech plan: none supplied. Epic SV-9667: all 10
Notifications stories (now "Ready for QA") covered; 4 notes tickets classified above.
All 18 touched cases are AUTOMATION: HOLD — **build verification to be handed to the build verification session (L7).**
