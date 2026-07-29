#!/usr/bin/env python3
"""Chris Ward group-message delta pass, 2026-07-29 — LOCAL ONLY (NO TestRail writes).

Source of truth: chris-message-2026-07-29.md (verbatim; NEWEST source, last-update-wins —
newer than the kickoff video AND the current six specs). Every touched case's verbatim
PRE-EDIT body is backed up to backup/<internal-id>.json before editing; MANIFEST.md lists them.

Deltas applied:
  D1 SBC asset identifier -> VIN (falls back Unit #, then plate); supersedes the video's
     serial ruling FOR SBC ONLY (WIP stays on serial; ambiguity flagged, question queued).
  D2 SBC exports Summary/Expanded, four exact menu items (both PDF and CSV).
  D3 "Locations:" line in every CSV + PDF export + on-screen scope indicator, ALL 6 reports.
  D4 PV "Catalogue" -> exact label "Special Order" (Type filter, Type column, export).
  D5 TU column selector ADDED (new case TU-COL-01; reverses the video-era no-selector state).
  D6 Same logo treatment all reports — only PV lacked coverage; PV-EXP-05 extended.
"""
import json, os, sys
from datetime import date

RS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BK = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backup")
os.makedirs(BK, exist_ok=True)

MSG = "Chris Ward group message 2026-07-29 (chris-update-2026-07-29/chris-message-2026-07-29.md; NEWEST source, last-update-wins)"

FILES = {}
def load(fname):
    p = os.path.join(RS, "cases", fname)
    if p not in FILES:
        FILES[p] = json.load(open(p))
    return FILES[p]

def find(fname, iid):
    for c in load(fname):
        if c["id"] == iid:
            return c
    raise KeyError(iid)

manifest = []
def backup(c, fname, what):
    with open(os.path.join(BK, f"{c['id']}.json"), "w") as fh:
        json.dump(c, fh, indent=1, ensure_ascii=False); fh.write("\n")
    manifest.append((c["id"], fname, what))

def nextnum(lst):
    return len(lst) + 1

LOC_LINE_NOTE = ("LOCATIONS-LINE + SCOPE-INDICATOR (all 6 reports) per " + MSG + ": every CSV and PDF "
    "export carries a \"Locations:\" line naming the scoped location(s), and each report shows its "
    "location scope on screen; permission scoping unchanged. Spec anchor pending Chris's updated "
    "spec changelog (expected ~2026-07-30) — exact placement is confirmed in the build at VIU.")

SCOPE_LINE = ("The page itself shows which location(s) the report is currently scoped to (the new "
    "on-screen scope indicator - exactly where and how it appears is confirmed in the build).")

# ---------------------------------------------------------------- D1: SBC VIN chain
c = find("cases-sbc-B-tree-links-sorting.json", "SBC-LBL-01")
backup(c, "cases-sbc-B-tree-links-sorting.json", "D1 VIN-first identifier (re-ruled from serial)")
c["title"] = "Asset identified by VIN, falling back to Unit #, then plate"
c["preconditions"] = [
 "1. One customer has ZZAUTOTEST assets with invoices in range: (a) one with a VIN recorded, "
 "(b) one with no VIN but a Unit # recorded, (c) one with no VIN or Unit # but a plate recorded, "
 "(d) one with no VIN, Unit #, or plate (blank the fields as far as the asset form allows)."
]
c["steps"] = ["1. Expand the customer and read each asset row's label."]
c["expected"] = [
 "1. Asset (a) is identified by its VIN.",
 "2. Asset (b) (no VIN) is identified by its Unit # instead.",
 "3. Asset (c) (no VIN or Unit #) is identified by its plate instead.",
 "4. For asset (d) (no VIN, Unit #, or plate), note what the label shows - what stands in when all "
 "three are missing is confirmed in the build (the older rule showed \"Unknown Asset\").",
 "5. Note whether the year/make/model text still appears anywhere in the row - the update says the "
 "VIN identifier REPLACES the year/make/model label; confirm the exact rendering in the build.",
]
c["spec_ref"] = ("SV-8606 (specs/sbc-sales-by-customer.md Story 8 S8-R7; S8-R8; S8-R9; S8-R10 - "
 "identifier RE-RULED to VIN, falling back to Unit #, then plate, by " + MSG + ", superseding the "
 "kickoff video's serial-number ruling P24 AND the spec's year/make/model + unit/plate/VIN-suffix rule)")
c["notes"] = ("RE-RULED 2026-07-29 per " + MSG + ": 'Assets are now identified by VIN (falls back to "
 "Unit #, then plate) instead of the year/make/model label.' This supersedes (for SBC only) the "
 "kickoff-video P24 serial-number ruling applied 2026-07-28 (that pre-edit body is in "
 "chris-update-2026-07-29/backup/; the pre-video body is in video-promotion-backup-2026-07-28/). "
 "The all-three-missing fallback and whether year/make/model disappears entirely are unpinned - "
 "confirm from Chris's updated spec changelog + the build at VIU, do not invent (Rule 9). WIP's asset "
 "identifier stays on the video's serial ruling - the message scopes VIN to SBC only (ambiguity "
 "flagged in SPEC-WATCH; question queued for Chris). MERGED 2026-07-28 (user-authorized "
 "consolidation, MERGE-PLAN G-SBC-LBL): absorbed SBC-LBL-02, SBC-LBL-03 (retired locally, deleted "
 "from TestRail).")

c = find("cases-sbc-B-tree-links-sorting.json", "SBC-LBL-04")
backup(c, "cases-sbc-B-tree-links-sorting.json", "D1 notes-only: duplicate-label context serial->VIN")
c["notes"] = ("Context updated 2026-07-29 per " + MSG + ": the asset identifier is now the VIN "
 "(falls back Unit #, then plate) - VINs are unique, so duplicate labels should be rarer, but the "
 "(#1)/(#2) rule (S8-R11) itself is not overridden; seed the duplicate-label state (e.g. two assets "
 "that fall back to the same plate) and re-confirm in the build. Title shortened earlier (2026-07-28).")

# ---------------------------------------------------------------- D2: SBC Summary/Expanded exports
MENU4 = ("\"Download Summary (PDF)\", \"Download Expanded View (PDF)\", "
         "\"Download Summary (CSV)\", \"Download Expanded View (CSV)\"")

c = find("cases-sbc-C-calcs-columns-exports-persistence.json", "SBC-EXP-01")
backup(c, "cases-sbc-C-calcs-columns-exports-persistence.json", "D2 four exact menu items")
c["title"] = "The overflow menu holds exactly the four download items - no Print"
c["expected"] = [
 "1. The overflow (export) menu is the leftmost control in the toolbar's action area and is the "
 "application's standard overflow-menu control.",
 "2. The menu items read, in order: " + MENU4 + " - and there is NO \"Print\" item anywhere in the menu.",
 "3. There are no separate always-visible export buttons - all exports live behind this one menu.",
]
c["spec_ref"] = ("SV-8612; SV-8613 (specs/sbc-sales-by-customer.md S14-R1; S14-R2; S15-R1; S15-R2; "
 "S20-R16 - menu RESHAPED to the four Summary/Expanded items by " + MSG + " [ratifies + extends video "
 "P21]; 'Print' REMOVED per video P25 31:14, CONFIRMED by the same message)")
c["notes"] = ("MENU RESHAPED 2026-07-29 per " + MSG + ": 'Menu items: Download Summary (PDF), Download "
 "Expanded View (PDF), Download Summary (CSV), Download Expanded View (CSV)' + 'The Print option is "
 "removed.' The four labels are now SPEC-STATED by the message (VIU-confirm hedge removed) - still to "
 "be sighted live at VIU per Rule 12. Menu ORDER as listed in the message; confirm in the build.")

c = find("cases-sbc-C-calcs-columns-exports-persistence.json", "SBC-EXP-16")
backup(c, "cases-sbc-C-calcs-columns-exports-persistence.json", "D2 Summary/Expanded both formats, exact labels")
c["title"] = "Summary and Expanded View downloads exist for both PDF and CSV"
c["steps"] = [
 "1. Open the download (overflow) menu and read the four items.",
 "2. Download the Summary version in both formats (Download Summary (PDF) and Download Summary (CSV)) and open the files.",
 "3. Download the Expanded View version in both formats and compare against the Summary files.",
]
c["expected"] = [
 "1. The menu offers exactly four items: " + MENU4 + ".",
 "2. Each Summary file gives ONE row per customer, without the asset or invoice detail rows.",
 "3. Each Expanded View file contains the full Customer, then Asset, then Invoice breakdown.",
 "4. All four files reflect exactly the filtered data shown on screen.",
]
c["spec_ref"] = ("SV-8612; SV-8613 (specs/sbc-sales-by-customer.md Stories 14/15 - Summary/Expanded "
 "split for both PDF and CSV per " + MSG + " ['matching Sales By Rep'], ratifying + extending kickoff "
 "video P21 32:10-33:03 + 48:39; overrides the old single-flat-export S14-R6; S14-R10; S15-R16)")
c["notes"] = ("RATIFIED + EXTENDED 2026-07-29 per " + MSG + ": 'Exports now come in Summary and "
 "Expanded versions, for both PDF and CSV (matching Sales By Rep). Summary = one row per customer; "
 "Expanded = the full Customer -> Asset -> Invoice breakdown.' Menu labels now spec-stated "
 "(VIU-confirm hedge removed) - still to be sighted live at VIU per Rule 12. Exact Summary column set "
 "pending the updated spec changelog. Added to TestRail 2026-07-28 as C38856; this reshape is LOCAL, "
 "awaiting push authorization.")

c = find("cases-sbc-C-calcs-columns-exports-persistence.json", "SBC-EXP-03")
backup(c, "cases-sbc-C-calcs-columns-exports-persistence.json", "D2 scoped to Expanded CSV + D3 Locations line")
c["title"] = "Expanded View CSV: column order, blank-cell rules, and the Locations line"
c["expected"] = [
 "1. The Expanded View CSV has the twelve columns in this exact order: Customer, Invoice #, Date, "
 "Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, "
 "Margin %, Subtotal.",
 "2. On customer rows the Invoice # and Date cells are blank.",
 "3. On invoice rows the Customer cell is blank and the Invoice # and Date cells are filled.",
 "4. Customer names are plain - the \"(N)\" invoice count is not included.",
 "5. The rows follow the Expanded View's Customer, then Asset, then Invoice breakdown - note how the "
 "asset level appears (this level is NEW; its exact representation is confirmed from the updated spec "
 "and the build - the older spec had no asset rows in the file).",
 "6. The file carries a \"Locations:\" line naming the location(s) the report was scoped to (exact "
 "position in the file is confirmed in the build).",
]
c["spec_ref"] = ("SV-8612 (specs/sbc-sales-by-customer.md Story 14 S14-R6; S14-R7; S14-R8; S14-R9 - "
 "file now the Expanded View CSV with a Customer->Asset->Invoice breakdown + a Locations: line per "
 + MSG + "; the old S14-R10 flat/no-asset-layer rule is superseded)")
c["notes"] = ("RESHAPED 2026-07-29 per " + MSG + ": exports split Summary/Expanded and the Expanded "
 "View is 'the full Customer -> Asset -> Invoice breakdown', so the old 'no asset layer by design' "
 "known-limitation note is STALE and removed. Column order + blank-cell rules kept from the current "
 "spec until the changelog lands - reconcile then. Locations: line = all-reports change, same message.")

c = find("cases-sbc-C-calcs-columns-exports-persistence.json", "SBC-EXP-11")
backup(c, "cases-sbc-C-calcs-columns-exports-persistence.json", "D2 scoped to Expanded PDF body")
c["title"] = "Expanded View PDF body matches the CSV's columns and on-screen rules"
c["expected"] = [
 "1. The Expanded View PDF's body table has the twelve columns in the same exact order and labels as "
 "the Expanded View CSV, with the same Customer, then Asset, then Invoice breakdown (the asset level "
 "is NEW - its exact representation is confirmed from the updated spec and the build).",
 "2. Body dates show as \"Mon DD YYYY\" - for example, \"May 14 2026.\"",
 "3. The Date cell is blank on customer rows, matching the screen.",
 "4. Margin % shows an em dash when the row's Subtotal is zero or below.",
 "5. The Subtotal column is bold - header, every row, and the totals row.",
 "6. Inv. Hrs uses the same signs and coloring as on screen, with green rendered as #21ba45 and red "
 "as #c10015.",
]
c["spec_ref"] = ("SV-8613 (specs/sbc-sales-by-customer.md Story 15 S15-R16; S15-R17; S15-R18; "
 "S15-R19; S15-R20; S15-R21 - body now the Expanded View with a Customer->Asset->Invoice breakdown "
 "per " + MSG + "; the old flat/no-asset-layer shape is superseded)")
c["notes"] = ("RESHAPED 2026-07-29 per " + MSG + " (Summary/Expanded split - this case covers the "
 "Expanded View PDF; the Summary PDF's one-row-per-customer shape is covered by SBC-EXP-16). Color "
 "extends to the PDF but never the CSV (S3 Key Decision) - unchanged.")

# ---------------------------------------------------------------- D3: Locations line + scope indicator
c = find("cases-sbc-C-calcs-columns-exports-persistence.json", "SBC-EXP-09")
backup(c, "cases-sbc-C-calcs-columns-exports-persistence.json", "D3 PDF header Locations line (reverses location-not-shown)")
c["title"] = "PDF header: title, organization, date range, Product Type and Locations lines"
c["expected"] = [
 "1. The header is two columns: a text block on the left (70% width) and the organization logo on the right (30% width).",
 "2. The text block shows the report title \"Sales By Customer Report\"; the organization name; the "
 "date range; and the filter summary line \"Product Type: {value}\" where value is \"Parts & Service,\" "
 "\"Parts only,\" or \"Service only.\"",
 "3. The header date range shows start and end in the format \"Mon D, YYYY,\" joined by an em dash - "
 "for example, \"May 1, 2026 - May 31, 2026\" - and always shows both dates (every range is bounded).",
 "4. The header also carries a \"Locations:\" line naming the location(s) the report was scoped to "
 "(exact placement within the header is confirmed in the build).",
]
c["spec_ref"] = ("specs/sbc-sales-by-customer.md Story 15 S15-R7; S15-R8; S15-R9; S15-R10; S15-R11 - "
 "the old 'location is not shown in the header' rule is REVERSED by the Locations: line added to every "
 "export per " + MSG)
c["notes"] = ("REVERSED 2026-07-29 per " + MSG + ": every PDF now carries a \"Locations:\" line (the "
 "old expected #4 asserted location is NOT shown - removed). KNOWN-LIMITATION ENCODING kept: the "
 "header uses \"Mon D, YYYY\" while body Date cells use \"Mon DD YYYY\" - intentional per the S15-R9 "
 "context note; do not file it as an inconsistency. " + LOC_LINE_NOTE)

def add_export_locline(fname, iid, filedesc, what="D3 Locations line in exports"):
    c = find(fname, iid)
    backup(c, fname, what)
    n = nextnum(c["expected"])
    c["expected"].append(f"{n}. {filedesc} carries a \"Locations:\" line naming the location(s) the "
                         "report was scoped to (exact position in the file is confirmed in the build).")
    c["spec_ref"] = (c.get("spec_ref","").rstrip() + " + Locations: line in every CSV/PDF export per " + MSG)
    c["notes"] = ((c.get("notes") or "").rstrip() + (" " if c.get("notes") else "") + LOC_LINE_NOTE).strip()
    return c

add_export_locline("cases-sbr-D-exports-assignments-states-mobile-visual-worep-api.json", "SBR-EXP-02",
                   "Every file (all four downloads, PDF and CSV)")
add_export_locline("cases-pv-D-exports-visual-api.json", "PV-EXP-02", "Each file (PDF and CSV)")
add_export_locline("cases-tu-C-links-exports-location.json", "TU-EXP-04", "Every download (each PDF and the CSV)")
add_export_locline("cases-iv-D-persistence-sorting-exports.json", "IV-EXP-02", "Each download (PDF and CSV)")
add_export_locline("cases-wip-D-persistence-exports.json", "WIP-EXP-02", "Each download (PDF and CSV)")

def add_scope_indicator(fname, iid):
    c = find(fname, iid)
    backup(c, fname, "D3 on-screen location-scope indicator")
    n = nextnum(c["expected"])
    c["expected"].append(f"{n}. {SCOPE_LINE}")
    c["spec_ref"] = (c.get("spec_ref","").rstrip() + " + on-screen location-scope indicator per " + MSG)
    c["notes"] = ((c.get("notes") or "").rstrip() + (" " if c.get("notes") else "") +
        "SCOPE-INDICATOR added 2026-07-29 per " + MSG + " ('Each report now shows which location(s) "
        "it's scoped to... on screen') - distinct from the per-row location label (video P10), which "
        "stays. Spec anchor pending the updated spec changelog.").strip()
    return c

add_scope_indicator("cases-sbc-A-access-filters.json", "SBC-LOC-03")
add_scope_indicator("cases-sbr-A-access-filters.json", "SBR-LOC-03")
add_scope_indicator("cases-pv-A-access-permissions-filters.json", "PV-FILT-10")
add_scope_indicator("cases-tu-C-links-exports-location.json", "TU-LOC-02")
add_scope_indicator("cases-iv-C-asof-filters-location.json", "IV-LOC-02")
add_scope_indicator("cases-wip-C-summary-totals-filters.json", "WIP-FLT-06")

# ---------------------------------------------------------------- D4: Special Order label
c = find("cases-pv-A-access-permissions-filters.json", "PV-FILT-01")
backup(c, "cases-pv-A-access-permissions-filters.json", "D4 exact label Special Order")
c["preconditions"][2] = ("3. Both inventory parts and special-order parts (the \"Special Order\" type) "
 "have sales activity in the selected date range.")
c["expected"] = [
 "1. The Type filter is the first control in the filter row.",
 "2. It is single-select and offers exactly three choices: Both, Inventory, and Special Order "
 "(special-order catalog parts that were never put into stock).",
 "3. On a first visit the default is Both.",
 "4. Both is an explicit selection returning inventory and Special Order rows together - a deliberate "
 "filter value, not the absence of a filter.",
 "5. Each selection immediately reloads the report limited to that type (no separate Apply step) - "
 "under Inventory every row's Type column reads Inventory; under Special Order every row's Type "
 "column reads Special Order; under Both, rows of both kinds appear.",
]
c["spec_ref"] = ("SV-8642 (specs/parts-velocity.md S2-R1; S3-R5 - 'Catalogue' RENAMED to the exact "
 "label 'Special Order' [Type filter, Type column, export] per " + MSG + ", confirming kickoff video P31)")
c["notes"] = ("RENAME CONFIRMED 2026-07-29 per " + MSG + ": 'The part type \"Catalogue\" is renamed to "
 "\"Special Order\" (the Type filter, the Type column, and the export)... No data changes - "
 "splay/label only.' The label is now spec-stated (VIU-confirm hedge removed) - still to be sighted "
 "live at VIU per Rule 12. VIU-confirm the filter control's own name ('Type' is the spec's name). "
 "Seeding for the reload leg: at least one invoiced sale of an inventory part AND at least one "
 "vendor-sourced (Special Order) part request on an invoiced/paid work order in the window. MERGED "
 "2026-07-28 (user-authorized consolidation, MERGE-PLAN G-PV-TYPE): absorbed PV-FILT-02. TITLE "
 "unchanged (already label-neutral). NOTE: the same rename on the Parts Sales report's dropdown is "
 "OUT of this suite's scope (different feature) - recorded as an FYI in the change-list, no case here.")

c = find("cases-pv-A-access-permissions-filters.json", "PV-FILT-09")
backup(c, "cases-pv-A-access-permissions-filters.json", "D4 exact label Special Order")
c["preconditions"][1] = "2. Special Order rows are present under Type = Both (a Special Order part has in-window activity)."
c["steps"] = [
 "1. With Type = Both, select any bin in the Bin filter.",
 "2. Look for Special Order rows in the result.",
 "3. Set the Type filter to Special Order while the Bin filter is still active.",
]
c["expected"] = [
 "1. With any Bin filter active, ALL Special Order rows are excluded (they have no bin location).",
 "2. Special Order combined with any Bin filter yields an empty result showing the empty state - "
 "this is by design, not a defect.",
]
c["spec_ref"] = ("SV-8642 (specs/parts-velocity.md S2-R8 - 'Catalogue' RENAMED to the exact label "
 "'Special Order' per " + MSG + ", confirming kickoff video P31)")
c["notes"] = ("Expected-behavior case: the empty result here is correct per spec. RENAME CONFIRMED "
 "2026-07-29 per " + MSG + " - label now spec-stated (VIU-confirm hedge removed); still to be sighted "
 "live at VIU per Rule 12. TITLE TRIMMED 2026-07-29 (user-authorized): was 96 chars, over the "
 "no-more-than-80 concise-title rule; meaning unchanged.")

c = find("cases-pv-B-rowmodel-columns.json", "PV-ROW-05")
backup(c, "cases-pv-B-rowmodel-columns.json", "D4 exact label Special Order")
c["expected"][1] = ("2. The Type column shows each row's kind as plain text (no badge or chip "
 "styling): \"Inventory\" or \"Special Order\".")
c["spec_ref"] = ("SV-8643 (specs/parts-velocity.md S3-R4; S3-R5; S3-R8 - Type value 'Catalogue' "
 "RENAMED to the exact label 'Special Order' per " + MSG + ", confirming kickoff video P31)")
c["notes"] = ("RENAME CONFIRMED 2026-07-29 per " + MSG + ": the Type column value is 'Special Order' "
 "(label/display-only, no data change). Label now spec-stated (VIU-confirm hedge removed) - still to "
 "be sighted live at VIU per Rule 12.")

c = find("cases-pv-D-exports-visual-api.json", "PV-EXP-08")
backup(c, "cases-pv-D-exports-visual-api.json", "D4 notes-only: export value Special Order confirmed")
c["notes"] = ("Expected-behavior case (deliberate screen-vs-export difference). RENAME CONFIRMED "
 "2026-07-29 per " + MSG + ": the exported Type VALUES read 'Special Order' (rename covers 'the "
 "export' too); the centered-alignment rule is unaffected - check the exported value text at VIU. "
 "FIX-WORDING repair 2026-07-28 (sense-check): alignment assertions scoped to the PDF - a CSV "
 "carries no alignment.")

# ---------------------------------------------------------------- D5: TU column selector (NEW case)
newcase = {
 "id": "TU-COL-01",
 "area": "TU — Visual & Accessibility",
 "title": "A column selector lets the user choose which columns show",
 "priority": "Medium",
 "type": "Functional",
 "permissions_required": "The permission that grants access to the timesheet reports (same as Timesheet Activities - no new permission).",
 "preconditions": [
  "1. You are on the Technician Utilization report with rows loaded."
 ],
 "steps": [
  "1. Find the column selector control in the toolbar (on the other reports it is a separate button next to the download menu).",
  "2. Open it and read the list of column toggles.",
  "3. Turn one column off, then back on, watching the table."
 ],
 "expected": [
  "1. The report has a column selector control, styled and placed like the other reports in the suite "
  "(this control was just added - the exact placement, tooltip, and list of toggleable columns are "
  "confirmed from the updated spec and the build).",
  "2. Turning a toggle off hides that column (header and cells); turning it back on restores the "
  "column to its usual place in the order.",
  "3. The change applies immediately with no reload - that is the suite convention on the other "
  "reports; confirm it holds here."
 ],
 "design_ref": "none - SPEC-ONLY (Report Suite: no designs yet; design-reconciliation later if Figma arrives)",
 "spec_ref": ("SV-8655 (specs/technician-utilization.md Story 8 Visual Conformance and Accessibility - "
  "column selector ADDED per " + MSG + " ['Column selector added for visual/natural conformance']; no "
  "spec anchor yet - confirm from the updated spec changelog)"),
 "viu_status": "VIU-Pending",
 "notes": ("NEW 2026-07-29 per " + MSG + " - reverses the earlier no-column-selector state (kickoff "
  "video P18 had vetoed one for TU; the message adds it 'for visual/natural conformance' = Story 8, "
  "SV-8655). Modeled on the suite's existing column-selector cases (SBC-COL-01 C30156 / SBR-COL-01 "
  "C30265) but kept to ONE case - the per-column list, defaults, and persistence behaviour are "
  "unpinned until the spec changelog lands; do not invent (Rule 9). No C-ID yet (needs authorized "
  "add_case; section = TU — Visual & Accessibility, sits with Story 8)."),
 "api_related": False,
}
tu_d = load("cases-tu-D-visual-api.json")
assert not any(x["id"] == "TU-COL-01" for x in tu_d)
# insert before the first API case so the visual section stays contiguous
idx = next(i for i, x in enumerate(tu_d) if x["area"] == "TU — API")
tu_d.insert(idx, newcase)
manifest.append(("TU-COL-01", "cases-tu-D-visual-api.json", "D5 NEW case (no backup - did not exist)"))

# ---------------------------------------------------------------- D6: PV logo treatment
c = find("cases-pv-D-exports-visual-api.json", "PV-EXP-05")
backup(c, "cases-pv-D-exports-visual-api.json", "D6 same logo treatment (PV lacked coverage)")
c["expected"].append(
 "5. The shop logo shows at the top of the PDF when one is set, with the same logo treatment as the "
 "other reports in the suite (fallback behaviour when no logo is set is confirmed in the build; the "
 "CSV never includes a logo).")
c["spec_ref"] = ("specs/parts-velocity.md S6-R5; S6-R6 + same-logo-treatment for every report per " + MSG)
c["notes"] = ("LOGO ADDED 2026-07-29 per " + MSG + " ('Each report now ensures the same \"logo\" "
 "treatment') - the PV spec had NO logo mention, so this report genuinely lacked coverage; the other "
 "five reports already carry logo cases (SBC-EXP-10 C30168, SBR-EXP-06 C30281, TU-EXP-06 C30439, "
 "WIP-EXP-08 C30517, IV-EXP-04 C30590). Exact treatment pending the updated spec changelog.")

# ---------------------------------------------------------------- write files + manifest
for p, data in FILES.items():
    with open(p, "w") as fh:
        json.dump(data, fh, indent=1, ensure_ascii=False); fh.write("\n")

with open(os.path.join(BK, "MANIFEST.md"), "w") as fh:
    fh.write("# Chris-update 2026-07-29 — pre-edit backups (LOCAL delta pass, NO TestRail writes)\n\n"
             "Source: `../chris-message-2026-07-29.md` (verbatim). Every touched case's verbatim\n"
             "PRE-EDIT body is here as `<internal-id>.json`. To recover a case, copy the backup body\n"
             "over the entry in the listed cases/ file (TU-COL-01 is NEW — recover by deleting it).\n\n"
             "| Internal ID | File | Delta |\n|---|---|---|\n")
    for iid, fname, what in manifest:
        fh.write(f"| {iid} | {fname} | {what} |\n")

print(f"Applied. Touched: {len(manifest)} cases ({len(manifest)-1} edited + 1 new).")
for iid, _, what in manifest:
    print(f"  {iid}: {what}")
