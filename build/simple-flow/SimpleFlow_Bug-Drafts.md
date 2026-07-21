# Simple Mode — Bug Drafts (plain-English)

Five issues found while testing Simple Mode, written in plain English.
Each entry explains what happens now, what should happen instead, and
simple steps to see it. **These are defects for the dev team — not
questions for the product owner.**

---

## 1. Permission to finish or review a work order is only enforced on the screen, not behind the scenes  _(Severity: Medium)_

**What happens now**
Some staff are not supposed to be able to finish a work order or sign off a review. The screen correctly hides those buttons from them - so through normal use they can't do it. But the check is only on the screen: the system behind the screen does NOT block the action, so someone technical could still finish a work order or sign off a review even without the permission. (It has been agreed the on-screen block is good enough for the first version; this is logged so the deeper block can be added later.)

**What should happen**
The block should also happen behind the screen, not just on it - so a person without the permission is refused even if they try to go around the normal screen.

**How to see it (simple steps)**
1. Sign in as a role that is NOT allowed to finish work orders (for example a Technician).
2. Confirm the Finish / Mark-Reviewed buttons are hidden on the screen - good.
3. Have someone technical trigger the same "finish" or "sign off" action directly (not through the normal screen).
4. Notice the action still goes through - it should have been refused.

---

## 2. Required fields at finish time (mileage, VIN, engine hours) are only enforced on the screen  _(Severity: Medium)_

**What happens now**
When settings say fields like mileage, VIN or engine hours are required to finish a work order, the finish screen correctly stops you until you fill them in. But the system behind the screen does NOT check for them - so a work order can still be finished with those required fields left empty if the action is triggered outside the normal screen.

**What should happen**
The system behind the screen should also refuse to finish a work order when a required field (mileage / VIN / engine hours) is missing - the same way the on-screen finish step already does.

**How to see it (simple steps)**
1. In Work Order settings, turn on "require mileage" (and/or VIN, engine hours).
2. Confirm the finish screen blocks you until those fields are filled - good.
3. Have someone technical trigger the "finish" action directly, leaving those fields empty.
4. Notice the work order finishes anyway with the fields blank - it should have been refused.

---

## 3. Receiving a work-order part on the OLDER receiving screen fails with an error (the newer bulk screen works)  _(Severity: Low)_

**What happens now**
When a part was ordered from a work order, trying to receive it on the older single-order "Accept Delivery" screen fails - the app shows a generic error and nothing is received. The SAME part receives fine on the newer "bulk receive" screen, and ordinary (non-work-order) parts receive fine on the older screen too. So it only breaks for work-order parts on that one older screen - and a working alternative already exists, which is why this is low urgency.

**What should happen**
Receiving a work-order part on the older Accept Delivery screen should succeed and record the delivery, exactly like it already does on the newer bulk receive screen and for ordinary parts.

**How to see it (simple steps)**
1. Create a work order and add a part from a supplier, typing the part number in by hand.
2. Finish the work order so the part becomes an order waiting to be received.
3. Open the older "Accept Delivery" screen for that order.
4. Enter an invoice number and a received quantity, then click Receive.
5. Notice it fails with an error - the newer bulk receive screen would have accepted it.

---

## 4. A brand-new company starts with the wrong default settings  _(Severity: Medium)_

**What happens now**
When a company first starts using Simple Mode, two settings come out of the box set the wrong way: "auto-approve lines" is turned ON (it should be OFF) and the supplier invoice number is set to optional (it should be required). So a new company gets the wrong behaviour until someone notices and changes it by hand.

**What should happen**
Out of the box, a new company should have "auto-approve lines" turned OFF and the supplier invoice number set to REQUIRED, matching the agreed defaults.

**How to see it (simple steps)**
1. On a brand-new company (or first use of Simple Mode), open Work Order settings.
2. Look at "auto-approve lines" and the "supplier invoice" setting.
3. Notice auto-approve is ON and the invoice is optional - they should be OFF and required.

---

## 5. On the Receive screen, the "Vendor Missing" group of parts shows at the top instead of the bottom  _(Severity: DROPPED — WON'T FILE (cosmetic only, no functional impact; user decision 2026-07-20))_

**What happens now**
When you open a work order and click the "Receive" button, you land on the "Purchase Order Details" screen, where the parts are grouped by supplier. Parts that don't have a supplier assigned yet are put in a "Vendor Missing" group. On this Receive screen that "Vendor Missing" group appears at the TOP of the list, above all the supplier groups. It has been agreed it should appear at the BOTTOM here. (On the separate "Bulk Receive" / "Receive Vendor Parts" page the "Vendor Missing" group correctly shows at the top - that page is fine and should not change.)

**What should happen**
On the Receive ("Purchase Order Details") screen reached from a work order's "Receive" button, the "Vendor Missing" group should appear at the BOTTOM of the list, below the supplier groups. The "Bulk Receive" / "Receive Vendor Parts" page should keep showing it at the top, unchanged.

**How to see it (simple steps)**
1. Open a work order that has some parts with a supplier and at least one part with no supplier assigned yet.
2. Click the "Receive" button on the work order to open the "Purchase Order Details" screen.
3. Look at where the "Vendor Missing" group sits in the list.
4. Notice it is at the TOP, above the supplier groups - it should be at the BOTTOM here.
5. For comparison, open the "Bulk Receive" / "Receive Vendor Parts" page and confirm the "Vendor Missing" group is at the top there - that one is correct.

---

---

## Internal — QA/dev-only mapping (NOT for the PO)

Links each plain-English bug above to its internal code, Jira draft,
affected TestRail cases, refs and current status.

### Bug 1

- **Internal code / Jira draft:** BUG-6 + BUG-7. Jira draft: TICKET 2. Milos R2 Q5: UI gating = v1 PASS; this is the OPEN fix ticket for the behind-the-screen (API) gap.
- **TestRail cases:**
  - SF-PERM-06 — [C29410](https://shopview.testrail.io/index.php?/cases/view/29410)
  - SF-PERM-02 — [C29406](https://shopview.testrail.io/index.php?/cases/view/29406)
  - SF-PERM-07 — [C29411](https://shopview.testrail.io/index.php?/cases/view/29411)
  - SF-REV-09 — [C29394](https://shopview.testrail.io/index.php?/cases/view/29394)
- **Refs:** SV-8183 backend-enforcement claim vs SV-7864 atom-collapse (workOrderLinesCreateAndEdit collapses to ROLE_WORK_ORDER::VIEW+CREATE_AND_EDIT). Tech simple-complete -> 201; tech change-status->complete -> 201; by contrast tech settings/change -> 403 (settings atom IS enforced).
- **Current status:** OPEN — CONFIRMED bug (API gap kept open per Milos R2 Q5). Medium. SF-PERM-06 = API section (4090). Results recorded "UI pass / API fail".

### Bug 2

- **Internal code / Jira draft:** BUG-8. Jira draft: TICKET 3.
- **TestRail cases:**
  - SF-VAL-01 — [C29415](https://shopview.testrail.io/index.php?/cases/view/29415)
  - SF-VAL-02 — [C29416](https://shopview.testrail.io/index.php?/cases/view/29416)
  - SF-VAL-03 — [C29417](https://shopview.testrail.io/index.php?/cases/view/29417)
  - SF-COMP-05 — [C29294](https://shopview.testrail.io/index.php?/cases/view/29294)
  - SF-COMP-16 — [C29305](https://shopview.testrail.io/index.php?/cases/view/29305)
  - SF-REV-03 — [C29388](https://shopview.testrail.io/index.php?/cases/view/29388)
- **Refs:** SV-8183 backend-enforcement claim / SV-7864 atom-collapse. Evidence viu-evidence/VIU2-02-mileage-gate.png (wizard blocks) vs simple-complete {} -> 201 with mileage empty.
- **Current status:** OPEN — CONFIRMED bug, expected NOT rewritten. Medium. Required-field gates (mileage/VIN/engine hours) are UI-only; backend-checked blockers (tech story, line approval) ARE enforced.

### Bug 3

- **Internal code / Jira draft:** BUG-11. Jira draft: TICKET 4. DOWNGRADED 2026-07-09 (RE-VIU BATCH 7): confined to the LEGACY single-PO Accept-Delivery path; the new Bulk Receive pipeline works (receive-requested-parts -> 200).
- **TestRail cases:**
  - SF-COMP-13 — [C29302](https://shopview.testrail.io/index.php?/cases/view/29302)
  - SF-COMP-19 — [C29308](https://shopview.testrail.io/index.php?/cases/view/29308)
  - SF-VAL-05 — [C29419](https://shopview.testrail.io/index.php?/cases/view/29419)
  - SF-VAL-06 — [C29420](https://shopview.testrail.io/index.php?/cases/view/29420)
  - SF-PNFIX-02 — [C29364](https://shopview.testrail.io/index.php?/cases/view/29364)
  - SF-PNFIX-03 — [C29365](https://shopview.testrail.io/index.php?/cases/view/29365)
  - SF-PNFIX-04 — [C29366](https://shopview.testrail.io/index.php?/cases/view/29366)
  - SF-PNFIX-05 — [C29367](https://shopview.testrail.io/index.php?/cases/view/29367)
  - SF-PNFIX-06 — [C29368](https://shopview.testrail.io/index.php?/cases/view/29368)
  - SF-RCV-08 — [C29376](https://shopview.testrail.io/index.php?/cases/view/29376)
  - SF-VPART-07 — [C29337](https://shopview.testrail.io/index.php?/cases/view/29337)
  - SF-REV-04 — [C29389](https://shopview.testrail.io/index.php?/cases/view/29389)
  - SF-REV-14 — [C29399](https://shopview.testrail.io/index.php?/cases/view/29399)
  - SF-CORE-03 — [C29315](https://shopview.testrail.io/index.php?/cases/view/29315)
  - SF-CORE-04 — [C29316](https://shopview.testrail.io/index.php?/cases/view/29316)
  - SF-CORE-05 — [C29317](https://shopview.testrail.io/index.php?/cases/view/29317)
  - SF-CORE-07 — [C29319](https://shopview.testrail.io/index.php?/cases/view/29319)
- **Refs:** SV-7301 / Story 10 (receive creates/links catalog+inventory part) / Story 8 (Bulk Receive = the working path). Legacy POST /api/inventory/orders/accept -> 500 for WO POs (free-text/non-catalog part; manufacturer_id null). Evidence viu-evidence/R7-01-wo-po-accept-delivery.png, R7-06-received-full.png.
- **Current status:** OPEN — Low (downgraded). Affected cases now largely testable via the Bulk Receive path; this ticket only blocks the legacy single-PO Accept-Delivery surface.

### Bug 4

- **Internal code / Jira draft:** GAP-B. Jira draft: TICKET 5.
- **TestRail cases:**
  - SF-SET-08 — [C29282](https://shopview.testrail.io/index.php?/cases/view/29282)
- **Refs:** §4 / S1 first-use defaults (confirmed Milos Q3): Auto-approve OFF, Create POs ON, Vendor Invoice REQUIRED. Live GET /api/organizations/settings shows autoApproveLines:true, requireVendorInvoiceNumber:false.
- **Current status:** OPEN — CONFIRMED bug, SF-SET-08 expected stays (authoritative spec default). Medium. Wrong first-use org defaults.

### Bug 5

- **Internal code / Jira draft:** Round-3 deviation (Milos 2026-07-16 decision). No prior BUG-code; new dev ticket draft.
- **TestRail cases:**
  - SF-RCV-05 — [C29373](https://shopview.testrail.io/index.php?/cases/view/29373)
  - SF-RCV-07 — [C29375](https://shopview.testrail.io/index.php?/cases/view/29375)
- **Refs:** SV-7301 / Story 12 (Accept Delivery). Milos 2026-07-16: Vendor Missing group should sit at BOTTOM on the WO Receive (Purchase Order Details, grouped-by-vendor) surface but at TOP on the Bulk Receive (Receive Vendor Parts) page. Live-observed 2026-07-16: Vendor Missing renders at TOP on the WO Receive screen (wrong); TOP on Bulk Receive (correct). Evidence viu-round3-2026-07-16/ORDER-RECV-S15878-full.png, ORDER-RECV-S15878-Aeboro-miss.png (WO Receive) vs BULK-groups-full.png (Bulk Receive); observations.json.
- **Current status:** DROPPED — WON'T FILE (cosmetic only, no functional impact; user decision 2026-07-20). The Vendor Missing group still appears and functions; only its position differs (TOP vs Milos's ruled BOTTOM on the Accept-Delivery / Purchase Order Details screen) — purely visual, no functional/data/workflow impact, so not filed as a bug. SF-RCV-05 + SF-RCV-07 KEEP Deviation status (the build genuinely deviates from the ruling) but are annotated ACCEPTED COSMETIC / won't-file, not an open actionable bug. Bulk Receive surface is correct — no change there.

**Notes:** Source of truth = `jira-bug-drafts.md` (4 active tickets
TICKET 2–5, post-Milos-Round-2, updated 2026-07-10) plus bug 5, a Round-3
deviation (Milos 2026-07-16 decision; live-observed 2026-07-16). TestRail IDs
sourced from `testrail-id-map.csv` (standing rule 8). These are DEFECTS for the
dev team (Jira TICKET 2–5 + the Round-3 deviation under epic SV-7301, Product
Area Work Orders) — NOT filed yet (no Atlassian MCP here; file from the chat
app). Kept OUT of any
PO-facing deliverable (standing rule 7). DROPPED / WON'T FILE: bug 5
(vendor-missing-group position — cosmetic only, no functional impact; user
decision 2026-07-20; SF-RCV-05/07 stay Deviation, annotated accepted-cosmetic)
and the earlier BUG-5/TICKET 1 (reviewer != completer descoped v1, Milos
2026-07-10). CLOSED / not filed:
BUG-3 (review-note descoped, Milos R2 Q1), BUG-9/GAP-A (vendorless
category-req/sell-optional intended, Milos R2 Q4), BUG-1/2/4/10.
