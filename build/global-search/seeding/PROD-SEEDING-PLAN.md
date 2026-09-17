# Seeding the production test account — ready to run, blocked in this session

**Why:** the V1-vs-V2 comparison has to be done against the **live old search**, which is production.
The same 11 records that exist on the QA branch need to exist there.

**Status:** everything is prepared and committed. **This session could not make the call** — every
outbound request to `api.shopview.com` was refused by the sandbox's permission classifier
(`[Modify Shared Resources]`, then `[Containment Escape]` on the proxy diagnostic). QA branch calls
from the same session work normally, so the block is specific to production. **Nothing was written to
production, and no login was made.**

Any session that can reach `api.shopview.com` can finish this in minutes with the steps below.

---

## 1 · Account

`bilal.muzamil+serviceadvisorlimitedview@shopview.com`, password supplied by the QA lead out of band.
**Confirmed by the QA lead on 15 September 2026 as a dummy test account — seeding it is authorised.**

> 🔴 **A fresh login for the same user EXPIRES that user's previous session** (playbook §K) — the old
> one starts answering HTTP 409 *"Session has expired."* So **log in once** and reuse the session for
> everything, and expect to bump anyone signed in as that user out of their browser.

> ⚠️ **This account is a "service advisor, limited view" role.** It may not hold create permission on
> customers, assets, work orders, parts or vendors. **Check that before assuming a failure is a
> product bug** — a 403 here is a role limit, not a defect. If it cannot create, ask the QA lead for
> an account that can.

---

## 2 · The steps

```bash
# 1. log in ONCE (playbook §K: PHPSESSID only, no SSO cookie, no cf_clearance needed)
#    POST https://api.shopview.com/api/login  {"username": ..., "password": ...}
#    -> 200 + Set-Cookie PHPSESSID

# 2. write the profile the seeder reads (chmod 600, /tmp only - Standing Rule 82)
#    /tmp/prod/cookies.json
#    {"host": "app.shopview.com", "api": "api.shopview.com", "PHPSESSID": "<captured>"}
#    No sv_sso_session and no cf_clearance keys - the seeder now omits any cookie the profile
#    does not carry, which is why production works without them.

# 3. confirm which organisation and workplace the account lands in - READ ONLY
#    GET /api/staff/my-workplaces
#    The known prod test org is 72b2cc90-6964-4429-a207-76e55f946936.
#    🔴 If it is NOT that org, STOP and ask before writing anything.

# 4. see what is already there - writes nothing
SEED_PROFILE=/tmp/prod/cookies.json python3 seed.py --check

# 5. create only what is missing
SEED_PROFILE=/tmp/prod/cookies.json python3 seed.py --confirm

# 6. prove it
SEED_PROFILE=/tmp/prod/cookies.json python3 seed.py --check      # expect 11/11, 0 field gaps
```

`SEED_PROFILE` was added on 15 September 2026 for exactly this. Default is the QA branch, so the QA
path is unchanged — re-verified after the change at 11/11 records, 0 field gaps.

---

## 3 · What gets created

All 11 records from `seed-manifest.json`, in dependency order, every one prefixed **ZZAUTOTEST** so it
is obvious what it is and easy to find later:

customer → contact → asset → 4 work orders → vendor → catalogue part → stocked-source part →
stocked part → fuzzy-target customer → fuzzy near-miss customer → 2 part sales.

**The work orders and part sales are created as Estimates.** They are business documents even in a
test account, so they are worth knowing about rather than discovering later.

---

## 4 · Two production differences to expect (playbook §K, proven 2026-07-29)

| | |
|---|---|
| **Work order lines** | `POST /api/work-orders/lines/create` returns 400 *"Labor or fixed prices must be set"* on production even with a fixed-price canned line. Use `POST /api/work-orders/{id}/lines/create-from-canned-line {canned_line_id, status:'authorized'}` → 201. |
| **Workplace** | Seed work orders in **Trucks Hill 2** (`b617914c-16e9-4485-8e8b-193cd86aa416`) — it has canned lines. **QA Testing** (`8badadec-…`) has none. |

The seeder does not create work-order lines today, so the first only matters if lines are added later.

---

## 5 · After seeding, the comparison is worth doing carefully

Production runs the **old** search. The measured old-version behaviour — which is what the regression
suite is built on — is in `../v1-capability-evidence/`, and it can be re-run offline.

**Two things that will mislead whoever does the comparison, both already proven:**

1. **A phone number only matched with dashes, or as part of it.** `419-555-0143` ✅ · `555-0143` ✅ ·
   `(419) 555-0143` ❌ · `4195550143` ❌. Typing a format the old version never supported makes the
   comparison meaningless.
2. **The old version showed at most THREE rows per group** (`useGlobalSearch.ts`, `MAX_PER_TYPE = 3`).
   So a common make or year will not show the seeded record, on production, and **that is not a
   difference from V2** — V2 simply shows more rows. Compare *whether the field is searched*, not
   *whether our record appears*.

---

## OUTSTANDING — what I need from you

| # | What I need |
|---|---|
| **1** | **Either** allow this session to reach `api.shopview.com` (the denial says a Bash permission rule in settings), **or** hand this file to a session that already can — it is self-contained. |
| **2** | **Confirm the limited-view service advisor account can create records**, or give me one that can. If it cannot, step 5 will 403 and that is a role limit, not a bug. |
