# SV-11576 — List Asset column shows the year (21 Oct 2026) — PASSED, comment 79189

Staging v26.40.20-00f1fd6 (= develop head; PR #3857 merged 08:10 UTC), Admin, location DVI Test (S1 prefix).
Production before: v26.40.20-aada856, Trucks Hill 2 — production list API returns vehicleYear null; S2-988 (2019
Freightliner) shows "Freightliner". Production build has no Board/Tech View toggles yet.

Matrix (List / Tech View / Board card), `ev/staging-cells.json`:
- YMD S1-34993: 2013 Ford Flex in all three (Board line found by eye; it sits outside board_card_field_vehicle when no unit)
- YM- S1-37462: 2018 CAT / 2018 CAT / "EXH-177 · 2018 CAT"
- -MD S1-37618: 17 Creek Enterprises 17 Creek Enterprise.. / same / 17 Creek Enterprises 17 Creek Enterprises
- -M- S1-37681: Valley / not in Tech View (no lead) / Valley
- Y-- S1-36297: empty / empty / no asset line (card shows unit ZZF4LH)
Gotchas: staging session's location changes between runs — switch via avatar → Change Location (API change-location
alone does not move the SPA). Work-order prefixes: S1 = DVI Test, S2 = Heavy Duty 9919, S3 = Lethbridge 4310.
Production list had a leftover "Status: Imported" filter from SV-9818 — cleared with "Clear all filters".
TestRail test (run 498): https://shopview.testrail.io/index.php?/tests/view/4101035 — no result written (not asked).
