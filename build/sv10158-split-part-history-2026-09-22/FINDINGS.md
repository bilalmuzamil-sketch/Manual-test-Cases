# SV-10158 — Split work order moves a part but writes no Part History entry

**Ticket:** [SV-10158](https://shopview.atlassian.net/browse/SV-10158) · status **TESTING QA** ·
priority Medium · label `QA_Validation_Required` · reporter **Bilal Muzamil** · assignee
**Slavcho Mitrov** · created 2026-09-17 · updated 2026-09-22T11:52:33.
**Links:** `relates to` **SV-9304** — *Moving a part between work orders leaves no history*.

**Note on provenance: this ticket is ours.** It was raised on 17 September out of the SV-9304 pass,
so the "reported flow" in Rule 66 terms is our own written repro, and the acceptance bar is the
Expected Behaviour we ourselves put on the ticket.

## §0 — Sources, read live at pass start

**What the ticket reports (from its own description):** splitting a work order moves a part onto the
new work order, but the part's Part History records nothing — no entry names the new work order.
**Expected:** *"An entry showing the part moved from the original work order to the new one — the same
kind of entry the app already writes when a part is moved with the Move option ('Moved 1 from WO # …
to WO # …')."*

**The open product question the ticket deliberately left (Rule 78 applies):** *"moving a part with the
Move option is now recorded, and splitting is a third way a part changes work order. Whether the split
should write the same record has not been written down anywhere, so it needs a decision."*

**The developer's comment (`77024`, Slavcho Mitrov, 2026-09-22T03:55:08) — the only comment.** Fixed in
PR **3215**, targets `main`. His claims, quoted, each of which is a testable assertion:
1. *"A split now writes the same Part History entry a Move does — e.g. Moved 2 from WO # S2-14638 to
   WO # S2-16421 — **one per inventory-linked part on the split line**."*
2. *"This was a gap rather than a regression: the split never went through the code SV-9304 fixed, so
   it has never written Part History."*
3. *"the existing **Split to / Split from** work-order entries are unaffected."*
4. **He answers the open question:** *"yes, a split records the same way a move does."*

**Declared out of scope by the developer, needing their own tickets:** the same gap for **part-sale
move** and **part-sale split**; and the split still writes **no per-part work-order-level entry**
(blocked on **SV-7884** settling the payload shape).

## §0b — Environments and build markers (read live at pass start)

| Role | Environment | Build marker | index.html last-modified |
|---|---|---|---|
| AFTER (fix) | `sv10158.qa.shopview.com` | **`v26.36.9-58de7bb`** | Tue, 22 Sep 2026 10:11:10 GMT |
| BEFORE (pre-fix) | `app.shopview.com` | **`v26.36.9-8d1613f`** | Tue, 22 Sep 2026 09:38:08 GMT |

Production is the BEFORE per Standing Rule 86.

## §0c — Test plan

| # | Check | Source of the requirement |
|---|---|---|
| 1 | The reported flow: split a line carrying an inventory-linked part → Part History shows `Moved N from WO # <old> to WO # <new>` | the ticket's Expected Behaviour |
| 2 | **One entry per inventory-linked part** on the split line (a line carrying more than one part) | developer claim 1 |
| 3 | The work-order-level **Split to / Split from** entries still appear and are unchanged | developer claim 3 |
| 4 | Regression: the ordinary **Move** option still writes its entry (SV-9304 not disturbed) | SV-9304, `relates to` |
| 5 | The wording matches the Move entry's wording, since the ticket asks for *"the same kind of entry"* | the ticket's Expected Behaviour |
| 6 | BEFORE on production: the same split writes nothing | Standing Rules 73/86 |

## §1 — A first attempt that was INVALID, and why it is recorded rather than quietly redone

The first run looked like a clean failure and was not one. It is written down because the trap is
reusable.

A part was seeded onto line 5 of `S2-17435` with the playbook's §AC.10 recipe
(`POST /api/work-orders/part/make-request` → **201**), the line was split
(`POST /api/work-orders/split {"ids":["625e7b98-…"]}` → **201**, the browser navigated to a brand-new
work order `1654346c-…`), and **Part History was unchanged: 3 entries before, 3 after, no `Moved`
entry.** On the face of it, the exact defect still reproducing on the fix branch.

**It was a seeding failure, not a product failure.** Reading the organisation settings before
concluding anything (Standing Rule 75 — configuration first) gave:

```
"autoPickInventoryParts": false
```

The playbook's seeding recipe depends on that flag being **on**: with auto-pick enabled a seeded
inventory part comes back `status: "received"`, genuinely out of stock, and therefore *is* linked to
an inventory part. With it **off**, the seeded request is never picked — nothing leaves stock, the
part is not inventory-linked, and **no Part History entry is due for it under anybody's reading.**
Splitting that line proved nothing at all.

**This is the second time today the same class of mistake was one step away from a false report**, and
it is already written down: playbook **§AC.9 — "Inventory parts arrive ALREADY PICKED when auto-pick
is on — check the setting before seeding."** It was not read before seeding. The retest below turns
the flag on first and verifies the seeded request really comes back picked, rather than assuming it.

