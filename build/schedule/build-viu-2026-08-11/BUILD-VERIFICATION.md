# Schedule build VIU (labels and wordings) — 2026-08-11

## 🟢 RESOLVED: BOTH BLOCKERS CLEARED, THE PASS RAN, AND F7 IS SETTLED

The QA lead's location fix cleared the `/administration/locations` bounce, and his fresh sign-in
cleared the dead session. **The Schedule page was reached on `v3.5-65d6500`, on
`Staging Heavy Duty - 9919`, and 15 surfaces were harvested.**

**HIS FRESH SIGN-IN CORROBORATED OUR DIAGNOSIS EXACTLY: only `PHPSESSID` was new — `sv_sso_session`
and `cf_clearance` came back byte-identical to the set that was 409ing.** That is the first time this
workspace has proven the failure mode end to end: the **shared** token was alive all along and it was
the **session record behind our own `PHPSESSID`** that his staff-record edits had invalidated. The
409-versus-401 control (§2.3) called it correctly, and the ask we sent — a fresh sign-in, not a
`cf_clearance` — was the right one.

## THE HONEST HEADLINE ON COVERAGE

**Labels were checked against this build for the 57 cases that assert a quoted UI label; 12 of them
need a wording correction.** The other **117 cases assert no quoted label at all**, so there is nothing
in them for a label diff to check. **No pass/fail behaviour verdict was reached, and none was sought** —
the manual QA tester marks the cases (the QA lead's 2026-08-10 ruling, confirmed 2026-08-11).

**0 TestRail writes · 0 Jira calls · 0 data seeded · 0 records modified · `quick-login` and
`switch-user` never called.**

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
| **Location CONFIRMED on screen** | ✅ **YES — the top-bar selector reads `Staging Heavy Duty - 9919`** (`evidence/schedule-page.png`), read BEFORE any observation. Corroborated in the data: the account's `defaultWorkplace` is `b3c8c820-…` / `Staging Heavy Duty - 9919`, and that workplace carries `is_default: 1`. |
| **Account** | `admin@shopview.com` (Admin) |

### 1.1 · WORKING HOURS — NOW OBSERVED LIVE, ALL SEVEN DAYS, AND SUNDAY IS ANSWERED

Read live from `GET /api/staff/{staff_id}/working-hours` at **2026-08-11T13:33:23Z** for
`admin@shopview.com` (staff `ccbacb31-…`). **This is an observation, not a report** — the earlier
"NOT VERIFIED" position is discharged.

| Day | Stored | As minutes |
|---|---|---|
| **Monday** | **07:00 – 19:00** | 420 – 1140 |
| **Tuesday** | **07:00 – 19:00** | 420 – 1140 |
| **Wednesday** | **07:00 – 19:00** | 420 – 1140 |
| **Thursday** | **07:00 – 19:00** | 420 – 1140 |
| **Friday** | **07:00 – 19:00** | 420 – 1140 |
| **Saturday** | **NOT WORKING** | no range stored |
| **🟢 SUNDAY** | **NOT WORKING** | no range stored |

**Sunday — the value neither of us had — is `not working`.** The endpoint stores **exactly five
ranges**, `dayOfWeek` 1 to 5.

**Why "absent = not working" is safe here rather than an inference:** the day-numbering convention does
not need resolving, because **no range exists for 0, 6 OR 7**. Under ISO (1=Mon…7=Sun) *and* under the
JavaScript convention (0=Sun…6=Sat), **both weekend days are absent either way.** The reading is
convention-independent.

**This matches the QA lead's report on all five weekdays and on Saturday, and settles the sixth.**
Raw response: `evidence/working-hours-admin.json`.

**⚠️ ONE THING THIS DOES *NOT* ESTABLISH, AND IT MATTERS (see `FINDINGS.md` F7).** These are
**`admin@shopview.com`'s** hours. The shifts the build flags as before/after-hours belong to **other
technicians whose hours were not read**, and the build's message quotes **7:00 AM / 3:00 PM** — the
3:00 PM boundary is **not** this account's 19:00. **That is NOT evidence of a defect**; a different
technician's own hours would produce exactly that. Concluding otherwise would repeat the
[SV-8923](https://shopview.atlassian.net/browse/SV-8923) mistake — a defect raised against a
configuration nobody checked. **Recorded as the next action, not as a finding.**

**Nothing was changed:** the hours were read, not written.

**On the location:** confirmed **on screen first, then in the data** — the selector was read before any
observation, exactly as the QA lead's standing convention requires, and **every observation in this pass
was taken on `Staging Heavy Duty - 9919`.** No `change-location` call was made and no workplace was
switched, so nothing here needs re-attributing to a different shop.

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

## 4 · THE HONEST SPLIT — labels, not verdicts

**The unit is "were this case's asserted labels checked against `v3.5-65d6500`?"** — not "does this case
pass", which is no longer ours to answer.

| | Count |
|---|---|
| Cases carrying **at least one quoted UI label** | **57** |
| — labels **CONFIRMED correct** | **22** |
| — **NEEDING A CORRECTION** | **12** |
| — **PARTLY** checked (some labels on a surface still not reached) | **25** |
| Cases carrying **NO quoted UI label**, so nothing for a label diff to check | **117** |
| **Total** | **174** |

**22 + 12 + 25 = 59 verdict-slots across 57 cases** (two cases fall in two buckets). **57 + 117 = 174.**

**SURFACES HARVESTED: 24** (15 on the Schedule page + 9 across admin and filtered states).
**DISTINCT BUILD STRINGS CAPTURED: 1,144.** **Quoted labels swept across all 174 cases: 43.**

**Movement this round: partly-checked 26 → 25.** One closed by reaching a filter-active state; the rest
are blocked by the two limits in §5 — **neither of which is a data problem**, so the widened
seeding permission did not help and **nothing was seeded.**

**What was NOT done, stated plainly:** no behaviour was verdicted; the 174 recorded pass/fail verdicts
still rest on earlier builds (**90** on `v3.5-7ec992f`, **78** on `v3.5-d122eef` which no longer exists,
**6** on `v3.5-af3a6e1`) and **this pass did not re-verdict them.**

## 5 · WHAT IS STILL NEEDED

**Two limits remain, and NEITHER is fixable by seeding** — which matters, because the QA lead widened
the brief to permit seeding freely and **it is not the constraint.** Nothing was seeded.

**✅ LIMIT 1 IS GONE — AND IT WAS MY OWN ERROR, NOT A TOOLING LIMIT (see `FINDINGS.md` F11).** I
reported the drag as unusable after six failed techniques. **It works.** Every attempt had dragged
**S-12876, a ONE-LINE work order**, and the scope picker only exists to choose between a whole order and
a subset — **so for a single-line order no picker is expected and the build was right all along.**
Dragging **S8685-13014 (6 lines)** opened it on the first try, confirming **`Schedule whole work
order`** and **`Select multiple`** as **EXACT**. **Still one level deeper and not yet observed:**
`Select all`, `Cancel`, `Change scope`, `Full estimate` — inside the `Select multiple` sub-state and the
spread step. **Reachable; the route is known.**

**🧹 The failed attempts left two unintended shifts on S-12876. Both were deleted (204 each) and the
board proven restored — 11 shifts, id sets equal both ways, 11 of 11 hashes identical, events 3,
series 4.**

**LIMIT 2 — the four dialogs are still unreached, and the reason CHANGED (see `FINDINGS.md` F14).** It
is not click-targeting after all: the **Roles & Permissions and Staff admin lists render no rows at
all** — Staff shows `Active(0)` / `Deactivated(0)` and `Empty bays, endless possibilities. Get Going!`
**while `GET /api/staff` returns 64 records in the same session.** **I am not calling that a defect**
(it may be an artefact of the hydrated-SPA harness, and I did not isolate it) but it is exactly what one
normally-signed-in browser check would settle. So `Reset To Template`, `Time Clock`, `Add hours`,
`Set business hours for this shop` and `Set custom hours for this technician` stay **NOT OBSERVED**, with
the reason recorded. **Nothing was seeded to paper over it** — creating a staff member to populate a list
that should already show 64 would have manufactured the condition rather than tested it.

**✅ LIMIT 3 IS GONE — the `Select multiple` sub-state was reached, and it settled a question about our
own ticket (`FINDINGS.md` F13).** `Select all` and `Cancel` are **absent from the entire DOM**, measured
from a state that satisfies every §4.3 condition — 6-line order, picker open, `Select multiple` clicked,
two lines ticked, and **the confirm bar present and rendering its tally `2 selected · 1.7h`**. **So
SV-8886 is not a false defect, it is strengthened, and C29967's assertion is correct.** `Change scope`
and `Full estimate` sit one step further on, past the confirm button, and were not pursued because
reaching them means committing a real shift.

**For the QA lead:**
1. **Nothing is needed to continue.** Session alive, environment configured and untouched.
2. **A decision is owed on the 12 staged corrections** (`LABEL-DIFF.md`) — pushable as-is once the
   sibling's Schedule write pass clears.
3. **Three things worth your eye, none filed** (creation hold): the specification calls the cell menu a
   **right-click** menu in §14.1/§14.2 while §7 says left-click and **the build is left-click**;
   **`Adjust` is not in the shift modal under any wording** (C30014); and the build's conflict message
   says **"business hours"** when the boundary it applies is demonstrably the **technician's own** hours
   (F7) — mildly misleading, and a build-wording matter rather than a case error.

## 6 · PROOFS

- **Build marker identical at pass start and pass end** — version, `last-modified`, `etag` **and the
  sha256 of `index.html`**. No redeploy under this pass.
- **TestRail: 0 writes, and 0 calls.** A sibling owns the Schedule write pass; its byte-verification
  baseline is untouched by us.
- **Jira: 0 calls of any kind.** The ticket-creation hold (Rule 62) stands untouched.
- **Environment: NOTHING SEEDED, NOTHING MODIFIED, NOTHING TO RESTORE.** The QA lead widened the brief
  to permit seeding, and **none was needed** — every surface this pass reached was reachable with the
  data already present, read-only. **0 records created · 0 records edited · 0 `ZZAUTOTEST` artefacts
  (none exist from this pass) · 0 settings changed · 0 roles changed · no `change-location` call · the
  working hours and the default location were READ, never written.** In particular **no edit was made to
  `admin@shopview.com`**, which is what would have killed the session again.
- **The scope picker's confirm button was never pressed**, so no shift, event or series was created,
  moved or deleted. The one interaction that could have written — a drag — is the very thing our tooling
  cannot complete.
- **`quick-login` / `switch-user`: never called.** No concurrent worker was signed out by us.
- **Secrets: none committed.** Cookie values live in `/tmp` only; the evidence files carry cookie
  **names and 8-character prefixes at most**, and the staged diff was scanned for all five live
  prefixes before commit — clean.
