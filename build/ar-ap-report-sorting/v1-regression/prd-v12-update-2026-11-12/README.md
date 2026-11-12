# PRD v11 -> v12 update of the A/R and A/P cases (12 Nov 2026)

**Why:** Milos saved PRD v12 (Confluence 947650561) at 14:28 UTC on 12 Nov 2026, answering Mudassir's seven questions
(Slack C0C454MLP0T 1794489893.034679). Every case cited v11. QA lead: "DO it if that is the best approach".

**Read first (Rule 123):** live v12 fetched 12 Nov 2026 (`../sources/PRD-947650561-v12-2026-11-12.md`). Every quoted PRD
sentence in the 88 regression cases (25) and the 16 "Run on Staging After the Feature Is Deployed" cases (32) is word
for word in v12 (`quote-check.json`; the 9 "reuse rule" / "drill-down keeps" quotes differ only by the PRD's italics).

**What changed in TestRail (103 cases, custom_expected only, live text edited in place, before-images in `live-before/`):**
- every "PRD v11 … 5 Nov 2026" citation -> "v12 … 12 Nov 2026" (section 133628: "version 12 (12 Nov 2026, Milos Vasic), read 12 Nov 2026");
- V1R-90 (C1095446): the S1-R8 quote now carries v12's added sentence ("The documents of an open customer or vendor may all
  arrive from the server in one request; this rule sets only how many are shown at a time."). What the test expects is unchanged;
- Rule 54 stamp: "Last checked against build <build> (staging) on 11/12/2026." from each case's latest observed staging result
  in run 557 (`stamps.json`: 85 on b8c04e2, 18 on d07623f, 1 on e16016f);
- V1R-35 (C1079008) unchanged (Product decision, no PRD version). Retired V1R-25/26/27/76 untouched. V1R-72 deleted earlier.
- `push-log.jsonl`: 103 x HTTP 200, read back; C715471's first read-back came too early, the second was identical.

**No re-run (QA lead, 12 Nov 2026: "If yes and running those tests after that change is unecessary then please stop.").**
No expected result changed meaning, so no status can change. A re-run started at 16:35Z was stopped at 16:43Z: 14 of
the 15 finished tests gave the same verdict as before; V1R-15 shows ERROR only because the stop closed its browser
(`partial-rerun-stopped-2026-11-12.log`). Nothing from it was posted. V1R-32/53/87 (tech) passed again on e16016f; not posted.

**Local:** `cases/cases.json`, `cases/CASES.md` (also V1R-36 synced to TestRail: EXPECT FAIL removed, marker READY - SV-12547
fixed, passed on staging), `tools/inventory.py` + `tools/check.py` now point at v12: `check.py` 0 problems.
