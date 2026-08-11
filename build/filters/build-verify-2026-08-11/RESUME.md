# Filters build-verification — RESUME

**Kept current so a dead session costs nothing.** Last updated: see the final line.

---

## What this pass is

Make the **Filters** suite build-verified: every case's **labels, navigation path, named test data and
step executability** checked against the running build, so a manual tester can run it without
discovering the case itself is wrong.

**Sources are NOT in scope** — they were re-verified against live Confluence v19 on 10 August
(`build/filters/source-accuracy-2026-08-10/`). **No expectation moves to match the build (Rule 57).**

## The governing distinction (Rule 9 vs Rule 57)

| Class | Where the string sits | What to do |
|---|---|---|
| **A** | a label in **Preconditions or Steps** | **use the build's wording** — a step naming a control the tester cannot find is our defect |
| **B** | a label in **Expected Results that a numbered requirement PINS** | **keep the spec's wording**; the build differing is a deviation to record |
| **C** | a label in **Expected Results merely describing what the tester will see** | **use the build's wording**; the assertion is untouched |

Method proven on the Report Suite: `build/report-suite/label-vs-behaviour-2026-08-11/`.

## Environment facts established this pass

- **Suite: ours 114 / live total 119** under group 4110 (5 foreign by user 7, Ahtasham — hands-off,
  Rule 38): C43576, C43577, C43578, C43579, C43580.
- **Build marker at pass start: `v3.6-3e9dd6d`**, `index.html` last-modified **Tue 11 Aug 2026
  07:45:44 GMT**, etag `b1b2623f07bec03883f57a0e17204431`, sha256 `fa01a52544d9fc96…`, read
  **2026-08-11T09:32:19Z**. **This SUPERSEDES the `v3.4.2-ef30acc` recorded previously** — the branch
  has moved a whole minor version.
- **Session: LIVE** — `GET https://sv8785api.qa.shopview.com/api/auth/me/fe-permissions` → **HTTP 200,
  42 permissions, view_mode `full`**. `quick-login` / `switch-user` **never called** (a sibling worker
  shares the token).
- **Run 352 pre-state: `include_all` false, 114 tests, 473 result records, 65 passed / 7 failed /
  42 untested.** Snapshots `/tmp/testrail/run352-{tests,results}-PRE.json`.
- **Raw-markup census BEFORE: 0 of 114.**
- **`custom_atmstatus`: 110 cases = 1, and 4 cases = 3 (Automated)** — C29600, C29614, C29623, C38877.

## How to get a browser onto the branch (no quick-login)

`tools/boot.mjs` — secret-free, reads `/tmp/qa-cookies/filters-cookie-header.txt`. Three things were
needed and none of them is obvious:

1. Cookies alone bounce to `/login`; the SPA guard is `R.getUser() !== null` reading **localStorage
   `user`**, so a **user object must be hydrated**.
2. The object needs `data.details` and `data.role.fePermissions`. Built from
   `GET /api/staff?limit=200` (the `admin@shopview.com` record) + `GET /api/roles/{role_id}`.
3. **It still bounces to `/administration/locations` until `data.details.default_workplace` is set** —
   the router guard is `userHasDefaultWorkplace()`. Set it to the Heavy Duty workplace
   `b3c8c820-f815-4cf1-8938-10956c5ee71a`; `POST /api/iam/change-location` alone is **not** enough.

Rebuild `/tmp/fv/user.json` with `tools/mkuser.py` if `/tmp` has been wiped.

## Where the pass has got to

See `BUILD-VERIFICATION.md` for the per-case ledger, `CLASSIFICATION.md` for every mismatch with both
texts side by side, `FINDINGS.md` for behaviour deviations (**written up, not filed** — the
ticket-creation hold stands), `testrail-execution-log.md` for writes, `FOR-VLAD.md` for changes to
cases TestRail flags Automated.

**STATUS: harness established, suite snapshotted, observation not yet begun.**

_Last updated 2026-08-11T09:45Z._
