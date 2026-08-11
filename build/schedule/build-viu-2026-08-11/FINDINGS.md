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

## F6 · The build renders these panels UPPERCASE via CSS — read the raw text nodes, never the screen

`textContent` is immune to CSS `text-transform`; `innerText` is not. The Schedule toolbar panels are
styled uppercase, so the screen (and any `innerText` dump) shows `FILTER & DISPLAY` and `VIEW OPTIONS`,
while the shipped strings are **`Filter & display`** and **`View options`**.

**This decided both of our internal label clashes, and a screenshot alone would have decided them
wrongly** — twice. Recorded as a method fact: a label diff on this product reads the raw text nodes.

**Second half of the same lesson, and the sharper one: prefer the VISIBLE string over the ACCESSIBLE
NAME.** The toolbar button carries `aria-label="Filter and display options"`, on all 15 surfaces, so a
containment check "finds" our `Filter and Display` wording in the build — in a string **no manual tester
can ever see**. A diff that accepts the accessible name will certify the wrong label with confidence.

**Not a defect. Nothing to file.** Playbook §A/§J candidate — flagged, not edited (a sibling may be
writing to it).

---

## F7 · Whose hours drive the before/after-hours flag is NOT established — raised, not answered

**Observed, verbatim, in the `Schedule issues` panel:** `Starts before business hours (7:00 AM) ·
Double-booked with Xamont Holdings` and `Extends past business hours (3:00 PM) · Double-booked with
Kastone Solutions`.

**Two things follow, and only the first is settled.**

**(a) The WORDING is `business hours`, not `working hours`** — a label correction, staged as
`LABEL-DIFF.md` §2.5.

**(b) WHICH tier of the hierarchy drives the flag is an open question.** C30025 asserts the flag is
measured against *"that technician's own configured working-day START/END time"*, with a hierarchy of
technician hours → shop business hours → default. The message says **business hours** and quotes
**7:00 AM / 3:00 PM**. The working hours we read live on `admin@shopview.com` are **07:00–19:00**, so
the 3:00 PM boundary is **not** that account's end time.

**🛑 THAT IS NOT EVIDENCE OF A DEFECT, AND IT IS IMPORTANT NOT TO REPORT IT AS ONE.** The flagged
shifts belong to **other technicians** — Alicia Campbell, MQ Test Tech Qamar, MQ Test Tech No — **whose
configured hours we did not read.** A 3:00 PM boundary is exactly what a *different* technician's own
hours would produce. **Concluding "the build ignores technician hours" from this would be precisely the
[SV-8923](https://shopview.atlassian.net/browse/SV-8923) mistake** — a defect raised against a
configuration that was never checked.

**What would settle it:** read the working hours of the technicians who own the flagged shifts and
compare each against its own message. **Not done. Recorded as the next action, not as a finding.**

**Also observed, and useful context:** the panel header is **`Schedule issues`**; the toolbar pill reads
**`6 conflicts`** in Day, **`37 conflicts`** in Week, **`122 conflicts`** in Month; and the reason
sentences compose, e.g. `Starts before business hours (7:00 AM) · Double-booked with Fuline Enterprises`.

---

## F8 · `Adjust` is not in the shift modal under any wording — recorded, not filed

**C30014** ([link](https://shopview.testrail.io/index.php?/cases/view/30014)) asserts the conflicted
shift's modal *"offers an 'Adjust' action"* which *"leads to a way to resolve the conflict"*.

**Observed:** a conflicted shift's modal **does** carry the conflict text (`Double-booked with Goport
Energy`), so the banner half is right. But the modal's actions are **`Delete shift`**, **`Close shift
details`**, **`Add Note`**, **`Edit estimated hours for <line>`**, **`Change colour`** and **`Open work
order S-12876 in a new tab`**. **No `Adjust`, and no near-neighbour** across 909 harvested strings.

**Under the re-scoped brief this is NOT ours to verdict** — the manual tester marks the case passed or
failed. It is recorded here with its evidence so the tester is not left hunting a control that appears
not to exist, and so the QA lead can see it. **The case KEEPS its documented expectation (Rule 57); it
is not rewritten to match the build.** **Nothing filed** (creation hold, Rule 62).

---

## F9 · A closed enumeration in C30015 has gone stale — the Rule-42 time bomb, live

`C30015` item 1 says the modal offers Delete and close *"and no other actions"*. The build offers four
more (F8). **The case's actual point — that there is NO `Reassign` action — is CONFIRMED correct.**
Repair is a scope-conditional rewrite of item 1, not a deletion of the assertion. Staged in
`LABEL-DIFF.md` §2.6.

---

## F10 · The specification's right-click contradiction is settled by observation — the build is LEFT-click

Our records already carried this as a spec defect: **§7 says the cell menu opens on left-click while
§14.1 and §14.2 twice call it a right-click menu.** Observed: **left-click opens it** (headed
`MQ Test Tech Qamar · Tue, Aug 11 · 21:15`, items `Create Event` and `New Work Order`); **right-click
adds nothing at all** — that surface captured **zero** new strings.

**So C30054 is correct on all five of its points, and the SPECIFICATION is wrong in two places.** A
documentation defect for the PO — **not a case change, and nothing filed.**

---

## Deviations observed against the documents

**⚠️ THE PARAGRAPH THAT STOOD HERE IS SUPERSEDED AND IS KEPT DATED RATHER THAN DELETED.** It read:
*"None — and that is a statement about how far this pass got, not about the product. No page of the
product was reached…"*. **That was true at 13:28Z and false by 13:36Z**, when the fresh sign-in arrived
and the Schedule page was reached.

**What was observed, stated as labels-and-navigation only (the re-scoped brief):** 15 surfaces, 909
distinct build strings, **12 cases needing a wording correction** (`LABEL-DIFF.md`), and the incidental
observations F6–F10 above. **No pass/fail behaviour verdict was reached or claimed** — the manual QA
tester marks the cases, per the QA lead's 2026-08-10 ruling confirmed 2026-08-11.

**The 174 cases' recorded verdicts still rest on earlier builds** — 90 on `v3.5-7ec992f`, 78 on
`v3.5-d122eef` (which no longer exists), 6 on `v3.5-af3a6e1` — and **this pass did not re-verdict
them**, because verdicting is no longer our job. What it establishes is that **their LABELS are now
checked against `v3.5-65d6500`** to the extent set out in `BUILD-VERIFICATION.md`.

## AUTOMATED CASES CHANGED — FOR VLAD

**None.** No case was changed by this pass — **0 TestRail writes of any kind** — and `custom_atmstatus`
is **1 (Not Automated) on all 174** Schedule cases, re-measured live by the previous pass earlier
today and unchanged since, there having been no write. **Nothing for Vlad to adjust.** (Standing
Rule 65: the section is stated even when empty.)
