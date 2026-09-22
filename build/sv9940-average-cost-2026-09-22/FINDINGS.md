# SV-9940 — Average Cost reverting to $1.00 after being updated. Findings.

**Fix branch** `sv9940.qa.shopview.com`, build **`v26.36.9-e96da48`**, last-modified Tue 22 Sep 2026
12:52:44 GMT, etag `12630ba3359f0edb0456a68109cab7a7`.
**Pre-fix comparison: PRODUCTION `app.shopview.com`** (QA lead's ruling 2026-09-22 — *"for before and
after never use Staging for BEFORE rather the production"*), test org `72b2cc90…`, signed in with the
production credentials through the login form.

## §0 — There is no developer handoff on this ticket, and the last comment disputes part of it

Read live before testing. **Four comments, none of them a QA handoff:** no test plan, no PR link, no
"Ready for QA". The most recent, **Dusan Radulovic, 22 Sep 05:59**, addresses only the Min/Max half and
says *"i just checked and i don't think this is caused by an issue on our end. Can we consider
possibilities that someone edited the min/max for that part, or maybe did an inventory import…"* —
i.e. the developer is asking Support for more information rather than handing over a fix.

**So the ticket is in TESTING QA with a QA branch built today, and nothing states what was changed.**
That is flagged rather than worked around; the testing below follows **the ticket description** (Standing
Rule 66) plus the analysis in the comments.

**The analysis worth keeping, from MAX (Qazi Sufyan), 14 Sep:** the value is being *"truncated at the
thousands comma, so \"1,069.03\" is read as 1"*, and the sell price confirms it is a **write**, not a
display problem — this org's matrix gives `1,069.03 × 1.111 = 1,187.80`, and the bad pair is
`1.00 × 1.11 = 1.11`, so the sell price is recalculated *from the truncated cost*. He also ties it to
**SV-8447** (`$3,896.04` → `$3.00`, Blocked since 20 July) as the same mechanism. The customer's own
trend: it started after **Min/Max** were added, and a >$1,000 hose **without** Min/Max never reverted.

**That gives two distinct cases to test, and the second is the customer's actual trigger.**

## §1 — The fix branch: both cases hold

The part used is **P550848** `000657fe…`, whose Average Cost already displays comma-formatted as
**`10,000.00`** in the Edit Inventory Part dialog — the exact shape the truncation theory is about.
Everything below was driven **in the screen** (Parts → Inventory → the part row → the Edit Inventory
Part dialog → Save), not by API, because the comma formatting lives in that field.

| case | what was done | result after Save + hard reload + reopen |
|---|---|---|
| **A — the customer's trigger: set Min/Max, do not touch the cost** | Min 0 → **2**, Max 0 → **2** on a part whose cost reads `10,000.00` | **cost `10,000.00`, sell `14,286.00`** — unchanged. Min/Max saved as 2/2 |
| **B — the reported edit: type a four-figure Average Cost** | Average Cost → **`1069.03`** (the customer's exact value) | **cost `1,069.03`, sell `1,527.22`** |

**Neither truncated.** In case B the sell price was recalculated from **1,069.03**, not from 1.00 — which
is the specific thing MAX identified as proof the cost is being written wrong. Both saves posted
`POST /api/inventory/parts/change` → **201**.

Read back from the dialog's own inputs after a full page reload each time, not from the list view.

## §2 — PRODUCTION reproduces the bug, and the request payload shows exactly why

Part **`0085fddf-7299-49aa-b2f4-c40c98fbce71`** on production, org `72b2cc90…`. Original values recorded
first: cost **10.00**, sell 300.00, core 1.00, min 5, max 6, quantities 2 and 99.

| step | what was done, in the screen | result after Save + reload |
|---|---|---|
| 1 | Average Cost `10.00` → typed **`1069.03`**, Save | **`1,069.03`** — the direct edit is fine |
| 2 | **Touch nothing but Min/Max** (5/6 → 2/2), Save | **cost `1.00`** ← the customer's bug, reproduced |

### The mechanism, taken off the wire rather than inferred

The two saves posted the same endpoint with the cost in **two different shapes**:

```
save 1 (typed the cost)    "purchasePrice": 1069.03      <- a NUMBER
save 2 (only touched Min/Max)  "purchasePrice": "1,069.03"   <- a comma-formatted STRING
```

**The second save re-submits the field as its formatted display string, and the value lands as 1.00.**
That is MAX's truncation theory confirmed from the request itself, and it explains every detail the
customer reported:

* **why the direct edit "works" and then reverts** — the freshly typed value is a plain number, so save 1
  is correct; the next save of *anything else on that part* re-sends it as `"1,069.03"` and destroys it;
* **why Min/Max was the trend** — adding Min/Max is simply the most common reason to open and save the
  part again. Any other edit would do it too;
* **why the >$1,000 hose with no Min/Max never reverted** — nobody re-saved it;
* **why only four-figure costs are hit** — below $1,000 the display has no comma, so the string still
  parses.

### The same step on the fix branch

```
branch save (only touched Min/Max, 2/2 -> 7/9)   "purchasePrice": 1069.03   <- a NUMBER
```

cost after save + reload: **`1,069.03`**, sell **`1,527.22`** — unchanged. **The front end no longer
re-submits the formatted string.** Case A of §1 shows the same on a `10,000.00` part.

## §3 — Production left exactly as found

Restored through the same dialog and read back after a reload: cost **10.00**, sell 300.00, core 1.00,
min **5**, max **6**, quantities **2** and **99** — every field back to its original value.

## §4 — What this does NOT cover

* **The Min/Max reverting to 13 and 20** that Mike Freeman reported on 17 Sep. That is a separate claim
  in the same ticket, it is the one Dusan disputes, and nothing in this pass addresses it. Min/Max saved
  and survived correctly in every case here.
* **[SV-8447](https://shopview.atlassian.net/browse/SV-8447)** (`$3,896.04` → `$3.00`, Blocked since
  20 July), which MAX identifies as the same mechanism. If the fix here is the string-vs-number
  submission, that ticket is very likely fixed by the same change and worth re-checking.
* The customer's own five Michelin parts — their data is not on either environment tested.
