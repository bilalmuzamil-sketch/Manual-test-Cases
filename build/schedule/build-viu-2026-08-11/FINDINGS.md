# Schedule build VIU — findings, 2026-08-11

**Nothing here is filed anywhere.** The Jira ticket-creation hold is active (Standing Rule 62 and the
hold at its tail), and none of these is a product defect in any case. **0 Jira calls of any kind.**

---

## F1 · The location bounce is FIXED — and it is worth recording as a positive finding

The second attempt's blocker was that **every** route redirected to `/administration/locations`,
because `admin@shopview.com` had `default_workplace: null`. After the QA lead set the default
location, **`/schedule` no longer goes there.** Measured, not assumed: it now redirects to
`/login?redirect=/schedule` (`evidence/step0-landing.png`).

**Recorded because a cleared blocker is as worth knowing as a new one** — the next pass should not
re-derive the location diagnosis, or waste a run re-testing five routes to prove it.

**Not a defect. Nothing to file.**

---

## F2 · Editing a staff record kills that user's session — the documented behaviour, observed again, and it now has a cost worth naming

**Observation.** The session behind the supplied cookie set went from **HTTP 200 at ~13:00** to
**HTTP 409 `{"errors":[{"error":"Session has expired."}]}` at 13:16:21Z**, across every endpoint
tried, and stayed there through re-probes at 13:18:46Z and 13:22:38Z. In the same window the QA lead
edited `admin@shopview.com` **twice** — the default location, then the working hours.

**This is a recorded, expected behaviour of the estate, not a product defect.** The playbook already
holds it: *"Changing a user's role immediately invalidates the held session — the very next request
returns HTTP 409 'Session has expired.' (at +0ms). The new role applies on a fresh login… This 409 is
expected, not an error."* (`build/APP-ACTIONS-PLAYBOOK.md`, *Role change forces re-auth (409)*).

**What is genuinely new, and is the reason this is written up at all:** the playbook records it for a
**role** change. Here it fired on a **default-location** change and, apparently, again on a
**working-hours** change — i.e. it appears to be **any edit to the staff record**, not specifically the
role. **Stated as an observation with its limit: two edits, one dead session, and we could not read the
record afterwards to confirm which edit did it.** It is not asserted as proven.

**The operational consequence is the useful part, and it will otherwise burn a cookie set:**
**complete all account configuration FIRST, then sign in, then send the cookies.** A set minted
between two edits is dead on arrival.

**Not a defect. Nothing to file.** Belongs in the playbook as a widening of an existing entry —
**flagged, not edited from here**, since the playbook is shared and a sibling may be writing to it.

---

## F3 · A harness gotcha that cost the previous attempt, now solved

**`chromium.launch({proxy:{server:$HTTPS_PROXY}})` does NOT work on this estate** — the page lands on
**`about:blank`** with zero requests issued. Chromium cannot TLS the egress proxy directly.

**The pattern that does work** (and is what the previous pass's `boot.cjs` did, though that detail was
not written down as the reason): intercept **every** request with `ctx.route('**/*')`, re-issue it with
node `fetch` — which honours `HTTPS_PROXY` — and `route.fulfill()` the response back into the page,
attaching the cookie header on the way. Working implementation: `tools/step0_land.cjs`.

**Worth recording because the failure mode is silent:** no error, no timeout, just a blank page and an
empty request log, which reads exactly like a dead environment.

**Not a defect. Nothing to file.** Playbook §A candidate — flagged, not edited.

---

## F4 · The `PHPSESSID` 409 is distinguishable from a dead shared token, and the distinction was load-bearing today

Kept as a worked example because getting it wrong sends the wrong ask:

| Symptom | Meaning | What to ask for |
|---|---|---|
| **409** `Session has expired.`, `application/problem+json` from nginx | The request **reached the app**; the session record behind this `PHPSESSID` is invalidated | **A fresh sign-in** |
| **401** `{"error":"sso_required"}` on **all** branches on a byte-identical shared token | The **shared `sv_sso_session`** is dead | **A fresh `sv_sso_session`** |

Today's set gave **409 on all three API hosts and never 401**, while the older Reports set gave
**401 on all three** — a clean control, side by side, in the same minute. **So the ask is a fresh
sign-in, and asking for a `cf_clearance` or "new cookies" would have been the wrong ask.**

**Not a defect. Nothing to file.**

---

## F5 · The working-hours configuration is UNVERIFIED, and that is itself the finding

The QA lead reports 07:00–19:00 Monday–Friday, Saturday not working, Sunday unconfirmed. **We could
not read any of it** — `/api/staff` returns 409 like everything else. **So every hours-dependent case
remains blocked on a precondition nobody has yet confirmed in the environment**, and under Rule 12 it
is NOT VERIFIED rather than taken from his screenshot.

**This is the SV-8923 trap in its live form.** That ticket was withdrawn as invalid precisely because
a defect was raised against a shop whose configured hours did not match the source case's own stated
precondition. **The check is therefore not optional: read the stored hours, compare them against what
each case's precondition states, and only then observe.** Where a case needs different hours, that is
a blocked observation with a reason on that case's record — the case is not reinterpreted and the
environment is not adjusted.

**Not a defect. Nothing to file.**

---

## Deviations observed against the documents

**None — and that is a statement about how far this pass got, not about the product.** No page of the
product was reached, so no behaviour and no label was compared with any document. **Every one of the
174 cases' verdicts still rests on an earlier build** (90 on `v3.5-7ec992f`, 78 on `v3.5-d122eef`
which no longer exists, 6 on `v3.5-af3a6e1`), **none on `v3.5-65d6500`.**

## AUTOMATED CASES CHANGED — FOR VLAD

**None.** No case was changed by this pass — **0 TestRail writes of any kind** — and `custom_atmstatus`
is **1 (Not Automated) on all 174** Schedule cases, re-measured live by the previous pass earlier
today and unchanged since, there having been no write. **Nothing for Vlad to adjust.** (Standing
Rule 65: the section is stated even when empty.)
