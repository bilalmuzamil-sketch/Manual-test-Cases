# SV-10190 — Delete line stays enabled on a line holding a received part, and the delete succeeds

**Ticket:** [SV-10190](https://shopview.atlassian.net/browse/SV-10190) · status TESTING STAGE · priority **High** (data loss) · reporter Vladimir Tomovic · assignee parth fadadu
**Tested on:** https://app.staging.shopview.com — build **`v26.39.2-538dd8d`**, last-modified Wed, 30 Sep 2026 15:50:45 GMT, etag `W/"a7ed1984fe1c2eebda9ebbcf19239b3a"`
**Fix reached staging:** 30 Sep 08:37 (Merged to Staging), moved to TESTING STAGE 10:42
**Repro methods followed:** the ticket's own Steps to reproduce (single tab) **and** parth fadadu's two-tab method in comment 77401
**Date:** 2026-10-01

---

## 1. Verdict

**PARTIAL — the data-loss defect is fixed; the stale-menu defect is not.**

The ticket describes two compounding defects and says so itself: *"Fixing the server side alone
prevents the data loss; fixing the refresh alone only narrows the window."* That is exactly what has
happened. The server side is fixed. The refresh is not.

| Defect | Result |
|---|---|
| 2 — `POST /api/work-orders/lines/delete` has no staged-parts guard | **FIXED** |
| 1 — the line keeps its pre-receive `deletable: true`, so Delete line stays enabled | **STILL REPRODUCES**, 6 of 6 |

**Against the ticket's stated Expected result** — *"Delete line is disabled, with the hover
message…"* — this **does not pass**: in the two-tab case the item is still enabled. But the High
severity was *data loss*, and no data can be lost any more.

---

## 2. Defect 2 — the server-side guard (the data-loss half): FIXED

Verified two ways on a line holding a part received moments earlier:

**Directly at the endpoint**
```
POST /api/work-orders/lines/delete   ->  400
{"errors":[{"error":"Line can not be deleted with staged parts, please move parts to another line or return them"}]}
```
The line and its part were both still present afterwards.

**Through the screen** — on a line where the menu item was wrongly enabled, clicking *Delete line*
opens the usual confirm dialog (*"Are you sure you want to delete this line? This cannot be
undone."*); pressing **Delete** produces a red warning — *"Line can not be deleted with staged parts,
please move parts to another line or return them. Please try to resolve this."* — and the line and
its received part survive. Re-read from the API afterwards: line present, 1 part attached.

So the user now gets an error instead of silent destruction. **This was the High-severity half.**

---

## 3. Defect 1 — the stale menu flag: STILL REPRODUCES

Using parth's two-tab method exactly: tab 1 left open on `/workorders/<id>/lines` with the part
ordered but not received, the part received in tab 2, then back to tab 1 **without reloading**.

| Attempts | Delete line disabled (correct) | Delete line enabled (the bug) |
|---|---|---|
| **6** (fresh work order and line each time) | 0 | **6** |

In every attempt the backend already reported `deletable: false` for that line while the menu item
rendered red and clickable. The original report measured 5 of 8 (62%); it reproduced 6 of 6 here.

Note the part row in tab 1 is stale too — it still shows *Awaiting* with a **Receive** button. The
ticket says the part row updates while the line's flag does not; in the two-tab case nothing in that
tab updates, because the tab never refetches.

### Where it does *not* happen

| Situation | Attempts | Result |
|---|---|---|
| Page loaded fresh (or reloaded) after the receive | 1 | **Disabled**, correct tooltip |
| The ticket's own steps — part received via **Receive parts** on the Lines page itself, no reload | **3** | **Disabled** all 3, correct tooltip |

So the board does refetch after an in-page receive, and the stale view is confined to a receive done
**somewhere else** — another tab, the purchase order page, or bulk receive.

---

## 4. The tooltip wording (three different strings are in play)

The live hover message is:

> Line can not be deleted with staged parts, please move parts to another line or return them

That matches **[SV-10442](https://shopview.atlassian.net/browse/SV-10442)** (Done), which corrected
the message from *"declined"* to *"deleted"*, and matches parth's Expected in comment 77401. It does
**not** match the string in this ticket's Expected result, which quotes TestRail **C2158** as
*"Cannot delete line with staged part"*. Following the newer, ratified source. **If C2158 still
asserts the old string it will fail on wording alone and should be updated** — flagged, not changed
(TestRail is not touched without authorisation).

---

## 5. How it was tested

Seeded on staging under the shared Foothills org, everything tagged `ZZAUTOTEST`:
work order → authorized line from a canned line → vendor part request → ordered → received through
the normal receiving screens. Each race attempt used a **fresh work order and line** so no attempt
could contaminate the next.

Honest split of what was clicked versus called: the **thing under test** — the Lines page, the line's
`…` menu, the Delete line item, the confirm dialog, and both receiving screens — was driven **on the
screen**. The **set-up** (creating the work order, the line, the part request and the order) was done
through the API for speed.

---

## 6. What could not be done, and why

**The production before-capture (Standing Rules 73/86) was not obtained.** Production
(`v26.39.2-1aeb22d`) does not carry this fix, so it is where the data loss could be shown.
Work-order creation there could not be driven:

- `POST /api/work-orders/create` returns `{"company_id":"Not found"}` for **every** customer tried —
  80 customers at each of the nine workplaces.
- A customer created through `POST /api/customers/create` (201) is then rejected by
  `POST /api/vehicles/create` with `{"customer_id":"Not found"}`.
- `/api/companies` ignores its `search` parameter, returning the same first 100 rows regardless, so
  the customers visible on existing production work orders could not be located by name.
- The Create Work Order dialog **does** open in the UI, and that route is not exhausted — its
  customer and asset pickers are Quasar selects without test ids, so driving them is a longer job.

**This is an ask, not a decision** (Standing Rule 91): say the word and I will drive the production
dialog by hand and capture the before. Nothing in the verdict above depends on it.

---

## 7. Test data left on staging

Staging is shared, so nothing pre-existing was modified — only new records were created, all
descriptions prefixed `ZZAUTOTEST`. Left in place because they are the reproduction:

- **S2-34499** — work order `28d60f52-4bae-4f1d-837d-9d1129e68be3`, line *Replace - Hub cap gaskets*,
  part `SV10190-CLICK`: the line where the refused delete was captured.
- **S2-34483** — work order `52e0753e-23cd-4789-a8cc-b37135328b23`, three lines with received parts:
  the fresh-load correct state.

The remaining scratch work orders from the repeat runs are listed in `CLEANUP.md`.

## 8. Evidence

- `ev/01-server-refuses.png` — the delete refused, line and part intact
- `ev/02-two-tab-still-enabled.png` — Delete line still red and clickable after a receive elsewhere
- `ev/03-correct-states.png` — the two situations that behave correctly
- `ev/build_ex.py` — the exhibit builder
- Probe scripts and raw run output: `/tmp/qa10190/`, not committed

## 9. Pre-post gate (Standing Rule 72)

Recorded in `GATE.md` when the comment is posted.
