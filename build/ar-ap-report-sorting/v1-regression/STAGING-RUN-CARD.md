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
| 2 | Seed everything the tests need. Resumable: run it again until only the 2 refusals in step 3 are left | `python3 seed.py staging` |
| 3 | Confirm the seed: expect `done 83 … total 85`. The missing 2 are `doc:R76:pay` and `doc:P27:pay`: overpayments the app refuses ("cannot be overpaid"), the developer-data preconditions of V1R-76 / V1R-27 (same on QA) | `python3 seed.py staging --check` |
| 4 | Prove it: expect `47 of 47 parties answered`. Before the upgrade it asks the payment screens' unpaid lists; after, the aging reports themselves | `python3 status.py staging` |
| 5 | Run all tests through the screens (about 30 minutes) | `node run.js staging $(seq -f 'V1R-%02g' 1 93 \| grep -vx V1R-72 \| sed 's/^V1R-35$/V1R-35v2 V1R-35chev/')` |
| 6 | Build the results file + annotated pictures (local only) | `python3 results_for_testrail.py staging` |
| 7 | Dry run of the TestRail post: prints, writes nothing. Step 6 prints this exact command | `python3 <scratchpad>/xtools/push_results_to_run.py --run 557 --lead "Re-Ran on staging" --results ../testrail-results-staging/RESULTS-STAGING.json --build-marker <marker> --date "<d Month yyyy>" --env "Staging" --screenshots yes --dry-run` |
| 8 | Post to **run 557** (QA lead, 12 Nov 2026: "The results should go in the same test run with the head line something like this: \"Re-Ran on staging\" and then post the staging results in the new comment."). Every staging result is a NEW result whose first line reads "Re-Ran on staging" (`--lead`). | the same command without `--dry-run` |

Before step 8: read the "NEEDS REVIEW" list that step 6 prints. A new failure is never posted until it has been measured,
checked against the epic's "not bugs / decided by Product" notes, and searched for in Jira (Rules 110, 120, 121).
Re-check that SV-12544, SV-12545 and SV-12547 are still open.


**Permission recorded (QA lead, 12 Nov 2026):** asked "May I sign tech@shopview.com in on staging during the run, in its own separate browser session?" — answer: **"Yes"**. Applies to V1R-32, V1R-53 and V1R-87 on staging: separate cookie jar holding only `sv_sso_session` + `cf_clearance`, never the QA lead's PHPSESSID; check the QA lead's session (`/api/iam/view-profile/` → 200) after every sign-in; restore tech's role from `staging-seed-2026-11-12/tech-before-staging.json` afterwards (Rule 26).


**Who runs what (QA lead, 12 Nov 2026, verbatim: "The tests which are not related to staging will be run by the other session."):** this session runs the staging tests in run 557 — section 134654 "Regression Tests" (92) and section 133628 "Run on Staging After the Feature Is Deployed" (13). The other 365 tests under group 20434 are run by the other session; staging is not prepared for them by us.


**Scope update (12 Nov 2026, ~11:30Z):**
- V1R-25, V1R-26, V1R-27 and V1R-76 (C1078998, C1078999, C1079000, C1095432) were RETIRED on the QA lead's order and moved to section 134653 "Retired - cannot be set up (QA lead 11 and 12 Nov 2026)"; they are no longer in run 557. The staging run is **88 regression tests**: do not run or post those four.
- C715477 and C715479 were moved (QA lead, 12 Nov 2026) from "Release day and what must not change" into section 133628 "Run on Staging After the Feature Is Deployed", which now holds **15 tests**. C715477's timing phrases were re-pointed to staging (read back OK); C715479 needed no change. Both need only what staging already holds: an unpaid invoice from a work order at location B (Staging Lethbridge - 4310) with the Admin enrolled at both A and B, and a customer with an overdue invoice.
- C715462 (A/R Summary Totals leave out overpaid invoices) stays where it is: it says "Run this on production, after the release is installed" because only production holds overpaid invoices (the PRD counts 16 across 13 accounts); the app refuses to create one on staging.
- **Superseded 12 Nov 2026 ~11:50Z: an overpaid invoice CAN be made on staging, through normal actions only** (pay part, reverse that payment, pay in full with an earlier payment date: as of the days before the reversal the reversed payment still counts). Ready on staging: customer "ZZAUTOTEST OVERPAID C715462 Cust A", invoice S-40181 ($100.00, $120.00 counted as of 10 and 11 Nov 2026) + invoice B S-40182 ($500.00). Read A/R Summary **As of 11/11/2026**. Rebuild (resumable, idempotent): `python3 ../../overpaid-recipe/seed_overpaid.py staging`; re-measure read-only with `--check`. Recipe, definition and proof: `OVERPAID-INVOICE-RECIPE.md` (script and readings in `overpaid-recipe/`). Changing C715462's preconditions is the QA lead's call (TestRail write, Rule 6).
- **Staging already runs the upgrade:** at ~11:45Z on 12 Nov 2026 the front end reported `v26.45.4-b8c04e2` (= the SV-11315 merge, PR #4262) and the API answered 200 on `/api/reporting/reports/ar-aging-summary`, 404 on the old `/api/reporting/account-receivable/aging-summary-report`.

## Tests that are held, and why

| Test | Why it is not a normal pass/fail |
|---|---|
| V1R-25, V1R-26, V1R-27 | **Retired** by the QA lead to section 134653 "Retired - cannot be set up" (not in run 557): they need records nobody can make through the screens. Not run, not posted. |
| V1R-76 | **Revived 12 Nov 2026** (C1095432 moved back to 134654 and added to run 557, union-only). Its overpaid invoice is made by `staging-run-2026-11-12/seed_overpaid_v1r76.py` (the OVERPAID-INVOICE-RECIPE on a customer with ONLY that invoice, as the case requires): "ZZAUTOTEST OVERPAID V1R-76 Cust X", S2-40185, as of 11/11/2026. |
| V1R-72 | Deleted. Not run. |
| V1R-35 | Rewritten 12 Nov 2026 to Product's decision (Chris Ward, 4 Nov 2026: "OK as built"). It runs as `V1R-35v2`. `V1R-35chev` is the measurement of the faded arrows and is shown for review only. |
| V1R-32, V1R-53 | Need tech@shopview.com with a limited role. On QA they **PASSED** on 11 Nov 2026 (results 616784, 616785): tech was signed in with quick-login in a SEPARATE cookie jar holding only `sv_sso_session` + `cf_clearance` (never the QA lead's PHPSESSID), its role changed and restored afterwards (standing permission, Rule 118; Rule 26), and the QA lead's session re-checked 200 after every sign-in. Do the same on staging; recipe and evidence: `live-run-2026-11-11/unblock-2026-11-11/`. If staging's quick-login is refused, record Blocked with the rung tried (115.4). **Ready on staging (12 Nov 2026):** roles "ZZAUTOTEST V1R-32 Reports on Customers View off" `fd976fe4-a167-487c-affc-9b89e55f26b7` and "ZZAUTOTEST V1R-53 Reports page access only" `9da670d3-6845-4986-b7a2-1314d45136b5` (Reports page access only, cross toggles off, read back). Tech is still **Technician** (`af8d02b5-…`); restore to `live-run-2026-11-11/staging-seed-2026-11-12/tech-before-staging.json` after (on staging tech's default location is Staging Heavy Duty - 9919 - staging calls the field `defaultWorkplace`, QA `default_workplace` - and billable is 0; a role change must send that `workplace_id` or staging answers 400 "workplace_id: Missing required parameter"). |
| V1R-87 | Needs a location the user is NOT enrolled in, holding one invoice. On QA it **PASSED** with a new location "ZZAUTOTEST V1R-87 Location C" and invoice S-17887 (same folder). On staging create the equivalent (tag ZZAUTOTEST) before step 5. **Done 12 Nov 2026 07:32Z:** "ZZAUTOTEST V1R-87 Location C" `613d5730-af58-47c5-ad64-52bb5a8cf58d` (Calgary, GST, America/Edmonton, shop 2) with one open invoice **S-40099** (screen `S2-40099`, $87.00, dated 2 Nov 2026) for "ZZAUTOTEST AR V1R-87 Location C". You were auto-enrolled at C; tech is not (read back), so tech with the Admin role is the viewer for step 7. The scripted V1R-87 covers steps 1-6 and 8. |
| V1R-69 | On QA the test browser could not load the chart section, so it needs a person. On QA it came out Blocked. |

## Traps that are already handled

- **Time zones.** On staging, location A "Staging Heavy Duty - 9919" is on **Asia/Karachi**; on QA it was Edmonton. Location B "Staging Lethbridge - 4310" is on America/Edmonton.
  - The seeder reads both zones from the app every run.
  - It dates every record at **noon on the right day, on its own location's clock**, never in the future.
  - It records each location's "today" in `seeded-staging.json`, and the tests move every date they expect by that location's offset.
  - The date table (`python3 seed.py staging --dates 00:30Z 06:00Z 12:00Z 20:00Z`) shows that at 00:30Z and 20:00Z the two locations are on different days. That is why the window exists.
  - The time-zone databases also disagree about Edmonton in Nov 2026: this machine's says UTC−6, Node's built-in one says UTC−7. Hence the 75-minute safety margin.
- **Document numbers.** On staging location A is shop **2** and B is shop **3**; on QA both were 11315. The tests expect `S2-…`/`CM2-…` at A and `S3-…` at B.
  - **Proved 12 Nov 2026 (after the 07:32Z seed) for every open seeded document:** 61 of 61 numbers the tests expect equal what staging itself shows (e.g. `S2-40046`, `S3-40035`, `CM2-4542`). Evidence: `live-run-2026-11-11/staging-seed-2026-11-12/number-readback.txt`. Re-check after any reseed: `python3 ../staging-seed-2026-11-12/verify_numbers.py`.
  - Deposits (`DEP2-…`) can be proved only on the aging report after the upgrade: the payment list shows them without the shop number (`DEP-4834`). On QA the report showed `DEP11315-…`.
- **Country.** Location A is **US** on staging but CA on QA. Date or money formats could differ. Not checked yet; the first run will show it.
- **Location.** Seeding moves your session's active location to A and leaves it there.
- **QA and staging never mix.** Separate ledgers (`seeded-qa.json` / `seeded-staging.json`), workplace files, run files (`run-staging.json`) and pictures (`../evidence-staging/`).

## Every result is attributed, identified and dated (Rule 110)

- Each verdict in `run-staging.json` carries the staging build marker and the UTC start and end.
- The results builder **refuses** if verdicts come from more than one build.
- The seeded ids are re-read after every reseed. `seeded-staging.json` is committed with each seed; it holds no secrets.

## What is seeded on staging now (12 Nov 2026, build v26.45.3-6197d19, before the upgrade)

- **Anchor** `2026-11-12T07:15:30Z`: location A's day and B's day are both **12 Nov 2026**. Run the tests on 12 Nov between 07:15Z and 17:45Z, or reseed on the day you run. To reseed, move `tools/seeded-staging.json` aside first; `run.js` stops if the day differs.
- **83 of 85** documents for 47 customers and vendors (`ZZAUTOTEST AR …` / `ZZAUTOTEST AP …`), created 07:15:42–07:31:28Z. Every id, number and creation time is in `tools/seeded-staging.json`.
- **Location C, roles, tech**: see the held-tests table above.
- Every write is in `live-run-2026-11-11/staging-seed-2026-11-12/` (`oplog.jsonl`, `seed-run-1.log`, `seed-run-2.log`, `status-after-seed.txt`).
- **Run 1** created the 16 vendors, but staging's create answer carried no vendor id. The seeder now finds the vendor by name and our own email first, then creates, so a re-run never duplicates. There is no duplicate: 16 names, 16 vendors, each created inside the run window.
- **Status board note**: before the upgrade P56 shows no open documents only because the vendor payment list shows the session's current location (A), and P56's only bill is at B. The bill was listed at B when created (`txn` recorded, due 6 Dec 2026).
- **Excluded from the "existing data unchanged" check**: every record above (names, numbers, UTC times) is appended to `existing-data-unchanged-check/staging-before-feature-captured-2026-11-12/RE-CHECK-AFTER-FEATURE-ON-STAGING.md`. The snapshot's own CM2-4540, CM2-4541 and C-13911 were not touched or reused.

## Run of 12 Nov 2026 (13:20-13:37Z) - what happened

- **Builds.** Run on `v26.45.4-b8c04e2` from 12:52 to 13:28:47Z. Staging was then **redeployed** to `v26.45.4-d07623f` at about 13:29Z; the seeded data survived (47/47 parties still answered by the report). Results were posted **per build**: 84 under b8c04e2, V1R-68 under d07623f. The results builder refuses a file that mixes builds.
- **Posted to run 557** ("Re-Ran on staging"): **83 Passed** and **2 Failed** (V1R-07 C1078980 and V1R-08 C1078981, both the open SV-12545, with the ticket in Defects and "Follow the status here"). SV-12544 (V1R-80) and SV-12547 (V1R-36) are Done in Jira, and their cases PASSED on staging.
- **Not posted:**
  - V1R-69 (Blocked): the automated browser cannot load the Technician Utilization chart section; a person must check it.
  - V1R-32, V1R-53 and V1R-87 (not run): the tech sign-in and role change were **denied by this session's permission system**, so tech@shopview.com was never signed in or changed (read back: identical to `tech-before-staging.json`). The ready-made chain is `staging-run-2026-11-12/tech-tools/run_tech_cases.sh`; it always restores tech's role.
- **Our harness errors found and fixed** (none is a product finding):
  - Date literals I shifted twice or missed (V1R-80, V1R-86).
  - The info-icon helper clicked at step 5 where the case says "point again" (V1R-68, V1R-69, V1R-70).
  - A fixed 1.2-second wait on V1R-43; the bucket loads its lines more slowly on staging.
  - A 60-second PDF wait on V1R-82 step 12; the 1,745-line A/R PDF downloads in time with 3 minutes.
  - V1R-76's sum read only the ~60 rows the virtual table had loaded. It now walks the table and must find the report's own row count (296).
- **Pictures for PDF-only checks** (V1R-34/36/83/91) are the rendered PDF pages they read.
