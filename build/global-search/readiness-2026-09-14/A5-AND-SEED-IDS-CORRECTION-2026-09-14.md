# 🔴 CORRECTION — A5 re-tested, and a real defect found in MY OWN seed record

**Date:** 2026-09-14, second session · **Supersedes** the A5 paragraph in `READINESS-VERDICT-2026-09-14.md`

## 1 · THE COMMITTED SEED IDs ARE WRONG — this is a defect in my work, not the build

`build/global-search/qa-seed-2026-09-14/qa-seed-state.json` records the seeded customer as
**`c01eab9e-e400-474c-aaa9-a8a93a346add`**.

**That id does not exist.** `GET /api/customers/c01eab9e-…` → **404**, and so does `/api/companies/…`.

The customer itself **is** there — searching `ZZAUTOTEST` returns
**`ZZAUTOTEST Bridgeport Hauling`**, postal `44872-9931`, city `Fernvale` — under a **different id:**

> **`a1d08451-0214-41a4-983f-7f878ff7bcf0`**

**Why this matters more than it looks.** Every downstream id in that file is now suspect — contact,
asset, vendor, both parts, the inventory record. Anything that consumed those ids (including my own
A5 test, which is how this surfaced) was pointing at nothing. **The committed seed state must be
rebuilt from live lookups before the run.** Until then, treat `qa-seed-state.json` as unreliable.

Either the environment was refreshed and the records recreated, or the ids were recorded wrongly on
14 September. **I cannot yet tell which**, and I will not guess — the distinction matters, because one
means "re-record the ids" and the other means "the data may have been wiped and reseeded differently."

## 2 · A5 — re-tested properly, and it SURVIVES, but one doubt remains

**The three outcomes are now cleanly separated, which they were not before:**

| Condition | Result |
|---|---|
| Nonexistent / wrong `company_id` | **400** `{"company_id":"Not found"}` — correct behaviour |
| Expired session | **409** `{"error":"Session has expired."}` — clean |
| **Valid existing `company_id`, session answering 200 on three GETs immediately before** | **500** + request id `888fcd13-de21-4b1b-81ae-6613f703592c` |

So the original 500s were **partly** explained by a wrong id — but not away. With the **correct** id
`a1d08451-…`, on a session that had just answered `200` on `/api/search`, `/api/work-orders` and
`/api/part-sales`, the create still returns **500**.

🔴 **THE ONE DOUBT I HAVE NOT KILLED.** This environment expires sessions **within minutes** (see §3).
I have proved the session was alive *before* the 500. I have **not** proved it was alive *after* — so a
session dying mid-request cannot yet be fully excluded.

**The test that settles it, and it takes 30 seconds:** on a fresh session, run
**GET → POST create → GET** in that order. If the trailing GET returns **200**, the session survived the
POST and the **500 is a real defect**. If it returns 409, the session died and A5 is withdrawn.
**Do not file A5 until that sandwich has been run.**

## 3 · NEW OPERATIONAL FINDING — QA sessions here die in minutes

Twice today every endpoint went from `200` to `409 "Session has expired."` within a few minutes of a
cookie refresh. The execution session must plan for this: **expect 409 mid-run, refresh, and re-check
anything measured just before it.**

**This also invalidates one line in the readiness verdict.** I wrote that the four seeded work orders
`S9160-17580…17583` were "NOT FOUND". **That result came back on an already-expired session and proves
nothing.** Their existence is **unverified**, not absent.

## 4 · WHAT THIS CHANGES IN THE READINESS VERDICT

| Verdict line | Status now |
|---|---|
| Coverage — 65/65, 58 cases, source audit 58/58 | ✅ **unchanged** — proved independently of the environment |
| "31 cases READY — seeded 14 Sep" | ⚠️ **NOW UNVERIFIED.** The records appear to exist, but the recorded ids are wrong, so the seed state has to be rebuilt and re-checked |
| "A5 is a confirmed defect" | ⚠️ **HOLD** — stronger evidence than before, but do not file until the GET-POST-GET sandwich passes |
| "A5 wasn't session expiry because expiry returns 409" | ❌ **That reasoning was too quick** and I am withdrawing it. It happened to reach the right place, but a session dying *during* a request is not excluded by the fact that a fully-expired one returns 409 |
| 18 cases not ready (roles, second location, second org) | ✅ **unchanged** |

## OUTSTANDING — what I need from you

| # | What I need | Why |
|---|---|---|
| 1 | **Fresh QA cookies, and I will run the GET-POST-GET sandwich immediately** | It is the only thing standing between A5 being a real defect and a withdrawn one. **A false defect is exactly what must not reach Jira** |
| 2 | With the same cookies I will **rebuild every seeded id from live lookups** and recommit the seed state | Until then the seed file points at records that do not answer |
| 3 | Tell `manual-test-cases-c2` **not to file A5 yet** | It is in the handoff as a confirmed defect; that is now premature |
