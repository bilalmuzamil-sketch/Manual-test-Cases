# API-SPLIT — Standing Rule 51 check on the five proposed developer tickets

**Report Suite · epic SV-8582 · 2026-08-05**

**Standing Rule 51, verbatim from the QA lead:** *"do not create the tickets which are related to API,
if there are any ASK me (ask again if I have previously given a go ahead for the API tickets with the
Non API tickets) and create them ONLY if I ask you to create them"*.

**His approval today was *"Yes but give me the links of those tickets then"* — a batch approval.
Under Rule 51 a batch approval does NOT cover an API item inside the batch.** So every one of the
five was tested individually before anything was filed.

---

## THE TEST APPLIED

**If the fault is invisible to a user AND to a manual tester — reachable only by calling an endpoint
directly with a request the product's own screens never send — it is API-RELATED and is not ours to
file.** If the same failure also happens through the product's own screens, it is **user-facing**,
even where our evidence happens to be a captured response.

---

## THE RESULT — NONE OF THE FIVE IS API-ONLY

| # | The proposed ticket | Can a person hit it from a screen? | Verdict |
|---|---|---|---|
| **B1** | The location chooser is shown to someone with access to only one location, on all six reports | **YES** — the control is visibly on screen. A user sees it and can click it | **USER-FACING** |
| **B2** | Four columns missing from the Sales By Representative Summary spreadsheet | **YES** — the user clicks *Download Summary (CSV)* in the product and opens the file. Nothing about it needs an endpoint | **USER-FACING** |
| **B3** | The Technician Utilization download menu wording | **YES** — four labels read off an open menu | **USER-FACING** |
| **B4** | The location **column** does not follow the product owner's new rule on Work In Progress or Inventory Value | **YES** — a column present or absent on the table | **USER-FACING** *(blocked for a different reason — see below)* |
| **B5** | The logo falls back to the built-in one when none is uploaded, instead of printing no logo | **YES** — it is a picture in a downloaded printable file | **USER-FACING** *(not filed for a different reason — see below)* |

**So Standing Rule 51 bars none of the five, and no separate API ask is needed.** Recorded here
positively rather than by silence, because "no API items" is itself a finding the rule wants stated.

**A note on how B2's evidence reads.** Its technical section mentions that the response the screen is
drawn from carries `invoice_count`, `hours_worked` and `hours_invoiced`. **That does not make it an API
ticket.** The fault a user meets is a short spreadsheet; the response contents are only how we proved
the figures exist rather than being genuinely absent. Rule 51's own words: *"a 500 in the response is
technical evidence; it is not what makes the ticket API-related."*

---

## WHAT WAS FILED, AND WHAT WAS NOT

### FILED — three tickets

| # | Key | Link |
|---|---|---|
| B1 | **SV-8879** | https://shopview.atlassian.net/browse/SV-8879 |
| B2 | **SV-8880** | https://shopview.atlassian.net/browse/SV-8880 |
| B3 | **SV-8881** | https://shopview.atlassian.net/browse/SV-8881 |

### NOT FILED — two, each for a different and specific reason

**B4 — blocked on the product owner's own contradiction. Cannot be written correctly.**
His location-column answer says the switch is *"toggleable … if the above is satisfied"* — which reads
as needing **both** his conditions — while his own bracket removes the switch only when someone lacks
**access** to several locations. **Those two sentences describe the same person differently.** We
cannot tell a developer what correct behaviour looks like while the requirement points two ways, and a
ticket with a wrong "expected behaviour" is worse than no ticket. **One sentence from Chris unblocks
it.** A follow-up question is already being prepared.

**B5 — NO LIVE EVIDENCE. Nobody has ever seen this fail on the build.**
This is the important one, and it is our own shortfall rather than anyone else's.

The claim is that the printable download shows the built-in ShopView logo when **no** logo is
uploaded, where the product owner now wants **no logo at all**. Every source we hold for that claim is
a **document reading** — three of our test cases assert it, and they assert it because the Sales By
Customer description says it (`S15-R17`: *"(2) the bundled ShopView logo when none is uploaded"*).

**The no-logo state was never actually produced on the build.** Two of our own live records say so
plainly:

> "the PDF logo fallback could not be exercised because **this organisation has an uploaded logo**"
> — `viu-2026-08-03/batch-pv-tu/VERDICTS.md`

> "**This org has no shop logo set**, so the logo-present branch is not observed."
> — `viu-2026-08-03/batch-wip-iv/VERDICTS.md`

So on one organisation a logo was always present and on the other never — and **the transition nobody
watched is exactly the one the ticket would be about.**

Filing it would mean telling a developer the product does something we have not seen it do, sourced
from a description the product owner has just overruled. **It needs a live check first**, and the
check is cheap: remove the organisation's uploaded logo, download a printable file, and look at the
top right. **That is an ask, and it is also why the new test case C43553 exists and is on HOLD.**

---

## A THIRD THING WORTH SAYING PLAINLY

All three filed tickets rest on observations taken on build **`v3.4.1-0ed4433`** on **2026-08-03**.
**The branch has since redeployed twice** — to `v3.4.1-3d03023`, and this morning to
**`v3.5-16cf83f`** (`last-modified` Wed 05 Aug 2026 06:40:32 GMT). **We could not re-confirm on the
current build**, because the redeploy invalidated our sign-in (`GET /api/auth/me` → HTTP 401
`sso_required`).

Each ticket therefore **states the build it was observed on, in its Branch / Environment section**,
which is a fact rather than a hedge. Per the QA lead's standing instruction **no
"this-may-already-be-fixed" disclaimer** was written into any of them — that wording is barred, and
keeping our findings current is our job, not the developer's.

**The internal re-check duty stands** (Standing Rule 49) and is recorded in the re-check queue. **A
fresh sign-in is an ask.**
