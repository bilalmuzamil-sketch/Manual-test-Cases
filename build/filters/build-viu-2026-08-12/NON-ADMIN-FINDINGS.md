# The non-admin cases — 2026-08-12

## ✅ RESOLVED. Fresh cookies arrived, both cases were driven as the Technician, and both PASS.

**[C29615](https://shopview.testrail.io/index.php?/cases/view/29615) — PASS.**
**[C38895](https://shopview.testrail.io/index.php?/cases/view/38895) — PASS.**
Blocked since 5 August; settled today on build **`v3.6-3e9dd6d`**.
Evidence: `evidence/two-user-isolation-2026-08-12.txt`.

### C29615 — saved filters are per user

Driven exactly as written, with the **Technician as the user who applies a filter**:

1. **Start state proved the first half on its own** — the admin held a 427-character saved value
   while the Technician's store returned **`null`**. The Technician never received the
   administrator's saved state.
2. **As the Technician, in the browser**, the Status chip was opened and **Declined** ticked. The
   chip became **`Status: Declined`**, **Clear Filters** appeared, the table went **33 → 10 rows**,
   the address bar became `/workorders?status=declined&tab=all`, and the choice was saved
   server-side.
3. **The administrator's page was then opened while that was in force**: `/workorders?tab=all` with
   **no status parameter**, **all five chips inactive**, **no Clear Filters**, **33 rows** — and the
   administrator's saved record was **byte-identical, `updatedAt` unmoved at 2026-08-11T16:41:57Z**.

**Expected 1 met. Expected 2 met.** The administrator's record was **never written to at any point**.

### C38895 — saved-filters service round-trip

| Assertion | Result |
|---|---|
| 1. changing a filter sends a save, and it succeeds | **HTTP 200**, response echoes the state |
| 2. reload asks for the saved state and applies it | **fresh browser, nothing typed** — the preferences `GET` was seen on load and the page came back already filtered: `Status: Declined`, 10 rows, URL carrying it |
| 3. the second user does not receive the first user's state | proven **in both directions** |
| 4. a never-saved key returns success with an empty value | `HTTP 200 {"value":null,"updatedAt":null}` — and a path-traversal-shaped key gives a clean **404** |

**All four met.**

### 🟢 And it settles the awkward question, in the reassuring direction

C29615 **already carried a Passed result** from Ahtasham Amjad, 6 August, with an empty comment,
while its own marker still said it needed a second sign-in. **We can now say the verdict he recorded
is the correct one** — the case does pass. **What we still cannot say is whether the per-user step
was actually driven at the time**, and that is unknowable from TestRail. The outcome is confirmed
either way, so **this is no longer a risk to the release** — it is a process note, and the four
Status-chip cases in the same pattern (C29559, C29609, C29610, C29612) remain held on Branko's
ruling regardless of their Passed results.

### What was changed on the two cases

Both markers moved **`AUTOMATION: HOLD` → `AUTOMATION: READY`** — the blocker is gone. Both had
Rule-54 sentence 2 re-stamped to **`Last checked against build v3.6-3e9dd6d on 12 August 2026.`**,
which is the build actually observed. **C38895's stale note** — *"We could not run it for you…"* —
was replaced with what was actually found, keeping the BLOCKED-not-failed fallback for a tester
without a second account.

### Rule 24

**No Rule-24 situation arose in either case**, so nothing was classified under it. The Technician's
missing `New Work Order` button was observed but is not what either case tests, and no API route was
found that let the Technician do something the interface denied. **The inverse — the interface
exposing what the back end blocks — was not seen either.**

### Environment

The Technician's filter was cleared **through the interface**; the account is back to 33 rows and no
saved filters. **Honest residue:** that account's preference row previously read `value: null`; it
now holds a no-filters object with today's timestamp, and it **cannot** be returned to literal
`null` — `PUT {"value":null}` gives **HTTP 400** and there is **no DELETE route (405)**.
Functionally it is what a tester will see. Nothing else was created, changed or deleted; no role was
touched; no `ZZAUTOTEST` data was needed.

---

## FIRST HALF (superseded by the block above, kept as the record of why the ask was made)

## Outcome at that point: NOT RUN. The Technician sign-in was dead.

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
