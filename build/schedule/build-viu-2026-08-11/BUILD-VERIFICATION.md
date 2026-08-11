# Schedule build VIU (labels and wordings) — 2026-08-11, third attempt

## 🟢 THE GOOD NEWS FIRST — THE LOCATION BOUNCE IS GONE

**The QA lead's fix worked.** `https://sv8685.qa.shopview.com/schedule` **no longer redirects to
`/administration/locations`.** That blocker — the one that stopped the second attempt dead — is
**cleared, and it is cleared by observation, not by assumption** (screenshot: `evidence/step0-landing.png`).

## 🔴 AND THE BAD NEWS — A DIFFERENT, NEWER BLOCKER, AND IT IS ALMOST CERTAINLY A SIDE EFFECT OF THAT SAME FIX

**`/schedule` now redirects to `/login?redirect=/schedule` — the sign-in page.** The held session is
**dead**: every API read returns **HTTP 409 `{"errors":[{"error":"Session has expired."}]}`**.

**0 of 174 build-verified. 174 remain unverified.**

**0 TestRail writes · 0 Jira calls · 0 environment changes · `quick-login` and `switch-user` never
called.**

---

## 1 · THE BUILD AND THE LOCATION

| | |
|---|---|
| **App version** | **`v3.5-65d6500`** |
| **`index.html` last-modified** | **Tue, 11 Aug 2026 09:33:33 GMT** |
| **etag** | `3250d285ffcf50626363a578fe273071` |
| **`index.html` sha256** | `9348ca09d6167375dc52bfc29bf3b9f8c4163dede2ea5ea62269b186c9cc5f6f` |
| **Read at pass START** | **2026-08-11T13:16:21Z** |
| **Read at pass END** | **2026-08-11T13:20:42Z** |
| **Moves under the pass** | **0** — version, last-modified, etag **and the sha256** identical at both reads |
| **Location intended** | `Staging Heavy Duty - 9919` (`b3c8c820-f815-4cf1-8938-10956c5ee71a`, America/Edmonton) |
| **Location CONFIRMED on screen** | ❌ **NO — and this is stated plainly rather than glossed** |
| **Account** | `admin@shopview.com` (Admin) |

### 1.1 · WORKING HOURS — a precondition of this whole pass, REPORTED BY THE QA LEAD AND **NOT** VERIFIED BY US

The QA lead has **set working hours on `admin@shopview.com`**. As he reports them:

| | |
|---|---|
| *"Set working hours for this technician"* | **ON** |
| **Monday – Friday** | **7:00 AM – 7:00 PM** |
| **Saturday** | **Not working** |
| **Sunday** | **UNKNOWN — below the fold in his screenshot** |

**⚠️ EVERY ROW OF THAT TABLE IS HIS REPORT, NOT OUR OBSERVATION. WE COULD NOT READ IT LIVE.** The
session is dead (§2), so no configuration could be fetched at all — the probe at **13:22:38Z** returned
**409** on `/api/staff` exactly as on everything else. **Under Rule 12 that makes all of it NOT
VERIFIED**, and it is recorded that way rather than restated as fact. **Sunday is doubly unknown:
unconfirmed by him and unreadable by us.**

**Reading it live is the FIRST action once there is a session**, before any hours-dependent
observation is taken.

**WHY THIS MATTERS MORE THAN IT LOOKS — AND WHY IT IS RECORDED BEFORE ANY OBSERVATION EXISTS.** These
hours change what the conflict-detection, capacity-bar and Tech Hours cases should show. With
07:00–19:00 Monday–Friday and Saturday off, a shift at **06:00**, at **20:00**, or **on a Saturday**
should now raise the documented conflict; **previously no hours were configured at all**, so those
paths could not fire. **A Schedule observation is only reproducible if the reader knows what hours
were in force when it was taken** — which is why this sits beside the build marker and the location
rather than in a footnote.

**AND IT IS EXACTLY THE TRAP THAT ALREADY COST US A TICKET.**
[SV-8923](https://shopview.atlassian.net/browse/SV-8923) had to be **withdrawn as invalid** because it
was raised against a shop with **no** business hours configured, when the source case's own
precondition required them. **So the discipline for every hours-dependent case is: read the
precondition the CASE states, check it against the configuration actually in force, and only then
observe.** Where a case requires **different** hours from these, that is recorded **on that case's
own record as a blocked observation with the reason** — the case is **not** reinterpreted to fit the
environment, and the environment is **not** adjusted to fit the case (§3).

**On the location, the honest position:** the QA lead's instruction is to confirm the selector reads
`Staging Heavy Duty - 9919` **before** taking any observation. **That confirmation could not be
made — the application never got past the sign-in page, so there was no selector to read.** No
`change-location` call was made either. **The reason that costs us nothing is that no observation of
the product was taken at all**, so there is no reading in this pass that needs re-attributing to a
different shop. **Nothing here may be read as "the location was verified".**

---

## 2 · THE BLOCKER — DIAGNOSED, NOT ASSUMED

### 2.1 What was measured

Probed the **API** host first, never the app host (which answers 200 on any path and can therefore
never tell you anything — playbook §A trap 2):

```
GET https://sv8685api.qa.shopview.com/api/auth/me/fe-permissions  →  HTTP 409
{"errors":[{"error":"Session has expired."}]}
```

**Not transient, and not one endpoint:** repeated three times and probed across four endpoints
(`/api/auth/me/fe-permissions`, `/api/staff/my-workplaces`, `/api/organizations/settings`,
`/api/schedule/board`) — **409 every time.** Re-probed at **13:18:46Z, i.e. AFTER the QA lead set the
default location** — **still 409.**

### 2.2 The four false alarms, each ruled out by measurement

| Playbook §A trap | Ruled out by |
|---|---|
| **1 — expired `cf_clearance`** | The refusal arrives as **`application/problem+json` from `nginx/1.30.4`**, i.e. **the app's own JSON**, so the request *reached the application*. Cloudflare would return an HTML challenge. The app host also still serves `index.html` **200**. |
| **2 — the app host answering 200 on any path** | Every probe went to the **`…api.`** host. |
| **3 — a corrupted cookie header** | Validated before use: **exactly three `name=value` pairs, one line, no `Cookie: ` prefix**. |
| **4 — using another branch's `PHPSESSID`** | This is the **Schedule** set (`/tmp/qa-cookies/schedule-cookie-header.txt`), and it was **alive on this very branch 20 minutes earlier**. |

### 2.3 It is NOT a dead shared token — and the contrast proves it

The same set returns **409 on all three API hosts** (`sv8685api`, `sv8785api`, `sv8582api`) and
**never 401**. Because `sv_sso_session` + `cf_clearance` are the **shared** values and `PHPSESSID` is
per-branch, **a dead shared token would show as `401 {"error":"sso_required"}`** — which is exactly
what the **older Reports set does** on all three hosts, as a control. **Ours does not look like
that.** So the shared token is alive and **the session record behind our `PHPSESSID` has been
invalidated.**

### 2.4 The likeliest cause, and it is worth him knowing

**Editing a staff member's record immediately invalidates that user's held session — the very next
request returns HTTP 409 "Session has expired.", and the change applies only on a FRESH LOGIN.** That
is a recorded, proven behaviour of this estate (`build/APP-ACTIONS-PLAYBOOK.md`, *"Role change forces
re-auth (409)"*), and the playbook is explicit that **this 409 is expected, not an error.**

The QA lead edited **`admin@shopview.com`** — **the very account we are signed in as** — through the
Edit Staff Member dialog, to give it the default location. The timeline fits exactly:

| Time (UTC) | Event |
|---|---|
| ~**12:56 – 13:00** | Previous pass reading **HTTP 200** on this same cookie set |
| ~**13:14 – 13:18** | QA lead sets the default location on `admin@shopview.com` |
| **13:16:21** | First probe of this pass → **409** |
| **13:18:46** | Re-probe after his change → **409** |
| ~**13:20 – 13:22** | QA lead makes a **SECOND** edit to the same staff record — the working hours |
| **13:22:38** | Third probe → **409**, on four endpoints |

**⚠️ AND THE SECOND EDIT RE-ARMS THE SAME TRAP.** The working-hours change is **another edit to the
same staff record**, so it invalidates the session again by the same mechanism. **The practical
consequence, and it is the one thing that will waste a cookie set if it is missed: finish ALL account
configuration first, and only THEN sign in and send the cookies.** A set minted before the next edit
will be dead by the time it arrives.

**So his fix did the right thing and took our session with it.** That is not a defect in the product
and it is not a mistake on his part — it is the documented consequence of the edit, and it needs
one more step to clear: **a fresh sign-in.**

### 2.5 Corroborated from the browser, independently

Loading the exact entry point he gave, **cookies only — no `localStorage` seeding, no injected user
or workplace object** (deliberately, per the brief and Rules 12/57):

| Asked for | Landed on |
|---|---|
| `https://sv8685.qa.shopview.com/schedule` | **`https://sv8685.qa.shopview.com/login?redirect=/schedule`** |

Page title **`Login | ShopView`**, body *"Sign in to your account to continue"*
(`evidence/step0-landing.png`, `evidence/step0-landing.json`). **Two independent measurements — the
API's 409 and the SPA's redirect to `/login` — agree.**

**And note what it is NOT: it is not `/administration/locations`.** The second attempt's blocker is
genuinely gone.

---

## 3 · WHAT WAS DELIBERATELY NOT DONE

- **Nothing was seeded, injected or faked.** No default workplace was set, no `user` object carrying
  a workplace the account does not have was hydrated, no `localStorage` was pre-loaded. The brief and
  the QA lead's standing instruction both bar it, and it would make our own setup — not the build —
  the source of every observation.
- **No setting was changed on `admin@shopview.com`** — not the default location, and **not the
  working hours**. He has just configured that account deliberately, twice; touching it would cut
  across his own change and would make our setup, rather than the build, the source of every
  hours-dependent observation. **If a case turns out to need different hours, that will be reported
  as a blocked observation with the reason — not adjusted.**
- **`quick-login` was NOT called, and this is the one that hurts.** The sign-in page renders a
  **`DEV MODE — QUICK LOGIN`** panel with **`Admin`** and **`Tech`** buttons, plainly visible in the
  screenshot, and the playbook's own 409-recovery recipe is *"call `POST /api/quick-login {"key":"admin"}`,
  keep the returned `PHPSESSID`, swap that one value in"*. **It would very probably have worked in one
  call.** It was not called because it **rotates the shared `sv_sso_session` and signs out every
  concurrent worker on the other branches** — and a sibling is running a 174-case `update_case` pass on
  Schedule right now. The brief bars it twice. **So this is a deliberate, costed decision, not an
  oversight** — and it is the fastest thing to unblock if he is willing to authorise it (§5).
- **Zero TestRail writes.** `get_*` only; in fact no TestRail call was needed at all, because there
  was no observation to diff against.

---

## 4 · THE HONEST SPLIT

| | Count |
|---|---|
| Cases build-verified for labels and wordings this pass | **0** |
| Cases **not** verified | **174** |
| Reason | **The application could not be signed into.** The session behind the supplied cookie set is invalidated (HTTP 409), so the product was never reached. |

**0 + 174 = 174.** No case was inferred, and no label was taken from the specification, from our own
case text, or from a previous pass to pad that number (Rule 12).

**Unchanged from the previous pass, and still true:** no case's verdict rests on the build now
running — the split is **90 on `v3.5-7ec992f` · 78 on `v3.5-d122eef` (which no longer exists) · 6 on
`v3.5-af3a6e1`**.

---

## 5 · WHAT IS NEEDED — one thing, and there are two ways to give it

**A signed-in session on `sv8685` for the account he has just configured.** Either:

1. **A fresh cookie set** — sign in to `https://sv8685.qa.shopview.com` as `admin@shopview.com` and
   send the three values (`PHPSESSID`, `sv_sso_session`, `cf_clearance`). **This is the clean route:
   it disturbs no other worker.**
   **⚠️ TIMING MATTERS, AND IT IS THE ONE THING THAT WILL WASTE THE SET: sign in AFTER all account
   configuration is finished.** Each edit to that staff record kills the session that holds it, so a
   set minted before the next change will already be dead when it reaches us (§2.4).
2. **Or explicit authorisation for ONE `POST /api/quick-login {"key":"admin"}`** — the playbook's
   recovery recipe, one call, and it would almost certainly restore access immediately. **But it
   rotates the shared token and will sign out the sibling workers on the Filters and Report Suite
   branches**, so it needs his go-ahead *and* a moment when no sibling is mid-write. **Not taken
   unilaterally.**

**Once past it, the remaining work is mechanical and roughly an hour.** The label check-list is
already built and partitioned by the previous pass — **195 distinct strings** asserted across the 174
cases (`build/schedule/build-verify-2026-08-11/evidence/labels.json`, `partition.json`) — the diff
tool is written (`tools/diff_labels.py`), and this pass's harvest harness now **reaches and renders
the SPA correctly** (`tools/step0_land.cjs`, proven by the screenshot). They have somewhere to land
the moment there is a session.

---

## 6 · PROOFS

- **Build marker identical at pass start and pass end** — version, `last-modified`, `etag` **and the
  sha256 of `index.html`**. No redeploy under this pass.
- **TestRail: 0 writes, and 0 calls.** A sibling owns the Schedule write pass; its byte-verification
  baseline is untouched by us.
- **Jira: 0 calls of any kind.** The ticket-creation hold (Rule 62) stands untouched.
- **Environment: nothing created, seeded, modified or restored** — no data, no role, no setting, no
  default workplace, and no `change-location` call. **There is nothing to restore.**
- **`quick-login` / `switch-user`: never called.** No concurrent worker was signed out by us.
- **Secrets: none committed.** Cookie values live in `/tmp` only; the evidence files carry cookie
  **names and 8-character prefixes at most**, and the staged diff was scanned for all five live
  prefixes before commit — clean.
