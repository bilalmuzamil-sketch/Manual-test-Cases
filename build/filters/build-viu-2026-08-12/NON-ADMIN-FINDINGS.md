# The non-admin cases — 2026-08-12

## Outcome: NOT RUN. The Technician sign-in is dead.

**This was the reason this session existed, and it could not be done.**

The second sign-in supplied for `bilal.muzamil+filters@shopview.com` (role Technician) returns
**HTTP 409 `{"errors":[{"error":"Session has expired."}]}`** against
`https://sv8785api.qa.shopview.com/api/auth/me/fe-permissions`, and against the Schedule and Report
Suite API hosts as well. So does the admin set. Full probe log: `evidence/session-probe-2026-08-12.txt`.

**Not one non-admin observation was made, and none is asserted.** No case was re-verdicted, no
`Last checked against build` line was written, and no permission behaviour is claimed anywhere in
this pass's output.

## The instruction to stop was followed

The brief said: *"If both resolve to the same user, STOP and report."* The situation that actually
arose is adjacent — **neither resolves to any user** — and it fails the same underlying test: there
is no way to tell a Technician observation from an admin one, because there is no session of either
kind. Reporting a non-admin result from here would have been a fabricated result (Rule 12), which the
brief correctly identified as the most damaging thing this session could do.

## Why no workaround was attempted beyond diagnosis

**The shared half of the credentials is alive** — proven, not assumed: a sibling worker's cookie file
carries a byte-identical `sv_sso_session` and `cf_clearance` and returns **HTTP 200 with 42
permissions** on its own branch. **`PHPSESSID` is per-branch**, proven both ways. So the failure is
precisely and only the two Filters `PHPSESSID` values.

The single documented recovery is `POST /api/quick-login`, and it is **banned for this session**
because it rotates the shared `sv_sso_session` — signing out the two sibling workers live on Schedule
and Reports, and potentially the QA lead's own browser. Five alternative session-exchange endpoints
were probed and all returned 404; the SPA sets no cookie; the API returns 409 rather than a followable
SSO redirect. **There is no non-destructive route.**

A canary — the Schedule sibling's session — was checked before and after every probe and never moved
off HTTP 200. **Nothing this session did cost anyone else their work.**

## ⚠️ A working admin session would NOT have fixed this

Worth stating plainly, because it is the thing most likely to be misread. The blocked cases assert
what a **Technician** sees. That needs the build driven **as that user**, and the only handle on that
identity is the second `PHPSESSID`. The alternatives — `switch-user` and `quick-login` — are banned
for the same reason as above.

**So the ask is specific: a live `PHPSESSID` for `bilal.muzamil+filters@shopview.com` on branch
`sv8785`.** A fresh `cf_clearance` will not help; the one supplied is already good. A whole new
sign-in is not needed either.

## The blocked set is 8 cases, not 11 — and only 2 are blocked *by the login*

The brief says 11. The committed ledger from yesterday's pass
(`build/filters/build-verify-2026-08-11/BUILD-VERIFICATION.md`) names **8**:

| Case | Area | What it is waiting on |
|---|---|---|
| [C29613](https://shopview.testrail.io/index.php?/cases/view/29613) | Persistence | not driven; no login-specific blocker on the case |
| [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | Persistence | not driven; no login-specific blocker on the case |
| [C29615](https://shopview.testrail.io/index.php?/cases/view/29615) | Persistence | **a second test login** — stated on the case |
| [C29616](https://shopview.testrail.io/index.php?/cases/view/29616) | Persistence | not driven; carries `EXPECT FAIL (SV-8832)` |
| [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | Persistence | **the QA lead's ruling** — a login does not unblock it |
| [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | Persistence | **an account whose filters predate the redesign** — a login does not unblock it |
| [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) | API | **a second test login** — stated on the case |
| [C43560](https://shopview.testrail.io/index.php?/cases/view/43560) | Persistence | not driven; no login-specific blocker on the case |

**So a second sign-in unblocks the build-check of 8, but clears the stated blocker on only 2.**
C38880 and C38881 need a ruling and a data state respectively, and would still be held.

## 🔴 And the part that should be read before the release

**[C29615](https://shopview.testrail.io/index.php?/cases/view/29615) — the case whose whole assertion
is that one user's saved filters do not reach another — is already marked PASSED**, by user 7
(Ahtasham Amjad) on 6 August at 09:49Z, with an empty comment, while its own marker still reads
`AUTOMATION: HOLD - needs a second test login`.

That is either evidence the blocker was solvable a week ago, or a pass recorded without the per-user
step being driven. **It is another author's result on our case, so it is reported and not touched**
(Rule 38). Four more held cases carry the same pattern — see `FINDINGS.md` §2.
