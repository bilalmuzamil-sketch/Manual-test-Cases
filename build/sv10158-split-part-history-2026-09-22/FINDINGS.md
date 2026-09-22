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

## §2 — FIX BRANCH: the reported flow now records the move

Auto-pick was turned **on** first (`POST /api/organizations/settings/change` → 200, re-read confirms
`"autoPickInventoryParts": true`), so the seeded part is genuinely picked — the seed came back
**`status: "received"`**, which is the state §1 was missing.

Work order **S2-17435**, line 1 *"Service - CVIP inspection single or tandem axle"*, part **MD668D**
seeded at **quantity 2**. Split driven **through the screen** exactly as the ticket's steps describe —
hover the line, tick the box that appears (`aria-checked` verified `true`), the ⋮ beside the
select-all box, then **Split work order clicked twice** — `POST /api/work-orders/split
{"ids":["522f44cc-…"]}` → **201**, and the browser landed on a brand-new work order.

| | Part History for MD668D |
|---|---|
| before the split | 4 entries |
| after the split | **5 entries — exactly one new** |

The new entry:

```
eventType : part.moved_to.work_order
eventName : Moved
on screen : "Moved 2 from WO # S2-17435 to WO # S10158-17581"
```

The quantity in the entry (**2**) matches the quantity seeded onto the line. This is the ticket's
Expected Behaviour met as written: *"An entry showing the part moved from the original work order to
the new one."*

## §3 — The developer's three claims, each tested

**Claim 1 — *"one per inventory-linked part on the split line"*. HOLDS.** Line 2 of the same work
order was given **two different** inventory parts — MD668D at quantity 3 and 2208H476 at quantity 1 —
and then split:

| Part | Entries before | Entries after | New | Entry on screen |
|---|---|---|---|---|
| MD668D | 6 | 7 | **1** | `Moved 3 from WO # S2-17435 to WO # S10158-17582` |
| 2208H476 | 1 | 2 | **1** | `Moved 1 from WO # S2-17435 to WO # S10158-17582` |

One entry each, never two, never none, and each carries its own correct quantity. MD668D now shows
both of its splits separately (`Moved 3 … to S10158-17582` and `Moved 2 … to S10158-17581`), so
repeated splits accumulate properly rather than overwriting.

**Claim 3 — *"the existing Split to / Split from work-order entries are unaffected"*. HOLDS.**

| Work order | History entries | Split-related |
|---|---|---|
| **S2-17435** (original) | 17 | **3 × `work_order.split_to` "Split to"** — one per split performed |
| **S10158-17581** (new) | 2 | **1 × `work_order.split_from` "Split from"** |
| **S10158-17582** (new) | 2 | **1 × `work_order.split_from` "Split from"** |

Worth noting: the **first, invalid split from §1** — the one whose part was never picked — still
produced its `Split to` / `Split from` pair. The work-order-level record is about the *line* moving
and is independent of whether any part was inventory-linked, which is the correct separation.

**Regression guard — the ordinary Move still writes its entry (SV-9304 undisturbed). HOLDS.**
A staged part (**P550848**) was moved from S2-17435 to a line on S10158-17581:

```
eventType : part.moved_to.work_order
eventName : Moved
on screen : "Moved 1 from WO # S2-17435 to WO # S10158-17581"
```

**Which also answers the ticket's "same kind of entry" requirement (check 5).** Split and Move now
produce the **same `eventType` and the same wording**, differing only in the quantity:

```
split :  part.moved_to.work_order   "Moved 2 from WO # S2-17435 to WO # S10158-17581"
move  :  part.moved_to.work_order   "Moved 1 from WO # S2-17435 to WO # S10158-17581"
```

**Honest note on how each was driven (the UI-vs-API split).** The **feature under test — the split —
was driven entirely through the screen**, including the two-click menu, because that is what a user
does and the screen can send a different payload than a script. The **Move regression guard was driven
at its endpoint** after the Quasar target-line dropdown proved awkward to automate; it is a guard on a
neighbouring feature rather than the thing under test, and the endpoint is the one the dialog itself
calls.

