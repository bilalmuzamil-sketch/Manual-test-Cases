# Simple Mode - Three Quick Questions on the Newest Write-Up

Hi Milos - thank you for the newest write-up. While folding it into our testing we ran into three small points where the text either disagrees with itself or leaves us unsure exactly what to check. These are not guesses: for each one we put the written spec and the app's real behaviour side by side. Please just pick one option per row (or add a note). Thank you!

---

## 1.

**The situation**
When a delivery of parts is received, each line shows the cost of the item. The write-up sets rules for when that cost can still be changed on the receiving screen.

**What the written spec currently says**
The write-up says the cost of an item can only be changed when it is 0.00. But an older sentence in the same section still says that after a purchase order is locked "only the cost stays changeable". These two can't both be true.

**What the app actually does today**
When we last checked the receiving screen (before this newest write-up arrived), the cost field could still be edited even when it was not 0.00. We have not yet re-checked it against the new rule - we need to know which sentence wins first.

**Why it needs your decision**
We have to check the build against one rule or the other. If the new "only when it is 0.00" rule wins, the older sentence is leftover text; if the older sentence wins, the new rule can't be right as written. Only you can settle which one the app should follow.

**The options**
- A) The cost can only be changed while it is 0.00 - the older sentence is leftover text and will be cleaned up.
- B) The cost stays changeable after the purchase order locks - please explain how the two sentences fit together.

**Your decision:** ______________________________________________

---

## 2.

**The situation**
Sometimes a part is bought before a supplier has been assigned to it. Your update explains what happens to that spending in the books while the supplier is still missing.

**What the written spec currently says**
Your update says purchases from parts with no supplier assigned are left out of the QuickBooks supplier-bill export AND out of the "Vendors Expenses" report until a supplier is set. We want to make sure we check the right report.

**What the app actually does today**
We can create such a no-supplier purchase in the app and we are ready to look for the missing spending - we just want to confirm the exact report name and place before we check it.

**Why it needs your decision**
If we look at the wrong report we could wrongly pass or fail this check. A one-word confirmation of the report name makes sure our test looks in the right place.

**The options**
- A) Yes - "Vendors Expenses" is the exact report where the missing spending should be visible.
- B) It's a different place - please name the report or screen we should check.

**Your decision:** ______________________________________________

---

## 3.

**The situation**
On the receiving screen a part can be given its proper part number on the spot. An earlier version of the write-up said that doing this also creates a brand-new part type in the catalogue.

**What the written spec currently says**
An earlier update removed the rule about creating a brand-new part type from the receive screen, but two other places in the write-up still describe it. So one part of the text says the feature is out, while other parts still describe it as in.

**What the app actually does today**
Today the app saves the typed part number and the part can be received normally. We stopped checking for a brand-new catalogue part type when the rule was removed.

**Why it needs your decision**
We need to know whether the leftover text is just clean-up that hasn't happened yet, or whether the feature is actually still meant to be in - that changes what we test.

**The options**
- A) The feature is out - the leftover text will be cleaned up.
- B) It is still in - please clarify what should happen when a part number is entered on the receiving screen.

**Your decision:** ______________________________________________

---

Thank you! Just pick one option per row, or add a note. These three are the only points in the newest write-up where the text either disagrees with itself or leaves us unsure what to check - everything else we were able to confirm ourselves.

---
---

## Internal - QA lead only (NOT for the PO)

**Do not share this section (or any IDs / codes / clause numbers / links) with the PO.**

### Kept questions - evidence & mapping

#### Q1 - S8-R7 leftover sentence — $0-only cost rule vs "only cost stays editable after lock"

- **TestRail cases:**
  - SF-BULK-06 - [C29355](https://shopview.testrail.io/index.php?/cases/view/29355)
- **Exact spec clause:** SPEC SELF-CONTRADICTION introduced by spec `_4` (V2.6) Δ14 (spec-v4-2026-07-17/spec-diff-v4-2026-07-17.md §A Δ14 + §D5 flag 2): the NEW S8-R7 = "Cost is editable (if the cost is 0, if cost is not 0 cost filed should not be editable)" while the SURVIVING old tail of the same S8-R7 paragraph still reads "After it locks, only cost remains editable." Both sentences are in the `_4` upload today. S10-R3/S12-R5 align with the new $0-only rule.
- **Build evidence:** OBSERVED build behavior (old build, 2026-07-13 labels): Bulk Receive allowed editing qty AND a non-zero cost (SF-BULK-06 was VIU-Verified against that old rule). The $0-only rule has NOT been observed yet — SF-BULK-06 was reworded to Δ14 on 2026-07-17 and flipped to VIU-Pending (re-VIU needed; if the build still allows editing a non-zero cost it becomes a deviation until dev ships). Case notes in group-B-receiving-vendor.json (SF-BULK-06).
- **Run-325 (Ayesha):** SF-BULK-06 C29355: in run 325 (Ayesha Khan) — see run325-status-map-2026-07-14.md (snapshot predates the 2026-07-17 Δ14 reword).
- **Resolves to:** A ($0-only wins) -> SF-BULK-06 stays as reworded (Δ14 $0-only cost + partial-receive qty note); the S8-R7 tail is confirmed leftover text; re-VIU against the $0-only rule (non-zero-cost editable => dev deviation). B (cost stays editable after lock) -> reword SF-BULK-06 expected back to cost-editable-after-lock per Milos's explanation and reconcile S8-R7 with S10-R3/S12-R5 (likely a fresh spec correction needed); re-VIU accordingly.

#### Q2 - Vendors-Expenses exclusion surface confirm (Δ12 / S6-R6 rewrite)

- **TestRail cases:**
  - SF-VMIS-06 - [C29343](https://shopview.testrail.io/index.php?/cases/view/29343)
- **Exact spec clause:** Spec `_4` (V2.6) Δ12 (spec-v4-2026-07-17/spec-diff-v4-2026-07-17.md §A Δ12): S6-R6 REWRITTEN to match code — no dedicated PO report / no 'needs vendor' marker; a vendor-missing PO's spend "does not appear in the QuickBooks Vendor Bill export (inner-join on vendor) and is not counted in the Vendors Expenses report" until a vendor is assigned (change-log 2026-07-16, "verified in VendorBillExportQueryHandler / VendorsExpensesQueryHandler"). Question = confirm the REPORT SURFACE name ("Vendors Expenses") before the in-app re-VIU, so the exclusion is checked on the right report.
- **Build evidence:** OBSERVED build behavior: the old 2026-07-14 finding — the Reports area has NO 'needs vendor' report — is now the spec itself (Deviation RESOLVED by rescope). The report leg is seedable (costed vendor-missing PO per Rule 14); the QB Vendor Bill export leg stays Blocked-Env (needs a QuickBooks-connected company + a human in QB). Case notes in group-B-receiving-vendor.json (SF-VMIS-06).
- **Run-325 (Ayesha):** SF-VMIS-06 C29343: in run 325 (Ayesha Khan) — see run325-status-map-2026-07-14.md (snapshot predates the 2026-07-17 Δ12 rescope).
- **Resolves to:** A (Vendors Expenses confirmed) -> re-VIU the report leg on that report (seed a costed vendor-missing PO, observe the exclusion, then assign a vendor and observe inclusion); QB leg stays Blocked-Env. B (different surface) -> reword SF-VMIS-06 expected to the named surface and re-VIU there; flag the S6-R6 report name for a spec correction.

#### Q3 - Story-10 Δ7 residue — struck S10-R2 vs surviving AC bullets + technical guardrails

- **TestRail cases:**
  - SF-PNFIX-02 - [C29364](https://shopview.testrail.io/index.php?/cases/view/29364)
  - SF-PNFIX-03 - [C29365](https://shopview.testrail.io/index.php?/cases/view/29365)
  - SF-PNFIX-06 - [C29368](https://shopview.testrail.io/index.php?/cases/view/29368)
  - SF-QB-08 - [C29433](https://shopview.testrail.io/index.php?/cases/view/29433)
- **Exact spec clause:** PRE-EXISTING DOC SELF-CONTRADICTION (spec `_3` Δ7, still verbatim in `_4` — spec-v4-2026-07-17/spec-diff-v4-2026-07-17.md §D5 flag 3 + L58-59, L315, L416): S10-R2 ("When a part number is added, the part becomes a first-class part") is STRUCK THROUGH, but the surviving Story-10 AC bullets + technical guardrails + the §10 permission-matrix row still describe first-class-part creation. Last-update-wins applied the strike (QA-lead ruling 2026-07-14), but the leftover text has never been confirmed as clean-up by the PO.
- **Build evidence:** OBSERVED build behavior (VIU 2026-07-14, seeded vendor-missing PO S-15849): entering a NEW part number persists and the part becomes receivable (receive-requested-parts 200); the downstream first-class inventory/catalog/Part-History creation was DROPPED from the expected results per the Δ7 rescope (SF-PNFIX-02/03/06 + SF-QB-08 rescoped -> Verified on the remaining assertions). Case notes in group-B-receiving-vendor.json / group-C (SF-QB-08).
- **Run-325 (Ayesha):** SF-PNFIX-02 C29364 / SF-PNFIX-03 C29365 / SF-PNFIX-06 C29368 / SF-QB-08 C29433: in run 325 (Ayesha Khan) — see run325-status-map-2026-07-14.md (snapshot predates the rescope).
- **Resolves to:** A (feature out, leftover text) -> no case changes (the Δ7 rescope already matches); note the pending spec clean-up of the Story-10 AC bullets + guardrails + §10 matrix row. B (feature still in) -> REVERSE the Δ7 rescope: restore the first-class-part assertions to SF-PNFIX-02/03/06 + SF-QB-08, flip them off Verified pending re-VIU, and get the S10-R2 strike corrected in the spec.

### Not sent + why

Not re-asked / not sent: D5 flag 1 (vendor-missing group "bottom" vs "leads") — already answered by Milos Round-3 Q1 (split ruling: Bulk Receive top / Receive bottom; the residual Receive-screen placement is dev deviation TICKET work, not a re-ask). D5 flag 4 (design files still showing the old resolve-after-receive core flow vs Story 18's resolve-first) — a design-revision/dev item, not a PO product decision (rule 7). The 5 unanswered earlier Milos questions remain on their existing sheets (PO-Questions-Round3 / PO-Decisions 2026-07-14) — not duplicated here.

**Notes:** These are the 2 NEW Milos flags raised by the spec `_4` (V2.6) apply (D5 flag 2 + the Δ12 surface confirm) plus the 1 PRE-EXISTING unconfirmed residue (D5 flag 3). TestRail IDs from `testrail-id-map.csv` (rule 8); bugs stay off the PO sheet (rule 7). Spec citations: `spec-v4-2026-07-17/spec-diff-v4-2026-07-17.md` (§A Δ12/Δ14, §D5); `requirements.md` (V2.6). SF-CORE-05/06/09 were retired (user ruling 2026-07-17, executed 2026-07-20) and are not referenced here.
