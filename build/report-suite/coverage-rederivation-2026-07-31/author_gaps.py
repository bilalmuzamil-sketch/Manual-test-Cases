#!/usr/bin/env python3
"""Phase 6 — apply the coverage-re-derivation authoring to the LOCAL case bodies.

Two kinds of change, kept strictly separate:

  A. CONTENT EXTENSIONS (6) — a genuine gap closed by extending the case that already
     owns that behaviour, rather than authoring a near-duplicate. Adds one step + one
     expected (TU-COL-01 adds a step + an expected for the accessible name), plus the
     requirement anchor and its owning story ticket to `spec_ref`, plus a note line.

  B. REFS-ANCHOR BACKFILL (13) — the case already asserts the requirement in its
     tester-facing text but the anchor was missing or mis-typed. `spec_ref` only.
     NOTHING tester-facing changes.

Writes a backup of every touched file first. Idempotent: re-running detects the marker
text and skips.  Run:  python3 author_gaps.py [--dry-run]
"""
import json
import os
import re
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.abspath(os.path.join(HERE, ".."))
CASES = os.path.join(RS, "cases")
BACKUP = os.path.join(HERE, "backup")

REFS_CAP = 245           # TestRail refs field is EXCLUSIVE at 250 - stay under 245

# ---------------------------------------------------------------- A. extensions
# each: new step, new expected, the full replacement spec_ref, an appended note
EXTENSIONS = {
    "SBC-LOC-04": {
        "step": ("With more than one location still selected, download all four files "
                 "from the download menu (Summary and Expanded View, PDF and CSV) and "
                 "read the columns in each one."),
        "expected": ("Every one of the four downloads also contains the Location column, "
                     "in the same position it holds on screen, showing the same values "
                     "you just read: a location name on a row whose invoices are all at "
                     "one location, \"Multiple\" on a row that aggregates more than one, "
                     "and the invoice's own location on an invoice row. (Exactly where the "
                     "column sits inside each file is confirmed in the build.)"),
        "refs": ("SV-8603; SV-8612; SV-8613 (SBC spec v12 2026-07-29 S4-R12; S4-R12a; "
                 "S4-R13; S20-R19 — per-row Location column with automatic visibility; "
                 "\"Multiple\" on aggregating rows; S4-R13 = the same column in every "
                 "export)"),
        "note": ("COVERAGE RE-DERIVATION 2026-07-31: extended to close S4-R13's second "
                 "half — \"When the Location column is shown on screen (more than one "
                 "location in scope S4-R12) every export also includes that Location "
                 "column.\" The \"Locations:\" line half was already covered by SBC-EXP-09 "
                 "(C30167) and SBC-EXP-03 (C30161); the exported COLUMN was covered "
                 "nowhere. Owning story for S4-R13 = SV-8603 (SBC Story 4); the export "
                 "stories SV-8612/SV-8613 are cited because the observation happens in "
                 "their files. Extended rather than authored as a new case (Rule 28) — "
                 "same control, and this case already establishes the >1-location scope a "
                 "new case would have to re-seed. Not live-verified: no QA branch exists."),
    },
    "SBR-LOC-05": {
        "step": ("With more than one location still selected, download all four files "
                 "from the ⋯ menu (Summary and Expanded View, PDF and CSV) and read the "
                 "Location column in each one."),
        "expected": ("All four downloads include the Location column in the same position "
                     "it occupies on screen. In the Summary files a rep's row carries that "
                     "rep's location and reads \"Multiple\" when the rep spans more than "
                     "one location; in the Expanded View files each invoice row carries "
                     "that invoice's own exact location."),
        "refs": ("SV-8638; SV-8631 (SBR spec v15 2026-07-29 S21-R7; S21-R8; S18-R13; "
                 "S14-R20 — per-row Location column; \"Multiple\" on a rep row spanning "
                 "locations; position after Status; constant-width filter; S14-R20 = the "
                 "same column in all four exports)"),
        "note": ("COVERAGE RE-DERIVATION 2026-07-31: extended to close S14-R20 — "
                 "\"Whenever the Location column is shown on screen (S21-R7) it is "
                 "included in all four exports in the same position it occupies on screen "
                 "… a Summary (rolled-up) row carries the rep's location reading Multiple "
                 "when that rep spans more than one location; an Expanded (per-invoice) row "
                 "carries that invoice's own exact location.\" SBR-EXP-02 (C30277) covered "
                 "only the \"Locations:\" line. Owning story for S14-R20 = SV-8631 (SBR "
                 "Story 14 PDF and CSV exports) — added alongside SV-8638 (Story 21). "
                 "Extended rather than duplicated (Rule 28). Not live-verified."),
    },
    "PV-FILT-14": {
        "step": ("With more than one location still selected, download the CSV and the "
                 "PDF and read their columns from the left."),
        "expected": ("Both downloads include the Location column in the same position it "
                     "holds on screen (leftmost, before Type), with the same values — each "
                     "inventory row's own location, and \"Multiple\" on the merged Special "
                     "Order row."),
        "refs": ("SV-8642; SV-8646 (PV spec v4 2026-07-29 S2-R12; S3-R10; S7-R8; S6-R11 — "
                 "per-row Location column; leftmost before Type; \"Multiple\" on the merged "
                 "special-order row; not in the picker; S6-R11 = the same column in both "
                 "exports)"),
        "note": ("COVERAGE RE-DERIVATION 2026-07-31: extended to close S6-R11 — \"Every "
                 "export includes the per-row Location column whenever it is shown on "
                 "screen (more than one location in scope S2-R12 / S3-R10) in its "
                 "on-screen column position.\" PV-EXP-02 (C30376) covered only the "
                 "\"Locations:\" line. Owning story for S6-R11 = SV-8646 (PV Story 6 "
                 "Exports) — added alongside SV-8642 (Story 2). Extended rather than "
                 "duplicated (Rule 28). Not live-verified."),
    },
    "TU-LOC-06": {
        "step": ("With more than one location still selected, download both PDF views and "
                 "the CSV and read their columns from the left."),
        "expected": ("Every download — both PDF views and the CSV — includes the Location "
                     "column in its on-screen leftmost position, carrying the same values "
                     "you just read on screen."),
        "refs": ("SV-8656; SV-8654 (TU spec v5 2026-07-29 S9-R9; S9-R10; S8-R15; S10-R4; "
                 "S7-R13 — per-row Location column; leftmost before Technician; "
                 "\"Multiple\" on a spanning row; Summary row blank; not in the selector; "
                 "S7-R13 = same column in every download)"),
        "note": ("COVERAGE RE-DERIVATION 2026-07-31: extended to close S7-R13 — \"Every "
                 "download (both PDF views and the CSV) includes the per-row Location "
                 "column whenever it is shown on screen (more than one location in scope — "
                 "S9-R9) in its on-screen leftmost position.\" TU-EXP-04 (C30437) covered "
                 "only the \"Locations:\" line. Owning story for S7-R13 = SV-8654 (TU "
                 "Story 7 Export to PDF and CSV) — added alongside SV-8656 (Story 9). "
                 "Extended rather than duplicated (Rule 28). Not live-verified."),
    },
    "IV-LOC-06": {
        "step": ("With more than one location still selected, download the CSV and the "
                 "PDF and read their columns."),
        "expected": ("Both downloads include the Location column in the same position it "
                     "holds on screen (between Vendor and Qty on Hand), naming each row's "
                     "own location."),
        "refs": ("SV-8674; SV-8677 (IV spec v3 2026-07-29 S7-R6; S7-R7; S3-R1; S12-R10; "
                 "S10-R15 — Location column inserted between Vendor and Qty on Hand; "
                 "automatic visibility; never \"Multiple\"; S10-R15 = the same column in "
                 "every export)"),
        "note": ("COVERAGE RE-DERIVATION 2026-07-31: extended to close S10-R15 — \"Every "
                 "export (each CSV and each PDF) includes the Location column whenever it "
                 "is shown on screen (S7-R6).\" IV-EXP-02 (C30588) covered only the "
                 "\"Locations:\" line. Owning story for S10-R15 = SV-8677 (IV Story 10 "
                 "Export to PDF and CSV) — added alongside SV-8674 (Story 7). Extended "
                 "rather than duplicated (Rule 28). Not live-verified."),
    },
    "TU-COL-01": {
        "step": ("With the button focused, read the name assistive technology gives it — "
                 "use the browser's accessibility inspector or a screen reader."),
        "expected": ("Because the button shows an icon and no text, it still carries a "
                     "name that assistive technology reads out — it is not left unnamed. "
                     "(The exact wording is confirmed in the build.)"),
        "refs": ("SV-8655; SV-8582 (TU spec v5 2026-07-29 Story 10 S10-R1; S10-R2; "
                 "S10-R3; S10-R4; S10-R5; S10-R6 column selector + Story 8 S8-R16 "
                 "accessible name — Story 10 has NO owning Jira story so epic SV-8582 is "
                 "used and FLAGGED; S8-R16 is owned by SV-8655)"),
        "insert_step_at": 2,      # keep the naming checks together, next to the tooltip
        "insert_expected_at": 2,
        "note": ("COVERAGE RE-DERIVATION 2026-07-31: extended to close S8-R16 — \"The "
                 "icon-only Column Selection control carries an accessible name exposed to "
                 "assistive technology.\" Expected 1 checks the TOOLTIP which is not the "
                 "accessible name; the suite does test accessible names elsewhere "
                 "(TU-DAY-01 C30418 / TU-DAY-04 C30421) so this is observable and was "
                 "genuinely untested. Owning story = SV-8655 (TU Story 8 Visual Conformance "
                 "and Accessibility) — added; the epic key stays for the Story-10 half. "
                 "Extended rather than duplicated (Rule 28) — same control. The spec does "
                 "not state the name's wording so it is left VIU-confirm; do not invent it. "
                 "Not live-verified."),
    },
}

# ------------------------------------------------------- B. refs-anchor backfill
# case -> (new spec_ref, short reason appended to notes)
BACKFILL = {
    "SBC-EXP-03": ("SV-8612 (SBC spec v12 2026-07-29 Story 14 S14-R5; S14-R6; S14-R7; "
                   "S14-R8; S14-R13 — the Expanded CSV now has thirteen columns INCLUDING "
                   "Asset; with per-level blank-cell rules; the old flat twelve-column "
                   "shape is superseded)",
                   "S14-R8 (plain customer names; no \"(N)\" count) added — already "
                   "asserted in expected 5, anchor was missing"),
    "SBC-EXP-04": ("SV-8612 (SBC spec v12 2026-07-29 Story 14 S14-R9; S14-R10; S14-R11; "
                   "S14-R12; S14-R13)",
                   "S14-R9 (Margin % plain to one decimal; empty when Subtotal <= 0) added "
                   "— already asserted in expected 1; the citation was off by one"),
    "SBC-EXP-02": ("SV-8612; SV-8613 (SBC spec v12 2026-07-29 S14-R14; S14-R15; S15-R6 — "
                   "file names now carry the Summary/Expanded version; the old flat "
                   "sales-by-customer-{range} map is superseded)",
                   "S14-R15 (plain comma-separated .csv; not .xlsx and not JSON) added — "
                   "already asserted in expected 4"),
    "SBC-EXP-14": ("SV-8612; SV-8613 (SBC spec v12 2026-07-29 S14-R16 CSV cap; S15-R25 PDF "
                   "cap; S14-R14; S15-R22; §7 — Print leg REMOVED per kickoff video P25 "
                   "31:14; user ruling 2026-07-28 video-overrides-spec)",
                   "S14-R16 (CSV cap) and S15-R25 (PDF cap) added - the pre-v12 S14-R14/"
                   "S15-R22 citations are kept so no other requirement loses its anchor"),
    "SBC-EXP-10": ("SV-8613 (SBC spec v12 2026-07-29 Story 15 S15-R12; S15-R13; S15-R14; "
                   "S15-R15; S15-R16; S15-R17; S15-R18)",
                   "S15-R16 (scales without distortion) S15-R17 (logo fallback order) and "
                   "S15-R18 (no-logo layout) added - all three already asserted in "
                   "expected 1-3; the existing S15-R12..R15 citations are kept"),
    "SBR-PERS-04": ("SV-8640 (SBR spec v15 2026-07-29 Story 23 S23-R4; S23-N1; Story 2 "
                    "S2-R4; S2-R7; Story 21 S21-R2)",
                    "S2-R7 (first-load default = This Month) added — asserted in expected "
                    "1; the anchor did not travel when SBR-DATE-03 was merged in 2026-07-28"),
    "SBR-STATE-01": ("SV-8633 (SBR spec v15 2026-07-29 Story 16 S16-R1; S16-R2; S16-R3; "
                     "S16-N1; Story 2 S2-N1; Story 21 S21-N2; §7)",
                     "S2-N1 and S21-N2 added — both are the same Story-16 empty state "
                     "reached by a filter that matches nothing; step 1 already drives it"),
    "TU-NAV-03": ("SV-8648 (TU spec v5 2026-07-29 S1-R3; S1-R6; S9-R2)",
                  "S1-R6 (first-visit location default = the user's active location) added "
                  "— already asserted in expected 3"),
    "WIP-TAB-01": ("SV-8657 (WIP spec v6 2026-07-29 Story 1 S1-R1; S1-R5 — Performance "
                   "group; below the named anchor items [Sales; Technician Efficiency; "
                   "Advisor Analysis; Shop Efficiency] per the PRD video 2026-07-30 "
                   "01:18-02:05; S1-R5 = browser page title)",
                   "S1-R5 (browser page title) added — asserted verbatim in expected 3; "
                   "the anchor did not travel when WIP-TAB-04 was merged in 2026-07-28"),
    "WIP-SCOPE-05": ("SV-8658 (WIP spec v6 2026-07-29 Story 2 S2-N1; S2-N2; Story 6 S6-N1; "
                     "§7 User Feedback Summary)",
                     "S6-N1 (a tab with no visible jobs shows no Totals row) added — "
                     "asserted in expected 4; the anchor did not travel when WIP-TOT-04 was "
                     "cut 2026-07-28"),
    "WIP-EXP-02": ("SV-8665 (WIP spec v6 2026-07-29 Story 9 S9-R2; S9-R3; S9-R4; S9-R10a — "
                   "\"Locations:\" line in every CSV/PDF export per Chris Ward's 2026-07-29 "
                   "message [NEWEST source; last-update-wins])",
                   "S9-R10a (the \"Locations:\" line in both downloads) added — asserted in "
                   "expected 4"),
    "WIP-FLT-09": ("SV-8663 (WIP spec v6 2026-07-29 S7-R13; S7-R14; S4-R3; S9-E1; S10-R5a; "
                   "§4 Location (column) — automatic visibility; never \"Multiple\"; export "
                   "header \"Branch\")",
                   "S10-R5a (constant-width Location filter control; fixed left-aligned "
                   "column position) added — asserted in expected 7 and expected 1"),
    "IV-NAV-06": ("SV-8668 (IV spec v3 2026-07-29 Story 1 S1-N2; Story 4 S4-N1; Story 5 "
                  "S5-N1; Story 7 S7-N2; Story 12; §7 User Feedback Summary)",
                  "S4-N1 (no qualifying parts means no totals row) added — asserted in "
                  "expected 2; the anchor did not travel when IV-TOT-05 was cut 2026-07-28"),
}

MARKER = "COVERAGE RE-DERIVATION 2026-07-31"


NUM_RE = re.compile(r"^\s*\d+\.\s*")


def renumber(items):
    out = []
    for i, t in enumerate(items, 1):
        body = NUM_RE.sub("", t).strip()
        out.append("%d. %s" % (i, body))
    return out


def main():
    dry = "--dry-run" in sys.argv
    os.makedirs(BACKUP, exist_ok=True)
    touched, ops = {}, []

    for fname in sorted(os.listdir(CASES)):
        if not fname.endswith(".json"):
            continue
        path = os.path.join(CASES, fname)
        data = json.load(open(path, encoding="utf-8"))
        changed = False
        for c in data:
            cid = c["id"]
            if c.get("viu_status") != "VIU-Pending":
                continue
            if cid in EXTENSIONS:
                e = EXTENSIONS[cid]
                if MARKER in (c.get("notes") or ""):
                    ops.append((cid, "extension", "SKIP already applied"))
                    continue
                st, ex = list(c["steps"]), list(c["expected"])
                si = e.get("insert_step_at")
                ei = e.get("insert_expected_at")
                st.insert(si - 1, e["step"]) if si else st.append(e["step"])
                ex.insert(ei - 1, e["expected"]) if ei else ex.append(e["expected"])
                c["steps"] = renumber(st)
                c["expected"] = renumber(ex)
                c["spec_ref"] = e["refs"]
                c["notes"] = (c.get("notes") or "").rstrip()
                c["notes"] = (c["notes"] + " " if c["notes"] else "") + e["note"]
                assert len(c["spec_ref"]) <= REFS_CAP, (cid, len(c["spec_ref"]))
                assert "," not in c["spec_ref"], cid
                changed = True
                ops.append((cid, "extension",
                            f"+1 step +1 expected; refs {len(c['spec_ref'])} chars"))
            elif cid in BACKFILL:
                refs, why = BACKFILL[cid]
                if MARKER in (c.get("notes") or ""):
                    ops.append((cid, "refs-backfill", "SKIP already applied"))
                    continue
                c["spec_ref"] = refs
                c["notes"] = (c.get("notes") or "").rstrip()
                c["notes"] = ((c["notes"] + " " if c["notes"] else "")
                              + f"{MARKER} (refs only; no tester-facing change): {why}.")
                assert len(c["spec_ref"]) <= REFS_CAP, (cid, len(c["spec_ref"]))
                assert "," not in c["spec_ref"], cid
                changed = True
                ops.append((cid, "refs-backfill", f"refs {len(refs)} chars"))
        if changed:
            touched[fname] = data

    for fname, data in touched.items():
        path = os.path.join(CASES, fname)
        if not dry:
            shutil.copy2(path, os.path.join(BACKUP, fname))
            with open(path, "w", encoding="utf-8") as fh:
                json.dump(data, fh, indent=1, ensure_ascii=False)
                fh.write("\n")

    for cid, kind, detail in sorted(ops):
        print(f"  {cid:<14}{kind:<16}{detail}")
    print(f"\n{'DRY RUN - ' if dry else ''}files touched: {len(touched)}; "
          f"extensions {sum(1 for o in ops if o[1]=='extension')}; "
          f"refs-backfills {sum(1 for o in ops if o[1]=='refs-backfill')}")
    print("backups ->", BACKUP)


if __name__ == "__main__":
    main()
