---
title: Staging and production sessions - what expires, what to check, what never to do
keywords: session, cookies, login, staging, production, 401, expired, redeploy, build marker, app-version, tmp, prod login, time window, karachi, edmonton
learned: 2026-11-18
evidence: build/ar-ap-report-sorting/v1-regression/partly-used-credit-2026-11-18/capture_prod.js; build/ar-ap-report-sorting/v1-regression/STAGING-RUN-CARD.md
---
- Staging: the QA lead's cookies (/tmp/staging, chmod 600) last a few hours; a 401 means ask for fresh ones - never quick-login with his PHPSESSID, never logout/change-location (env.js/stg.js block them).
- Build marker: curl -s https://app.staging.shopview.com/ | grep app-version - before every step and in every result.
- Production test account: POST /api/login with /tmp/prod/login.json, ONE login per run (it expires that user's other sessions); localStorage user + fe_permissions_wrapper + PHPSESSID cookie; see capture_prod.js.
- "Today" differs between Staging Heavy Duty - 9919 (Asia/Karachi) and Staging Lethbridge - 4310 (America/Edmonton) outside 07:15-17:45 UTC: run date-dependent screen tests only inside that window; data checks with an explicit asOfDate are safe any time.
- A guessed URL that 404s proves nothing (Rule 115): read app/src/api/... first.
