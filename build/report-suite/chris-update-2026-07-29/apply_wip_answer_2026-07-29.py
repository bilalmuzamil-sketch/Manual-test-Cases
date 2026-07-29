#!/usr/bin/env python3
"""Apply Chris Ward's WIP-identifier answer (A = VIN chain), 2026-07-29 — LOCAL ONLY.

Source: wip-identifier-answer-2026-07-29.md (verbatim; user-relayed, NEWEST source,
last-update-wins). NO TestRail writes — the push is separately authorized (Rule 6).

Edits:
  - WIP-COL-05 / WIP-FLT-03 / WIP-SORT-03: flipped from the video-era serial ruling to
    the VIN -> Unit # -> plate chain (mirrors the SBC-LBL-01 wording pattern) + a short
    plain tester note on the VIN label for non-vehicle assets (Chris's terminology
    caution; Rule 9 keeps the build label "VIN").
  - WIP-EXP-07: expected #4 caveat re-based on the VIN chain (was serial).
  - SBC-LBL-01: notes-only — the "WIP question queued for Chris" residue closed
    (answered A 2026-07-29; local metadata field, not pushed to TestRail).

Backups: verbatim pre-edit bodies to backup/ BEFORE editing (SBC-LBL-01 already has a
backup/SBC-LBL-01.json from the D1 wave — the new one is suffixed .pre-wip-answer-edit
so the earlier backup is NOT overwritten).
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.dirname(HERE)
CASES = os.path.join(RS, "cases")
BK = os.path.join(HERE, "backup")

ANSWER_DOC = "chris-update-2026-07-29/wip-identifier-answer-2026-07-29.md"
TESTER_NOTE = ("Note for the tester: the field is labelled VIN. For assets that are not "
               "vehicles (for example a generator), this is the unit's serial number.")

FILES = {
    "WIP-COL-05": "cases-wip-B-columns-calc-sorting.json",
    "WIP-SORT-03": "cases-wip-B-columns-calc-sorting.json",
    "WIP-FLT-03": "cases-wip-C-summary-totals-filters.json",
    "WIP-EXP-07": "cases-wip-D-persistence-exports.json",
    "SBC-LBL-01": "cases-sbc-B-tree-links-sorting.json",
}
BACKUP_NAME = {  # SBC-LBL-01.json already holds the pre-D1 body — do not overwrite
    "SBC-LBL-01": "SBC-LBL-01.pre-wip-answer-edit.json",
}

EDITS = {
 "WIP-COL-05": {
  "title": "Asset cell identifies the asset by VIN, falling back to Unit #, then plate",
  "preconditions": [
   "1. You are signed in to the ShopView App on a desktop browser.",
   "2. The report shows work orders including: one whose asset has a VIN recorded, one with no VIN but a Unit # recorded, and one with no VIN or Unit # but a plate recorded.",
  ],
  "steps": [
   "1. Read the Asset cell of the row whose asset has a VIN.",
   "2. Read the Asset cell of the row with no VIN, then the one with no VIN or Unit #.",
   "3. Open the column-selection control, turn on the VIN column, and read it.",
  ],
  "expected": [
   "1. The Asset cell identifies the asset by its VIN.",
   "2. When the asset has no VIN, the cell shows its Unit # instead; when it has no VIN or Unit #, it shows its plate instead.",
   "3. Note what the cell's second line shows now that the VIN is the main identifier (the older layout put the VIN on a muted second line) - the exact rendering is confirmed in the build; record what you see.",
   "4. The VIN column (off by default) shows the VIN on its own line as a separate, sortable column.",
   "5. " + TESTER_NOTE,
  ],
  "spec_ref": ("SV-8660 (specs/wip-work-in-progress.md Story 4 S4-R7; S4-R8; S4-R10 - identifier "
    "RE-RULED to VIN, falling back to Unit #, then plate, by Chris Ward answer A 2026-07-29 ("
    + ANSWER_DOC + "; NEWEST source, last-update-wins), superseding the kickoff video's "
    "serial-number ruling P24 AND the spec's unit-number rule)"),
  "notes": ("RE-RULED 2026-07-29 per Chris Ward's answer to the WIP-identifier question: 'A is the "
    "correct answer' - WIP uses the same VIN -> Unit # -> plate chain as Sales By Customer (mirrors "
    "SBC-LBL-01 C30134). Chris's standing note: the chain is the STANDARD for all reports and all "
    "future work ('Not just for these specs though -- really good to keep this in mind for all "
    "actions moving forward'), with the terminology caution that for non-vehicle assets (e.g. a "
    "generator) the VIN field is effectively the serial number - hence the plain tester note "
    "(label stays 'VIN' per Rule 9). Supersedes the video P24 serial ruling applied 2026-07-28 "
    "(pre-edit body in chris-update-2026-07-29/backup/WIP-COL-05.json; pre-video body in "
    "video-promotion-backup-2026-07-28/). Second-line rendering + the all-identifiers-missing "
    "fallback are unpinned - Chris updated the spec before bed but has NOT hand-reviewed it; "
    "confirm from his spec changelog + the build at VIU, do not invent (Rule 9)."),
 },
 "WIP-SORT-03": {
  "title": "Columns sort by underlying values; Asset sorts by the identifier shown",
  "preconditions": [
   "1. You are signed in to the ShopView App on a desktop browser.",
   "2. A tab shows several work orders with a spread of money values (including values over $1,000), differing statuses, and differing asset identifiers (VIN, or Unit # / plate where the VIN is missing).",
  ],
  "steps": [
   "1. Sort by a money column (for example Total) and check the order of values like $900.00 vs $1,100.00.",
   "2. Sort by Days Open and check the order of the day counts.",
   "3. Sort by Status and check the order against the displayed labels.",
   "4. Sort by Asset and check the order against the identifiers shown in the Asset cells.",
   "5. Sort by WO #, Customer, and Advisor and check they order as text.",
  ],
  "expected": [
   "1. Money and numeric columns sort by their underlying numeric value (so $1,100.00 is treated as more than $900.00, not compared as text).",
   "2. Days Open sorts by its day count.",
   "3. Status sorts by its displayed label.",
   "4. The Asset column sorts by the identifier it shows - the VIN, falling back to Unit #, then plate.",
   "5. WO #, Customer, Asset, VIN, Location, and Advisor sort as text.",
  ],
  "spec_ref": ("SV-8660 (specs/wip-work-in-progress.md Story 4 S4-R27; S4-R9 - Asset sort key "
    "RE-RULED to the VIN chain (VIN, then Unit #, then plate) by Chris Ward answer A 2026-07-29 ("
    + ANSWER_DOC + "; last-update-wins), superseding the video P24 serial ruling AND the spec's "
    "'sorts by unit number')"),
  "notes": ("RE-RULED 2026-07-29 per Chris Ward's answer A ('A is the correct answer'): the asset "
    "identifier is the VIN chain (VIN -> Unit # -> plate; standard for all reports going forward "
    "per his standing note), so the Asset column's sort key follows the identifier it shows. "
    "Supersedes the video P24 serial ruling (pre-edit body in "
    "chris-update-2026-07-29/backup/WIP-SORT-03.json). Exact sort key when rows mix VIN/Unit #/"
    "plate identifiers is unpinned - confirm in the build at VIU. Title kept 80 chars or fewer."),
 },
 "WIP-FLT-03": {
  "title": "Asset filter matches VIN, Unit #, or plate; \"All assets\" when empty",
  "preconditions": [
   "1. You are signed in to the ShopView App on a desktop browser.",
   "2. The report shows jobs for at least two assets whose VINs (and Unit #s or plates) you know.",
  ],
  "steps": [
   "1. Read the Asset filter's label before selecting anything.",
   "2. Open the filter and read how each option is presented.",
   "3. Type part of a VIN and check the matching options; clear and type part of a Unit # instead.",
   "4. Select one or more assets and watch the rows; then use the \"Clear\" action.",
  ],
  "expected": [
   "1. With no asset selected, the filter reads \"All assets\" and every job is shown.",
   "2. Each option identifies the asset by its VIN, falling back to Unit #, then plate (the exact option text is confirmed in the build).",
   "3. The typed text matches against the asset's identifier - the VIN, and the Unit # where the asset has one (the exact fields matched are confirmed in the build).",
   "4. Selecting assets narrows the visible jobs on screen only (no reload); a single \"Clear\" action appears once at least one asset is selected and returns the filter to \"All assets\".",
   "5. " + TESTER_NOTE,
  ],
  "spec_ref": ("SV-8663 (specs/wip-work-in-progress.md Story 7 S7-R4; S7-R5 - option text + "
    "type-ahead match fields RE-RULED to the VIN chain (VIN, then Unit #, then plate) by Chris "
    "Ward answer A 2026-07-29 (" + ANSWER_DOC + "; last-update-wins), superseding the video P24 "
    "serial ruling; the spec's original unit-number+VIN matching partially survives via the chain)"),
  "notes": ("RE-RULED 2026-07-29 per Chris Ward's answer A ('A is the correct answer'): the asset "
    "identifier is the VIN chain (VIN -> Unit # -> plate; standard for all reports going forward "
    "per his standing note), with the non-vehicle terminology caution carried as a plain tester "
    "note (label stays 'VIN' per Rule 9). Supersedes the video P24 serial ruling (pre-edit body in "
    "chris-update-2026-07-29/backup/WIP-FLT-03.json). Exact option text + matched fields unpinned "
    "- Chris's spec update is not hand-reviewed yet; confirm at VIU, do not invent (Rule 9). "
    "P12 LATEST INFO (latest-info user ruling 2026-07-28: update per latest info now, correct at "
    "VIU later): the Asset dropdown should MATCH THE NATIVE ShopView multi-select style, plus a "
    "possible toggle - video 15:49-16:04 Stefan: 'I would also add maybe a toggle or something... "
    "Just to have it, like, uniform throughout the app'; Chris 16:54: 'let's please do this. Happy "
    "to update the spec with that, too.' Exact interaction (close-on-pick vs toggle) = VIU-confirm "
    "- do not fail on stay-open vs close-per-pick until confirmed live. (No case asserted the "
    "stay-open behavior - verified by search.)"),
 },
 "WIP-EXP-07": {
  "expected": [
   "1. On screen the headers read \"Asset\" and \"Location\".",
   "2. In BOTH the PDF and the CSV, the same two columns are headed \"Unit\" and \"Branch\".",
   "3. This on-screen-vs-export label difference is the EXPECTED, documented v1 behavior.",
   "4. Note: the on-screen Asset cell now identifies the asset by its VIN (falling back to Unit #, then plate); whether the export header text changes from \"Unit\" is confirmed in the build - record what it shows, do not file a bug either way.",
  ],
  "spec_ref": ("SV-8665 (specs/wip-work-in-progress.md Story 9 S9-E1; §2 Known Limitations (v1) "
    "- asset identifier RE-RULED to the VIN chain (VIN, then Unit #, then plate) by Chris Ward "
    "answer A 2026-07-29 (" + ANSWER_DOC + "; last-update-wins), superseding the video P24 serial "
    "ruling; export header text at export unpinned)"),
  "notes": ("DOCUMENTED LIMITATION - DO NOT FILE. The Unit/Branch export headers are a known v1 "
    "limitation, not a defect. Asset DATA re-ruled 2026-07-29 to the VIN chain per Chris Ward's "
    "answer A ('A is the correct answer'; chain = standard for all reports going forward), "
    "superseding the video P24 serial ruling (pre-edit body in "
    "chris-update-2026-07-29/backup/WIP-EXP-07.json); the spec's export header text (S9-E1 'Unit') "
    "predates both rulings - header text at export is unpinned, VIU-confirm. Title shortened to fit."),
 },
}

# SBC-LBL-01: notes-only (local metadata; notes are NOT a pushed TestRail field)
SBC_LBL_01_NOTES_OLD = ("WIP's asset identifier stays on the video's serial ruling - the message "
  "scopes VIN to SBC only (ambiguity flagged in SPEC-WATCH; question queued for Chris).")
SBC_LBL_01_NOTES_NEW = ("2026-07-29: the WIP question is ANSWERED - Chris Ward: 'A is the correct "
  "answer' (wip-identifier-answer-2026-07-29.md): WIP also uses the VIN chain, and the chain is "
  "the STANDARD for all reports and all future work ('really good to keep this in mind for all "
  "actions moving forward'); WIP-COL-05/WIP-FLT-03/WIP-SORT-03 + the WIP-EXP-07 caveat flipped "
  "the same day.")

changed = []
for iid, fname in FILES.items():
    path = os.path.join(CASES, fname)
    raw = open(path).read()
    # preserve each file's existing indent style (wip-B uses indent=2, the rest indent=1)
    indent = 2 if raw.lstrip().startswith("[\n  {") else 1
    data = json.loads(raw)
    for i, c in enumerate(data):
        if c["id"] != iid:
            continue
        bk = os.path.join(BK, BACKUP_NAME.get(iid, iid + ".json"))
        assert not os.path.exists(bk) or iid != "SBC-LBL-01" or bk.endswith(
            ".pre-wip-answer-edit.json"), "would overwrite the D1 backup"
        if not os.path.exists(bk):
            with open(bk, "w") as fh:
                fh.write(json.dumps(c, indent=1, ensure_ascii=False) + "\n")
        if iid == "SBC-LBL-01":
            # tolerate the unicode em-dash in the stored notes
            old = c["notes"]
            needle_a = SBC_LBL_01_NOTES_OLD
            needle_b = SBC_LBL_01_NOTES_OLD.replace(" - ", " — ")
            if needle_a in old:
                c["notes"] = old.replace(needle_a, SBC_LBL_01_NOTES_NEW)
            elif needle_b in old:
                c["notes"] = old.replace(needle_b, SBC_LBL_01_NOTES_NEW)
            else:
                raise SystemExit("SBC-LBL-01 stale-WIP sentence not found - notes drifted, inspect")
        else:
            c.update(EDITS[iid])
        data[i] = c
        changed.append(iid)
        break
    else:
        raise SystemExit(f"{iid} not found in {fname}")
    with open(path, "w") as fh:
        fh.write(json.dumps(data, indent=indent, ensure_ascii=False) + "\n")

print("edited:", changed)
for iid in ("WIP-COL-05", "WIP-SORT-03", "WIP-FLT-03"):
    t = EDITS[iid]["title"]
    assert len(t) <= 80, (iid, len(t))
    print(f"  {iid} title {len(t)} chars OK")
