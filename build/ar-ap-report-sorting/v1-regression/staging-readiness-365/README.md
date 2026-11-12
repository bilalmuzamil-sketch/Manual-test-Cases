# Staging readiness for the other 365 run-557 tests: NOT NEEDED, STOPPED

**Not needed: the 365 tests are run by the other session, decided 12 Nov 2026 (QA lead, via the coordinator).** Kept as analysis only. Nothing here is a backlog.

What was done before the stop (12 Nov 2026, staging build v26.45.3-6197d19, upgrade not yet on staging):
- `extracted/precondition-data-lines.txt`: the 351 distinct data preconditions of the 365 tests, read from TestRail and counted per test.
- `parse_setup.py` → `manifest-r365.json`, `parse-report.json`: the 131 Setup lists parsed into 111 customers, 71 vendors and 557 documents, with no line left unparsed. **Never seeded.**
- `measure_org.py` → `org-staging-*.json`: a read-only measurement of staging through V1's A/R and A/P Aging Detail calls, taken at 09:42Z. A/R has 1,730 open lines, 296 customers, documents at 5 locations. A/P has 14,704 open lines, 489 vendors, 7 locations. The QA lead's login is enrolled at 5 locations; QA had 2.
  - Preconditions that cannot hold on staging as measured: "between 31 and 90 customers or vendors", "8 or fewer vendors", "exactly 2,000 customers", "a bucket of 101 to 400 A/P lines", and "the Location menu lists two".
- `prep_r365.py locc` created ONE location (see `oplog-r365-staging.jsonl` and `seeded-r365-staging.json`), listed in `existing-data-unchanged-check/.../RE-CHECK-AFTER-FEATURE-ON-STAGING.md`.
- `seed.py` and `seedlib.py` gained optional `--universe` / `--manifest` arguments and a `phone=False` customer. With no flags, the behaviour is unchanged for the 92 regression tests.
