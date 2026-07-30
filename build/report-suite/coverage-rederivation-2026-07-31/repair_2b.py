#!/usr/bin/env python3
"""Rule-28 Stage-2b CONSISTENCY REPAIRS — make every exact column/header list
scope-conditional so it stays true whether or not the automatic Location column is showing.

THE CONTRADICTION (user-authorized fix, 2026-07-31)
  The per-row Location column was added suite-wide in the 2026-07-29 spec round. It is
  AUTOMATIC: shown whenever more than one location is in scope, hidden otherwise — and it
  is included in the exports too (SBC S4-R13, SBR S14-R20, PV S6-R11, TU S7-R13,
  IV S10-R15, WIP S9-R10a).
  Fourteen older cases enumerate a column or header list with absolute framing —
  "Exactly these 14 columns show", "these thirteen columns in this exact order",
  "the headers, in order, are exactly …" — and none of them mention Location. In a
  multi-location scope those cases and the Location cases CANNOT BOTH BE TRUE, so a
  tester in a two-location org would fail a correct build.

THE RESOLUTION
  Neither side is wrong — both are in the current specs. The cases were simply silent
  about the scope they assume. Each list is made scope-conditional: it stays exact for a
  single-location scope and states where Location joins it when more than one location is
  in scope. No ruling is reversed; no list loses its precision.
  WIP-COL-01 (C30466) already did this correctly and is the model followed.

Run: python3 repair_2b.py [--dry-run]
"""
import json
import os
import re
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.abspath(os.path.join(HERE, ".."))
CASES = os.path.join(RS, "cases")
BACKUP = os.path.join(HERE, "backup-2b")
REFS_CAP = 245
MARKER = "STAGE-2B CONSISTENCY REPAIR 2026-07-31"

# The scope sentence appended to the offending expected line, per case.
# "add_expected" appends a whole new expected line instead where that reads better.
REPAIRS = {
    # ---------- EXPORT header/column lists (SBC + SBR are the only two reports whose
    # ---------- exports enumerate a fixed list; PV/TU/IV/WIP exports say "the columns
    # ---------- currently shown on screen", which is already scope-correct)
    "SBC-EXP-03": {
        "exp_index": 1,
        "replace": ("The Expanded View CSV has these thirteen columns in this exact order: "
                    "Customer, Asset, Invoice #, Date, Inv. Hrs, Labor Invoiced, Labor "
                    "Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, "
                    "Margin %, Subtotal."),
        "with": ("With a single location in scope the Expanded View CSV has these thirteen "
                 "columns in this exact order: Customer, Asset, Invoice #, Date, Inv. Hrs, "
                 "Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop "
                 "Supplies, Margin, Margin %, Subtotal. When more than one location is in "
                 "scope the file also carries a Location column — immediately after Date, "
                 "the position it holds on screen — making fourteen."),
        "refs": ('SV-8612; SV-8603 (SBC spec v12 2026-07-29 Story 14 S14-R5; S14-R6; S14-R7; S14-R8; S14-R13 + Story 4 S4-R13 — Expanded CSV thirteen columns INCLUDING Asset; per-level blank-cell rules; plus the automatic Location column in every export)'),
    },
    "SBC-EXP-11": {
        "exp_index": 1,
        "replace_sub": ("the same thirteen columns, in the same order and with the same "
                        "labels, as the Expanded View CSV"),
        "with_sub": ("the same columns, in the same order and with the same labels, as the "
                     "Expanded View CSV — thirteen with a single location in scope, plus "
                     "the Location column after Date when more than one location is in "
                     "scope"),
        "refs": ('SV-8613; SV-8603 (SBC spec v12 2026-07-29 Story 15 S15-R5; S15-R13; S15-R19; S15-R20; S15-R21; S15-R22; S15-R23; S15-R24 + Story 4 S4-R13 — Expanded PDF body = the Expanded columns; plus the automatic Location column)'),
    },
    "SBC-EXP-16": {
        "exp_index": 5,
        "replace": ("The Summary files have these ten columns in this exact order: "
                    "Customer, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, "
                    "Parts Margin, Shop Supplies, Margin, Margin %, Subtotal — no Asset, "
                    "Invoice # or Date columns."),
        "with": ("With a single location in scope the Summary files have these ten columns "
                 "in this exact order: Customer, Inv. Hrs, Labor Invoiced, Labor Margin, "
                 "Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %, Subtotal "
                 "— no Asset, Invoice # or Date columns. When more than one location is in "
                 "scope a Location column is added with the identifying columns, ahead of "
                 "the money columns (the Summary files have no Date column for it to "
                 "follow — confirm its exact position in the build)."),
        "refs": ('SV-8612; SV-8613; SV-8603 (SBC spec v12 2026-07-29 Story 14 S14-R1/R2/R4 + Story 15 S15-R1/R2/R4/R5 + Story 4 S4-R13 — four-item Summary/Expanded menu and the Summary column list; plus the automatic Location column in every export)'),
    },
    "SBR-EXP-03": {
        "exp_index": 3,
        "replace": ("The columns are: Rep / Inv. Hrs / Labor Invoiced / Labor Margin / "
                    "Parts Invoiced / Parts Margin / Margin / Margin % / Subtotal."),
        "with": ("With a single location in scope the columns are: Rep / Inv. Hrs / Labor "
                 "Invoiced / Labor Margin / Parts Invoiced / Parts Margin / Margin / "
                 "Margin % / Subtotal. When more than one location is in scope a Location "
                 "column is added with the identifying columns ahead of Inv. Hrs, and a "
                 "rep who spans more than one location reads \"Multiple\" (this file has no "
                 "Status column for it to follow — confirm its exact position in the "
                 "build)."),
        "refs": ('SV-8631 (SBR spec v15 2026-07-29 Story 14 S14-R3; S14-R5; S14-R20; Story 2 S2-R5; §3 Margin % definition — Summary PDF; plus the automatic Location column in all four exports)'),
    },
    "SBR-EXP-04": {
        "exp_index": 2,
        "replace_sub": ("a per-invoice table with columns: Date / Invoice / Customer / "
                        "Status / Inv. Hrs"),
        "with_sub": ("a per-invoice table with columns: Date / Invoice / Customer / Status "
                     "/ (Location, only when more than one location is in scope, carrying "
                     "that invoice's own location) / Inv. Hrs"),
        "refs": ('SV-8631 (SBR spec v15 2026-07-29 Story 14 S14-R6; S14-R8; S14-R20; Story 6 S6-R9 — Expanded PDF page-block per rep; plus the automatic Location column after Status)'),
    },
    "SBR-EXP-10": {
        "exp_index": 2,
        "replace_sub": "The headers, in order, are exactly: Sales Representative",
        "with_sub": ("With a single location in scope the headers, in order, are exactly: "
                     "Sales Representative"),
        "add_expected": ("When more than one location is in scope the file also carries a "
                         "Location column, with the identifying columns ahead of the "
                         "metric columns; a rep whose invoices span more than one location "
                         "reads \"Multiple\". (This file has no Status column for it to "
                         "follow — confirm its exact position in the build.)"),
        "refs": ("SV-8631 (SBR spec v15 2026-07-29 Story 14 S14-R15; S14-R18; S14-R20 — Summary CSV headers; plus the automatic Location column in all four exports; S14-R15's header list was left un-updated when S14-R20 was added — spec correction pending)"),
    },
    "SBR-EXP-11": {
        "exp_index": 2,
        "replace_sub": "The headers, in order, are exactly: Sales Representative",
        "with_sub": ("With a single location in scope the headers, in order, are exactly: "
                     "Sales Representative"),
        "add_expected": ("When more than one location is in scope the file also carries a "
                         "Location column immediately after Status — the position it holds "
                         "on screen — and every row shows that invoice's own exact "
                         "location, never \"Multiple\"."),
        "refs": ("SV-8631 (SBR spec v15 2026-07-29 Story 14 S14-R16; S14-R20 — Expanded CSV headers; plus the automatic Location column after Status; S14-R16's header list was left un-updated when S14-R20 was added — spec correction pending)"),
    },
    # ---------- ON-SCREEN column lists ----------
    "PV-COL-02": {
        "exp_index": 1,
        "replace_sub": "Exactly these 14 columns show, in this left-to-right order:",
        "with_sub": ("With a single location in scope exactly these 14 columns show, in "
                     "this left-to-right order:"),
        "add_expected": ("When more than one location is in scope the automatic Location "
                         "column shows as well, leftmost before Type — 15 columns. It is "
                         "not part of the 14-column default set and is not in the column "
                         "picker, so its presence is expected and is not a failure of this "
                         "test."),
        "refs": ('SV-8644; SV-8643 (PV spec v4 2026-07-29 S4-R2; S4-R3 + Story 3 S3-R10 — the 14 default-visible columns and the 6 hidden ones; plus the automatic Location column leftmost when more than one location is in scope)'),
    },
    "PV-COL-03": {
        "exp_index": 2,
        "replace_sub": ("Columns always render in the fixed canonical left-to-right order "
                        "regardless of the order they were toggled on:"),
        "with_sub": ("Columns always render in the fixed canonical left-to-right order "
                     "regardless of the order they were toggled on (with the automatic "
                     "Location column, when shown, sitting leftmost before Type):"),
        "refs": ('SV-8644; SV-8643 (PV spec v4 2026-07-29 S4-R4; S4-R5 + Story 3 S3-R10 — canonical column order and immediate re-render; plus the automatic Location column leftmost when shown)'),
    },
    "IV-COL-01": {
        "exp_index": 1,
        "replace_sub": "The columns appear in this order:",
        "with_sub": "With a single location in scope the columns appear in this order:",
        "add_expected": ("When more than one location is in scope the automatic Location "
                         "column also appears, between Vendor and Qty on Hand, "
                         "left-aligned. It is not in the column-selection control, so its "
                         "presence is expected and is not a failure of this test."),
        "refs": ('SV-8670; SV-8674 (IV spec v3 2026-07-29 Story 3 S3-R1; S3-R2 + Story 7 S7-R6 — fixed column order and alignment; plus the automatic Location column between Vendor and Qty on Hand)'),
    },
    "IV-COL-04": {
        "exp_index": 1,
        "replace_sub": "On first visit, the visible columns are:",
        "with_sub": ("On first visit with a single location in scope the visible columns "
                     "are:"),
        "add_expected": ("When more than one location is in scope the automatic Location "
                         "column also shows, between Vendor and Qty on Hand — it is not "
                         "one of the toggleable columns and its presence is expected."),
        "refs": ('SV-8670; SV-8674 (IV spec v3 2026-07-29 Story 3 S3-R12; S3-R13; Story 8 S8-R3 + Story 7 S7-R6 — first-visit default columns; plus the automatic Location column when more than one location is in scope)'),
    },
    "IV-PERS-02": {
        "exp_index": 1,
        "replace_sub": ("Whatever columns are shown, they appear in the fixed "
                        "left-to-right order ("),
        "with_sub": ("Whatever columns are shown, they appear in the fixed left-to-right "
                     "order — with the automatic Location column, when more than one "
                     "location is in scope, between Vendor and Qty on Hand ("),
        "refs": ('SV-8675; SV-8674 (IV spec v3 2026-07-29 Story 8 S8-R4; Story 3 S3-R1 + Story 7 S7-R6 — toggling never reorders; plus the automatic Location column between Vendor and Qty on Hand)'),
    },
    "SBR-ROW-02": {
        "exp_index": 1,
        "replace": ("The columns appear left to right: Date, Invoice, Customer, Status, "
                    "Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, "
                    "Margin, Margin %, Subtotal (12 columns)."),
        "with": ("With a single location in scope the columns appear left to right: Date, "
                 "Invoice, Customer, Status, Inv. Hrs, Labor Invoiced, Labor Margin, Parts "
                 "Invoiced, Parts Margin, Margin, Margin %, Subtotal (12 columns). When "
                 "more than one location is in scope the automatic Location column is "
                 "added immediately after Status, making 13."),
        "refs": ('SV-8623; SV-8638 (SBR spec v15 2026-07-29 Story 5 S5-R2; S5-R3; S5-R6; S5-R8; S5-R10; S5-N2; Story 6 S6-R4; Story 18 S18-R4; S18-R6a + Story 21 S21-R7 — plus the Location column after Status)'),
    },
    "TU-HRS-02": {
        "exp_index": 1,
        "replace_sub": "The headers appear in exactly this order:",
        "with_sub": ("With a single location in scope the headers appear in exactly this "
                     "order:"),
        "add_expected": ("When more than one location is in scope the automatic Location "
                         "column also appears, leftmost before Technician — it is not in "
                         "the Column Selection control and its presence is expected."),
        "refs": ('SV-8649; SV-8656 (TU spec v5 2026-07-29 S2-R1; S2-R2; S2-R3; S2-R4; S2-R5; §3 + Story 9 S9-R9 — header order and the hours columns; plus the automatic Location column leftmost when shown)'),
    },
    # ---------- refs hygiene surfaced by the surface sweep ----------
    "SBC-EXP-08": {
        "refs": ('SV-8613 (SBC spec v12 2026-07-29 Story 15 S15-R5; S15-R6; S15-R7; S15-R8 — A4 landscape; 25px margins; standard font; footer label and page numbers)'),
        "note_only": ("S15-R7 (A4 landscape / 25px margins / standard font) and S15-R8 "
                      "(footer) added — both already asserted in expected 1 and 2; the "
                      "anchor sat on the sibling header case SBC-EXP-09 (C30167) instead. "
                      "Found by the same-requirement-different-surface sweep"),
    },
}

NUM_RE = re.compile(r"^\s*\d+\.\s*")


def renumber(items):
    return ["%d. %s" % (i, NUM_RE.sub("", t).strip()) for i, t in enumerate(items, 1)]


def main():
    dry = "--dry-run" in sys.argv
    os.makedirs(BACKUP, exist_ok=True)
    touched, ops, problems = {}, [], []

    for fname in sorted(os.listdir(CASES)):
        if not fname.endswith(".json"):
            continue
        path = os.path.join(CASES, fname)
        data = json.load(open(path, encoding="utf-8"))
        changed = False
        for c in data:
            cid = c["id"]
            if cid not in REPAIRS or c.get("viu_status") != "VIU-Pending":
                continue
            r = REPAIRS[cid]
            if MARKER in (c.get("notes") or ""):
                ops.append((cid, "SKIP already applied"))
                continue
            detail = []
            if "exp_index" in r:
                i = r["exp_index"] - 1
                cur = NUM_RE.sub("", c["expected"][i]).strip()
                if "replace" in r:
                    if cur != r["replace"]:
                        problems.append((cid, "expected text drifted", cur[:120]))
                        continue
                    c["expected"][i] = r["with"]
                else:
                    if r["replace_sub"] not in cur:
                        problems.append((cid, "sub-string not found", cur[:120]))
                        continue
                    c["expected"][i] = cur.replace(r["replace_sub"], r["with_sub"])
                detail.append(f"expected {r['exp_index']} reworded")
            if "add_expected" in r:
                c["expected"] = list(c["expected"]) + [r["add_expected"]]
                detail.append("+1 expected")
            c["expected"] = renumber(c["expected"])
            c["spec_ref"] = r["refs"]
            assert len(c["spec_ref"]) <= REFS_CAP, (cid, len(c["spec_ref"]))
            assert "," not in c["spec_ref"], cid
            detail.append(f"refs {len(c['spec_ref'])}")
            base = (c.get("notes") or "").rstrip()
            extra = r.get("note_only") or (
                "the exact column/header list is now scope-conditional: it stays exact "
                "with a single location in scope and states where the automatic Location "
                "column joins it when more than one location is in scope, so this case "
                "and the report's Location-column case can both be true. No ruling "
                "reversed; the governing export/location requirement added to refs. "
                "Not live-verified: no QA branch exists")
            c["notes"] = (base + " " if base else "") + f"{MARKER}: {extra}."
            changed = True
            ops.append((cid, "; ".join(detail)))
        if changed:
            touched[fname] = data

    if problems:
        print("STOPPED - source text did not match (nothing written):")
        for p in problems:
            print("  ", p)
        sys.exit(1)

    for fname, data in touched.items():
        path = os.path.join(CASES, fname)
        if not dry:
            shutil.copy2(path, os.path.join(BACKUP, fname))
            with open(path, "w", encoding="utf-8") as fh:
                json.dump(data, fh, indent=1, ensure_ascii=False)
                fh.write("\n")

    for cid, d in sorted(ops):
        print(f"  {cid:<13}{d}")
    print(f"\n{'DRY RUN - ' if dry else ''}cases repaired: {len(ops)}; "
          f"files touched: {len(touched)}")


if __name__ == "__main__":
    main()
