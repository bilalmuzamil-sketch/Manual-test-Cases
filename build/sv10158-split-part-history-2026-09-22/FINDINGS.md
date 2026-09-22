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


## §4 — PRODUCTION (the BEFORE): the same split writes nothing

Standing Rule 86 — the BEFORE half of the comparison comes from production, the build customers are
actually running, never from staging.

**Two production attempts before this one were INVALID, and both failed the same way as §1**: the
seeded inventory request came back **`status: "quoted"`**, the explicit pick was refused
(*"Part request … is not available to pick."*), and Part History was of course unchanged. The reason
is one the branch run never hit, because there the line was already authorized:

> **a part request inherits the state of the line it sits on.** Seed onto a line that is still
> *quoted* and the request is quoted too — not orderable, not pickable, not inventory-linked. Nothing
> is due in Part History for it, so "0 new entries" proves nothing at all.

So the third attempt **authorizes the line first**
(`POST /api/work-orders/lines/change-lines {workOrderId, lines:[lineId], field:"status",
value:"authorized"}`), then picks, and — the part that matters — **refuses to split until the part is
proven staged**, by requiring the staged part's own context menu
(`button_part_context_menu_<workOrderPartId>_line_<lineId>`) to be present on the lines page. An
absence is only evidence once the precondition is proven present.

**The valid production run.** `app.shopview.com`, build **`v26.36.9-8d1613f`**, 22 Sep 2026 17:37–17:38 UTC:

```
autoPickInventoryParts = false                       (production, read live)
LINES on S2-811     5945bfdb:authorized  0690821f:complete
SEED                201 | status = in_stock          (authorized line -> pickable request)
PICK                201 {"pickedCount":1}
GATE                button_part_context_menu_aae96044-…_line_5945bfdb-…     <-- part IS staged
HISTORY BEFORE      1   (part.picked.qty — "Picked qty 2 on WO # S2-811, Qty: 6 -> 4 (-2)")
SPLIT               POST /api/work-orders/split {"ids":["5945bfdb-…"]} -> 201
                    browser landed on new work order ee9adbb2-…
HISTORY AFTER       1  |  NEW 0
```

**Nothing was written.** The part left S2-811 for a brand-new work order and its Part History still
shows only the pick. Screens: `ev/PROD-Q1-history-before.png` and `ev/PROD-Q2-history-after.png`
(distinct captures, one minute and one split apart — sha256 `732495f4…` and `14eb880f…`).

This is the defect the ticket reports, still live on the build customers are running today, proven
with the precondition established rather than assumed.

## §5 — What was left behind on production, stated plainly

Production keeps the restore-after discipline, and **a split cannot be undone** — it creates a new
work order and moves the line onto it. Deleting those new work orders would destroy the lines they
now carry, which is worse than leaving them, so they are left in place and named here instead:

| Created by | New work order | Line moved onto it |
|---|---|---|
| the first invalid attempt | `281adfa7-5925-4718-936d-91d12cda3873` | `04790952-…` ("Fdgfdg") |
| the valid attempt | `ee9adbb2-0df5-4e12-8771-506591445638` | `5945bfdb-…` |

Line `5945bfdb` was **already `authorized`** before the run, so the authorize call was a no-op
(`{"data":[]}`) and no line status was changed.

**Inventory is fully restored.** Part **1238213 / A427** is back at **quantity 6**, exactly where it
started — the one genuinely picked request (`ee651c2f`, work-order-part `aae96044`) was removed with
`POST /api/work-orders/parts/delete {part_id: <work_order_part_id>, work_order_id}` → 201, and the
stock read back 4 → **6**.

**Two unpicked `quoted` requests remain on `281adfa7`** (`a86add05`, `fd2fa876`), left by the two
invalid attempts. They hold **no stock** — nothing was ever picked for them — so inventory is
unaffected; they are cosmetic rows on a work order that already exists.

**A cleanup trap worth keeping.** The first cleanup pass filtered on the description
`ZZAUTOTEST SV-10158` and found **zero matches across all three work orders** — because
**the server overwrites the description on an inventory part request** with the inventory part's own
(`"A427"`). Match on `inventory_part_id`, and judge a cleanup by the thing that must move — the
**stock quantity** — not by how many rows the pass believed it removed.

## §6 — The QA comment: gate, post, read-back

**Pre-post gate (Standing Rule 72), run at the moment of posting, 22 Sep 2026 ~12:46 UTC-5:**

| Check | Result |
|---|---|
| branch build marker re-read live | `v26.36.9-58de7bb`, last-mod Tue 22 Sep 10:11:10 GMT — **unchanged** since pass start |
| production build marker re-read live | `v26.36.9-8d1613f`, last-mod Tue 22 Sep 09:38:08 GMT — **unchanged** |
| ticket state re-read live | status **TESTING QA**, priority **Medium**, **1 comment** (the developer's `77024`) — nothing new since it was read |
| AI-fingerprint scan of the body text | 0 hits |
| technical-details section | **absent** — per the QA lead's answer for this ticket (Standing Rule 84) |

**Posted:** comment **`77076`**, 2026-09-22T12:47:07-0500. Exhibits uploaded as **real Jira
attachments** (`61267` / `61268` / `61269`), not external links.

**Read back from Jira in ADF (Standing Rule 81 — verify what the reader gets, not what was sent):**

```
first text   "OVERALL QA STATUS: PASSED"
table rows   6  (header + 5 checks)
media 1      after "Before and after"                         980x400  type=file
media 2      after "Checks 1 and 2 — one entry per part…"      980x371  type=file
media 3      after "Checks 4 and 5 — the ordinary Move…"       980x243  type=file
fingerprints 0            technical-details section  absent
```

**The read-back caught a real defect and it was fixed in place.** The first post used
`!file.png|width=980!`, and Jira filled in a **height of 183 for all three images** — a single default
rather than each image's own aspect — so every exhibit would have rendered **squashed**. The comment
was updated in place (`PUT …/comment/77076`) with an explicit `width=980,height=<computed>` per image
and re-read to confirm 400 / 371 / 243. **This is exactly the Rule-81 failure mode: the upload
succeeded, the attachments were real, and the reader would still have seen sloppy work.** Worth
carrying forward: *a wiki-markup image with `width` alone does not keep its aspect ratio — give it
both, computed from the file.*
