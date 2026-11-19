---
title: Reusable scripts - every document of the six aging reports, exports, sorts, future dates, screen checks
keywords: script, invariants, exports, csv, pdf, whole-data, every document, check, kit, automation, playwright, screen, aging, summary, detail, collection, unpaid
learned: 2026-11-18
evidence: build/ar-ap-report-sorting/release-audit-2026-11-18/scripts/invariants.py; build/ar-ap-report-sorting/release-audit-2026-11-18/scripts/exports.py; build/ar-ap-report-sorting/release-audit-2026-11-18/scripts/check_exports.py; build/ar-ap-report-sorting/release-audit-2026-11-18/scripts/sort_and_future.py; build/ar-ap-report-sorting/release-audit-2026-11-18/scripts/screen_tests.js
---
- Pull: python3 build/ar-ap-report-sorting/existing-data-unchanged-check/staging-recheck-after-SV-12663-2026-11-16/scripts/pull.py <out> <asOf> <zone>  (cookies /tmp/staging/cookie-header.txt)
- Checks (32 per zone, PRD-quoted): python3 build/ar-ap-report-sorting/release-audit-2026-11-18/scripts/invariants.py <data dir> <zone> [--fetch-detail-opening]  -> INVARIANTS.md
- Exports: python3 build/ar-ap-report-sorting/release-audit-2026-11-18/scripts/exports.py <out>; then check_exports.py <out> <data dir>. PDFs: render with pdftoppm and LOOK (M2).
- Sort/blank/future date: sort_and_future.py <out.md>. Screen: node build/ar-ap-report-sorting/release-audit-2026-11-18/scripts/screen_tests.js (reuses v1-regression/staging-run-2026-11-12/tech-tools/lib.js, logout blocked).
- 92-test screen run: build/ar-ap-report-sorting/v1-regression/STAGING-RUN-CARD.md (only 07:15-17:45 UTC).
- Data files may be .json.gz - the scripts read both.
