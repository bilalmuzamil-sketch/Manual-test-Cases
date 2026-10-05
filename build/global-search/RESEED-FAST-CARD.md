# 🚀 RESEED GLOBAL SEARCH — the fast card

**One page. If you read nothing else about seeding, read this.**
The redeployments clear the data. This card exists so putting it back is a command, not a project.

---

## The whole thing, from your side

### 1 · Say one of these — and nothing else

| You say | What gets rebuilt | Where |
|---|---|---|
| **`RESEED GLOBAL SEARCH STAGING`** | **everything** — all 7 universes, ~223 records | `app.staging.shopview.com`, workplace **Staging Heavy Duty - 9919** |
| **`RESEED GLOBAL SEARCH QA`** | **everything** — all 7 universes | `sv9160.qa.shopview.com` |
| **`RESEED GLOBAL SEARCH LIVE`** | **everything** — Global Search V2 shipped to production on 2026-10-01 (`v26.40.0`) | `app.shopview.com`, workplace **Trucks Hill 2** |
| **`RESEED GLOBAL SEARCH sv<NNNN>`** — e.g. `RESEED GLOBAL SEARCH sv10740` | **everything** — **any other QA branch**, by its number. Its data is kept separate from every other branch's. First done on **sv10740**, 2026-10-05: all 7 universes PRESENT, build `v26.40.3-da63248` | `sv<NNNN>.qa.shopview.com`, workplace **Staging Heavy Duty - 9919** |

> 🔴 **A QA branch shows its own work-order prefix.** On sv10740 work orders read **`S10740-…`**,
> purchase orders **`I10740-…`** — not `S2-…`. Cases that name `S2-15430` use **`S10740-17584`**
> there. The checks read the prefix off the search; never type the production one on a branch.

### 2 · Paste me three values

Open the environment in your browser, press **F12 → Application → Cookies**, and copy these three:

```
sv_sso_session      (64 characters)
PHPSESSID           (32 characters)
cf_clearance        (the long one)
```

**That is the only thing I need from you, and the only step I cannot do myself.** Paste the three
values in any order — I can tell them apart by length.

> **Why you still have to do this:** `cf_clearance` is Cloudflare's, it expires, and it cannot be
> minted from inside the container. Everything else self-heals: if the login has lapsed the script
> signs itself back in.

### 3 · I run one command and report back

```bash
cd build/global-search/seeding
./reseed_everything.sh staging          # or qa, or live
```

**Expect 25–45 minutes for a full rebuild.** The script prints the time each step took and a total
at the end, so the next run has a real number rather than an estimate.

---

## What you get back

A single verdict — **and it is a verdict about the SEARCH, not about the database**:

```
✅ RESEED EVERYTHING COMPLETE — and PROVEN, not just created.
 total: 31m 12s
```

Every universe is created, then **searched for**. A run is finished when the search returns the
records. *"The record exists"* is not *"the search returns it"* — a catalogue part with no stock row
sits happily in the database and is invisible to search, and that has produced a false pass here
before.

---

## 🔴 Production is different in three ways, and all three bite

**It now runs V2.** Until 2026-10-01 production ran V1 and took one universe; it now answers
`/api/search` and `/api/global-search/fetch` 404s there. The script no longer takes anyone's word
for this — it **measures** which search is deployed before choosing a verifier, and says so.

**There is no quick-login.** Production is `PHPSESSID` only, minted by `POST /api/login`; quick-login
500s there. So the one thing I need is a **username and password**, not three cookies.

**🔴 A fresh login kills the previous session — so production uses a DEDICATED ACCOUNT.** Logging in
as the QA lead killed the browser he was working in, three times, each time stopping a half-built
reseed. The fix is an account nobody is sitting in:
`bilal.muzamil+serviceadvisornoreports@shopview.com`. Its password lives in **`/tmp/prod/login.json`,
`chmod 600`, never committed** (Rule 82 — this repo is public), and it is re-supplied per container.

**With that file present the run now heals itself.** `seed.py` re-mints the session inside its own
`call()` the moment a 401 says `session_expired`, and the reseed script re-mints and retries any
step once — which covers `verify_ranking.py` and `status.py`, the two tools that carry their own
request code. Both paths were proved by deliberately corrupting the session mid-run on
2026-10-01. Without the credential file nothing is invented: the 401 is reported exactly as before.

A full production run takes **~24 minutes** and needed **zero** re-logins once it had its own account.

---

## Before you ask me to reseed: check whether you need to

A redeploy does **not** always take everything. One took 32 of 33 records; another took none.

```bash
cd build/global-search/seeding && python3 status.py
```

Read-only, a few seconds, and it tells you the build marker, whether it changed, and every universe
as **PRESENT / PARTIAL / GONE** with the missing records named.

**If only some universes are short, I can resume instead of rebuilding:**

```bash
./reseed_everything.sh staging 12       # start at step 12, skip what is intact
```

| Steps | Universe | Records |
|---|---|---|
| 1–1b | V1-regression | 11 |
| 2–5 | Fibridge V2 + work-order statuses | 39 |
| 6 | Permission role fixtures | 7 roles |
| 7–8 | Purchase orders + vendor invoices | — |
| 9–11 | Ranking, fuzzy and the algorithm cases | 93 |
| 12–14 | Same-record permission toggle + its PO/invoice | 20 |
| 15–16 | SV-10279 prefix parity · per-tab prefix | 12 + 14 |
| **17–17c** | **Search results integrity** (SV-10619 / SV-10551) | **42** |
| **17d** | Lead technician + service advisor on a seeded work order (SRI-WO-C2 / C3) | 2 assignments |

---

## The three things that waste the most time, and how the script handles them

**The QA branch switches itself off.** Every call then answers `403 AccessDenied` — which is not the
API refusing you, it is a redirect to a parking page. No cookie fixes it. The script **wakes the
branch itself** before it starts.

**The session has lapsed.** On QA and staging the script **signs itself back in**. On production it
stops and asks, because quick-login returns 500 there.

**The branch redeploys mid-run.** Then records created before it are gone. The script prints the
build marker **before and after** and tells you to run it again if it moved. This happened on
2026-09-29 and a probe reported 0 rows for data that was untouched — *a zero right after a redeploy
is a question, not an answer.*

---

## After a reseed, two things are true and worth knowing

**Record numbers change.** Work order, part sale, purchase order and invoice numbers are assigned by
the branch, so `S-34379` today is something else tomorrow. Anything quoting one — including the
manual-QA workbook — must re-read it from the seed state, never trust the old value. (Rule 111.)

**Commit the state files.** Git is the only durable store; the container is not.

```bash
git add -- build/global-search/seeding/
python3 build/testing-tools/scan_secrets.py --staged
git commit && git push
```

---

## Where the detail lives

| | |
|---|---|
| Every trap, count target and non-seedable item | `seeding/RESEED-KNOWLEDGE.md` |
| The per-universe keywords, if you want just one | `seeding/RESEED.md` |
| What the newest universe is for, and what building it proved | `../search-results-integrity/SEEDED-DATA-AND-WHAT-IT-PROVED.md` |
| The method for standing up a kit for any OTHER feature | `../skills/20-FEATURE-DATA-SEEDING.md` |
