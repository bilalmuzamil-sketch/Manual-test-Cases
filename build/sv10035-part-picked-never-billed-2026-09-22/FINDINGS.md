# SV-10035 — Part added to a work order is missing from Lines and Finance but shows on the Parts tab

**Ticket:** [SV-10035](https://shopview.atlassian.net/browse/SV-10035) · status **TESTING QA** ·
priority **Medium** · labels `QA_Validation_Required`, `ai-unverified-repro`, `bug-report`,
`source-intercom` · reporter **Ryan Fyfe** (PowerTools, submitter Mike Freeman) · assignee
**Slavcho Mitrov** · created 2026-09-14 · updated 2026-09-22T06:46:52-0500.

**This pass ran unattended.** Two standing decisions were therefore taken by the rule rather than by
asking: **no "Technical details for developers" section** on the comment (Standing Rule 84 — it is
posted only on an explicit yes for that ticket, and silence is not consent), and **no API-only ticket
filed** if one is found (Standing Rule 51 — it is written up here and asked about instead).

## §0 — Sources, read live at pass start

**The customer's report** — Parker Mike, Crawford Fleet Services, 18 users, via Intercom. Work order
**S-46147**, line **#4 "Secure threshold plate"**, part **3140FTF — 5/16-18X2.5 FLOOR SCREW**,
quantity 6, category **FASTENERS**, vendor Inventory, sell price **$0.38 each**, status Received.
**Steps to Reproduce on the ticket: "1. Unable to replicate."**

His own words, which are the acceptance bar (Standing Rule 66):

> *"added a part to a work order and it isn't showing up on the Lines tab or the Finance tab. However,
> it is showing up on the parts tab. it took the parts from inventory but not charging the customer
> for it. i had to add the part again to the work order for it to show up."*
>
> *"I can see that part 3140FTF … is appearing twice in the Parts tab, whereas it only appears once on
> the Work Order and in the Finance tab."*

So there are **two** symptoms to clear, not one: the part missing from Lines and Finance, **and** the
duplicate Parts-tab row that his workaround created.

**The developer's two comments (both read live).** `76933` (21 Sep) names the cause — *"picking a part
deducted it from inventory and then errored before the billable line was created"* — and the fix —
*"the error is gone … Where no sell price can be determined it bills at $0.00, which is visible and
correctable, instead of not billing at all."* `77046` (22 Sep) hands it to QA at **QA Severity: High**,
adds the second fix (*"Changing a part's Category on the Parts tab no longer wipes its stored Sell
Price - this is what created the broken records in the first place"*), and states two things that
shape the test:

- **the setup route changed**: the Category route that created the broken records *"is now closed"*,
  so reproduce with **Add Part → Part Source Type = Found → blank Sell Price**;
- **the fix is forward-only**: *"Work orders already stuck in the bad state are not repaired by
  deploying it and will still show the old symptom - that is expected, not a failed fix."*

**The QA handoff document** (`QA-Handoff-SV-10035-…md`, branch
`SV-10035-part-picked-but-never-billed`, PR #3202, 6 files, BE only) supplies the 10-section
checklist this pass works through. Per Standing Rule 66 it is an **input**, not the definition of the
test: the ticket description and the customer's words define what "fixed" means, and the handoff tells
us which code paths to reach.

## §0b — Environments and build markers (read live at pass start)

| Role | Environment | Build marker | index.html last-modified | etag |
|---|---|---|---|---|
| AFTER (fix) | `sv10035.qa.shopview.com` | **`v26.36.9-2a3614f`** | Tue, 22 Sep 2026 11:06:39 GMT | `44fc03f34c5f490fd50727d42ed339cf` |
| BEFORE (pre-fix) | `app.shopview.com` | **`v26.36.9-8d1613f`** | Tue, 22 Sep 2026 09:38:08 GMT | `bb2fc9820ec15cc1d8c1161c3477a7dc` |

Production is the BEFORE per Standing Rule 86, and it is the right one here for a second reason: the
customer is on it, and the ticket says the fix is forward-only, so production still carries both the
mechanism and the stranded records.

## §0c — The test plan

The customer's two symptoms define checks 1–3; the developer's second fix and the handoff's
regression list supply the rest. Each row names where the requirement comes from, so a reader can see
that nothing here was invented from the build (Standing Rule 57).

| # | Check | Source of the requirement |
|---|---|---|
| 1 | Picking a part with no sell price **succeeds** — no 500, no error, no silent no-op; status becomes Received | dev comment `76933`; handoff §2 |
| 2 | The picked part appears on **Lines** and on **Finance**, priced $0.00 | the customer's own words; handoff §2 |
| 3 | The Parts tab shows **exactly one** row for it, not two | the customer's second symptom; handoff §3 |
| 4 | Inventory quantity drops by the picked quantity | handoff §2 |
| 5 | Same result with **Automatically Pick Inventory Parts = ON**, without clicking Pick | handoff §2 last bullet |
| 6 | **Pick All** over one priced part and two unpriced: all billed, prices correct, all on Lines and Finance | handoff §4 |
| 7 | Changing **Category** to one with no markup **keeps** the stored Sell Price, and it survives a reload | dev comment `77046`; handoff §5 |
| 8 | That part then picks at its **real** price, not $0.00 | handoff §5 |
| 9 | Regressions: a priced part bills at its real price; sell-price edit saves; margin edit recalculates; a fixed line total does not shift; a category **with** a markup still recalculates | handoff §6 |
| 10 | Core/deposit parts: parent row **and** core row, both on Lines/Finance | handoff §7 |
| 11 | Permissions unchanged: admin allowed; no-permission user blocked with 403 **not** 500; technician Pick-All carve-out intact | handoff §8 |
| 12 | The BEFORE: the same flow on production still loses the part | Standing Rules 73/86 |

**Deliberately not treated as faults**, per the developer and the handoff: the error-level Sentry log
on a $0.00 fallback (§9 — *"intentional … Do not raise it as a bug"*), vendor purchase-order
receiving (never reaches the changed listener), and work orders **already** stranded in the bad state
(the fix is forward-only).

## §1 — Finding a work order to test on, and a mistake worth recording

The first two production attempts reported **"no suitable work order"** and stopped. That was **my
filter, not the environment**: I searched for work orders whose *own* status was `in_progress` /
`authorized` / `open`, when what a part request actually needs is a **LINE** in `authorized` status —
and those live on work orders whose status is `approved`.

Surveying 30 production work orders and their per-line statuses made it obvious in one read:

```
S2-918  approved          lines=1  [authorized]            <- created by my own SV-10158 split today
S2-917  estimate          lines=1  [authorization_required] <- same
S2-861  approved          lines=1  [authorized]            <- USED
S2-808  approved          lines=1  [authorized]
S2-803  approved          lines=1  [authorized]
S2-811  ready_for_review  lines=1  [complete]
S2-810  ready_for_review  lines=4  [complete,complete,authorization_declined,complete]
```

Seven usable work orders were there the whole time. **S2-861** (`47abc3c7-…`) was chosen; S2-918 and
S2-917 were deliberately avoided because they are artefacts of this morning's SV-10158 pass and
mixing the two records would muddy both.

*Filter on the state the action actually needs, not on the parent record's state.*
