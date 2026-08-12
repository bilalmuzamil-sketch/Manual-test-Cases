# Filters — build verification, 2026-08-12

**Read this section first. It changes what the rest of the pass could be.**

---

## 🔴 THE HEADLINE: NEITHER SUPPLIED SIGN-IN WORKS, SO NOTHING WAS OBSERVED ON THE BUILD

Both Filters sessions handed to this session return **HTTP 409 `{"errors":[{"error":"Session has
expired."}]}`** against the Filters API host. **Not one case was driven live**, and under Standing
Rule 12 that means **not one verdict, not one label correction and not one build stamp** could
honestly be produced from the running build.

**The count, stated plainly: 0 of 115 cases were observed against the build today.**

**What this cost, in order of damage:**

| Owed | Status |
|---|---|
| the **11 non-admin cases**, blocked since 5 August | **STILL BLOCKED** — and now for a second, independent reason |
| re-verifying the other **104** against the running build | **NOT DONE** — 0 of 104 |
| re-stamping Rule-54 sentence 2 | **CORRECTLY NOT DONE** — a build stamp with no observation behind it is a fabricated claim |

**No sentence 2 was written on any case.** Every case still carries the build line its last real
observation earned, which is exactly what Rule 54 requires and what Rule 60 makes readable.

---

## The build marker — read successfully, because it needs no session

| | |
|---|---|
| `<meta name="app-version">` | **`v3.6-3e9dd6d`** |
| `last-modified` | **Tue, 11 Aug 2026 07:45:44 GMT** |
| `etag` | `"b1b2623f07bec03883f57a0e17204431"` |
| `sha256(index.html)` | `fa01a52544d9fc96113f6785bec26bb43771af57fe2bc8c6120d4b6fbb11d4cb` |
| read at start | 2026-08-12T02:54Z |
| read at end | 2026-08-12T03:11Z — **`index.html` byte-identical, same sha256** |

**THE BUILD HAS NOT MOVED SINCE YESTERDAY'S PASS.** `build/filters/build-verify-2026-08-11/`
recorded `v3.6-3e9dd6d`, the same `last-modified`, the same etag and the same sha256 at
2026-08-11T09:32:19Z. **Byte-identical, 24 hours apart.**

**That is worth saying out loud, because it is the one piece of good news here:** yesterday's
build-verification pass checked **106 of the 114** cases against **this exact build**, and its
findings therefore still stand. They are not stale. The developers have not deployed since.

---

## Proof that the failure is the two `PHPSESSID`s, and not something we did wrong

Full probe log with every HTTP code: **`evidence/session-probe-2026-08-12.txt`**.

**The shared half of the credential set is ALIVE.** The Schedule sibling worker's cookie file,
written at 02:52Z, carries a `sv_sso_session` and `cf_clearance` **byte-identical to ours**
(compared by sha256; values never printed) and differs **only** in `PHPSESSID` — and that set
returns **HTTP 200 with 42 permissions** against its own branch. So the sign-in itself is good.

**`PHPSESSID` is per-branch, proven in both directions:** the Schedule `PHPSESSID` returns **200**
on `sv8685api` and **409** on `sv8785api`. **Both Filters `PHPSESSID`s return 409 on all three
branch API hosts** — they authenticate nowhere.

**All five of the playbook's false-alarm traps were ruled out before this was called a blocker:**

| Trap | Verdict |
|---|---|
| 1 — expired `cf_clearance` read as a dead sign-in | **ruled out** — `cf_clearance` proven alive |
| 2 — probing the app host, which answers 200 on any path | **ruled out** — every probe used the `…api.` host |
| 3 — `paste -sd` corrupting the cookie header | **ruled out** — built with `'; '.join`, one line, three pairs, lengths 64 / 32 / 426, no newline |
| 4 — per-branch session store | **THIS IS THE DIAGNOSIS**, and it is terminal: neither value works on any branch |
| 5 — `quick-login` / `switch-user` rotating the shared token | **not triggered** — neither was ever called |

**And there is no recovery route that does not rotate the shared token.** The SPA authenticates
client-side and sets no cookie; the API returns 409 directly rather than a followable redirect,
because a valid `sv_sso_session` suppresses the 401; and `/api/auth/callback`, `/api/sso/callback`,
`/api/auth/sso`, `/api/auth/session` and `/api/auth/refresh` are all **404**. The only documented
recovery is `POST /api/quick-login` — **banned for this session**, because it rotates the shared
`sv_sso_session` and would sign out the two sibling workers live on Schedule and Reports, and could
sign the QA lead out of his own browser.

**The sibling canary was checked before and after every probe and never moved off 200.** Nothing
this session did disturbed anyone else's work.

---

## What was NOT possible even with a working admin session — say this before it is asked

**A working admin session would NOT have unblocked the 11 non-admin cases.** Those cases need the
build driven **as the Technician user**, and the only handle on that identity is the second
`PHPSESSID` — which is dead. The alternative routes are `switch-user` and `quick-login`, both
banned for the same reason.

So the honest position on the item that has been outstanding since 5 August is: **it needs a live
`PHPSESSID` for `bilal.muzamil+filters@shopview.com` on branch `sv8785`, and nothing else will do.**

---

## What WAS done instead

Everything that does not depend on the build. Under **Rule 60** the layers separate cleanly: a
session outage costs the **label layer** and the **verdict layer**, and costs the **document layer**
nothing at all. The suite's text lives in TestRail, which was reachable throughout.

See `FINDINGS.md` for the tester-readiness audit of all 115 cases and `testrail-execution-log.md`
for what was written.

## What was written

**5 `update_case`, all HTTP 200, 30 fields compared each, 0 mismatches, 0 collateral changes.**
0 add · 0 delete · 0 section · 0 run writes · 0 results · **0 Jira calls** (the creation hold, restated
by the QA lead today, stands).

**Run 352 proven undamaged by content:** 115 tests, **all 473 results present by id, 0 field changes,
0 new**. `update_run` never called — the run was already in sync at 115.

**The 5 foreign cases proven byte-identical**, `updated_on` and `updated_by` included.

**No `Last checked against build` line was written on any case**, because nothing was observed.

Detail: `CHANGES-MADE.md` · `LABEL-DIFF.md` · `testrail-execution-log.md` ·
`AUTOMATED-CASES-CHANGED.md`.

## Sources — currency checked (Rule 31)

| Source | Version / last change | Verdict |
|---|---|---|
| Filters specification, Confluence page 572030978 | last modified **6 August 2026** (v19); its in-body "Version: 1.6" is the Rule-31(a) trap | **CURRENT** — unchanged since our 11 August records |
| Build `sv8785` | `v3.6-3e9dd6d`, 11 Aug 07:45:44 GMT | **CURRENT, and unmoved** — identical to yesterday's pass and at both ends of this one |
| The running build as an *observable* source | **UNREACHABLE** — both sign-ins dead | **BLOCKED** |

_Last updated 2026-08-12T03:12Z._
