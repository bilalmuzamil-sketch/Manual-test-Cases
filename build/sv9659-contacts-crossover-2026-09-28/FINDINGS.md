# SV-9659 — Previous customer's contacts intermittently appear when adding an asset

Tested 2026-09-28 (unattended run).

## §0 Sources and build markers

| Item | Value |
|---|---|
| Ticket | SV-9659, Bug, **TESTING QA**, priority Medium, no parent, reporter Ryan Fyfe, assignee Dusan Radulovic |
| QA branch | `sv9659.qa.shopview.com` — **v26.39.1-5dc1cea**, last-modified Mon 28 Sep 2026 16:47:38 GMT |
| Production (comparison) | `app.shopview.com` — **v26.39.1-3ef6ade**, last-modified Fri 25 Sep 2026 09:32:14 GMT |
| Dev handoff | **none posted** — no test plan or "Ready for QA" checklist on the ticket. Tested against the description (Rule 66). |

### Scope, from the ticket
The **Contact dropdown in the New Asset window** must show only the contacts of the
customer you are currently on. The reported fault is that it sometimes keeps showing the
*previously viewed* customer's contacts, and that closing and reopening ShopView clears it.

**Out of scope, and deliberately not treated as a failure here:** the pinned-notes half of
Mike Freeman's second report. Dusan confirmed on 2026-09-28 that it is
[SV-10477](https://shopview.atlassian.net/browse/SV-10477): *"Separate part of the code
causes that issue so it's safer to split the fix in another ticket."*

## §1 How this had to be tested — and the trap in it

The customer says closing and reopening ShopView clears the problem. That makes it
**client-side state that survives moving around inside the app but not a reload**.

So a test that navigates by typing URLs would reload the application every time and could
never show the fault — it would produce a clean, confident, worthless PASS. **Every step
below is done by clicking inside the running app**: the Customers link in the top nav, the
search box, the customer row, the New Work Order button, the Add button beside Asset, and
the Contact dropdown itself.

## §2 Test data (named, so this can be re-run)

**QA branch** — two customers with entirely distinct contacts:

| Role | Customer | Contacts |
|---|---|---|
| A (visited first) | **Abode Trucking & Repair** | Heather Best, Hailey Rivera, Joshua Bender, Frank Stewart, Kristopher Collins, Dana Marshall (6) |
| B (visited second) | **Accokeek Heavy Truck Repair Inc** | Elijah Wright, Rachel Valentine (2) |

**Production** — `aqeel transport 56` (Samsung Sdasd, ABCD EFGH, Test 91 Happy2, Adam
Zampa) and `Ayesha` (Test Contact 2, Test Contact, James Charles).

The two sets share no names, so any cross-over is unmistakable.

## §3 The click path (same on both builds)

Customer profile → **New Work Order** → the **Add** button beside **Asset** → the **New
Asset** window → open **Contact**.

## §4 A difference between the builds, found in the deployed code

The Contact field in the New Asset window carries a different test identifier on each build:

| Build | Contact field identifier |
|---|---|
| Production | `select_` — the name part is **empty** |
| QA branch | `select_vehicle_contact` |

Production's shared `queries` bundle also contains the literal string `"undefined"`, which
the branch's does not. Both point the same way: on production this field was being built
without knowing which record it belonged to, and on the branch it is bound properly. This
is supporting evidence that the fix genuinely touched this control — it is not a verdict on
its own.
## §5 What was run, and what it showed

Three different attempts at the fault, because the report says it is intermittent.

**a. The reported flow, unhurried.** Open A, look at its Contacts tab, move to B inside the
app, New Work Order → Add asset → open Contact.

**b. The reported flow with the dialog used on A first.** The customer had been *working* in
the previous customer before it went wrong, so this opens the New Asset window on A, reads
its Contact list, closes it, moves to B and opens the same window again. If the window keeps
anything from its first use, this is where it shows.

**c. A race.** The same flow but opening the window ~0.8 s after landing on B, so B's own
details may still be loading. A stale-cache fault is most likely to surface here.

### QA branch — v26.39.1-5dc1cea

| # | Attempt | Contact list shown on B | Verdict |
|---|---|---|---|
| 1 | (a) unhurried | Elijah Wright, Rachel Valentine | correct |
| 2 | (b) dialog reused, round 1 | on A: all 6 Abode names · on B: Elijah Wright, Rachel Valentine | correct |
| 3 | (b) dialog reused, round 2 | same as round 1 | correct |
| 4 | (c) race, round 1 | Elijah Wright, Rachel Valentine | correct |
| 5 | (c) race, round 2 | Elijah Wright, Rachel Valentine | correct |

**Five attempts, no cross-over.** Not once did an Abode name appear while on Accokeek.

### Production — v26.39.1-3ef6ade

| # | Attempt | Contact list shown on B | Verdict |
|---|---|---|---|
| 1 | (a) unhurried | Test Contact 2, Test Contact, James Charles | correct |
| 2 | (c) race, round 1 | same | correct |
| 3 | (c) race, round 2 | same | correct |

**The fault could not be triggered on production in three attempts.** That is consistent with
the customer's own description — *"sometimes"*, *"the last few days"* — and it means this pass
has **no captured before-picture of the fault itself**. Said plainly: the branch behaves
correctly, and I cannot show a side-by-side of it behaving incorrectly first.

## §6 Regression — the window still does its job

On the branch, with Accokeek open: chose **Rachel Valentine** in Contact, chose a Make, set
Unit to `ZZAUTOTEST-9659`, pressed Save.

| Check | Result |
|---|---|
| Asset saved | yes — the New Work Order window then showed Asset = `ZZAUTOTEST-9659` |
| Customer's Assets tab | went from **Assets (1)** to **Assets (2)** |

So the fix has not broken the window it changed.

## §7 Build markers, start and end

| Environment | Start | End |
|---|---|---|
| `sv9659.qa.shopview.com` | v26.39.1-5dc1cea, last-modified Mon 28 Sep 2026 16:47:38 GMT | **identical** |
| `app.shopview.com` | v26.39.1-3ef6ade | **identical** |

## §8 Honest limits

- **No before-picture of the fault.** Three production attempts all behaved correctly, so
  nothing was captured showing the wrong contacts. The evidence here is that the reported
  flow is correct on the branch across five varied attempts, plus the code-level change in §4.
- **Intermittent by nature.** Five clean attempts reduce the risk but cannot prove a
  once-in-a-while fault is gone. If the QA lead wants more confidence, the cheapest next step
  is more repetitions of attempt (b), which is the closest to what the customer described.
- **Pinned notes were not tested** — split to SV-10477 by the developer.
- Test data left on the branch: one asset `ZZAUTOTEST-9659` on Accokeek Heavy Truck Repair
  Inc. Per-ticket QA branches need no cleanup.

## §9 Verdict

**PASS, with the limit in §8 stated.** The Contact dropdown in the New Asset window showed
only the current customer's contacts in every one of five attempts on the branch, including
the two that most closely reproduce what the customer described, and the window still saves
an asset correctly.
