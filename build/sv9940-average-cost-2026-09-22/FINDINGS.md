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
