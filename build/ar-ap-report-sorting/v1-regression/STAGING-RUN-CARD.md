# A/R and A/P aging — run the 92 regression tests on staging

**Say: `RUN A/R A/P ON STAGING`.** Epic SV-11315 · TestRail section 134654 "Regression Tests" · 92 tests.

**The only thing you supply:** fresh staging cookies, put in `/tmp/staging/` (never in this repo). The session sets up the rest.
It never signs in, out or "quick-logs-in" on any site, because that would sign you out. Every test browser blocks `/logout`.

**The gate (step 1):** the upgrade must actually be on staging. The status board asks the new report address. **404 = not there yet → stop.**
Anything else = it is there. The board also prints the build marker. On 12 Nov 2026 staging was `v26.45.3-6197d19` and gave 404.

**When:** seed and run **on the same day, between 07:15 and 17:45 UTC** (12:15–22:45 in Karachi). Why: see "time-zone trap" below. The seeder refuses outside that window.

## Commands (from `build/ar-ap-report-sorting/v1-regression/live-run-2026-11-11/tools/`)

| # | What | Command |
|---|---|---|
| 0 | Lift the read-only hold, **only once the "before the feature" staging snapshot is finished** | `rm /tmp/staging/NO-WRITES` |
| 1 | Status board: build marker, **gate**, each location's time zone / shop number / today, what survived (read-only) | `python3 status.py staging` |
| 2 | Seed everything the tests need. Resumable: run it again until `failed 0` | `python3 seed.py staging` |
| 3 | Confirm the seed: expect `done 85 … total 85` | `python3 seed.py staging --check` |
| 4 | Prove it through the reports' own screens' back end: expect `47 of 47 parties answered` | `python3 status.py staging` |
| 5 | Run all tests through the screens (about 30 minutes) | `node run.js staging $(seq -f 'V1R-%02g' 1 93 \| grep -vx V1R-72 \| sed 's/^V1R-35$/V1R-35v2 V1R-35chev/')` |
| 6 | Build the results file + annotated pictures (local only) | `python3 results_for_testrail.py staging` |
| 7 | Dry run of the TestRail post: prints, writes nothing. Step 6 prints this exact command | `python3 <scratchpad>/xtools/push_results_to_run.py --run 557 --lead "Re-Ran on staging" --results ../testrail-results-staging/RESULTS-STAGING.json --build-marker <marker> --date "<d Month yyyy>" --env "Staging" --screenshots yes --dry-run` |
| 8 | Post to **run 557** (QA lead, 12 Nov 2026: "The results should go in the same test run with the head line something like this: \"Re-Ran on staging\" and then post the staging results in the new comment."). Every staging result is a NEW result whose first line reads "Re-Ran on staging" (`--lead`). | the same command without `--dry-run` |

Before step 8: read the "NEEDS REVIEW" list that step 6 prints. A new failure is never posted until it has been measured,
checked against the epic's "not bugs / decided by Product" notes, and searched for in Jira (Rules 110, 120, 121).
Re-check that SV-12544, SV-12545 and SV-12547 are still open.

## Tests that are held, and why

| Test | Why it is not a normal pass/fail |
|---|---|
| V1R-25, V1R-26, V1R-27, V1R-76 | Need records nobody can make through the screens or the app's own calls: an invoice or bill with no due date, and an invoice or bill paid more than its amount. A developer has to create them. Not posted. |
| V1R-72 | Deleted. Not run. |
| V1R-35 | Rewritten 12 Nov 2026 to Product's decision (Chris Ward, 4 Nov 2026: "OK as built"). It runs as `V1R-35v2`. `V1R-35chev` is the measurement of the faded arrows and is shown for review only. |
| V1R-32, V1R-53 | Need tech@shopview.com with a limited role. On QA they **PASSED** on 11 Nov 2026 (results 616784, 616785): tech was signed in with quick-login in a SEPARATE cookie jar holding only `sv_sso_session` + `cf_clearance` (never the QA lead's PHPSESSID), its role changed and restored afterwards (standing permission, Rule 118; Rule 26), and the QA lead's session re-checked 200 after every sign-in. Do the same on staging; recipe and evidence: `live-run-2026-11-11/unblock-2026-11-11/`. If staging's quick-login is refused, record Blocked with the rung tried (115.4). |
| V1R-87 | Needs a location the user is NOT enrolled in, holding one invoice. On QA it **PASSED** with a new location "ZZAUTOTEST V1R-87 Location C" and invoice S-17887 (same folder). On staging create the equivalent (tag ZZAUTOTEST) before step 5. |
| V1R-69 | On QA the test browser could not load the chart section, so it needs a person. On QA it came out Blocked. |

## Traps that are already handled

- **Time zones.** On staging, location A "Staging Heavy Duty - 9919" is on **Asia/Karachi**; on QA it was Edmonton. Location B "Staging Lethbridge - 4310" is on America/Edmonton.
  - The seeder reads both zones from the app every run.
  - It dates every record at **noon on the right day, on its own location's clock**, never in the future.
  - It records each location's "today" in `seeded-staging.json`, and the tests move every date they expect by that location's offset.
  - The date table (`python3 seed.py staging --dates 00:30Z 06:00Z 12:00Z 20:00Z`) shows that at 00:30Z and 20:00Z the two locations are on different days. That is why the window exists.
  - The time-zone databases also disagree about Edmonton in Nov 2026: this machine's says UTC−6, Node's built-in one says UTC−7. Hence the 75-minute safety margin.
- **Document numbers.** On staging location A is shop **2** and B is shop **3**; on QA both were 11315. The tests expect `S2-…`/`CM2-…` at A and `S3-…` at B.
  - This is **not proved yet**. Step 4 prints the numbers the report really returns; compare them before trusting step 5.
- **Country.** Location A is **US** on staging but CA on QA. Date or money formats could differ. Not checked yet; the first run will show it.
- **Location.** Seeding moves your session's active location to A and leaves it there.
- **QA and staging never mix.** Separate ledgers (`seeded-qa.json` / `seeded-staging.json`), workplace files, run files (`run-staging.json`) and pictures (`../evidence-staging/`).

## Every result is attributed, identified and dated (Rule 110)

- Each verdict in `run-staging.json` carries the staging build marker and the UTC start and end.
- The results builder **refuses** if verdicts come from more than one build.
- The seeded ids are re-read after every reseed. `seeded-staging.json` is committed with each seed; it holds no secrets.

*Real staging ids: filled in after the first seed.*
