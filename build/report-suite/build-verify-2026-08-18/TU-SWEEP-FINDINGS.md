# TU RE-VERIFY SWEEP — findings (2026-08-19, build v3.8-d0e135e)

## Headline
16 in-scope TU cases driven live and written in interim `<br>` form. **6 READY** (all driven live and
confirmed), **6 HOLD** (each re-driven live and characterized — the blocker is genuine, not a skip),
**4 Not-available** (the Total Hours link feature is still absent from the build).

## §8.5 HARD GATE — 0 cases skipped for data-seeding or login reasons
Every in-scope case was driven live on v3.8-d0e135e. The cases that remain HOLD are NOT skips for a
seedable data-state or an obtainable login — each is a genuinely-unobtainable state, characterized below
with the live evidence. **The one login case (C30446) was attempted through every avenue available on this
env and is a characterized environment limit, flagged to the QA lead.**

## READY (6) — driven live, assertion confirmed
| C-id | internal | what was confirmed live on v3.8-d0e135e |
|---|---|---|
| C30405 | TU-ELL-02 | Est. Lost Labor is the **last** column; it is the **only** header with the `info_outline` icon; cells/header bold. |
| C30411 | TU-SORT-03 | Default sort = Technician A→Z (`sortBy:technician, descending:false`); sort headers interactive; **a data reload resets to Technician A→Z**. |
| C30426 | TU-TECH-04 | Filter By Technician dropdown (All / Clear all + 11 techs); selection persists in `localStorage report_view:technician-utilization`. |
| C30439 | TU-EXP-06 | **PDF export embeds 1 JPEG image (the logo); CSV carries no image** (BOM + header + data only). Exports work. |
| C30443 | TU-LOC-02 | 8 locations selectable; report returns **one row per technician**; multi-location techs show Location = **"Multiple"** (pooled). |
| C30444 | TU-LOC-03 | `report_view` store carries a `locationIds` array → defensive saved-location restore mechanism present. |

## Not-available (4) — Total Hours link feature STILL ABSENT
The Total Hours cell carries **no anchor, no button, cursor `auto`** on every row inspected (v3.8-d0e135e)
— the "Total Hours is a link to Timesheet Activities" feature is **not present in the build**. Absence is a
measurement (probed multiple rows; the detector — checking for `<a>`/`<button>`/`role=link` in the Total
Hours cell — could fire and found nothing). Kept `AUTOMATION: Not available on Build to test Yet`, date
updated to 8/19/2026; logged to `DEFERRED-RUN.md`. Re-check trigger = the link feature shipping, NOT a
redeploy.
- C30428 (TU-LINK-01), C30430 (TU-LINK-03), C30432 (TU-LINK-05), C30433 (TU-LINK-06).

## HOLD (6) — re-driven live, characterized genuine limits
| C-id | internal | live re-verification on v3.8-d0e135e | why it stays HOLD |
|---|---|---|---|
| C30407 | TU-ELL-04 | 0 null/em-dash ELL rows across all 8 locations; ELL $-value + calc verified live. | The em-dash ELL state needs a location with **no** default labor rate. The rate is a per-location config not exposed/settable via any endpoint reached; every location carrying internal-hours data resolves ELL to a $ value. Characterized data-config limit. |
| C30408 | TU-ELL-05 | Same as above (part-value split needs a rate-less location). | Same rate-less-location requirement. |
| C30413 | TU-SORT-05 | Same — no technician has an em-dash ELL (all rated). | Same. |
| C30431 | TU-LINK-04 | Total Hours link **absent** (confirmed); reconcile-exception also needs a tech clocked in at the load instant. | Blocked by the absent Total Hours link feature (+ open-clock requirement). Marker kept HOLD per Rule 69 (deferred marker never overwrites HOLD); reason refreshed to name the absent link. |
| C30446 | TU-LOC-05 | **Positive half confirmed live** — Location filter IS present for multi-location users (admin, 8 locations; non-admin Technician quick-login, multi-location). Negative half needs a one-location user. | **0 of 19 roster staff are single-workplace** (all span 3+); `switch-user` returns HTTP 400 on this env; fresh staff need invite-confirmation; the tech quick-login user is a hidden dev user not in the roster (editing its workplaces risks the shared login). Characterized env limit. **FLAGGED: QA lead to provision a one-location test user.** |
| C38887 | TU-EXP-09 | Exports verified working at actual size (PDF+CSV, HTTP 200). | The report shows **one row per technician** (11 here) → it cannot structurally reach the export row cap (thousands of rows), so the over-cap refusal cannot be produced. Characterized structural limit. |

## Flagged for the QA lead (no ticket created — Rule 62 / creation hold)
1. **C30446 (TU-LOC-05)** needs a **one-location test user** provisioned (or acceptance of the
   characterization). This is the only TU login case that could not be driven on this shared env.
2. **Total Hours link (SV-9064 story)** remains absent from the build — 5 TU cases (C30428/30430/30432/
   30433 + C30431) wait on it. Not a defect; a not-yet-shipped feature.

## No new defects
No new deviation was found on v3.8-d0e135e for the 16 in-scope cases. All 8/18 EXPECT-FAIL/deviation
adjudications for TU (SV-8943/8945/8950/8951/8952/8953/8954/8947 etc.) live on the 36 already-stamped cases
left as-is (Rule 60 same-minor); they were not in this sweep's write scope.

## OUTSTANDING — what I need from you
- A **one-location test user** for C30446 (or accept the characterization).
- The **Total Hours link** feature to ship (unblocks C30428/30430/30432/30433/C30431).
- Whether to attempt deeper seeding of a **rate-less location** for the em-dash ELL cases (C30407/08/13),
  or accept the characterization.
