#!/usr/bin/env python3
"""Report Suite — promote the kickoff-video deltas to LOCAL case edits (2026-07-28).

USER RULING 2026-07-28: Chris Ward's kickoff video is AUTHENTIC + AUTHORITATIVE
product intent (made for Chris Amani, company VP) and is NEWER than the six
Confluence specs (specs last updated 2026-07-21) — by last-update-wins the VIDEO
overrides the spec where they conflict. This script applies the previously
"PENDING-CHRIS" items as LOCAL edits to build/report-suite/cases/*.json.

NO TestRail writes (Rule 6 — the change-list remains the approval gate).
Idempotence: NOT idempotent — run exactly once on the pre-promotion tree
(guarded: aborts if SBC-EXP-16 already exists).

Applied items (video anchor = transcript timestamps in
chris-answers-2026-07-28/loom-kickoff-transcript.md):
  P24 serial-number asset identifier (29:54-30:46)  -> SBC-LBL-01 rewrite +
      SBC-LBL-02/03/04 notes/refs + WIP-COL-05 / WIP-FLT-03 / WIP-SORT-03
      rewrites + WIP-EXP-07 caveat.
  P25 SBC Print removed (31:14)                     -> SBC-EXP-01 + SBC-EXP-14
      edits; SBC-EXP-13 marked Retire-Proposed (NOT deleted).
  P21 SBC compressed download added (32:10-33:03,
      48:39)                                        -> NEW case SBC-EXP-16
      (no C-ID yet; refs = epic SV-8582, stated explicitly - no child story).
  P33 location filter hidden when <=1 permitted
      location (46:10-46:28)                        -> SBR-LOC-04 / TU-LOC-05 /
      IV-LOC-04 / PV-FILT-13 expectation FLIPPED.
  P10 per-row location identifier in All-locations
      view (40:58-41:20)                            -> SBC-LOC-03 / SBR-LOC-03 /
      PV-FILT-10 / TU-LOC-01 / IV-LOC-01 expectation ADDED (design-light,
      exact control = VIU-confirm, Rule 9).
  P2/P3 nav placement (04:32-05:19)                 -> TU-NAV-01 below-existing
      expectation added; PV-NAV-01/IV-NAV-01 already assert the Parts section
      (no-op, verified).
  P31 Catalogue rename                              -> NOT applied (Chris only
      said "maybe" — stays OPEN-DECISION).

Every edited case: title <= 80 chars (asserted), tester-facing text plain
(Rules 7/9; unpinned labels flagged "confirmed in the build", never invented),
refs = ticket + spec-or-video anchor in spec_ref (Rule 20), overridden spec
wording quoted in notes (Rule 25).
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
CASES = os.path.join(os.path.dirname(HERE), "cases")

RULING = "user ruling 2026-07-28: video overrides spec (video newer, last-update-wins)"


def load(fname):
    path = os.path.join(CASES, fname)
    raw = open(path).read()
    l2 = raw.split("\n")[1]
    indent = len(l2) - len(l2.lstrip())
    return path, json.loads(raw), indent


def save(path, data, indent):
    with open(path, "w") as f:
        f.write(json.dumps(data, indent=indent, ensure_ascii=False) + "\n")


def case(data, cid):
    for c in data:
        if c["id"] == cid:
            return c
    raise KeyError(cid)


EDITED = []


def touched(cid, summary):
    EDITED.append((cid, summary))


# ---------------------------------------------------------------- SBC file B
path, data, ind = load("cases-sbc-B-tree-links-sorting.json")

c = case(data, "SBC-LBL-01")
c["title"] = "Asset label = year make model plus the serial number as the identifier"
c["preconditions"] = [
 "1. One customer has ZZAUTOTEST assets with invoices in range: (a) one with a serial number recorded, (b) one with no serial number.",
]
c["steps"] = ["1. Expand the customer and read each asset row's label."]
c["expected"] = [
 "1. Every label starts with the vehicle's year, make, and model.",
 "2. Asset (a) shows its SERIAL NUMBER after the year/make/model as the identifier.",
 "3. For asset (b) (no serial number), note what the label shows instead — what stands in when the serial number is missing is confirmed in the build (the older wording used the unit number, then the plate, then the last 8 of the VIN).",
]
c["spec_ref"] = ("SV-8606 (specs/sbc-sales-by-customer.md Story 8 S8-R7; S8-R8 — identifier "
                 "OVERRIDDEN to serial number by kickoff video P24 29:54-30:46, " + RULING + ")")
c["notes"] = ("VIDEO-AUTHORITATIVE (P24, " + RULING + "). Video 29:54-30:46: 'Using unit number as an "
              "identifier is not best in class... the holy grail... is the serial number, or in some cases "
              "the bin number... it's one and the same. Interchangeable terminology... that is the "
              "identifier... I need to change this on my local to actual serial number.' OVERRIDDEN spec "
              "wording (S8-R8): suffix priority '· Unit {unit}' -> plate -> 'VIN …{last 8}' -> none. "
              "The exact suffix punctuation and the missing-serial fallback are unpinned — VIU-confirm from "
              "the build, do not invent (Rule 9).")
touched("SBC-LBL-01", "identifier Unit->plate->VIN REPLACED by serial number; fallback flagged unpinned")

c = case(data, "SBC-LBL-02")
c["spec_ref"] = "SV-8606 (specs/sbc-sales-by-customer.md Story 8 S8-R9)"
c["notes"] = ("Video P24 (" + RULING + "): the asset identifier is now the SERIAL NUMBER. This case's "
              "no-year/make/model rule (S8-R9: label = the VIN on its own) is not itself overridden by the "
              "video, but re-confirm the fallback in the build once the serial-number identifier ships.")
touched("SBC-LBL-02", "notes+refs only — S8-R9 VIN-only rule kept, re-confirm under serial-number ruling")

c = case(data, "SBC-LBL-03")
c["spec_ref"] = "SV-8606 (specs/sbc-sales-by-customer.md Story 8 S8-R10)"
c["notes"] = (c["notes"] + " " if c["notes"] else "") + \
             ("Video P24 (" + RULING + "): the asset identifier is now the SERIAL NUMBER; the 'Unknown "
              "Asset' rule (S8-R10) is not itself overridden — re-confirm in the build (an asset may now "
              "also need no serial number to be 'Unknown').")
touched("SBC-LBL-03", "notes+refs only — Unknown-Asset rule kept, re-confirm under serial-number ruling")

c = case(data, "SBC-LBL-04")
c["spec_ref"] = "SV-8606 (specs/sbc-sales-by-customer.md Story 8 S8-R11)"
c["notes"] = ("Video P24 (" + RULING + "): the asset identifier is now the SERIAL NUMBER — duplicate labels "
              "should become rarer (serials are unique), but the (#1)/(#2) rule (S8-R11) itself is not "
              "overridden; seed the duplicate-label state accordingly and re-confirm in the build.")
touched("SBC-LBL-04", "notes+refs only — (#1)/(#2) rule kept, seeding note updated for serial identifier")

save(path, data, ind)

# ---------------------------------------------------------------- SBC file A
path, data, ind = load("cases-sbc-A-access-filters.json")

c = case(data, "SBC-LOC-03")
c["title"] = "Selecting locations scopes the data; All locations covers every accessible one"
c["steps"] = [
 "1. Select only location A in the location filter and note the customers/totals.",
 "2. Select locations A and B together and note the change.",
 "3. Select \"All locations.\"",
 "4. With \"All locations\" active, look at how the rows tell you which location they belong to.",
]
c["expected"] = [
 "1. With one or more locations selected, the report includes only data from those locations.",
 "2. Adding a second location adds that location's invoices to the rows and totals.",
 "3. With \"All locations,\" the report includes data from every location the user has access to.",
 "4. With \"All locations\" active you can tell which location each row's data belongs to — a location label or marking is shown. (Exactly where and how it appears is confirmed in the build.)",
]
c["spec_ref"] = ("SV-8603 (specs/sbc-sales-by-customer.md Story 4 S4-R5; S4-R6 — per-row location "
                 "identifier in All-locations view ADDED per kickoff video P10 40:58-41:20, " + RULING + ")")
c["notes"] = ("VIDEO-AUTHORITATIVE ADD (P10, " + RULING + "). Video 41:09-41:20: 'we'll need a way to "
              "define, we're looking at all locations... how do I know which is for shop A and which is "
              "for shop B? ... we should probably add that in there.' The current spec has NO per-row "
              "location label on this report (tree is Customer->Asset->Invoice, no Location column — only "
              "WIP has one). Exact control/label unpinned — VIU-confirm, do not invent (Rule 9).")
touched("SBC-LOC-03", "ADDED All-locations per-row location-identifier expectation (control unpinned); title shortened to 78")

save(path, data, ind)

# ---------------------------------------------------------------- SBC file C
path, data, ind = load("cases-sbc-C-calcs-columns-exports-persistence.json")
if any(c["id"] == "SBC-EXP-16" for c in data):
    sys.exit("SBC-EXP-16 already exists — promotion already applied; aborting.")

c = case(data, "SBC-EXP-01")
c["title"] = "The overflow menu holds only Download (CSV) and Download (PDF) — no Print item"
c["expected"] = [
 "1. The overflow (export) menu is the leftmost control in the toolbar's action area and is the application's standard overflow-menu control.",
 "2. The menu items read, in order: \"Download (CSV)\", \"Download (PDF)\" — and there is NO \"Print\" item anywhere in the menu.",
 "3. There are no separate always-visible export buttons — all exports live behind this one menu.",
]
c["spec_ref"] = ("SV-8612; SV-8613 (specs/sbc-sales-by-customer.md S14-R1; S14-R2; S15-R1; S15-R2; "
                 "S20-R16 — the 'Print' third menu item REMOVED per kickoff video P25 31:14, overriding "
                 "Story 16 / SV-8614, " + RULING + ")")
c["notes"] = ("VIDEO-AUTHORITATIVE (P25, " + RULING + "). Video 31:14: 'Like, print here, this should not "
              "exist. I'm going to make sure. That's cut out of the spec.' OVERRIDDEN spec wording: S14-R1 "
              "menu order 'Download (CSV)', 'Download (PDF)', 'Print' (Print third) + Story 16 S16-R1..R6 "
              "(Print the report). Exports are PDF + CSV downloads only.")
touched("SBC-EXP-01", "menu expectation now CSV+PDF only, explicit NO Print item")

c = case(data, "SBC-EXP-13")
c["viu_status"] = "Retire-Proposed (video P25, user ruling 2026-07-28 — awaiting TestRail delete authorization)"
c["notes"] = ("RETIRE-PROPOSED (P25, " + RULING + ") — this case's ONLY purpose is the Print behavior, and "
              "the video removes Print from Sales By Customer entirely (31:14: 'print here, this should not "
              "exist. I'm going to make sure. That's cut out of the spec.'). OVERRIDDEN spec wording: Story "
              "16 S16-R1..R6 / S16-N1 / §7 ('Print PDF fails'). NOT deleted — Rule 6: kept in TestRail "
              "(C30171) until the user explicitly authorizes delete_case; body left as authored for the "
              "record. Prior note: the distinct failure wording Print='PDF generation failed.' vs PDF "
              "download='PDF export failed.'")
touched("SBC-EXP-13", "marked Retire-Proposed (Print-only case; NOT deleted — awaiting authorization)")

c = case(data, "SBC-EXP-14")
c["title"] = "An export over 10,000 data rows is refused with the too-large toast"
c["steps"] = [
 "1. With the over-cap filter set, choose \"Download (CSV)\".",
 "2. Choose \"Download (PDF)\".",
 "3. Narrow the filters below the cap and re-try one export.",
]
c["expected"] = [
 "1. For both CSV and PDF: no file is generated and no download starts.",
 "2. An error toast is shown each time: \"This export is too large to generate. Narrow the date range or filters, then try again.\" (dismissed by the user).",
 "3. The cap counts customer rows plus invoice rows (not the header or totals row) against the active date range, Product Type, location, Customer filter, and sort.",
 "4. Below the cap the export succeeds normally.",
]
c["spec_ref"] = ("SV-8612; SV-8613 (specs/sbc-sales-by-customer.md Story 14 S14-R14; Story 15 S15-R22; "
                 "§7 — the Print leg REMOVED per kickoff video P25 31:14 / SV-8614 overridden, " + RULING + ")")
c["notes"] = ("Server-side enforcement is covered by SBC-API-05. BUILD-DELTA: the 10,000-row cap is the "
              "2026-07-21 spec round — the current build may lack it at VIU. Video P25 (" + RULING + "): "
              "the Print step/expectation was removed with the Print control (spec S16-R6 had capped Print "
              "too); title shortened to fit.")
touched("SBC-EXP-14", "Print step/expectation removed (CSV+PDF legs kept); title shortened to 67")

data.append({
 "id": "SBC-EXP-16",
 "area": "SBC — Exports",
 "title": "The download menu also offers a compressed (summary) version of the report",
 "priority": "Medium",
 "type": "Functional",
 "permissions_required": "Sales By Customer report View permission.",
 "preconditions": [
  "1. You are on the Sales By Customer report with at least one customer and several invoices in the chosen date range.",
 ],
 "steps": [
  "1. Open the download (overflow) menu and read the options.",
  "2. Download the compressed (summary) version and open the file.",
  "3. Download the expanded (full, nested) version and compare the two files.",
 ],
 "expected": [
  "1. Besides the existing expanded (nested) download, the menu offers a compressed (summary) download option. (The exact menu wording is confirmed in the build.)",
  "2. The compressed file gives one summary line per customer, without the per-invoice detail rows. (The exact file shape is confirmed in the build once the spec update lands.)",
  "3. The expanded download still contains the full nested detail, and both files reflect exactly the filtered data shown on screen.",
 ],
 "design_ref": "none - SPEC-ONLY (Report Suite has no designs yet)",
 "spec_ref": ("SV-8582 (EPIC-LEVEL, stated explicitly: no child story exists yet for the SBC compressed "
              "download — kickoff video P21 32:10-33:03 + 48:39, user ruling 2026-07-28; overrides the "
              "current spec's single flat export, S14-R6; S14-R10; S15-R16)"),
 "viu_status": "VIU-Pending",
 "notes": ("VIDEO-AUTHORITATIVE ADD (P21, " + RULING + "), NEW — no C-ID yet (needs authorized add_case). "
           "Video: Parth 32:10 'in sales by customer, we don't want to include option to download as a "
           "expanded view?' -> Chris 32:43 'You know what? That's actually a good callout. Let's, let's "
           "add that.' + 48:39 'we're gonna have to add to SVC, Sales by Customer, like you said, the "
           "CompressedView, that was a great idea.' OVERRIDDEN spec state: SBC exports are a single FLAT "
           "shape (S14-R6/S14-R10 CSV, S15-R16 PDF) with no Summary-vs-Expanded split. Compressed-file "
           "shape modeled on the other reports' Summary downloads but unpinned until Chris's spec update — "
           "flagged, not invented (Rule 9)."),
 "api_related": False,
})
touched("SBC-EXP-16", "NEW case authored (compressed/summary SBC download, video P21) — no C-ID yet")

save(path, data, ind)

# ---------------------------------------------------------------- WIP file B
path, data, ind = load("cases-wip-B-columns-calc-sorting.json")

c = case(data, "WIP-COL-05")
c["title"] = "Asset cell shows a bold serial number over a muted VIN; VIN is also a column"
c["preconditions"] = [
 "1. You are signed in to the ShopView App on a desktop browser.",
 "2. The report shows work orders including: one whose asset has both a serial number and a vehicle identification number, one with no serial number, and one with no vehicle identification number.",
]
c["steps"] = [
 "1. Read the Asset cell of a row whose asset has both values.",
 "2. Read the Asset cell of the row with no serial number, then the one with no vehicle identification number.",
 "3. Open the column-selection control, turn on the VIN column, and read it.",
]
c["expected"] = [
 "1. The Asset cell is two lines: the asset's SERIAL NUMBER on the first line in bold, and the vehicle identification number on the second line in a smaller, muted style.",
 "2. When the asset has no serial number, the first line shows a placeholder (its exact text is confirmed in the build); when it has no vehicle identification number, the second line shows \"— no VIN —\".",
 "3. The VIN column (off by default) shows the vehicle identification number on its own line as a separate, sortable column.",
]
c["spec_ref"] = ("SV-8660 (specs/wip-work-in-progress.md Story 4 S4-R7; S4-R8; S4-R10 — identifier "
                 "OVERRIDDEN to serial number by kickoff video P24 29:54-30:46, " + RULING + ")")
c["notes"] = ("VIDEO-AUTHORITATIVE (P24, " + RULING + "). Video 29:54-30:46: the serial number (bin number "
              "— interchangeable) is THE asset identifier, replacing the unit number ('if you see it, "
              "please flag it for anybody'). OVERRIDDEN spec wording: S4-R7 Asset cell = unit number (line "
              "1, bold) + VIN (line 2); §4 'Asset … identified by its unit number and its VIN'; old "
              "placeholder '(no unit #)'. The missing-serial placeholder text is unpinned — VIU-confirm, "
              "do not invent (Rule 9). \"— no VIN —\" is verbatim from the spec (S4-R8) and is kept.")
touched("WIP-COL-05", "Asset cell line 1 unit number -> SERIAL NUMBER; missing-serial placeholder flagged unpinned")

c = case(data, "WIP-SORT-03")
c["title"] = "Columns sort by underlying values; Asset sorts by serial number"
c["preconditions"] = [
 "1. You are signed in to the ShopView App on a desktop browser.",
 "2. A tab shows several work orders with a spread of money values (including values over $1,000), differing statuses, and differing serial numbers.",
]
c["steps"] = [
 "1. Sort by a money column (for example Total) and check the order of values like $900.00 vs $1,100.00.",
 "2. Sort by Days Open and check the order of the day counts.",
 "3. Sort by Status and check the order against the displayed labels.",
 "4. Sort by Asset and check the order against the serial numbers.",
 "5. Sort by WO #, Customer, and Advisor and check they order as text.",
]
c["expected"] = [
 "1. Money and numeric columns sort by their underlying numeric value (so $1,100.00 is treated as more than $900.00, not compared as text).",
 "2. Days Open sorts by its day count.",
 "3. Status sorts by its displayed label.",
 "4. The Asset column sorts by the serial number.",
 "5. WO #, Customer, Asset, VIN, Location, and Advisor sort as text.",
]
c["spec_ref"] = ("SV-8660 (specs/wip-work-in-progress.md Story 4 S4-R27; S4-R9 — Asset sort key "
                 "OVERRIDDEN to serial number by kickoff video P24 29:54-30:46, " + RULING + ")")
c["notes"] = ("VIDEO-AUTHORITATIVE (P24, " + RULING + "): the asset identifier is the serial number, so "
              "the Asset column's sort key follows it. OVERRIDDEN spec wording: S4-R9 'sorts by unit "
              "number'. Title shortened to fit.")
touched("WIP-SORT-03", "Asset sort key unit number -> serial number; title shortened to 64")

save(path, data, ind)

# ---------------------------------------------------------------- WIP file C
path, data, ind = load("cases-wip-C-summary-totals-filters.json")

c = case(data, "WIP-FLT-03")
c["title"] = "Asset filter type-ahead matches serial number or VIN, \"All assets\" when empty"
c["preconditions"] = [
 "1. You are signed in to the ShopView App on a desktop browser.",
 "2. The report shows jobs for at least two assets whose serial numbers and vehicle identification numbers you know.",
]
c["steps"] = [
 "1. Read the Asset filter's label before selecting anything.",
 "2. Open the filter and read how each option is presented.",
 "3. Type part of a serial number and check the matching options; clear and type part of a vehicle identification number instead.",
 "4. Select one or more assets and watch the rows; then use the \"Clear\" action.",
]
c["expected"] = [
 "1. With no asset selected, the filter reads \"All assets\" and every job is shown.",
 "2. Each option shows the serial number and the vehicle identification number.",
 "3. The typed text matches against EITHER the serial number OR the vehicle identification number.",
 "4. Selecting assets narrows the visible jobs on screen only (no reload); a single \"Clear\" action appears once at least one asset is selected and returns the filter to \"All assets\".",
]
c["spec_ref"] = ("SV-8663 (specs/wip-work-in-progress.md Story 7 S7-R4; S7-R5 — option text + match "
                 "fields OVERRIDDEN from unit number to serial number by kickoff video P24 29:54-30:46, "
                 + RULING + ")")
c["notes"] = ("VIDEO-AUTHORITATIVE (P24, " + RULING + "): the asset identifier is the serial number. "
              "OVERRIDDEN spec wording: S7-R4/S7-R5 options and type-ahead matched the UNIT NUMBER and the "
              "VIN. Separate OPEN-DECISION (video P12) on whether the dropdown stays open on each pick vs "
              "matches native + a toggle — do not pass/fail on that until decided.")
touched("WIP-FLT-03", "type-ahead/option fields unit number -> serial number; P12 open-decision noted")

save(path, data, ind)

# ---------------------------------------------------------------- WIP file D
path, data, ind = load("cases-wip-D-persistence-exports.json")

c = case(data, "WIP-EXP-07")
c["title"] = "Export headers read \"Unit\" and \"Branch\" — documented limitation, do not file"
c["expected"] = [
 "1. On screen the headers read \"Asset\" and \"Location\".",
 "2. In BOTH the PDF and the CSV, the same two columns are headed \"Unit\" and \"Branch\".",
 "3. This on-screen-vs-export label difference is the EXPECTED, documented v1 behavior.",
 "4. Note: the on-screen Asset cell now identifies the asset by its serial number; whether the export header text changes from \"Unit\" is confirmed in the build — record what it shows, do not file a bug either way.",
]
c["spec_ref"] = ("SV-8665 (specs/wip-work-in-progress.md Story 9 S9-E1; §2 Known Limitations (v1) — "
                 "asset identifier OVERRIDDEN to serial number by kickoff video P24, " + RULING + ")")
c["notes"] = ("DOCUMENTED LIMITATION — DO NOT FILE. The Unit/Branch export headers are a known v1 "
              "limitation, not a defect. Video P24 (" + RULING + "): the asset DATA is now the serial "
              "number; the spec's export header text (S9-E1 'Unit') predates the video — header text at "
              "export is unpinned, VIU-confirm. Title shortened to fit.")
touched("WIP-EXP-07", "serial-number data caveat added to the Unit/Branch header limitation; title shortened")

save(path, data, ind)

# ---------------------------------------------------------------- SBR file A
path, data, ind = load("cases-sbr-A-access-filters.json")

c = case(data, "SBR-LOC-03")
c["title"] = "Location selection cascades; an inaccessible location's data is never included"
c["steps"] = [
 "1. Select only location Y.",
 "2. Look for rep A; read rep B's count, totals, and detail rows.",
 "3. Select \"All Locations\" and check whether any location-Z data appears.",
 "4. With \"All Locations\" active, look at how the rows tell you which location they belong to.",
]
c["expected"] = [
 "1. With only Y selected, rep A disappears (no matching invoice at Y); rep B's metrics reflect only Y invoices — an invoice's location is that of its originating work order / parts sale.",
 "2. Changing the selection re-fetches and re-renders scoped to the chosen set.",
 "3. \"All Locations\" means all locations the user can access — location Z's data is never included.",
 "4. With \"All Locations\" active you can tell which location each row's data belongs to — a location label or marking is shown. (Exactly where and how it appears is confirmed in the build.)",
]
c["spec_ref"] = ("SV-8638 (specs/sbr-sales-by-representative.md Story 21 S21-R3; S21-R4; S21-R5; §3 — "
                 "per-row location identifier in All-Locations view ADDED per kickoff video P10 "
                 "40:58-41:20, " + RULING + ")")
c["notes"] = ("VIDEO-AUTHORITATIVE ADD (P10, " + RULING + "). Video 41:09-41:20: 'how do I know which is "
              "for shop A and which is for shop B? ... we should probably add that in there.' The current "
              "spec has NO per-row location label on this report (no Location column). Exact control/label "
              "unpinned — VIU-confirm, do not invent (Rule 9).")
touched("SBR-LOC-03", "ADDED All-Locations per-row location-identifier expectation (control unpinned); title shortened to 79")

c = case(data, "SBR-LOC-04")
c["title"] = "The Location filter is hidden for a user with access to only one location"
c["preconditions"] = [
 "1. You are signed in as a user assigned to exactly one location.",
]
c["steps"] = [
 "1. Open the report and look for the Location filter in the toolbar.",
 "2. Then sign in as a user with access to two or more locations and look again.",
]
c["expected"] = [
 "1. For the single-location user the Location filter is NOT shown at all — the report simply shows that one location's data.",
 "2. For the user with access to two or more locations the Location filter IS shown.",
]
c["spec_ref"] = ("SV-8638 (specs/sbr-sales-by-representative.md Story 21 S21-N1 — expectation FLIPPED by "
                 "kickoff video P33 46:10-46:28, " + RULING + ")")
c["notes"] = ("VIDEO-AUTHORITATIVE FLIP (P33, " + RULING + "). Video 46:10-46:28: 'if you, say you only "
              "had QA testing, you would not see this at all. This- the filter's just gone. If you had... "
              "QA testing and QB location, then of course you'd see the filter.' OVERRIDDEN spec wording "
              "(S21-N1): 'A single-location user STILL SEES the filter with one selectable location' — the "
              "case previously asserted exactly that. Ties to the Q2 permission-model question.")
touched("SBR-LOC-04", "FLIPPED: single-location user now expects NO Location filter (was: still sees it)")

save(path, data, ind)

# ---------------------------------------------------------------- PV file A
path, data, ind = load("cases-pv-A-access-permissions-filters.json")

c = case(data, "PV-FILT-10")
c["title"] = "Location filter is rightmost, defaults to the active location, accessible-only"
c["steps"] = [
 "1. Look at the rightmost control in the filter row.",
 "2. Note which location is selected by default and compare it to the location selected in the application's global location switcher.",
 "3. Open the filter and read the list of locations.",
 "4. Select a second location, then select the 'All Locations' option.",
 "5. With 'All Locations' active, look at how the rows tell you which location they belong to.",
]
c["expected"] = [
 "1. The Location filter is the rightmost control in the filter row and is multi-select.",
 "2. On a first visit it defaults to the user's currently active location (the one in the global location switcher).",
 "3. The list holds the locations the signed-in user has access to, plus an 'All Locations' option.",
 "4. Each selection reloads the data scoped to the chosen set; 'All Locations' means all locations the user can ACCESS, never beyond - a location the user cannot access is never included.",
 "5. The location scope cascades through every metric like the other filters.",
 "6. With 'All Locations' active you can tell which location each row's data belongs to — a location label or marking is shown. (Exactly where and how it appears is confirmed in the build.)",
]
c["spec_ref"] = ("SV-8642 (specs/parts-velocity.md S2-R9 — per-row location identifier in All-Locations "
                 "view ADDED per kickoff video P10 40:58-41:20, " + RULING + ")")
c["notes"] = ("VIU-confirm the exact 'All Locations' label. Seeding: needs a user with two accessible "
              "locations and in-window activity at both (heavy multi-location seeding). "
              "VIDEO-AUTHORITATIVE ADD (P10, " + RULING + "): per-row location identifier in All-Locations "
              "view — the current spec has NO explicit Location column in the 20-column set (S4-R4), "
              "though inventory rows are per-location (S3-R1a). Exact control/label unpinned — "
              "VIU-confirm, do not invent (Rule 9).")
touched("PV-FILT-10", "ADDED All-Locations per-row location-identifier expectation (control unpinned); title shortened to 79")

c = case(data, "PV-FILT-13")
c["title"] = "The Location filter is hidden for a user with access to only one location"
c["preconditions"] = [
 "1. You are signed in as a user with access to exactly one location.",
 "2. You are on the Parts Velocity report with data loaded.",
]
c["steps"] = [
 "1. Look for the Location filter in the toolbar.",
 "2. Then sign in as a user with access to two or more locations and look again.",
]
c["expected"] = [
 "1. For the single-location user the Location filter is NOT shown at all — the report simply shows that one location's data.",
 "2. For the user with access to two or more locations the Location filter IS shown.",
]
c["spec_ref"] = ("SV-8642 (specs/parts-velocity.md S2-E4 — expectation FLIPPED by kickoff video P33 "
                 "46:10-46:28, " + RULING + ")")
c["notes"] = ("VIDEO-AUTHORITATIVE FLIP (P33, " + RULING + "). Video 46:10-46:28: 'if you, say you only "
              "had QA testing, you would not see this at all. This- the filter's just gone. If you had... "
              "QA testing and QB location, then of course you'd see the filter.' OVERRIDDEN spec wording "
              "(S2-E4): 'A user with access to only one location STILL SEES the Location filter with a "
              "single selectable location.' Seeding: create a fresh ZZAUTOTEST staff member scoped to one "
              "location if none exists (Standing Rule 14 pattern).")
touched("PV-FILT-13", "FLIPPED: single-location user now expects NO Location filter (was: still sees it)")

save(path, data, ind)

# ---------------------------------------------------------------- TU file C
path, data, ind = load("cases-tu-C-links-exports-location.json")

c = case(data, "TU-LOC-01")
c["title"] = "The Location filter is the rightmost multi-select; All Locations = select-all"
c["steps"] = [
 "1. Look at the rightmost control in the toolbar and read its label.",
 "2. Open it and read the listed options.",
 "3. Choose \"All Locations\", then uncheck one individual location.",
 "4. With every accessible location selected, look at how the report tells you which location the shown data belongs to.",
]
c["expected"] = [
 "1. The toolbar has a location filter labeled \"Location\" - a multi-select and the RIGHTMOST control.",
 "2. It lists the locations the signed-in user has access to, plus an \"All Locations\" option.",
 "3. \"All Locations\" acts as a select-all shortcut: choosing it selects every accessible location; unchecking one location leaves the remaining specific locations selected - the selection is always the concrete set of checked locations.",
 "4. With all locations selected you can tell which location the shown data belongs to — a location label or marking is shown. (Exactly where and how it appears is confirmed in the build; this report pools each technician's hours into one row, so the marking may take a different form here.)",
]
c["spec_ref"] = ("SV-8656 (specs/technician-utilization.md S9-R1 — per-row location identifier in "
                 "All-Locations view ADDED per kickoff video P10 40:58-41:20, " + RULING + ")")
c["notes"] = ("Labels pinned verbatim (\"Location\" / \"All Locations\"). VIDEO-AUTHORITATIVE ADD (P10, "
              + RULING + "): location identifier in All-Locations view — the current spec has NO per-row "
              "location identifier (hours pooled across locations into one row per technician, S9-R4). "
              "Exact control/label/form unpinned — VIU-confirm, do not invent (Rule 9).")
touched("TU-LOC-01", "ADDED All-Locations location-identifier expectation (form unpinned — TU pools rows per tech); title shortened to 78")

c = case(data, "TU-LOC-05")
c["title"] = "The Location filter is hidden for a user with access to only one location"
c["preconditions"] = [
 "1. You are signed in as a user with access to exactly one location.",
 "2. You are on the Technician Utilization report.",
]
c["steps"] = [
 "1. Look for the Location filter in the toolbar.",
 "2. Then sign in as a user with access to two or more locations and look again.",
]
c["expected"] = [
 "1. For the single-location user the Location filter is NOT shown at all — the report simply shows that one location's data.",
 "2. For the user with access to two or more locations the Location filter IS shown.",
]
c["spec_ref"] = ("SV-8656 (specs/technician-utilization.md S9-N1 — expectation FLIPPED by kickoff video "
                 "P33 46:10-46:28, " + RULING + ")")
c["notes"] = ("VIDEO-AUTHORITATIVE FLIP (P33, " + RULING + "). Video 46:10-46:28: 'if you, say you only "
              "had QA testing, you would not see this at all. This- the filter's just gone. If you had... "
              "QA testing and QB location, then of course you'd see the filter.' OVERRIDDEN spec wording "
              "(S9-N1): 'A user with access to only one location still sees the filter with a single "
              "selectable location.' Seeding: a fresh ZZAUTOTEST staff member scoped to one location if "
              "none exists.")
touched("TU-LOC-05", "FLIPPED: single-location user now expects NO Location filter (was: still sees it)")

save(path, data, ind)

# ---------------------------------------------------------------- TU file A
path, data, ind = load("cases-tu-A-access-hours-lostlabor.json")

c = case(data, "TU-NAV-01")
c["title"] = "Technician Utilization sits under Performance, below existing report links"
c["steps"] = [
 "1. Open the reports navigation.",
 "2. Look under the Performance group.",
 "3. Click the entry labeled Technician Utilization.",
 "4. Note where the entry sits relative to the report links that existed before this release.",
]
c["expected"] = [
 "1. The report is listed under the Performance group, labeled \"Technician Utilization\".",
 "2. Clicking it opens the report.",
 "3. The entry sits BELOW the previously existing report links (toward the bottom) — the new reports are added without moving or disturbing the existing entries.",
]
c["spec_ref"] = ("SV-8648 (specs/technician-utilization.md S1-R1 — nav placement tightened per kickoff "
                 "video P3 05:11-05:19 [below existing items, additive not interruptive], " + RULING + ")")
c["notes"] = ("VIU-confirm the exact timesheet-reports permission name as shown in the roles screen (the "
              "spec names it only by reference to the Timesheet Activities report). VIDEO-AUTHORITATIVE "
              "(P3, " + RULING + "). Video 05:11-05:19: 'technician utilization is actually in a really "
              "bad spot right now. So, we want to move these down below what's already there.' The spec is "
              "order-agnostic among the six reports (order relax kept); the below-existing rule is the "
              "video's addition. Title shortened to fit.")
touched("TU-NAV-01", "ADDED below-existing-links placement expectation (video P3); title shortened to 77")

save(path, data, ind)

# ---------------------------------------------------------------- IV file C
path, data, ind = load("cases-iv-C-asof-filters-location.json")

c = case(data, "IV-LOC-01")
c["title"] = "The Location filter is a rightmost multi-select with an All locations toggle"
c["steps"] = [
 "1. Open the Inventory Value report and find the filter labeled \"Location\".",
 "2. Read its position in the toolbar and its default selection.",
 "3. Open it and read its options and its toggle.",
 "4. Select every accessible location (\"All locations\") and look at how the rows tell you which location they belong to.",
]
c["expected"] = [
 "1. The toolbar has a location filter labeled \"Location\" — a multi-select and the rightmost filter — listing the locations the signed-in user has access to, with an \"All locations\" / \"Clear all\" toggle.",
 "2. On a first visit it defaults to the user's currently active location.",
 "3. With \"All locations\" active you can tell which location each row's stock belongs to — a location label or marking is shown. (Exactly where and how it appears is confirmed in the build.)",
]
c["spec_ref"] = ("SV-8674 (specs/inventory-value.md Story 7 S7-R1; S7-R2; Story 12 S12-R3 — per-row "
                 "location identifier in All-locations view ADDED per kickoff video P10 40:58-41:20, "
                 + RULING + ")")
c["notes"] = ("VIDEO-AUTHORITATIVE ADD (P10, " + RULING + "). Video 41:09-41:20: 'how do I know which is "
              "for shop A and which is for shop B? ... we should probably add that in there.' The current "
              "spec has NO Location identifier column (one row per part per location, S2-R3, but no "
              "Location column in S3-R1). Exact control/label unpinned — VIU-confirm, do not invent "
              "(Rule 9). Title shortened to fit.")
touched("IV-LOC-01", "ADDED All-locations per-row location-identifier expectation (control unpinned); title shortened to 77")

c = case(data, "IV-LOC-04")
c["title"] = "The Location filter is hidden for a user with access to only one location"
c["steps"] = [
 "1. Open the Inventory Value report and look for the Location filter in the toolbar.",
 "2. Then sign in as a user with access to two or more locations and look again.",
]
c["expected"] = [
 "1. For the single-location user the Location filter is NOT shown at all — the report simply shows that one location's stock.",
 "2. For the user with access to two or more locations the Location filter IS shown.",
]
c["spec_ref"] = ("SV-8674 (specs/inventory-value.md Story 7 S7-N1 — expectation FLIPPED by kickoff video "
                 "P33 46:10-46:28, " + RULING + ")")
c["notes"] = ("VIDEO-AUTHORITATIVE FLIP (P33, " + RULING + "). Video 46:10-46:28: 'if you, say you only "
              "had QA testing, you would not see this at all. This- the filter's just gone. If you had... "
              "QA testing and QB location, then of course you'd see the filter.' OVERRIDDEN spec wording "
              "(S7-N1): 'A user with access to only one location still sees the filter with a single "
              "selectable location.'")
touched("IV-LOC-04", "FLIPPED: single-location user now expects NO Location filter (was: still sees it)")

save(path, data, ind)

# ---------------------------------------------------------------- report
print("Edited/authored cases: %d" % len(EDITED))
for cid, s in EDITED:
    print("  %-12s %s" % (cid, s))

# Title-length guard (<= 80 chars, concise-title rule 2026-07-27)
import glob
bad = []
for f in glob.glob(os.path.join(CASES, "cases-*.json")):
    for c in json.load(open(f)):
        if len(c["title"]) > 80 and c["id"] in [e[0] for e in EDITED]:
            bad.append((c["id"], len(c["title"])))
print("Edited titles over 80 chars:", bad if bad else "NONE")
