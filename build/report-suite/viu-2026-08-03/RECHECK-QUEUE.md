# RE-CHECK QUEUE — Report Suite VIU on the NON-FINAL QA branch `sv8582`

## STATUS: **OPEN**

> **Why this file exists (CLAUDE.md Standing Rule 49).** The QA lead relayed engineering's
> position verbatim on **2026-08-03**: *"they have also told they this QA Branch is also not final
> they are still working on it. So whatever you change from it, make sure that you will have to
> recheck it in future to ensure that what you had learned from this QA branch is still true or if
> that has been changed."*
> Therefore **every** observation in this VIU pass is **PROVISIONAL**. Each row below must be
> re-confirmed against the build once it settles. **No Report Suite deliverable may be described as
> VIU-complete while this queue is OPEN.**

## THE BUILD THIS PASS OBSERVED (the thing that must be compared later)

| Marker | Value |
|---|---|
| App | `https://sv8582.qa.shopview.com` |
| API | `https://sv8582api.qa.shopview.com` |
| **App version (authoritative marker)** | **`v3.4.1-0ed4433`** |
| index.html `last-modified` | `Mon, 03 Aug 2026 13:40:38 GMT` |
| index.html `etag` | `02091e9dc11f187d7739b4efa166ea21` |
| API server banner | `nginx/1.30.4` / `PHP/8.5.7` |
| Org | `d55bc308-e61a-438d-b5f1-c7a73c89d49f` (shared) |
| Report Suite feature flag | **none exists** — the six reports are unflagged on this branch |
| Observed (UTC) | `2026-08-03 18:13 → 18:xx` |

**Re-read the marker (one command):**
```
curl -s https://sv8582.qa.shopview.com/ | grep app-version
```
**If the value is no longer `v3.4.1-0ed4433`, the build has moved and EVERY row below is due for
re-check.**

## HOW TO RE-RUN THIS QUEUE

1. Check the marker (command above). Also check it at **every session start** and **before/after any
   Report Suite work** (`ls build/*/viu-*/RECHECK-QUEUE.md`).
2. For each row: re-drive the same check live, then set **Re-check outcome** to
   **CONFIRMED** (unchanged — cite fresh evidence) or **CHANGED** (state the new observation; a
   CHANGED row is a reportable finding, not a silent correction).
3. Only set this file to **CLOSED** when **100% of rows** are re-verified (Rule 17 — no sampling).
4. Tooling is reusable and read-only: `tools/qa8582.mjs`, `tools/boot8582.mjs`, `tools/nav_map.mjs`,
   `tools/capture_report.mjs`.

## TRIGGERS THAT REOPEN / FORCE A RE-RUN

- The app-version marker changes (deploy).
- Cookies die earlier than ~24h (on this estate that usually means a deploy happened).
- Engineering or the QA lead declares the branch final.
- Any Report Suite spec version bump (Rule 31 pre-flight) — a re-check and a spec-diff then run
  together.

---

## ROWS — every case touched or verdicted in this pass

Legend for **Re-check obligation**: what specifically must be re-confirmed once the build settles.

<!-- RECHECK-ROWS-START -->

### A. Environment / navigation facts (not case verdicts, but everything below depends on them)

| # | Fact observed | Build | Re-check obligation | Re-check outcome |
|---|---|---|---|---|
| E1 | API host is `sv8582api.qa.shopview.com`; `quick-login {key:'admin'}` → 200 | `v3.4.1-0ed4433` 2026-08-03 | Confirm auth route still 200 | PENDING |
| E2 | No Report Suite feature flag exists; all six reports render unflagged | `v3.4.1-0ed4433` 2026-08-03 | Re-list `/api/feature-flags` — a flag may be added before release | PENDING |
| E3 | Six routes: `/reports/sales-by-customer`, `/reports/sales-by-representative`, `/reports/parts-velocity`, `/reports/technician-utilization`, `/reports/work-in-progress`, `/reports/inventory-value` | `v3.4.1-0ed4433` 2026-08-03 | Confirm routes unchanged | PENDING |
| E4 | Nav groups: WIP/TU/SBR under **PERFORMANCE**; PV/IV under **PARTS**; SBC under **SALES** | `v3.4.1-0ed4433` 2026-08-03 | **High-churn** — nav grouping is exactly the sort of thing still being worked on. Re-confirm every group heading. | PENDING |
| E5 | `/reports` redirects to `/reports/punch-clock-activities` (no neutral reports index) | `v3.4.1-0ed4433` 2026-08-03 | Confirm redirect target | PENDING |

### B. Case-level rows

Populated per VIU batch. Each row: internal ID · C-id · link · what was observed · what changed/
concluded · build + date · re-check obligation.

See `BATCH-LOG.md` for the running per-batch tally and `LABEL-DIFF.md` for the wording deltas each
row refers to.

| # | Case | C-id | Observed on `v3.4.1-0ed4433` (2026-08-03) | Conclusion / staged change | Re-check obligation | Re-check outcome |
|---|---|---|---|---|---|---|
<!-- BATCH ROWS APPENDED BELOW -->

<!-- RECHECK-ROWS-END -->
