# Schedule — build verification for this pass

| | |
|---|---|
| App version | **`v3.5-65d6500`** |
| `index.html` last-modified | **Tue, 11 Aug 2026 09:33:33 GMT** |
| etag | `3250d285ffcf50626363a578fe273071` |
| `index.html` sha256 | `9348ca09d6167375…` |
| Read at | **2026-08-12T06:15:15Z** |
| Moved during the pass? | **No.** Same marker on every probe launch; every probe records the API calls it made and none saw a different bundle. |

**Sessions.** Two were supplied. The **administrator** session was live all pass
(`GET /api/iam/view-profile/` → HTTP 200, `admin@shopview.com`). The **Technician** session
(`bilal.muzamil+schedule@shopview.com`) was live at the start and **was lost during the attempt to
unblock the ten permission cases** — a role-definition edit invalidates the session of every holder
of that role, one way, and it does not return when the permissions are put back. Full account in
`DIVERGENCES.md` §A.

**`quick-login` and `switch-user` were never called.** `admin@shopview.com` was never edited — its
Edit Staff Member dialog was opened read-only and closed with Escape, and the probe's own non-GET
call list confirms nothing was written from it.

**Bridge health.** The request bridge answers a failed fetch with a synthetic `599` and records it,
so "the app never asked for X" is provable rather than inferred. **`bridge_errors` read 0 on every
run.** The only 4xx anywhere was `GET /api/api/sso/check` → 404, a doubled-path housekeeping call the
app makes on load; it is pre-existing and harmless.

**Writes made against the QA branch** (all authorised as test data; roles restored, data not):

| What | Calls | Proof |
|---|---|---|
| `ZZAUTOTEST probe` role created, edited, deleted | 3 | re-GET 404 = gone; role count 12 before and 12 after |
| Technician role permissions changed and restored | 6 | **restored byte-identical, 10 fields compared, 0 mismatches** — `evidence/role-Technician-{BEFORE,AFTER}.json` |
| One shift deleted by a probe, then recreated | 2 | **11 fields compared, 0 mismatches**; whole-board diff 545/49/18 with 0 of the other 544 shifts changed |
| View-option toggles flipped during the walk | 0 API writes | Capacity Planning and Events flipped off and **back on**; Business Hours turned on and **back off** |

**Nothing else was created, changed or deleted**, and the probes print their non-GET call list at
exit — it read `[]` on every run except the two named above.

## Run 357 — proven untouched, by content

Read before the pass at **06:18:53Z** and again after all writes at **06:54:01Z**:

```
include_all           False -> False
tests                 176   -> 176
results               529   -> 529
case_id sets equal in BOTH directions          yes (0 missing, 0 extra)
every prior result present BY ID               yes (0 missing)
graded fields changed                          0
derived / echo fields moved                    0
new results logged during our window           0
```

**Verified by content, never by `updated_on`.** `update_run` was never called; no result was logged
anywhere.

## TestRail writes

**3 `update_case`, 0 add, 0 delete, 0 section, 0 run, 0 result.** `custom_atmstatus` was never sent.
Every write carried **all three text fields** and was re-GET and byte-compared: **30 fields compared
per case, 0 mismatches, 0 collateral changes.** Per-operation log: `testrail-execution-log.md`.

## Jira

**Zero calls that create anything.** The creation hold is active; findings are written up here instead.
