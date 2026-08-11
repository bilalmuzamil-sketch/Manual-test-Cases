#!/usr/bin/env python3
"""Plan the two gaps.

GAP 1 — add the live version pin to spec citations that carry none.
GAP 2 — normalise the Technician Utilization pin DATE.

The pin is inserted in the suite's OWN house style, learned from the 442 citations
that already carry one:  "<RPT> spec v<N> <YYYY-MM-DD> "  immediately after
"<RPT> spec ".  Nothing else in the entry moves: not the ticket key, not an
anchor, not the descriptive text -- except where an entry would exceed the
248-CHARACTER limit, where descriptive text alone is condensed.

Rule 42's mechanism is the VERSION INTEGER.  Two of the 42 already carry one in a
variant date form ("v7 read 2026-08-11"); they are normalised to house style, not
"added", and that distinction is reported rather than blurred.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
EV = os.path.join(HERE, "..", "evidence")
LOG = os.path.join(HERE, "..", "logs")
LIMIT = 248

SLUG = {"SBC": "Sales-By-Customer", "SBR": "Sales-By-Representative",
        "PV": "Parts-Velocity", "TU": "Technician-Utilization",
        "WIP": "Work-In-Progress", "IV": "Inventory-Value"}

# Established LIVE this pass from the Confluence version API (evidence/*-meta.json).
# The DATE is the UTC calendar date of the version's `when` timestamp -- see
# SOURCE-CURRENCY.md for why UTC is the convention and TU was the lone outlier.
LIVE = {"SBC": ("17", "2026-08-10"), "SBR": ("18", "2026-08-07"),
        "PV": ("6", "2026-08-07"), "TU": ("7", "2026-08-07"),
        "WIP": ("11", "2026-08-10"), "IV": ("5", "2026-08-07")}

RPT = r"(SBC|SBR|PV|TU|WIP|IV)"
PINNED = re.compile(RPT + r"\s+spec\s+v\d+\s+\d{4}-\d{2}-\d{2}")
VARIANT = re.compile(RPT + r"\s+spec\s+v(\d+)\s+read\s+(\d{4}-\d{2}-\d{2})")
# A CITATION points at a place in the document: an optional "Story N" locator
# followed by a real anchor, a section sign, or a named subsection.  Anything
# else after "<RPT> spec " is PROSE ABOUT the document -- "his SBR spec edit is
# pending", "the SBC spec carries no error-state story", "WIP spec Story 11 is
# silent on re-runs" -- and pinning a version into those would turn three true
# sentences into false ones.  They are matched here only to be EXCLUDED.
BARE = re.compile(RPT + r"\s+spec\s+(?!v\d)"
                  r"(?=(?:Story\s+\d+\s+)?(?:S\d+-[RNE]\d+|§\d+|Prerequisites))")
ANCHOR = re.compile(r"\b(S\d+-[RNE]\d+[a-z]?)\b")

# Condensations applied ONLY where the pin would overflow 248 characters.
# Every one removes REDUNDANT text and NOTHING else -- no ticket key, no anchor,
# no version, no source, no meaning.  Two kinds only:
#   (a) "Story N " immediately before an anchor of that same story.  The anchor
#       already encodes the story number (S4-R5 IS Story 4), and sibling cases in
#       the same report already cite without the locator, so nothing is lost.
#   (b) filler words -- "msg", a stray semicolon, a definite article -- where the
#       same clause is written without them elsewhere in the suite.
# Each is justified case by case in OVER-LIMIT.md.
CONDENSE = {
    30111: [("Story 4 ", ""),                       # redundant: S4-R5/S4-R6
            ("per Chris Ward msg ", "per Chris Ward "),   # C30215 form
            ("video P10; [ruling", "video P10 [ruling")],  # C30215 form
    30134: [("by Chris Ward msg ", "by Chris Ward ")],     # C30470 form
    30215: [("Story 21 ", "")],                     # redundant: S21-R3/R4/R5
    30327: [("RESCOPED 2026-08-03: the old ", "RESCOPED 2026-08-03: ")],
    30516: [("Story 9 ", "")],                      # redundant: S9-E1
}


def live_anchors():
    out = {}
    for k, s in SLUG.items():
        body = open(os.path.join(EV, f"{s}-v{LIVE[k][0]}.xml")).read()
        out[k] = set(ANCHOR.findall(body))
    return out


def build():
    cases = json.load(open(os.path.join(HERE, "..", "snapshots", "cases-PRE.json")))
    ours = {c["id"]: c for c in cases if c["created_by"] == 3}
    anchors = live_anchors()
    plan, skipped = [], []

    for cid, c in sorted(ours.items()):
        old = c.get("refs") or ""
        new = old
        moves = []

        # (1) normalise the variant "v<N> read <date>" form to house style
        for m in list(VARIANT.finditer(new)):
            rpt, ver, rd = m.group(1), m.group(2), m.group(3)
            lv, ld = LIVE[rpt]
            frm = m.group(0)
            to = f"{rpt} spec v{lv} {ld}"
            new = new.replace(frm, to)
            moves.append({"kind": "normalise-variant", "report": rpt,
                          "from": frm, "to": to,
                          "version_was": ver, "version_now": lv, "read_date": rd})

        # (2) add a pin where the citation has none
        for m in list(BARE.finditer(new)):
            rpt = m.group(1)
            lv, ld = LIVE[rpt]
            frm = m.group(0)
            to = f"{rpt} spec v{lv} {ld} "
            new = new.replace(frm, to, 1)
            moves.append({"kind": "add-pin", "report": rpt,
                          "from": frm.strip(), "to": to.strip(),
                          "version_now": lv, "date": ld, "cost": len(to) - len(frm)})

        # (3) TU date normalisation on cases already pinned v7 with the old date
        if "TU spec v7 2026-08-06" in new:
            new = new.replace("TU spec v7 2026-08-06", "TU spec v7 2026-08-07")
            moves.append({"kind": "tu-date", "report": "TU",
                          "from": "TU spec v7 2026-08-06", "to": "TU spec v7 2026-08-07"})

        if new == old:
            continue

        condensed = None
        if len(new) > LIMIT:
            if cid in CONDENSE:
                before_c, edits = new, []
                for frm, to in CONDENSE[cid]:
                    if frm not in new:
                        raise SystemExit(f"C{cid}: condensation text not found: {frm!r}")
                    new = new.replace(frm, to, 1)
                    edits.append({"from": frm, "to": to, "saved": len(frm) - len(to)})
                condensed = {"edits": edits,
                             "saved_total": len(before_c) - len(new),
                             "over_by_before": len(before_c) - LIMIT}
                if len(new) > LIMIT:
                    skipped.append({"cid": cid, "old": old, "would_be": new,
                                    "chars": len(new), "over_by": len(new) - LIMIT,
                                    "reason": "still over 248 after condensing"})
                    continue
            else:
                skipped.append({"cid": cid, "old": old, "would_be": new,
                                "chars": len(new), "over_by": len(new) - LIMIT,
                                "reason": "no condensation authored"})
                continue

        if "," in new:
            raise SystemExit(f"C{cid}: comma in refs -> TestRail would split it")

        # anchors cited must exist in the live body now being named
        cited = set(ANCHOR.findall(new))
        rpts = {mv["report"] for mv in moves}
        orphan = sorted(cited - set().union(*[anchors[r] for r in rpts])) if rpts else []

        plan.append({
            "cid": cid, "title": c["title"], "section_id": c["section_id"],
            "old": old, "new": new,
            "old_chars": len(old), "new_chars": len(new),
            "old_bytes": len(old.encode()), "new_bytes": len(new.encode()),
            "headroom_after": LIMIT - len(new),
            "moves": moves, "condensed": condensed,
            "anchors_cited": sorted(cited),
            "anchors_absent_from_live": orphan,
            "reports": sorted(rpts),
        })

    json.dump(plan, open(os.path.join(LOG, "plan.json"), "w"), indent=1)
    json.dump(skipped, open(os.path.join(LOG, "over-limit.json"), "w"), indent=1)

    kinds = {}
    for p in plan:
        for mv in p["moves"]:
            kinds[mv["kind"]] = kinds.get(mv["kind"], 0) + 1
    print(f"planned {len(plan)} cases | skipped-for-length {len(skipped)}")
    print("  move kinds:", kinds)
    print("  orphan anchors:", sum(1 for p in plan if p["anchors_absent_from_live"]))
    over = [p for p in plan if p["new_chars"] > LIMIT]
    print("  over limit in plan (must be 0):", len(over))
    tight = sorted(plan, key=lambda p: p["headroom_after"])[:8]
    print("  tightest after write:")
    for p in tight:
        print(f"    C{p['cid']} {p['new_chars']:>3} chars, {p['headroom_after']:>3} spare")
    return plan, skipped


if __name__ == "__main__":
    build()
