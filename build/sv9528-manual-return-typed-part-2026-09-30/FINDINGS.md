# SV-9528 — Manual Return only allows inventory parts; catalog and new parts cannot be selected

**Ticket:** [SV-9528](https://shopview.atlassian.net/browse/SV-9528) · status TESTING QA · priority Medium · duplicate link SV-9541
**QA branch:** https://sv9528.qa.shopview.com — build **`v26.39.2-0ab2729`**, last-modified Wed, 30 Sep 2026 09:30:34 GMT, etag `W/"a27b3ebad515836944b5bd6ffeb47a3b"`
**Production (BEFORE half, Standing Rule 86):** https://app.shopview.com — build **`v26.39.2-1aeb22d`**, last-modified Tue, 29 Sep 2026 09:36:08 GMT
**Handoff followed:** Stefan Vukovic's comment **77628**, PR #3371
**Date:** 2026-09-30

---

## 1. Verdict

**PASS** — all three handoff checks pass, plus the customer's own scenario, which the handoff does not
spell out as a step.

---

## 2. The scope question, settled before testing (Standing Rule 78)

The ticket's own **Expected Result** asks for three things to be *selectable* in the Part Number
dropdown: inventory parts, catalog parts and new parts. **What shipped is narrower** — the dropdown
still searches inventory only, and a catalog or brand-new part is recorded by **typing** its number.

That narrowing is **document-backed, not invented**:

- **Chris Ward, 2026-08-26 (comment 75672):** *"The user should be able to still add a custom part
  number to the field, and not have to use the dropdown an additional time to find the part number."*
- **Spec SV-2315** (*'Create Return' and 'Create Credit' Page*, status Done) says of the Part Number
  field: *"It should search INVENTORY ONLY. It should not search catalog items."* and lists
  **"Part Number (open field to edit)"** among the columns.

So the PO's ruling and the spec agree with each other and with what shipped, and they supersede the
ticket's original Expected Result (latest authoritative source wins). **This is disclosed in the QA
comment** rather than left for a reader to notice.

---

## 3. What was tested

| # | Check | Result |
|---|---|---|
| 1 | Create Return — type a part number that is in neither inventory nor the catalog, press Tab | **PASS** — `SV9528-QA-01` stays in the field |
| 1b | …then complete and Save Return | **PASS** — *"Manual Return created successfully"*, listed with the part number, 2.00 at $12.34 |
| 2 | Create Credit — same, plus a Credit Memo Number, then Post Credit | **PASS** — `SV9528-QA-02` stays; *"Manual return credited successfully"*; memo `SV9528-CM-01` listed at $10.49 |
| 2b | The typed part number persists onto the saved credit | **PASS** — opened the credit; `SV9528-QA-02` and its description are on the record |
| 3 | Regression — pick an inventory part from the dropdown | **PASS** — see below |
| 4 | The customer's own case — a catalog part that is not stocked | **PASS** — see §5 |

**Check 3 in detail**, driven with two inventory parts:

| Part | Description | Bin Location | Qty In Stock | Price | Core row |
|---|---|---|---|---|---|
| `P550848` (no core) | filled and **locked** | `H3B` | `6` | `53.52000` | none, correctly |
| `FLT1443E23` (core $43.47) | filled and **locked** | `Unassigned` | `0` | `56.97000` | **added automatically** — *"Core for REMANUFACTURED…"* at `$43.47`, total `$100.44` |

All four assertions the handoff makes about this path hold, and the core row appears only for the
cored part.

---

## 4. The BEFORE, captured on production

Same keystrokes on the live build: typed `SV9528-PROD-01` into Part Number on Create Return, pressed
Tab — **the field went blank**. The value was read straight out of the input both times, so this is
the field's real state and not an appearance.

This is exactly what Kerri White hit: she could not record a vendor credit for a part that was
returned to the vendor but never removed from an already-invoiced work order.

Nothing was saved on production — the form was abandoned, so there is nothing to restore.

---

## 5. The customer's own scenario, tested beyond the handoff

The handoff's steps use a part number that exists nowhere. The customer's case is a **catalog part
that is not an inventory item**, so that was driven too, using `F40010212` ("Slack Adjuster") — present
in the Catalog, absent from all 1,199 inventory part numbers on this org.

- Typing it offers **nothing** in the dropdown — correct, and exactly what SV-2315 requires.
- **It survives leaving the field by clicking away, not only by pressing Tab.** Worth stating
  plainly: clicking away is the gesture a real user makes, and the handoff only specifies Tab.
- The return saved and is listed against `F40010212`.

---

## 6. Other things seen (reported, not failed)

1. The **Credits list** shows the credit memo number, vendor, date, author and amount — **not** the
   part number. The typed part number is on the credit itself, which was confirmed by opening it. Not
   a defect, just worth knowing if anyone looks for it in the list.
2. Of 1,199 inventory parts on this org only **three** carry a core charge, so the core-row half of
   check 3 is easy to miss by picking an arbitrary part. `FLT1443E23`, `213-4760` and `XSS504692DFCII`
   are the three.

---

## 7. What could not be checked

Nothing.

---

## 8. Test data left in place

Per-ticket QA branches need no cleanup. Left standing and reproducible: manual return `SV9528-QA-01`
(5 Star Truck Repair, 2.00 at $12.34), manual return `F40010212` (the catalog-part case), and credit
memo `SV9528-CM-01` carrying part `SV9528-QA-02`. All descriptions are prefixed `ZZAUTOTEST`.

## 9. Evidence

- `ev/01-before-after.png` — production (field wiped) vs branch (field kept), same keystrokes
- `ev/02-return-saved.png` — the saved return listed with the typed part number
- `ev/03-inventory-regression.png` — the inventory-part path, with the core row added
- `ev/04-catalog-part.png` — a catalog-only part kept on click-away
- `ev/build_ex.py` — the exhibit builder
- Probe scripts and raw output: `/tmp/qa9528/`, not committed

## 10. Pre-post gate (Standing Rule 72)

Recorded in `GATE.md` when the comment is posted.
