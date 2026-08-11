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

## Deliverables

`BUILD-VERIFICATION.md` — the per-case ledger · `CLASSIFICATION.md` — every mismatch with both texts
side by side and its class · `FINDINGS.md` — behaviour deviations, **written up, not filed** ·
`testrail-execution-log.md` — the writes and the untouched-proofs · `FOR-VLAD.md` — changes to cases
TestRail flags Automated.

## Where the pass got to

**106 of the 114 checked against the running build; 8 not.** Of the 106: **89 correct as written**,
**8 corrected**, **9 carrying a recorded mismatch that must NOT be renamed** (the control our case
names does not exist, so renaming would delete a coverage finding).

**The 8 not checked are 7 Persistence cases plus C38895, and they share ONE blocker: a second test
login on this branch**, outstanding since 5 August. Nothing else is in the way of them.

**Writes: 8 × `update_case`, all HTTP 200, 30 fields compared each, 0 mismatches, 0 collateral.**
0 add / 0 delete / 0 section / 0 run writes / 0 results. **No Jira write of any kind** — the
2026-08-10 creation hold stands. **Run 352 proven untouched BY CONTENT**: 473 of 473 results present
by id, 0 field changes of any kind.

**Raw markup: 0 of 114 before AND after** — re-censused after the writes, because TestRail re-renders
hours later without moving `updated_on`.

**The build did not move under the pass** — marker read three times, byte-identical each time.

## If this has to be re-run

Nothing is part-done. The remaining work, in the order it is worth doing:

1. **The 8 unchecked** — the second login unblocks all 8 in one sitting.
2. **[C38891](https://shopview.testrail.io/index.php?/cases/view/38891)'s ~42 surface names.** Two are
   already known wrong (`IBS Batch Transactions` → `IBS Batches`, `Sales Tax Invoices` →
   `Sales Tax Collected`) and were deliberately **not** corrected in isolation — see the last section
   of `CLASSIFICATION.md` for why. Walk all 42 and fix them together.
3. **The six stale Parts/Reports hedges** (`FINDINGS.md` §2) — needs the QA lead's nod first.
4. **A provenance re-stamp** across the 89 found-correct cases, if he wants their stamps to name
   today's build. They were checked but not written, and `BUILD-VERIFICATION.md` says so plainly
   rather than implying otherwise.

## Environment state left behind

**Nothing created, nothing deleted, no role touched, no data seeded.** One session-level change:
`POST /api/iam/change-location` set the working location to **Staging Heavy Duty - 9919** so the
Work Orders page would resolve at all.

**Pre-existing filter state was found, not made, and was left exactly as found** — Parts Inventory
carried `gridLocation=General Storage` + six `category` values + `supply=under-supplied`, and the
Notes report carried an author and a mention. **None of it is ours.**

_Last updated 2026-08-11T11:15Z._
