# Filters — findings, verify-final, 2026-08-12

> **⚠️ PARTIAL — stood down during orientation, before any write and before the build was opened.**
> The QA lead redirected the budget: *"Get done with everything left for schedule FIRST."*

## THE HEADLINE, stated the way it should be quoted

**0 of 115 Filters cases were re-stamped, and 0 had their preconditions and steps walked.**
**12 of 115 rest on the build that ships tomorrow — unchanged from where this session found it.**

Nothing was written to TestRail, nothing to Jira, nothing to the run. **No page of the application
was opened**, so this folder contains no claim about the product's behaviour.

## 1 · What this session is worth to the next one

Three things that would otherwise have to be redone, all verified live:

**The build has not moved.** `v3.6-3e9dd6d`, last-modified 11 August 07:45:44 GMT, sha256
`fa01a525…`. This is the same build the 11 August pass checked 106 of 114 cases against — **which is
the entire premise of the re-stamp**, and it now stands verified rather than assumed.

**Both sign-ins work and are provably different people.** 42 permissions and `view_mode: full`
against **6 and `tech`**; `admin@shopview.com` against **`bilal.muzamil+filters@shopview.com`**; and
`GET /api/staff` returning **200 against 403**. The contrast is the proof. So the second-identity
blocker that has stood since 5 August is cleared **at the access level** — though nothing was
observed through it.

**The suite is counted and reconciled.** 115 ours / 120 live; the five foreign cases re-read and
proven byte-identical including `updated_on`/`updated_by`; run 352 holding 115 tests and 473 results
with `include_all` false and the case-id sets equal in both directions.

## 2 · The re-stamp worklist is fully specified and un-started

**93 cases name `v3.4.2-d00239b` from 5 August — a whole minor version behind what is running.**
12 already name `v3.6-3e9dd6d`; 10 carry no build sentence at all.

**But that understates the cases in their favour, not against them.** Yesterday's pass checked 106 of
114 against this very build and wrote to only the 8 it had to correct. **Roughly ninety cases were
checked against the running build and their stamps do not say so.**

**Which of them have EARNED a re-stamp is precisely the question that was not answered**, because it
needs a union harvest of visible text nodes taken from this build, and that harvest was never taken.
The bar, the three buckets and the two traps are written down in `RESTAMP-EVIDENCE.md` before any
result exists — which is the right order, and means the next worker inherits a standard rather than a
number to beat.

## 3 · What a tester faces tomorrow, from sources rather than from the build

| | cases |
|---|---|
| Runnable | **97** — 90 `READY` + 7 `READY - EXPECT FAIL` |
| Held | **18** |
| **Runnable and still Untested** | **29** |
| Held and still Untested | **14** |

**The real morning workload is 29 cases, not 43.** The other 14 will consume tester time and produce
results that do not mean what they appear to mean. The committed skip list is
`build/filters/build-viu-2026-08-12/SKIP-LIST.md`.

**The arithmetic gate passes both ways: 90 + 7 = 97, and 115 − 18 = 97.**

## 4 · Carried forward unresolved — none of it created by this session

**Five held cases already carry a `Passed` result**, all graded by user 7 with empty comments:
C29559, C29609, C29610, C29612 and — most sharply —
[C29615](https://shopview.testrail.io/index.php?/cases/view/29615), whose entire assertion is that
**one person's saved filters do not reach another**. That cannot be observed from a single sign-in.
So either a second login existed on 6 August, in which case everyone has been waiting on something
that already existed; or the per-user step was never driven, and the suite reports coverage nobody
has seen. **Both are worth knowing before a release, and neither is ours to settle.** Another
author's result on our case: reported, not touched.

**The `AUTOMATION: HOLD` marker is not stopping testers running held cases.** It is labelled
*AUTOMATION*, it sits last in Expected Results, and a manual tester reasonably reads it as somebody
else's concern. With 14 held cases still Untested, the same thing happens tomorrow unless the skip
list reaches the testers directly.

**Branko's Parts and Reports product write-up** still blocks 8 of the 18 held cases, outstanding
since 27 July. **No login and no build clears those.**

## 5 · Environment

**Nothing created, nothing changed, nothing to clean up.** Every call made was a `GET`. No work
order, customer, filter, saved view, role or user was touched; no `ZZAUTOTEST` data exists because
none was needed. `admin@shopview.com` was not edited. `quick-login` and `switch-user` were never
called.

## OUTSTANDING — what I need from you

1. **Branko's Parts and Reports product write-up** — blocks 8 held cases; outstanding since 27 July.
2. **A ruling on C38880** — the behaviour *is* documented in `S10-R4`; it is held on your decision
   only.
3. **A view on the five held-but-Passed results** (§4) — specifically whether C29615's per-user step
   was ever driven. Another author's results; not ours to change.
4. **Confirmation that the skip list reaches the testers**, not just the repository.
