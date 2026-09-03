# The 11 customer-portal CANDIDATES — assessed, case by case (register row **PH-3**)

**Run 2026-09-03, READ-ONLY, against `https://shopview.testrail.io` as `bilal.muzamil@shopview.com`.**
Script: [`fetch_candidates.py`](fetch_candidates.py) · raw output: `cases.json`, `sections.json`,
`users.json`, `SUMMARY.txt`.

> **🛑 NO TESTRAIL WRITE OF ANY KIND WAS MADE.** No `add_case`, no `update_case`, no `delete_case`,
> no run write, no result write. The only TestRail verb in `fetch_candidates.py` is `tr.get(...)` —
> `grep -n 'tr\.\(post\|add_\|update_\|delete_\)' fetch_candidates.py` returns nothing. **This is an
> assessment and a RECOMMENDATION. Every one of the 11 cases is exactly as it was.** The QA lead
> decides what, if anything, gets written.

## What this closes

The 2026-09-02 inventory (`../portal-hold-inventory-2026-08-31/INVENTORY.md`, Finding 2) named 11
cases that **look** like portal cases and carry no marker, and said in its own words that *"the
preconditions were not individually re-read against the marker's test"* — so it claimed no verdict.
**This pass re-read all 11 in full and states a verdict on each.**

The marker under test, byte-for-byte (QA lead, 2026-08-31; `build/skills/00-COMMON-CORE.md` §5.0-b):

```
AUTOMATION: HOLD - customer portal only exists on staging; this case cannot run on the QA branch
```

**The scoping test, applied literally: does RUNNING this case require a customer-portal artefact?
Never the word "portal".** A case that verifies the portal feature's *absence* on the shop-app path
is testable on the branch and **must not** be parked.

**Verdict classes:** **(a)** needs the portal to run ⇒ should carry the HOLD · **(b)** mentions the
portal but runs entirely on the shop-app path ⇒ correctly has no marker · **(c)** genuinely
ambiguous ⇒ named, with what would settle it.

## THE ANSWER — 10 × (a) · 0 × (b) · 1 × (c)

| C-id | Title | Section | Verdict | The precondition / step text that drove it | `created_by` | Automated? | What would need to change |
|---|---|---|---|---|---|---|---|
| [C18621](https://shopview.testrail.io/index.php?/cases/view/18621) | Partial payment can be initiated on an unpaid invoice via ShopPay | 2486 · `Administration > Customer Portal > SV-5957 … > Partial Payments – Basic Flow` | **(a) NEEDS THE PORTAL** | Precondition, verbatim: *"The customer portal (ShopPay) is accessible."* Step 1: *"Log in to the customer portal."* The payment is **made in the portal** | **3 — Bilal Muzamil (ours)** | No (`atmstatus` 1) | Add the HOLD marker. It has **no `AUTOMATION:` marker at all** today |
| [C18622](https://shopview.testrail.io/index.php?/cases/view/18622) | Payment modal pre-fills with full remaining balance | 2486 · same | **(a) NEEDS THE PORTAL** | Precondition, verbatim: *"An unpaid invoice is open in the customer portal."* The modal under test is the **portal's** Pay Now modal | **3 — Bilal Muzamil (ours)** | **YES (`atmstatus` 3)** | Add the HOLD marker — **but Rule 71: needs the QA lead's per-case go-ahead first** |
| [C18649](https://shopview.testrail.io/index.php?/cases/view/18649) | 'Partially Paid' status badge is displayed on partially paid invoices | 2491 · `… > UI & Display` | **(a) NEEDS THE PORTAL** | Precondition, verbatim: *"An invoice is in 'Partially Paid' state in the customer portal."* Step 1: *"Navigate to the invoice list in the customer portal."* The badge asserted is the **portal list's** badge | **3 — Bilal Muzamil (ours)** | No (`atmstatus` 1) | Add the HOLD marker. No `AUTOMATION:` marker today |
| [C18671](https://shopview.testrail.io/index.php?/cases/view/18671) | Late fee notice shown before due date | 2491 · same | **(a) NEEDS THE PORTAL** | ⚠️ The **precondition alone does not name the portal** (*"An invoice is not yet overdue… Late fees are enabled."*). **The only step does:** *"Open the invoice in the customer portal before its due date."* The notice is asserted **on the portal invoice view** — there is no shop-app screen in this case | **3 — Bilal Muzamil (ours)** | No (`atmstatus` 1) | Add the HOLD marker. Its route also belongs in the precondition (skill 18) |
| [C18672](https://shopview.testrail.io/index.php?/cases/view/18672) | Grace period reminder shown on invoice | 2491 · same | **(a) NEEDS THE PORTAL** | Same shape as C18671: precondition is a data-state, the sole step is *"Open the invoice in the customer portal during the grace period (1–29 days overdue)"* | **3 — Bilal Muzamil (ours)** | No (`atmstatus` 1) | Add the HOLD marker |
| [C18678](https://shopview.testrail.io/index.php?/cases/view/18678) | Partial payment can be initiated on an unpaid invoice via ShopPay | 2486 · same | **(a) NEEDS THE PORTAL** | **Byte-identical to C18621** — same precondition *"The customer portal (ShopPay) is accessible."*, same six steps | **3 — Bilal Muzamil (ours)** | No (`atmstatus` 1) | Add the HOLD marker — **and see the duplicate finding below** |
| [C18679](https://shopview.testrail.io/index.php?/cases/view/18679) | Payment modal pre-fills with full remaining balance | 2486 · same | **(a) NEEDS THE PORTAL** | **Byte-identical to C18622** — *"An unpaid invoice is open in the customer portal."* | **3 — Bilal Muzamil (ours)** | **YES (`atmstatus` 3)** | Add the HOLD marker — **Rule 71 per-case go-ahead first** |
| [C18706](https://shopview.testrail.io/index.php?/cases/view/18706) | 'Partially Paid' status badge is displayed on partially paid invoices | 2491 · same | **(a) NEEDS THE PORTAL** | **Byte-identical to C18649** | **3 — Bilal Muzamil (ours)** | No (`atmstatus` 1) | Add the HOLD marker |
| [C18728](https://shopview.testrail.io/index.php?/cases/view/18728) | Late fee notice shown before due date | 2491 · same | **(a) NEEDS THE PORTAL** | **Byte-identical to C18671** | **3 — Bilal Muzamil (ours)** | No (`atmstatus` 1) | Add the HOLD marker |
| [C18729](https://shopview.testrail.io/index.php?/cases/view/18729) | Grace period reminder shown on invoice | 2491 · same | **(a) NEEDS THE PORTAL** | **Byte-identical to C18672** | **3 — Bilal Muzamil (ours)** | No (`atmstatus` 1) | Add the HOLD marker |
| [C45245](https://shopview.testrail.io/index.php?/cases/view/45245) | Portal-collected deposit cannot be reversed in ShopView | 3018 · `Work Orders > Deposits … > D. Delete, Reverse, Split Deposits` | **(c) GENUINELY AMBIGUOUS — and HANDS-OFF either way** | Precondition requires a portal artefact: *"A deposit on that work order collected through the Customer Portal (created via `POST /api/external/customer-portal/deposits` with a gateway_reference), status held."* **But every assertion is on the shop-app path** — customer profile → Deposits tab, → Payments tab, Reverse control disabled. So it is a portal **data-state**, not a portal **screen** | **1 — Vladimir Tomovic — FOREIGN (Rule 38)** | **YES (`atmstatus` 3)** | **NOTHING BY US.** Rule 38: report, never edit — whatever the verdict. See the settlement test below |

**Counts: (a) 10 · (b) 0 · (c) 1.** Zero cases fall in class (b) — none of the 11 is a shop-app case
that merely says "portal". (The **27** shop-app cases that *do* fall in class (b) were already
identified and correctly excluded by the 2026-09-02 inventory: the Custom Roles / Roles-and-Permissions
cases in sections 303, 3539, 3541, 3543, 3548, 3642, 3643, 3668, 3669, which test the portal **toggle,
nav entry and permission gating inside the shop app**. They are not re-litigated here.)

## What would settle C45245 — one read-only probe, and it is not ours to run against the case

C45245 is the only case where the marker's own test genuinely pulls both ways, so the split matters:

- **The assertions are shop-app.** Nothing in the case asks the tester to open the portal. If the
  data-state can be created on a QA branch, the case **runs on the branch** and must **not** be
  parked — Rule 14 is explicit that a missing DATA-STATE is seeded, never a reason to park.
- **The data-state may or may not be creatable there.** The precondition names its own seeding route —
  `POST /api/external/customer-portal/deposits` — which is an **API endpoint on the app's own API host,
  not a portal UI screen.** If that endpoint answers on the QA branch's API host, the deposit is
  seedable in-app and the verdict flips to **(b) no marker**. If it is portal-host-only or gated behind
  a portal-issued token, the verdict is **(a) HOLD**.

**The settlement is one request on the QA branch API host, read-only in effect and cheap: does
`POST /api/external/customer-portal/deposits` accept an admin session, or does it demand a portal
credential?** That probe needs a signed-in QA-branch session (routine now —
`build/testing-tools/qa-branch-boot.mjs`, playbook §A) and was **deliberately not run in this pass**,
which was scoped TestRail-read-only. **It should be piggybacked (Rule 78) onto the next session that
already has a branch session up, not given a spawn of its own.**

**Whatever it returns, Rule 38 stands: C45245 is Vladimir Tomovic's (`created_by = 1`) and we do not
edit it.** The finding goes to him via the QA lead.

## Three things found on the way that were not asked for (reported, not fixed)

1. **🔴 FIVE OF THE TEN ARE EXACT DUPLICATES OF THE OTHER FIVE — same section, same words.**
   `C18621 ≡ C18678` · `C18622 ≡ C18679` · `C18649 ≡ C18706` · `C18671 ≡ C18728` · `C18672 ≡ C18729`.
   Each pair shares its section (2486 or 2491), title, preconditions, steps and expected result. All ten
   were created on **2026-03-20**. So this is **5 distinct behaviours, tested twice each** — a tester
   would run each of these five twice. Not touched, not merged; flagged for a decision.
2. **None of the 11 carries an `AUTOMATION:` marker of any kind**, none carries a Rule-54 provenance
   line, and **`refs` is `None` on all 11** — so none is traceable to a ticket or a spec version
   (Rules 20 / 54 / 64). The ten SV-5957 cases predate every one of those conventions (created
   2026-03-20). **Adding only the portal HOLD would leave them still failing the tester-readiness gate
   (Rule 84);** that is stated so the marker is not mistaken for making them ready.
   `custom_automation_type` is **0 / None** on all ten (C45245 is 1 / E2E) — the 2026-09-02 automation-type
   standard has not reached this section.
3. **Eight of the ten "ours" cases were LAST EDITED BY VLADIMIR TOMOVIC (user 1)** — C18621, C18622,
   C18671, C18672, C18678, C18679, C18728, C18729, on 2026-06-10 and 2026-07-14. **Rule 38's test is
   `created_by`, and `created_by = 3` on all ten, so by the rule as written they are OURS and not
   hands-off.** It is recorded because the rule's *intent* is that he decides scope by who authored a
   case, and "authored by us, last edited by Vladimir" is a shape the rule does not name. **If he wants
   the last-editor to count, that is his call and it moves eight cases into hands-off.**

## RECOMMENDATION — what I would mark, what I would leave. **A recommendation, not an action.**

**MARK (8), no further permission needed beyond his word on this list:**
**C18621 · C18649 · C18671 · C18672 · C18678 · C18706 · C18728 · C18729.** Each requires the tester to
be inside the customer portal to run at all, and each would send a QA-branch tester into a wall today
with nothing to warn them.

**MARK, BUT ONLY AFTER A PER-CASE GO-AHEAD (2) — Rule 71, they are flagged Automated:**
**C18622 · C18679.** The verdict is the same (a); the constraint is procedural. Rule 65 also applies —
**Vlad must be told** if they are changed.

**LEAVE (1): C45245.** Two independent reasons: **Rule 38** (Vladimir Tomovic's — report, never edit)
and the verdict itself is **(c)**, unsettled until the `POST /api/external/customer-portal/deposits`
probe above is run. Report it to him; do not touch it.

**And one caveat on all ten, stated plainly:** Rule 41 says touching a case means re-verifying the
whole case, and these ten fail three other gates (no provenance, no `refs`, no automation type,
spec-level preconditions). **A marker-only write is a deliberate partial fix** — it buys the tester a
warning cheaply and leaves the rest of the debt visible. **The alternative is a proper Rule-41 pass
over the SV-5957 section, which is a project, not a marker sweep.** Both options are his to choose
between; the register row states the cost of each.
