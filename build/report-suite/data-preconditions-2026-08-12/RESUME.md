# RESUME — Report Suite data preconditions, 12 August 2026

## Status: IN PROGRESS

## Build
`v3.7-4626299` · last-mod Wed 12 Aug 2026 05:06:49 GMT · etag `da084d29fbcc187229d2988862374d6b` ·
sha256 `6dc177ab17a9243f4820e0523390602c0c06038f0d70ee165d1d26032ee9c85b`.
Byte-identical to what the previous pass recorded — **no redeploy**.

## Done so far
- Branch synced (already up to date at `06bc0305`).
- Session live: 42 fe-permissions, HTTP 200.
- 492 live cases pulled under group 4281; **480 ours / 12 Vladimir Tomovic's**.
- 873 precondition LINES extracted from the 480 cases → 595 distinct clusters (543 singletons).
- All six report API endpoints located and returning rows.

## Established API facts (new this pass)
- Reports: `/api/reporting/reports/{sales-by-customer|sales-by-representative|parts-velocity|
  technician-utilization|inventory-value}?range=custom&start_date=&end_date=` and
  **work-in-progress uses `from=`/`to=` ISO instants** (not `range=`).
- **A 366-day cap is enforced server-side**: >366 days returns HTTP 400
  `"Date range cannot exceed 366 days."` (WIP words it `"Date range cannot be over one year."`).

## Writes so far
**0 TestRail writes. 0 Jira calls. 0 run writes. 0 seeding.**

## Next
Classify precondition lines semantically, then establish each distinct data requirement live.
