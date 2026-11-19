---
title: A/R and A/P aging reports (new, SV-11315) - every endpoint, parameter, sort key and test id
keywords: aging, a/r, a/p, ar, ap, reports, endpoint, api, export, csv, pdf, sort, sortby, filter, customers, vendors, locations, pastdue, timezone, test-id, staging
learned: 2026-11-18
evidence: build/ar-ap-report-sorting/release-audit-2026-11-18/scripts/invariants.py; build/ar-ap-report-sorting/release-audit-2026-11-18/scripts/exports.py; build/ar-ap-report-sorting/existing-data-unchanged-check/staging-recheck-after-SV-12663-2026-11-16/scripts/pull.py
---
- Base: https://api.staging.shopview.com/api/reporting/reports/{slug} - slugs ar-aging-summary, ap-aging-summary, ar-aging-detail, ap-aging-detail, ar-aging-collection, ap-unpaid-invoices. Production (old reports) answers 404 there.
- Detail buckets: GET {detail-slug} -> groups; rows per bucket: {detail-slug}/buckets/{bucket}/rows. Buckets: days_91_plus, days_61_to_90, days_31_to_60, days_1_to_30, current (that order).
- Every read: asOfDate=YYYY-MM-DD, timezone=<IANA zone the screen uses> (always send it - M13), pagination[page|rowsPerPage|sortBy|descending]. Filters: customers / vendors / locations = comma-joined ids, pastDue = 1-30,31-60,61-90,91-plus. Source: app/src/api/reporting/ReportingModel.ts AgingScopeParams.
- Opening sorts (agingColumns.ts AGING_OPENING_SORT): summaries + details customer_name / vendor_name, collection + unpaid date. Summary money sort keys: current, days_1_to_30, days_31_to_60, days_61_to_90, days_91_plus, total.
- Export: GET {slug}/export?...&format=csv|pdf (same params). Refusal = HTTP 400 application/problem+json with the PRD message.
- Screen test ids: filter_chip_<kind>, filter_search_<kind> (input), .q-menu [data-test-id^=filter_option_<kind>_], filter_tag_remove_<kind>_<id>; kind = customerIds / vendorIds; group toggles button[data-test-id^=button_aging_][...*_toggle_]. The menu lists the first 50 matches only.
- Collection/Unpaid group rows carry their documents inline (rows[]); Detail data is per bucket.
