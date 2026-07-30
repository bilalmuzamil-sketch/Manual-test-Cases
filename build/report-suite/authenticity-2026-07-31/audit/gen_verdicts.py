#!/usr/bin/env python3
"""PHASE 4 — Rule-28 three-dimension verdicts over ALL 474 active cases.

Dimensions 1 (USEFUL) + 2a (MAKES SENSE) are carried forward for the 458 cases the
full 2026-07-28 audit scored (with the 9 FIX-WORDING verdicts promoted to SENSIBLE —
all 9 were repaired and pushed on 2026-07-28, log
reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md) and are freshly scored
here for the 16 cases authored SINCE that audit.
Dimension 2b (cross-case consistency) is re-run suite-wide by consistency_sweep.py.
Dimension 3 (genuine + layman-runnable) is computed from the current bodies.
"""
import json, glob, csv, re, os, collections

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE = os.path.dirname(os.path.abspath(__file__))
prior = {r["internal_id"]: r for r in csv.DictReader(
    open(os.path.join(ROOT, "quality-audit-2026-07-28", "per-case-verdicts.csv"), encoding="utf-8"))}
idmap = {r["internal_id"]: r["testrail_case_id"] for r in csv.DictReader(
    open(os.path.join(ROOT, "testrail-id-map.csv"), encoding="utf-8"))}
cases = {}
for f in sorted(glob.glob(os.path.join(ROOT, "cases", "cases-*.json"))):
    for c in json.load(open(f, encoding="utf-8")):
        if str(c.get("viu_status", "")).startswith("Retired"):
            continue
        cases[c["id"]] = c
assert len(cases) == 474, len(cases)

# The 9 cases the 2026-07-28 audit marked FIX-WORDING were all repaired and pushed the
# same day; they are SENSIBLE now.
REPAIRED_0728 = {"IV-PERS-04", "PV-EXP-08", "SBC-PERM-04", "SBC-EXP-08", "SBR-NAV-01",
                 "SBR-CALC-08", "SBR-EXP-08", "TU-SUM-02", "TU-LINK-03"}

# Freshly scored: authored AFTER the 2026-07-28 full audit.
NEW = {
 "IV-LOC-06":  ("KEEP", "Per-row Location column for IV: its own position (after Vendor), its own NEVER-'Multiple' rule (one part at one location), not in the column selector. Different contract from the other five reports' Location columns."),
 "PV-FILT-14": ("KEEP", "Per-row Location column for PV: leftmost before Type, and 'Multiple' DOES appear on the merged special-order row - the opposite of IV/WIP. A distinct display contract."),
 "SBC-LOC-04": ("KEEP", "Per-row Location column for SBC: after Date, and 'Multiple' on a customer/asset row whose invoices span locations - a roll-up rule no other report has."),
 "SBR-LOC-05": ("KEEP", "Per-row Location column for SBR: after Status before Inv. Hrs, 'Multiple' on a rep summary row - distinct roll-up level."),
 "TU-LOC-06":  ("KEEP", "Per-row Location column for TU: the Summary row's Location cell is BLANK - a distinct rule none of the others assert."),
 "WIP-FLT-09": ("KEEP", "Per-row Location column for WIP: between VIN and Advisor, never 'Multiple', and exported under the header 'Branch' - a real screen-vs-export naming difference worth a test."),
 "PV-EXP-11":  ("KEEP", "Over-cap export refusal for PV. Per SV-8591 the guard 'takes a count callable/query per report', so each report's cap can fail independently - this is not a near-duplicate of another report's cap case."),
 "TU-EXP-09":  ("KEEP", "Over-cap export refusal for TU (same per-report count-callable argument). Also the coverage Chris's Q3=A ruling created: the TU spec page never carried a cap."),
 "WIP-EXP-10": ("KEEP", "Over-cap export refusal for WIP - the third page Chris's Q3=A ruling brought into the cap, and the one the 2026-07-31 pass found missing."),
 "SBC-EXP-16": ("KEEP", "The four-item Summary/Expanded x PDF/CSV download menu plus the Summary file's exact ten-column order. A menu-shape + column-order contract, not a filter-matrix duplicate."),
 "IV-DATE-09": ("KEEP", "Snapshot rows keep the category/vendor NAMES they were recorded with after a rename or delete. A genuine historical-integrity contract; failure = silently rewritten history."),
 "SBR-CALC-09":("KEEP", "A clock edit after invoicing moves the worked-hours side but must never rewrite billed sell values. The SV-8592 immutability contract; failure = corrupted financial history."),
 "TU-COL-01":  ("KEEP", "The whole TU column selector: Technician not toggleable, five toggles on by default, Location never listed, no reorder, remembered per browser. One case for the control, not one per toggle."),
 "WIP-CALC-10":("KEEP", "A RUNNING clock counts toward Labor Earned and is still capped at the quoted value. A distinct calculation edge no other WIP case drives."),
 "PV-PREC-01": ("KEEP", "Fractional Units Sold survives a full round-trip un-truncated. Closes the one genuine gap in epic SV-8582 (SV-8589's own first named test); failure = the live truncation bug."),
 "PV-PREC-02": ("KEEP", "The QuickBooks journal amount from a fractional movement is exact. SV-8589's own second named test, in a different system from PV-PREC-01; failure = real customer-ledger corruption."),
}
SENSE_NEW = ("SENSIBLE", "Cold-read PASS 2026-07-31: preconditions reachable (seeding named where "
             "needed), steps executable in order, expected follows from the steps, no internal "
             "contradiction, every control traceable to the spec or the driving story, domain "
             "logic sound, pass/fail observable by a non-technical tester.")

IDPAT = re.compile(r"\b(?:SBC|SBR|PV|TU|WIP|IV)-[A-Z]+-\d+\b")
JARGON = re.compile(r"\bS\d+-[A-Z]+\d+|SV-\d+|§|ROLE_[A-Z_]+|HTTP \d{3}|feature[- ]flag", re.I)
rows = []
for iid in sorted(cases):
    c = cases[iid]
    if iid in NEW:
        v, vr = NEW[iid]; s, sr = SENSE_NEW
    else:
        p = prior[iid]
        v, vr = p["verdict"], p["reason"]
        if iid in REPAIRED_0728:
            s = "SENSIBLE"
            sr = ("was FIX-WORDING in the 2026-07-28 audit; repaired and pushed the same day "
                  "(see reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md) - "
                  "original finding: " + p["sense_reason"][:150])
        else:
            s, sr = p["sense_verdict"], p["sense_reason"]
    tester = " ".join([c["title"]] + c["preconditions"] + c["steps"] + c["expected"])
    d3_trace = bool(re.match(r"^SV-\d+", c["spec_ref"])) and bool(re.search(r"\(.+\)", c["spec_ref"]))
    d3_jargon = JARGON.search(tester)
    d3_idleak = IDPAT.search(tester)
    d3 = "PASS" if (d3_trace and not d3_jargon) else "REVIEW"
    rows.append({
        "internal_id": iid,
        "testrail_case_id": idmap.get(iid, ""),
        "testrail_link": ("https://shopview.testrail.io/index.php?/cases/view/%s"
                          % idmap[iid].lstrip("C")) if idmap.get(iid) else "",
        "report": iid.split("-")[0], "section": c["area"], "title": c["title"],
        "title_len": len(c["title"]),
        "d1_useful": v, "d1_reason": vr,
        "d2a_sense": s, "d2a_reason": sr,
        "d3_genuine_layman": d3,
        "d3_traceable": "yes" if d3_trace else "NO",
        "d3_jargon_in_tester_text": d3_jargon.group(0) if d3_jargon else "",
        "d3_internal_id_in_tester_text": d3_idleak.group(0) if d3_idleak else "",
        "refs": c["spec_ref"],
    })
out = os.path.join(HERE, "per-case-verdicts-2026-07-31.csv")
w = csv.DictWriter(open(out, "w", newline="", encoding="utf-8"), fieldnames=list(rows[0].keys()))
w.writeheader(); w.writerows(rows)
print("rows:", len(rows))
print("D1:", collections.Counter(r["d1_useful"] for r in rows))
print("D2a:", collections.Counter(r["d2a_sense"] for r in rows))
print("D3:", collections.Counter(r["d3_genuine_layman"] for r in rows))
print("D3 not traceable:", [r["internal_id"] for r in rows if r["d3_traceable"] == "NO"])
print("D3 jargon hits:", [(r["internal_id"], r["d3_jargon_in_tester_text"]) for r in rows if r["d3_jargon_in_tester_text"]])
print("internal-id mentions (stripped by clean()/gen_import on push):",
      [(r["internal_id"], r["d3_internal_id_in_tester_text"]) for r in rows if r["d3_internal_id_in_tester_text"]])
print("KEEP-but-NONSENSE:", [r["internal_id"] for r in rows if r["d1_useful"] in ("KEEP","WEAK-KEEP") and r["d2a_sense"]=="NONSENSE"])
print("titles > 80:", sum(1 for r in rows if r["title_len"] > 80))
