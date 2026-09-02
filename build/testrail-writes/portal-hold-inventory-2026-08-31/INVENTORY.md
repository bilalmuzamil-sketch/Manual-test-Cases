# Live TestRail inventory — the staging-only CUSTOMER PORTAL HOLD marker

**Run 2026-09-02, READ-ONLY, against `https://shopview.testrail.io` as `bilal.muzamil@shopview.com`.**
Script: [`inventory_portal_hold.py`](inventory_portal_hold.py) · raw output: `matches.json`,
`sections.json`, `SUMMARY.txt`.

> **⚠️ DATE NOTE.** This sweep was commissioned as "2026-08-31 work" and the directory is named for
> that date so it files with the rest of that batch. **It actually ran on 2026-09-02**, which is the
> date every figure below is current as of (Rule 91 — the badge is the date of the CHECK).
> Build/estate: **686 sections · 4,624 cases** paged to exhaustion.

## Why this exists

The marker literal is FINAL (QA lead, 2026-08-31) and is written into **7 documentation files** plus
**live TestRail case bodies**. **The repo copies are the INSTRUCTION; the case bodies are the
DEPLOYMENT.** Only four case ids had ever been named — C44947, C44951, C44952, C45175 — and **nobody
had confirmed that was all of them.** If the string is ever renamed, this list is what has to be
re-written.

## THE ANSWER — 3 cases, not 4. All byte-exact. Zero variants.

**The canonical literal, byte-for-byte:**

```
AUTOMATION: HOLD - customer portal only exists on staging; this case cannot run on the QA branch
```

| C-id | Title | Section / project | Field | Match |
|---|---|---|---|---|
| [C44951](https://shopview.testrail.io/index.php?/cases/view/44951) | Paid banner appears only on portal-generated Invoice PDFs, before all content | `Invoice Refresh (Aug 2026) > Paid Banner, Payments and Balance` (section **6749**) | `custom_expected` | **BYTE-EXACT** |
| [C44952](https://shopview.testrail.io/index.php?/cases/view/44952) | Each banner payment shows its labeled fields and conditional fees/marker | `Invoice Refresh (Aug 2026) > Paid Banner, Payments and Balance` (section **6749**) | `custom_expected` | **BYTE-EXACT** |
| [C45175](https://shopview.testrail.io/index.php?/cases/view/45175) | Paid banner pill and title wording follow the paid state and the batch rule | `Invoice Refresh (Aug 2026) > Paid Banner, Payments and Balance` (section **6749**) | `custom_expected` | **BYTE-EXACT** |

**VARIANTS: none.** Every occurrence in the estate is the canonical literal, character for character,
in `custom_expected`, one per case. Nothing to reconcile.

## 🔴 FINDING 1 — C44947 DOES NOT CARRY THE MARKER, AND THE DOCUMENTATION STILL SAYS IT DOES

**C44947 is live and healthy — it just is not a portal-HOLD case.** Its marker reads
`AUTOMATION: READY`, its title is *"Payment method name resolves per rule (SHOPPAY shows 'Online')"*,
and it sits in the same section 6749.

**This is not drift or damage — it is a correct decision that the documentation never caught up
with.** `build/invoice-ui-refresh/build-verify-2026-08-31/RECLASSIFIED-18-2026-08-31.md` §2 records
the reclassification in its own words — **"C44947 | 🔴 IN SCOPE — I was wrong"** — because
**C44947 is about the METHOD NAME on the invoice's Payments rows (S8-R2), not the paid banner**, so
it never needed the portal. The marker was set to `AUTOMATION: READY` on 2026-09-01 and logged at
`build/invoice-ui-refresh/build-verify-2026-08-31/markers-2026-09-01/TESTRAIL-EXECUTION-LOG-2026-09-01.md`
(HTTP 200, 3 × `markdown fr-view`).

**⇒ The "known four" list is stale in SIX places** and each still names C44947 as staging-only:

- `build/skills/00-COMMON-CORE.md` §5.0-b (two mentions)
- `build/skills/03-RUN-CHECK.md` (the §7 worked example)
- `build/handoffs/HANDOFF-1-TEST-CASE-CREATION.md`
- `build/handoffs/HANDOFF-2-BUILD-VERIFICATION.md`
- `build/handoffs/HANDOFF-3-VIU.md`
- `build/handoffs/HANDOFF-4-TEST-EXECUTION-AND-DEFECTS.md`

**This inventory corrects `00-COMMON-CORE.md` §5.0-b only** — that is the section the task named as
the sweep list's home. **The other five are left untouched and REPORTED**, because a handoff and a
skill's worked example are not this pass's to rewrite without the QA lead saying so. That is the ask
in the register.

**And it is the exact thing this inventory was commissioned to catch:** the repo said four, the
deployment said three, and the difference was a decision nobody propagated.

## 🟠 FINDING 2 — 11 OTHER CASES LOOK LIKE PORTAL CASES AND CARRY NO MARKER (candidates, NOT a verdict)

**No case outside the three above carries any HOLD marker mentioning "portal", "staging" or "QA
branch".** But **38 cases mention "customer portal" somewhere in their text**, and some of them are
portal cases by precondition rather than by vocabulary. Applying the rule's own test — **scope it
from the PRECONDITIONS, never from the word "portal"** — these are the candidates a decision is owed
on. **Nothing was written and no verdict is claimed here; the preconditions were not individually
re-read against the marker's test.**

| C-id | Title (short) | Section | Author | Automated? |
|---|---|---|---|---|
| C18621 | Partial payment can be initiated on an unpaid invoice | `Administration > Customer Portal > SV-5957` (2486) | ours (user 3) | no |
| C18622 | Payment modal pre-fills with full remaining balance | `Administration > Customer Portal > SV-5957` (2486) | ours (user 3) | **YES (`custom_atmstatus` 3)** |
| C18678 | Partial payment can be initiated on an unpaid invoice | `Administration > Customer Portal > SV-5957` (2486) | ours (user 3) | no |
| C18679 | Payment modal pre-fills with full remaining balance | `Administration > Customer Portal > SV-5957` (2486) | ours (user 3) | **YES (`custom_atmstatus` 3)** |
| C18649 | 'Partially Paid' status badge on partially paid invoices | `Administration > Customer Portal > SV-5957` (2491) | ours (user 3) | no |
| C18671 | Late fee notice shown before due date | `Administration > Customer Portal > SV-5957` (2491) | ours (user 3) | no |
| C18672 | Grace period reminder shown on invoice | `Administration > Customer Portal > SV-5957` (2491) | ours (user 3) | no |
| C18706 | 'Partially Paid' status badge on partially paid invoices | `Administration > Customer Portal > SV-5957` (2491) | ours (user 3) | no |
| C18728 | Late fee notice shown before due date | `Administration > Customer Portal > SV-5957` (2491) | ours (user 3) | no |
| C18729 | Grace period reminder shown on invoice | `Administration > Customer Portal > SV-5957` (2491) | ours (user 3) | no |
| C45245 | Portal-collected deposit cannot be reversed in ShopView | `Work Orders > Deposits` (3018) | **Vladimir Tomovic (user 1) — FOREIGN (Rule 38)** | **YES** |

**The other 27 portal-mentioning cases are Custom Roles / Roles-and-Permissions cases** (sections 303,
3539, 3541, 3543, 3548, 3642, 3643, 3668, 3669) that test the portal **toggle, navigation entry and
permission gating inside the shop app**. Those are exactly the cases the rule says must **NOT** be
parked — *"a case that verifies the portal feature's ABSENCE on the shop-app path is testable on the
branch and must not be parked."* They are listed in `SUMMARY.txt`'s companion output and named here
so nobody re-discovers them as new.

**Two constraints on whatever is decided:** C18622, C18679 and C45245 are flagged **Automated**, so
Rule 71 needs a per-case go-ahead; C45245 is **Vladimir Tomovic's**, so Rule 38 makes it hands-off —
report only.

## Method, so the numbers can be challenged

1. **Paged to exhaustion.** `get_sections/1` and `get_cases/1` at `limit=250`, incrementing `offset`
   until a short page. **686 sections · 4,624 cases.** An unpaged call returns 250 and silently finds
   zero past the first page (core §3.3, playbook §J) — that trap is why the count is stated.
2. **Three widening nets, so a rename could not hide:** (a) the byte-exact canonical literal;
   (b) the load-bearing needle `customer portal only exists on staging`; (c) a regex
   `customer[\s-]*portal.{0,80}(staging|qa branch)` over `preconds` / `steps` / `expected` / `title`
   and their `custom_` twins. A hit on (b) or (c) that is not (a) is reported as a **VARIANT**.
   **All three nets returned the same three cases.**
3. **A fourth, wider net for the negative claim:** every `AUTOMATION: HOLD ...` marker in the estate
   was extracted and filtered for `portal` and for `staging|qa branch` independently. **Three cases,
   the same three.** That is what licenses "no variants exist anywhere".
4. **Rule 88.** No case body was read into a session's context. The script writes JSON; only
   `SUMMARY.txt` is read.

## READ-ONLY — stated plainly

**No `add_case`, `update_case`, `delete_case`, run write or result write was made, of any kind.** The
script contains exactly one TestRail verb, `tr_client.get(...)`; `grep -n 'tr\.\(post\|add_\|update_\|delete_\)' inventory_portal_hold.py`
returns nothing. This is an inventory, not a fix — the two findings above are handed back as asks.
