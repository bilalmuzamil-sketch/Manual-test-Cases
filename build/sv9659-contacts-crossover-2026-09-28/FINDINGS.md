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
