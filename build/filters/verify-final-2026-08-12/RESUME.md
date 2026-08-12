# Filters — verify-final, 2026-08-12: RESUME

> **⚠️ PARTIAL — THIS PASS WAS STOOD DOWN DURING ORIENTATION, BEFORE ANY WRITE.**
> The QA lead redirected the budget to Schedule first: *"Get done with everything left for
> schedule FIRST."* Filters resumes after Schedule is finished.

---

## THE ONE-LINE STATE

**Zero TestRail writes. Zero Jira calls. Zero run or result writes. Nothing seeded, so nothing to
clean up.** The suite is exactly as the next worker will find it, and the numbers below were all
established live this session, not inherited.

| | |
|---|---|
| Cases **re-stamped** | **0** |
| Cases whose **preconditions and steps were actually walked** | **0** |
| Cases **deliberately left** | n/a — the re-stamp never began |
| Divergences found | **0 found, because the runnability walk never started** — see `DIVERGENCES.md` |
| Held cases re-checked | **0** |

**Nothing here is a claim about the product.** What this session produced is a verified starting
position: the build marker, both sign-ins proven distinct, and a complete per-case census.

---

## WHAT WAS ESTABLISHED LIVE (all of it re-usable, none of it needs redoing)

### 1 · The build has not moved

| | |
|---|---|
| `app-version` | **`v3.6-3e9dd6d`** |
| `last-modified` | **Tue, 11 Aug 2026 07:45:44 GMT** |
| `etag` | `b1b2623f07bec03883f57a0e17204431` |
| `index.html` sha256 | `fa01a52544d9fc96113f6785bec26bb43771af57fe2bc8c6120d4b6fbb11d4cb` |
| read at | 2026-08-12T06:11:01Z |

Same build the 11 August pass checked 106 of 114 cases against. **That is what makes the re-stamp
owed and legitimate** — see `RESTAMP-EVIDENCE.md`.

### 2 · Both sign-ins work and are provably different people

Checked on the **api** host (`sv8785api`), because the app host returns 200 on any path.

| Check | Administrator | Technician |
|---|---|---|
| `fe_permissions` count | **42** | **6** |
| `view_mode` | `full` | **`tech`** |
| `view-profile` email | `admin@shopview.com` | **`bilal.muzamil+filters@shopview.com`** |
| `GET /api/staff` | **200** | **403** |

**`quick-login` and `switch-user` were never called.** Cookie jars are separate files under
`/tmp/qa-cookies/`, `chmod 600`, never written into the repository.

**This matters for the next worker:** the Technician session is live and proven, so the held cases
that need a second identity — chiefly
[C29615](https://shopview.testrail.io/index.php?/cases/view/29615) and
[C38895](https://shopview.testrail.io/index.php?/cases/view/38895) — are unblocked *at the access
level*. Nothing about them was observed.

### 3 · Counts reconcile, and the run is in sync

| | |
|---|---|
| Ours / live under group 4110 | **115 / 120** |
| Foreign (Ahtasham Amjad, user 7) | **C43576, C43577, C43578, C43579, C43580** |
| Run 352 tests | **115** |
| Run 352 results | **473** |
| `include_all` | **false** |
| Run case-id set vs our 115 | **equal in both directions**, 0 either way |

**The foreign five were re-read and proven byte-identical** — 30 shared fields each, 0 differ,
`updated_on`/`updated_by` included (`updated_by=7`, `updated_on=1786371856`). They were never edited
and must not be (Rule 38).

**Run 352 was read only.** `update_run` was never called; no result was written anywhere. Baseline
snapshot for the next worker to diff against: `evidence/run352-snapshot.json` (all 115 test ids, 115
case ids, 473 result ids).

### 4 · The full per-case census — the re-stamp worklist, already built

`evidence/case-census-2026-08-12.json`, one row per case: id, title, section, the build its Rule-54
sentence 2 names, the date, and its `AUTOMATION` marker.

| Build sentence on the case | cases |
|---|---|
| `v3.4.2-d00239b` on 8/5/2026 | **93** |
| `v3.6-3e9dd6d` on 8/11/2026 | **8** |
| `v3.6-3e9dd6d` on 12 August 2026 | **4** |
| no build sentence at all | **10** |
| **total** | **115** |

The 12 already current: C29595, C29596, C29615, C29622, C29623, C29624, C29625, C29626, C29627,
C38895, C43561, C43590.
The 10 with none: C29558, C29559, C29600, C29609, C29610, C29612, C29621, C43560, C43562, C43563.

**Note the two date formats already in the suite** — `8/11/2026` and `12 August 2026`. Pick one and
say which; do not let a re-stamp introduce a third.

| Marker | cases |
|---|---|
| `AUTOMATION: READY` | **90** |
| `AUTOMATION: READY - EXPECT FAIL` | **7** |
| `AUTOMATION: HOLD` | **18** |

**Gate passes both ways: 90 + 7 = 97, and 115 − 18 = 97.** Matches the brief's 97 runnable / 18 held.

---

## THE EXACT RE-RUN RECIPE

Everything below is reproducible from git plus fresh cookies. **Cookies are the only thing that dies**
— they last ~24 h on this estate and also die on deploy.

### Step 0 — sessions

Write the admin and technician cookie headers to `/tmp/qa-cookies/filters-admin.txt` and
`filters-tech.txt`, `chmod 600`. **Separate jars, separate browser contexts, never merged.** Prove
the identities differ with the four checks in §2 above **before trusting a single non-admin
observation** — 42/`full` against 6/`tech`, and 200 against 403 on `GET /api/staff`. Test on the
**api** host.

### Step 1 — re-confirm the build marker

If `app-version` is no longer `v3.6-3e9dd6d`, **stop and re-plan**: the whole re-stamp premise is
that the build has not moved since the 11 August pass observed it.

### Step 2 — the union harvest (this is the part still owed)

Reuse the sibling pass's tooling wholesale — `build/schedule/verify-final-2026-08-12/tools/`:

| File | Role |
|---|---|
| `harness_admin.cjs` | the bridge + hydration. **Change `APP` to `sv8785`, the API host to `sv8785api`, and re-read org/workplace/staff live** — the Schedule values are for a different estate |
| `build_union_harvest.py` | unions raw visible text nodes across surfaces |
| `restamp_eligibility.py` | the three-bucket adjudication |
| `build_restamp_payloads.py` / `exec_restamp.py` | payload build + byte-verified push |

**The harness needs one repair before it will render the admin pages** — the bundle reads the
organisation id from `localStorage["user"] -> .data.details.intercom_data.company.id`, and blocks
every request when the user is truthy but has no `default_workplace`. Full mechanism:
`build/schedule/build-viu-2026-08-12/HARNESS-FIX.md`. **Read the org and workplace ids live from
this estate**; this session began that read and had not finished it — `GET /api/organizations` and
`GET /api/staff/my-workplaces` both returned a shape whose id fields were not where the Schedule
harness expects them, so **that shape needs establishing before hydration is written, not guessed.**

**Surfaces the harvest must reach**, from the case census and the 11 August evidence: the Work Orders
list on every tab (All, Estimates, Completed, My WOs), all five chip dropdowns, collapsed and
expanded bar, the three empty states, the mobile sheets at 390 × 844, the Parts pages, the Reports
pages, and the page-search toolbar.

### Step 3 — the bar for a re-stamp, and it is not negotiable

> **Re-stamp a case only where every on-screen label it quotes matched a *visible* string in a
> harvest taken from this build.**

- **A match in an `aria-label` or a `data-test-id` does not count.** No tester can see it. This trap
  nearly certified the wrong wording on Schedule.
- **Compare strings as stored, with CSS `text-transform` recorded separately.** `innerText` returns
  what is *painted*, so an uppercase panel yields `STATUS` where the build stores `Status`.
- **A case merely present during a pass was not checked.** Leave it, and say how many.
- **Cases quoting no on-screen label are left alone** — there is nothing to compare, and stamping
  them would inflate the headline while meaning nothing.

**The honest split is the deliverable.** On Schedule that was 45 re-stamped, 29 left ambiguous, 100
left as no-label.

### Step 4 — runnability, which is the QA lead's actual priority

For the **97 runnable** cases, starting with the **29 untested** ones listed in
`build/filters/build-viu-2026-08-12/SKIP-LIST.md`, check the five:
precondition reachable · navigation path exists · control exists where the step says · steps work in
the written order · labels are the ones on screen (computed style, not `textContent`).

**Two categories, handled differently:**
- **Cosmetic** — renamed control, moved menu item, same route by a slightly different path →
  correct it and log it.
- **Substantive** — the route or state the source describes does not exist → **never silently
  rewritten.** Record in `DIVERGENCES.md` with both texts quoted, give the case the smallest change
  that stops a tester being stranded, and raise it.

The test: *would a reader of the source recognise what the build offers as the same thing?*

**A known "step from Mars" candidate is already named and owed:**
[C38891](https://shopview.testrail.io/index.php?/cases/view/38891) lists roughly 42 surfaces and
**two are known wrong** — it says `IBS Batch Transactions` and `Sales Tax Invoices` where the build's
nav reads `IBS Batches` and `Sales Tax Collected`. Two prior passes deliberately declined to fix two
names inside a list of forty, because that would make the case *look* freshly verified while the
other forty stayed unchecked. **It needs one pass that walks all 42 at once**, against the live
spec's `S14-R6` surface list — which carries its own warning: *locate surfaces by URL rather than by
name.*

### Step 5 — the held 18

Re-check them against the live build and the Technician session. **Verify the second-sign-in count
yourself rather than inheriting any figure** — the 12 August pass corrected the brief's "11 cases"
to **8** whose *build-check* a second login unblocks, of which only **2** name a second login as
their stated blocker (C29615, C38895). The other 8 of the 18 are waiting on **Branko's Parts and
Reports product write-up**, which no login clears.

### Step 6 — write discipline when writes do begin

`update_case` only. **All three text fields on every payload** — TestRail re-renders any omitted text
field through its HTML pipeline, and this project shows markup literally to the tester. Re-GET and
byte-compare field by field; **stop the batch on any mismatch**. **Print and read the built payloads
before sending** — two re-stamp defects passed a byte-check on another project today because the
payload itself was wrong. **An HTTP 500 can come back from a write that already landed — read before
retrying.** **Never set `custom_atmstatus`** — Vlad set it by hand on C29600, C29614, C29623, C38877.

---

## OPEN ITEMS THIS SESSION DID NOT TOUCH

Carried forward from `build/filters/build-viu-2026-08-12/`, unchanged and still owed:

1. **Five held cases already carry a `Passed` result**, all graded by user 7 with empty comments —
   C29559, C29609, C29610, C29612, and most sharply
   [C29615](https://shopview.testrail.io/index.php?/cases/view/29615), whose whole assertion is that
   one person's saved filters do not reach another. That cannot be seen from a single sign-in. Either
   a second login existed on 6 August, or the per-user step was never driven. **Another author's
   result on our case: reported, not touched.** Not ours to settle.
2. **The `AUTOMATION: HOLD` marker is not stopping testers running held cases** — it is labelled
   *AUTOMATION*, sits last, and reads as somebody else's concern. The skip list in
   `build/filters/build-viu-2026-08-12/SKIP-LIST.md` is the mitigation, and it needs to reach the
   testers directly.
3. **Branko's Parts and Reports product write-up** blocks 8 of the 18 held cases. Outstanding since
   27 July.

---

## ENVIRONMENT

**Nothing was created, changed or deleted.** No work order, customer, filter, saved view, role or
user was touched; no `ZZAUTOTEST` data exists from this session because none was ever needed. Every
call made was a `GET`. `admin@shopview.com` was not edited. `quick-login` and `switch-user` were
never called.

Secrets live only in `/tmp/filters-final/env.sh` and `/tmp/qa-cookies/filters-*.txt`, both
`chmod 600`, **never written into the repository or into any evidence file.**
