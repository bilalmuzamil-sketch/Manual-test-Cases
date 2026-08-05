# SV-8781 — result against the DEV'S OWN QA HANDOFF · **PASSED**

**Supersedes `RESULT-PASSED-2026-08-05.md`**, which was written from the ticket comments before the
generated handoff was available. That earlier verdict was **premature** — the handoff's *key check* is
a scenario it had not built. It has now been built and it passes.

**Env:** `sv8781.qa.shopview.com` · **`v3.5-fb6371c`** (marker byte-identical at pass start and end)
**Jira:** correction on comment `74577`, full result in comment `74578`

## Handoff checklist — item by item

| Handoff item | Verdict |
|---|---|
| Split: parts move to the new WO's own PO | **PASS** — S2-15886 → split → parts moved to new PO **S-15887**; old PO ceased to exist |
| Land on the new work order after the split | **PASS** (via endpoint; UI control see below) |
| Moved part keeps its prior status, not reset to "Authorized to Order" | **PASS** — stayed **"Awaiting"** |
| Moved part keeps correct vendor + receive action | **PASS** — Aabridge Beverages, Receive available |
| Original WO's remaining PO/parts still display correctly | **PASS** — WO-A kept ZZ-L2 on S-15888 |
| **KEY: exactly ONE PO block per vendor — not two — listing the new WO's own part AND the carried-over part** | **PASS** — one block, `orderNumber` **S-15888** (carried over) + **S-15889** (own) |
| Enter an invoice number, receive all items in one submission | **PASS** — `ZZAUTOTEST-INV-MERGED`, `receive-requested-parts` 200 |
| Both order numbers show correct received qty/cost against their **own** order, not double-counted | **PASS** at PO level — S-15888 took ZZ-L1's remaining 1, S-15889 closed out, nothing missing |
| **Partially-received parts left behind, not moved** | **PASS** — partially received first, then split: ZZ-L1 **stayed on S-15888** |
| Receiving updates the **correct** work order's status | **PASS** — WO-B `unreceived 0` (cleared), WO-A `unreceived 1` (correctly still waiting) |
| Simple Mode: part ordered before number/cost known, then split → no 500, cost shows 0 | **PASS** |
| Regression: normal non-split single-PO receive | **NOT RUN** |
| Regression: never-split work order | **NOT RUN** |
| CLI repair command | out of QA scope per the handoff |

## The discriminator that matters

* **fully unreceived** parts → PO **moves** to the new work order (S-15886 → S-15887)
* **partially received** parts → **stay** on the original work order's PO (S-15888)
* and the split-off work order can still **reach and receive** the stayed-behind item, because the
  receive view scopes by the **part request's** work order rather than the PO's

## Known pre-existing issue — reproduced, and now more reachable

One $61.00 invoice spanning two POs produced **two** Delivery rows, each stamped **$61.00**
(S-15888 and S-15889) → **$122.00 against a $61.00 invoice**. The handoff declares this pre-existing
and out of scope; **accepted as such**, but this fix makes it materially more reachable because a
merged two-PO receive is now a normal flow rather than an unreachable state. Candidate for its own
ticket — not raised, needs the QA lead's go-ahead.

## Not verified

* **The on-screen "Split work order" control** — it is a **two-step confirm** (guard: first call arms,
  second acts; the first click restyles the entry red). Headless automation could not land the second
  activation, so the split was driven through the same endpoint the control calls
  (`POST work-orders/split {ids:[lineId]}`). Everything downstream is verified. **Deliberately NOT
  reported as broken** — that was not proven, and the mechanism explains the observed no-op.
* **Handoff drift:** the checklist names `menu_item_split_wo`; that test-id **does not exist in this
  build**. The real control is the line bulk-action entry labelled **"Split work order"**.
* Two regression items above.

## Test data (left in place — QA branch, per the QA lead's ruling)

WO **S2-15888** (`4be9c3df…`) · WO **S2-15889** (`41309809…`) · POs **S-15888** (`5ea83031…`),
**S-15889** (`a6e4bc4b…`) · earlier pair WO **S2-15886**/**S2-15887**, POs **S-15886**/**S-15887** ·
parts **ZZ-L1**, **ZZ-L2**, **ZZ-OWN**, **ZZ-P1**, **ZZ-P2** · vendor **Aabridge Beverages** ·
invoices `ZZAUTOTEST-INV-1`, `ZZAUTOTEST-INV-PARTIAL`, `ZZAUTOTEST-INV-MERGED` ·
customer **Aaborough Works**, **2020 Ford Transit** VIN **86J8FAC1VALJ43SJY**

## Evidence

`evidence/PASS-KEY-two-POs-merged-one-block.png` · `PASS-partial-receive-before-split.png` ·
`PASS-parts-moved-to-new-wo.png` · `PASS-receive-one-vendor-single-invoice.png` ·
`PASS-per-item-posting-and-partial-receive.png` · `INFO-split-work-order-menu.png`

## OUTSTANDING

1. **One human click-through of "Split work order"** (click twice — it is a confirm control).
2. **Raise a ticket for the duplicated Delivery total?** Pre-existing, but newly easy to hit.
3. **Two regression checks** not run (non-split single-PO receive; never-split WO).
4. **Screenshots still need attaching to the ticket** — no Jira attachment API in my tooling.

---

## Closed out 2026-08-05 (final)

**SV-8781 → QA Complete.** Comment `74580` carries the result in the QA-lead's required format:
overall status first, the 13-row table, the separate-issue note, 5 inline images, then technical
details after a rule.

**Both previously-unverified items were unblocked and now PASS:**
* The on-screen **"Split work order"** control is a **click-twice-to-confirm** — first click arms it and
  turns the entry red while the menu stays open, second click performs the split (`201 POST
  work-orders/split`, landed on new WO **S-15890**). My earlier no-op was my own script reopening the
  menu and discarding the armed state. **Not a defect.**
* **Both regressions** run: never-split WO **S2-15891** received its single PO normally; order-scoped
  inventory PO **I-1201** received via `POST /api/inventory/orders/accept` → **201**, showing no Work
  Order Number as expected. (First attempt there returned `400 "Invoice number is too long. Max length
  is 21 characters."` — my 26-char invoice string, not a defect.)

**Follow-up ticket raised: [SV-8910](https://shopview.atlassian.net/browse/SV-8910)** — *Vendor invoice
total is duplicated onto every purchase order when one receive spans two POs* · Bug · **Low** ·
Product Area **Parts** · linked to SV-8781 as **Relates** · Open. Carries what-happens-now vs
what-should-happen, 9 numbered reproduction steps naming every value, impact, two **annotated**
screenshots, and the technical section with the raw delivery rows and object ids.

**Also found:** the "Vendor Invoices" page *does* exist (Parts → Vendor Invoices, Total Cost column),
correcting my earlier note that it did not — that is where the duplicated total is visible.

**Removed from the comment at the QA lead's instruction:** the handoff-drift notes, the test-data
inventory, and the false-alarm note. They remain recorded here.

### Notes kept here rather than on the ticket
* The handoff names `data-test-id` **`menu_item_split_wo`**, which does not exist in this build; the
  control is the line bulk-action entry labelled **"Split work order"**.
* The receive button refuses until an invoice number plus a non-zero cost and sell price are set on
  every selected part, and its tooltip says exactly that — a good self-explaining guard. The
  order-scoped receive enforces a 21-character invoice-number limit.
* Test data left on the QA branch: customer **Aaborough Works**, **2020 Ford Transit** VIN
  **86J8FAC1VALJ43SJY**; work orders **S2-15886, S2-15887, S2-15888, S2-15889, S-15890, S2-15891**;
  purchase orders **S-15886, S-15887, S-15888, S-15889**, inventory PO **I-1201**; parts **ZZ-P1,
  ZZ-P2, ZZ-L1, ZZ-L2, ZZ-OWN, ZZ-NS**; vendor **Aabridge Beverages**; invoices
  **ZZAUTOTEST-INV-1, -PARTIAL, -MERGED, -NOSPLIT, ZZTEST-ORD-1**.
* One false alarm of mine: a "Something went wrong loading this section" on the receive screen was my
  test rig — `feature-flags` called with an empty `organization_id` because my scripted sign-in had not
  populated it. Not a defect.
