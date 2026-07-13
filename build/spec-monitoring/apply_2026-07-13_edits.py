#!/usr/bin/env python3
"""Apply the 2026-07-13 spec-change edits to the case JSONs (both projects).
Idempotent-ish: sets fields to the target values by case id. Run once.
"""
import json, glob, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def edit_project(proj, edits, appends):
    files = glob.glob(os.path.join(ROOT, "build", proj, "cases", "*.json"))
    touched = {}
    for path in files:
        data = json.load(open(path))
        changed = False
        for c in data:
            if c["id"] in edits:
                c.update(edits[c["id"]])
                touched[c["id"]] = path
                changed = True
        if changed:
            json.dump(data, open(path, "w"), ensure_ascii=False, indent=1)
    # appends -> add to the named file
    for path_rel, cases in appends.items():
        path = os.path.join(ROOT, "build", proj, "cases", path_rel)
        data = json.load(open(path))
        existing = {c["id"] for c in data}
        for nc in cases:
            if nc["id"] not in existing:
                data.append(nc)
                touched[nc["id"]] = path + " (APPENDED)"
        json.dump(data, open(path, "w"), ensure_ascii=False, indent=1)
    return touched

# ---------------- FEES ----------------
fees_edits = {
 "FD-PERM-009": {
   "story_ref": "S13-R10",
   "permissions_required": "Work Orders: Create and Edit (WO history log) / Work Order Lines: Create and Edit (line history) — the gate under test",
   "preconditions": [
     "1. A work order already has fee/discount history (add/edit/remove entries).",
     "2. Two ZZAUTOTEST roles: Role A WITH Work Orders: Create and Edit (and, for line history, Work Order Lines: Create and Edit); Role B WITHOUT those. Assign by exact-user-match to Tech.",
   ],
   "steps": [
     "1. With Role A: open the WO history log and locate the fee/discount entries; also open an individual labor-line / part-line history.",
     "2. Confirm entries remain visible even when the F&D UI is hidden (feature flag off, or See Financial Data off).",
     "3. With Role B (lacking Work Orders: Create and Edit / Work Order Lines: Create and Edit): open the WO history log and a line history.",
     "4. Restore Tech to Time Clock after.",
   ],
   "expected": [
     "1. With Work Orders: Create and Edit: the WO history log and its fee/discount entries are visible. Viewing an individual labor-line or part-line history requires Work Order Lines: Create and Edit.",
     "2. Entries stay visible even when the F&D UI is hidden by the feature flag or by See Financial Data (S10-R1).",
     "3. The log shows the SET rate (e.g. \"10.00%\" or \"$5.00\"), not a resolved total, so See Financial Data does NOT gate it (S10-R6c).",
     "4. Without Work Orders: Create and Edit the WO history log (including fee/discount entries) is not accessible; without Work Order Lines: Create and Edit the labor-line/part-line history is not accessible.",
   ],
 },
 "FD-HIST-006": {
   "story_ref": "S13-R10",
   "permissions_required": "Test with a role that lacks Work Orders: Create and Edit / Work Order Lines: Create and Edit",
   "preconditions": [
     "1. A WO has fee/discount history.",
     "2. A ZZAUTOTEST role is assigned to Tech WITHOUT Work Orders: Create and Edit and WITHOUT Work Order Lines: Create and Edit (exact-user-match).",
   ],
   "steps": [
     "1. Log in as Tech and attempt to view the WO history log and an individual labor-line / part-line history.",
     "2. Restore Tech to Time Clock afterward.",
   ],
   "expected": [
     "1. Without Work Orders: Create and Edit, the WO history log (including fee/discount entries) is not accessible; viewing an individual labor-line or part-line history requires Work Order Lines: Create and Edit.",
   ],
 },
 "FD-PERM-004": {
   "expected": [
     "1. With Part Sales: Create and Edit ON: part-sale add/edit/remove is allowed.",
     "2. With it OFF: the part-sale F&D controls are not shown and the action is rejected (S13-N2).",
     "3. Part-sale adjustments — on the whole sale or on a part line — require Part Sales: Create and Edit plus See Financial Data, and do not use any Work Order permission (S13-R5).",
   ],
 },
}
fees_appends = {
 "group-A-wo-parts.json": [
  {
   "id": "FD-TAXN-001",
   "area": "Taxable jurisdiction note (§5-R15)",
   "story_ref": "S5-R15 / S2-R26a",
   "title": "Verify the taxable jurisdiction note shows below the Taxable control in the Add / Edit fee-or-discount dialog",
   "priority": "Medium",
   "type": "Functional",
   "permissions_required": "Work Orders: Create and Edit + See Financial Data + Fees & Discounts feature on",
   "preconditions": [
     "1. You are logged in with Work Orders: Create and Edit and See Financial Data; the Fees & Discounts feature is on.",
     "2. An open work order is available and you open the Add / Edit fee-or-discount dialog (any scope).",
   ],
   "steps": [
     "1. Open the Add / Edit fee-or-discount dialog and locate the Taxable Yes/No control (S2-R26).",
     "2. Read the text shown directly below the Taxable control.",
   ],
   "expected": [
     "1. Directly below the Taxable control this exact text shows: \"Tax treatment varies by jurisdiction — confirm your local requirements before saving.\" (S2-R26a)",
     "2. It renders as a plain advisory — not a UI instruction and not a legal-compliance statement — and does not block saving.",
   ],
  },
  {
   "id": "FD-TAXN-002",
   "area": "Taxable jurisdiction note (§5-R15)",
   "story_ref": "S5-R15 / S8-R13",
   "title": "Verify the taxable jurisdiction note shows below the Taxable setting in the Processing Fee dialog",
   "priority": "Medium",
   "type": "Functional",
   "permissions_required": "Access to configure a Processing Fee + Fees & Discounts feature on",
   "preconditions": [
     "1. You are logged in with access to configure a Processing Fee; the Fees & Discounts feature is on.",
     "2. You open the Processing Fee dialog (the S8-R11 Taxable setting is present).",
   ],
   "steps": [
     "1. Open the Processing Fee dialog and locate the Taxable Yes/No setting (S8-R11).",
     "2. Read the text shown directly below the Taxable setting.",
   ],
   "expected": [
     "1. Directly below the Taxable setting this exact text shows: \"Tax treatment varies by jurisdiction — confirm your local requirements before saving.\" (S8-R13)",
     "2. It is a plain advisory; the former legal-disclosure context note is no longer shown.",
   ],
  },
 ],
}

# ---------------- SIMPLE FLOW ----------------
COMP_AREA = "Completion — Simple (Stories 3/4)"
sf_edits = {
 "SF-SET-03": {
   "story_ref": "Story 1 / §4 (Create-POs setting retired — POs always on)",
   "title": "Verify there is no 'Create Purchase Orders' toggle and the Vendor Invoice sub-setting always shows (POs always on)",
   "preconditions": ["1. Signed in as Admin.", "2. On /administration/settings → Work Orders tab."],
   "steps": [
     "1. Look for a 'Create purchase orders' toggle in the Work Orders settings.",
     "2. Locate the Vendor Invoice (Optional/Required) setting.",
   ],
   "expected": [
     "1. There is no 'Create purchase orders' toggle — purchase orders are always created for vendor parts (the Create-POs setting and the No-PO/Skip flow were retired).",
     "2. The Vendor Invoice (Optional/Required) sub-setting always shows with its helper text.",
   ],
 },
 "SF-SET-08": {
   "steps": [
     "1. Open /administration/settings → Work Orders tab for the new org.",
     "2. Read the default state of Auto-approve Lines and Vendor Invoice.",
   ],
   "expected": [
     "1. Auto-approve Lines = OFF (spec default — authoritative).",
     "2. There is no Create Purchase Orders setting — purchase orders are always on.",
     "3. Vendor Invoice = REQUIRED.",
   ],
 },
 "SF-WOP-03": {
   "preconditions": [
     "1. Signed in as Admin.",
     "2. A WO with nothing to receive is in the list with the column enabled.",
   ],
   "expected": ["1. The cell shows '—' with no clickable link."],
 },
 "SF-QB-02": {
   "area": "QuickBooks / Inventory Integrity",
   "story_ref": "§4/§5 (POs always on — no Create-POs-OFF bypass)",
   "title": "Verify there is no Create-POs-OFF bypass — a vendor part always generates a PO and QuickBooks sync on completion",
   "preconditions": [
     "1. Signed in as Admin.",
     "2. A work order with a vendor/found part exists.",
     "3. There is no Create Purchase Orders setting to turn off — POs are always on.",
   ],
   "steps": [
     "1. Complete the work order that has a vendor/found part (receiving as required).",
     "2. Check that a PO was created for the vendor part.",
     "3. Check the vendor bill / AP sync and the catalog/inventory sync.",
   ],
   "expected": [
     "1. A PO is created for the vendor part — no setting suppresses PO creation.",
     "2. The vendor bill / AP sync occurs per the normal pipeline once received.",
     "3. Catalog/inventory sync happens per the normal receive pipeline.",
   ],
 },
 "SF-COMP-06": {
   "area": COMP_AREA,
   "story_ref": "Story 3/4 (POs always on — former Create-POs-OFF flow retired)",
   "title": "Verify a work order with a vendor part creates a PO on completion and routes through the receive step (POs always on)",
   "preconditions": [
     "1. Signed in as Admin.",
     "2. An open work order with an approved vendor-part line exists.",
     "3. POs are always on — there is no Create-POs setting to turn off.",
   ],
   "steps": [
     "1. Start completion of the work order.",
     "2. Observe whether a PO / background order is created for the vendor part and whether receiving is required.",
     "3. Complete after receiving and check the vendor bill / AP sync.",
   ],
   "expected": [
     "1. A PO (background order) is created for the vendor part; Complete Work Order stays disabled until the part is received (S4-R1/R4).",
     "2. After receiving, completion proceeds and the vendor bill / AP sync occur per the normal pipeline.",
     "3. There is no skip/no-PO path — the former Create-POs-OFF flow was retired.",
   ],
 },
 "SF-VAL-02": {
   "story_ref": "S4-R3 (VIN removed from completion; captured at Mark Reviewed)",
   "title": "Verify VIN is NOT required at completion in the non-review flow (only mileage and engine hours, when missing)",
   "preconditions": [
     "1. Signed in as Admin.",
     "2. Require Review is OFF.",
     "3. A work order is missing VIN but has mileage and engine hours present.",
   ],
   "steps": [
     "1. Start completion and reach the Details step.",
     "2. Note which vehicle fields are required, then complete with VIN still empty.",
   ],
   "expected": [
     "1. The completion Details step collects only mileage and engine hours (when missing) — VIN is NOT a required completion field (S4-R3).",
     "2. Completion is NOT blocked by a missing VIN; the work order completes.",
     "3. VIN is captured later only if Require Review is on, in the Mark Reviewed dialog (Story 16).",
   ],
 },
 "SF-COMP-21": {
   "steps": [
     "1. Open the work order with one line in Needs Approval and all other gates satisfied.",
     "2. Look at the Complete Work Order button and hover it for any tooltip.",
     "3. Approve the remaining line and re-check the button.",
   ],
   "expected": [
     "1. The Complete Work Order button is disabled while any line is unapproved.",
     "2. A tooltip on the disabled button describes the reason (which line needs approval).",
     "3. The button enables and completion proceeds once all lines are approved (S4-R8).",
   ],
 },
 "SF-COMP-22": {
   "steps": [
     "1. Confirm one line is unapproved (manually un-approved after being added, Auto-approve ON).",
     "2. Look at the Complete Work Order button (disabled) and its tooltip.",
     "3. Re-approve the line and retry.",
   ],
   "expected": [
     "1. With the line unapproved, the Complete Work Order button is disabled with a tooltip describing the reason.",
     "2. After re-approving all lines, the button enables and completion proceeds (holds regardless of Auto-approve).",
   ],
 },
 "SF-VAL-11": {
   "steps": [
     "1. Open a work order with one unapproved line and all other gates satisfied.",
     "2. Look at the Complete Work Order button and its tooltip.",
   ],
   "expected": [
     "1. The Complete Work Order button is disabled with a tooltip describing which line needs approval.",
     "2. Completion does not proceed until the line is approved; the button enables once all lines are approved.",
   ],
 },
 "SF-RCV-06": {
   "story_ref": "S12-R2 / S13-R6 / S13-R7",
   "steps": [
     "1. Attempt to receive without a vendor set.",
     "2. Attempt to receive without a part number.",
     "3. Attempt to receive with the cost / sell price missing.",
     "4. Attempt to receive without a vendor invoice number.",
   ],
   "expected": [
     "1. Receiving is gated until a vendor is set.",
     "2. Receiving is gated until the missing part number is entered (S13-R6).",
     "3. Receiving is gated until a missing cost / sell price is entered (S13-R7).",
     "4. Receiving is gated until a vendor invoice number is captured.",
     "5. On Accept Delivery, cost is editable when $0 or missing (parity with Bulk Receive); the sell-price lock rule is unchanged.",
   ],
 },
}
# Re-home SF-COMP-01..05,07,08,09,10 off the retired Story 2 (behaviour unchanged).
_rehome = {
 "SF-COMP-01": "Story 3/4 (streamlined completion — Complete button placement)",
 "SF-COMP-02": "Story 3/4 (streamlined completion — no-parts WO one-confirm)",
 "SF-COMP-03": "Story 3/4 (streamlined completion — Success screen) / S15-R3",
 "SF-COMP-04": "Story 3/4 (streamlined completion — Go to Invoice) / S15-R3",
 "SF-COMP-05": "Story 3/4 (streamlined completion — missing required fields blocked)",
 "SF-COMP-07": "Story 3/4 (streamlined completion — inventory movement) / §5 invariant 1",
 "SF-COMP-08": "Story 3/4 (streamlined completion — auto-pick off ⇒ pick in modal)",
 "SF-COMP-09": "Story 3/4 (streamlined completion — re-open returns to Approved)",
 "SF-COMP-10": "Story 3/4 (streamlined completion — individual-line Complete + per-part receive)",
}
for cid, sref in _rehome.items():
    sf_edits[cid] = {"area": COMP_AREA, "story_ref": sref}

t1 = edit_project("fees-discounts", fees_edits, fees_appends)
t2 = edit_project("simple-flow", sf_edits, {})
print("FEES edited/added:", len(t1))
for k in sorted(t1): print("   ", k, "->", os.path.basename(t1[k]))
print("SIMPLE edited:", len(t2))
for k in sorted(t2): print("   ", k)
