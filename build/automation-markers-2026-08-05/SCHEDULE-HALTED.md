# Schedule was NOT written — the QA branch was rebuilt this morning

**No Schedule case was touched. 0 writes. Proven byte-identical before and after, including
`updated_on` and `updated_by`, for all 165 cases.**

## The reason, in one line

The Schedule QA branch **redeployed at 08:09 UTC today**, so all 165 verdicts — and all 165
provenance lines — describe a build that no longer exists, and we cannot write "expect this to fail"
or "this feature is not built" onto a case from a build we have not observed.

| Field | The build the verdicts were measured on (4 Aug) | The build serving now (read 11:34 UTC, 5 Aug) |
|---|---|---|
| `<meta name="app-version">` | `v3.5-4873abe` | **`v3.5-be42149`** |
| `index.html` last-modified | Tue, 04 Aug 2026 14:47:39 GMT | **Wed, 05 Aug 2026 08:09:19 GMT** |
| `index.html` etag | `9b4b1fc776ebbfb04a9a0ca051d847f7` | **`70e496609e155994b93f515db32d0289`** |

This is exactly the event Standing Rule 49 exists for: the branch was declared **not final**, the
findings were therefore **provisional**, and the build has now moved.

## What the redeploy does and does not put in doubt — stated honestly

**142 of the 165 markers would have been safe**, because they do not depend on the build:

- **138 cases whose verdict is "works correctly"** would get `AUTOMATION: READY`. That says the case
  *can be automated*, not that it *currently passes* — so a regression would not make the marker wrong.
- **2 cases waiting on the product owner** (the shop-closure contradiction) depend on Branko, not the build.
- **2 cases that cannot be set up here** (a November clock change; a shared setting nobody has
  authorised changing) depend on the estate, not the build.

**23 markers WOULD have been unsafe, and they are the whole reason for stopping:**

- **19 cases** would have been stamped **`AUTOMATION: READY - EXPECT FAIL (SV-88xx)`** — a positive
  claim that the product is wrong *right now*.
- **4 cases** would have been stamped **`AUTOMATION: HOLD - the feature is not in the product yet`** — a
  positive claim that something is absent from a build we have not looked at. If the redeploy shipped
  any of the four, that marker would park work the engineer could already be doing.

## The evidence that softens it — but does not settle it

All ten defect tickets raised from the 4 August pass were read live from Jira this pass, and **every
one is still Open**:

SV-8848 · SV-8849 · SV-8850 · SV-8851 · SV-8852 · SV-8853 · SV-8854 · SV-8855 · SV-8856 · SV-8857.

So it is **likely** the 19 deviations still reproduce. **But "likely" is not "observed"** (Standing
Rule 12), and an open ticket is not evidence about a build — a fix can ship before its ticket is moved.

## What would unblock it

**Either** re-run the Rule-49 re-check queue for Schedule against `v3.5-be42149` — 165 rows, no
sampling — and then write all 165 markers from fresh verdicts; **or** tell us to write the **142
build-independent markers now** and leave the 23 build-sensitive ones until the re-check.

The queue is already written, one row per case, at `build/schedule/viu-2026-08-04/RECHECK-QUEUE.md`.
