---
title: In a screen test, pick rows by their exact full text or position - never by a shared prefix
keywords: playwright, ui, screen, click, locator, hasText, prefix, menu, option, row, test data, long name, neighbour
learned: 2026-11-18
evidence: build/ar-ap-report-sorting/release-audit-2026-11-18/scripts/screen_tests.js
---
- hasText matches substrings: "ZZAUTOTESTAbcdefghij" matched two customers and two vendors, so step 4 clicked A twice (tick, untick) and the chip read "All". Match the full normalised text, then click by index (all.nth(i)).
- Searching a broad prefix can push the target past the menu's first 50 rows; probe a few search terms first and count the rows each returns.
- Staging already holds long-name test records: customer 5b5c3981-61e4-41d8-b248-2b2608419af4 (120 letters) + "...NeighbourRow"; vendors 3af836e9-79fb-46de-ab25-7306c0ea4594 (120) and 3ebda93e-0c68-4597-887d-26f3cc0c3412; special-character customer/vendor "ZZAUTOTEST Special & \"Quoted\" 'Single' <Less> Greater> ... One Long Name".
