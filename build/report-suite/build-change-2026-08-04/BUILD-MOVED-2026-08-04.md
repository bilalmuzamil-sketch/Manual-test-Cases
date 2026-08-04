# THE QA BRANCH WAS REDEPLOYED TODAY — every live finding is now against a superseded build

**Discovered 2026-08-04 11:30 UTC**, while attempting the live re-drive of the Inventory Value export
(Step 2). This is the single most consequential thing in this session's work, so it is recorded on its
own rather than buried in a step report.

## THE EVIDENCE (read live, not inferred)

| Marker | The build every VIU finding rests on | The build live NOW |
|---|---|---|
| **App version** | **`v3.4.1-0ed4433`** | **`v3.4.1-3d03023`** |
| index.html `ETag` | `"02091e9dc11f187d7739b4efa166ea21"` | `"9875201c58ba78d9851c37f7039c16e1"` |
| index.html `Last-Modified` | `Mon, 03 Aug 2026 13:40:38 GMT` | **`Tue, 04 Aug 2026 10:41:58 GMT`** |

**All three markers changed.** Raw probe output: `build-marker-probe.txt`.

`viu-2026-08-03/RECHECK-QUEUE.md` states the trigger in its own words:

> *"**If the value is no longer `v3.4.1-0ed4433`, the build has moved and EVERY row below is due for
> re-check.**"*

**That condition is now met.**

## THE SESSION IS DEAD, AND THE DEPLOY IS WHY

```
POST https://sv8582api.qa.shopview.com/api/quick-login   -> HTTP 401 {"error":"sso_required", ...}
GET  https://sv8582api.qa.shopview.com/api/auth/me/fe-permissions -> HTTP 401 {"error":"sso_required", ...}
```

The cookies in `/tmp/report-suite-viu/cookies.json` were issued **2026-08-03 18:12 UTC**. CLAUDE.md's
durable note is that these sessions last ~24 hours **or until a deployment**, whichever comes first.
The deploy landed at **10:41:58 UTC**, roughly **17½ hours** into the cookie's life — so this is a
**deploy-killed session, not an expiry**. Either way it cannot be revived from this container: SSO
needs a browser login the QA lead has to drive.

## WHAT THIS DOES AND DOES NOT INVALIDATE

**It does NOT retract any finding.** Every observation was genuinely live-observed on
`v3.4.1-0ed4433` with evidence captured that run (Rule 12 satisfied at the time). Nothing recorded
becomes false; it becomes **provisional against a build that no longer exists**, which is precisely
the state Rule 49 was written for.

**It DOES mean these three things, plainly:**

1. **No Report Suite deliverable may say "verified against the current build".** The honest phrasing
   is *"verified against `v3.4.1-0ed4433`, which has since been superseded by `v3.4.1-3d03023`"*.
   The readiness report is written that way.
2. **The 469 provenance lines now carry a date that is technically true and materially misleading.**
   They read *"as per the build tested on 8/4/2026"*. The date is right; the **build is not the one
   live on that date any more**, because two builds existed on 2026-08-04. Re-stamping needs a live
   session, so it is queued rather than done. `BUILD_DATE` is one constant in
   `final-push-2026-08-04/build_plan.py`.
3. **The whole re-check queue is due**, including the Ruling-3 export findings. Nothing in it can be
   closed today.

## THE HONEST CONSEQUENCE FOR THE AUTOMATION ENGINEER

**He can still start**, and he should not read this as a reason to wait. What he must know is that the
column-order and money-format facts he will code against were observed on the previous build; if his
assertions fail on the columns, **the export may have been fixed in this deploy** — that is a
re-check, not a bug in his code. The two specific facts to re-confirm first are in the readiness
report's skip list.

## WHAT IS NEEDED TO CLEAR IT

| What | From whom | Why |
|---|---|---|
| **A fresh browser login to `sv8582.qa.shopview.com`** (new `sv_sso_session`, `PHPSESSID`, `cf_clearance`) | **QA lead** | Nothing live can be observed without it — no export re-drive, no provenance re-stamp, no queue row closed. |
| **Confirmation of what `v3.4.1-3d03023` changed** | engineering | Decides whether the re-check is a spot-check of the affected rows or the full queue. |

Until both arrive, the Report Suite's live status is **frozen as of `v3.4.1-0ed4433`** and every
deliverable says so.
