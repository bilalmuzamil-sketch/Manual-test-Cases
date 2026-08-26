#!/usr/bin/env python3
"""Report Suite source verification, 2026-08-26 — HELD body vs LIVE Confluence body,
then a Rule-43 per-requirement coverage verdict and the tester-impact list.

Method is inherited verbatim from source-sync-2026-08-13/tools/spec_compare.py (Rule 27 —
reuse the recorded recipe): the requirement unit is the spec's own anchor (S<n>-R<n> etc.),
its text is the span from the anchor to the NEXT anchor, and EVERY occurrence is kept
because an anchor is often cross-referenced before it is defined (a `setdefault` here
produced a FALSE ALL-CLEAR on SBR in August).

Nothing in this file reads a spec body into a session's context: bodies go from file to
file and only COUNTS and anchor IDs are printed.

NO TESTRAIL WRITE. The output is a candidate update list that stops at the button (Rule 6).
"""
import html, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(HERE, "..")
HELD = os.path.join(HERE, "..", "..", "source-sync-2026-08-13", "evidence")
SPECS = os.path.join(BASE, "specs")
DATA = os.path.join(BASE, "data")
OUT = os.path.join(BASE, "reports")

# report code -> (live json slug, held xml slug, held version)
R = {
    "IV":  ("inventory-value",          "Inventory-Value",          6),
    "PV":  ("parts-velocity",           "Parts-Velocity",           8),
    "WIP": ("wip",                      "Work-In-Progress",        15),
    "SBR": ("sales-by-representative",  "Sales-By-Representative", 22),
    "SBC": ("sales-by-customer",        "Sales-By-Customer",       20),
    "TU":  ("technician-utilization",   "Technician-Utilization",   9),
}
ANCHOR = re.compile(r"\bS\d+-(?:R|E|N|Q)\d+[a-z]?\b")


def flatten(xml):
    """Storage XML -> plain text. A tag becomes a SPACE so no word is glued to its
    neighbour across a tag boundary."""
    t = re.sub(r"<[^>]+>", " ", xml)
    t = html.unescape(t)
    return re.sub(r"\s+", " ", t).strip()


def anchor_texts(flat):
    hits = list(ANCHOR.finditer(flat))
    out = {}
    for i, m in enumerate(hits):
        end = hits[i + 1].start() if i + 1 < len(hits) else len(flat)
        out.setdefault(m.group(0), []).append(flat[m.start():end].strip())
    return out


def definition(d, a):
    """The DEFINITION occurrence is the one written "ANCHOR: ..." — a cross-reference is
    written "ANCHOR," or "ANCHOR)". This distinction MATTERS: comparing the whole occurrence
    list marks a requirement CHANGED merely because a new cross-reference to it was added
    elsewhere on the page, which would send a tester to re-check requirements whose wording
    never moved (5 false positives on Inventory Value alone). Comparing only the longest
    occurrence is equally wrong — a span runs to the NEXT anchor, so its length is an
    accident of layout, and it mis-cleared S5-R5, whose text really had been rewritten."""
    for t in d.get(a, []):
        if re.match(re.escape(a) + r"\s*:", t):
            return t
    return None


def live_body(slug):
    d = json.load(open(os.path.join(SPECS, slug + ".json")))
    return d["body"]["storage"]["value"], d["version"]["number"], d["version"]["createdAt"][:10]


def held_body(slug, ver):
    p = os.path.join(HELD, f"{slug}-v{ver}.xml")
    return open(p).read() if os.path.exists(p) else None


def main():
    cases = json.load(open(os.path.join(DATA, "live-cases.json")))
    pins = {r["cid"]: r for r in json.load(open(os.path.join(DATA, "case-version-pins.json")))}
    RPT = {"Sales By Representative Report": "SBR", "Sales By Customer Report": "SBC",
           "Work In Progress": "WIP", "Parts Velocity Report": "PV",
           "Inventory Value": "IV", "Technician Utilization": "TU"}
    by_report = {k: [] for k in R}
    for c in cases:
        parts = c["section"].split(" > ")
        code = RPT.get(parts[1] if len(parts) > 1 else "", None)
        cid = "C%d" % c["id"]
        if code and cid in pins:
            c["cid"] = cid
            c["code"] = code
            by_report[code].append(c)

    os.makedirs(OUT, exist_ok=True)
    summary = {}
    only = sys.argv[1:] or list(R)
    for code in only:
        slug, hslug, hver = R[code]
        lv_xml, lver, lmod = live_body(slug)
        live_a = anchor_texts(flatten(lv_xml))
        hd = held_body(hslug, hver)
        diffable = hd is not None
        held_a = anchor_texts(flatten(hd)) if diffable else {}

        gone = sorted(set(held_a) - set(live_a)) if diffable else []
        added = sorted(set(live_a) - set(held_a)) if diffable else sorted(live_a)
        both = sorted(set(held_a) & set(live_a)) if diffable else []
        changed = [a for a in both if definition(held_a, a) != definition(live_a, a)]
        xref_only = [a for a in both
                     if definition(held_a, a) == definition(live_a, a) and held_a[a] != live_a[a]]
        unchanged = [a for a in both if a not in changed]

        # anchor -> citing C-ids (an anchor is cited in refs and/or the provenance line)
        cites = {a: [] for a in set(live_a) | set(held_a)}
        for c in by_report[code]:
            txt = (c["refs"] or "") + "\n" + (c["expected"] or "")
            for a in set(ANCHOR.findall(txt)):
                cites.setdefault(a, []).append(c["cid"])
        for a in cites:
            cites[a].sort()

        # Rule 43 verdicts, per LIVE requirement
        verdict = {}
        for a in sorted(live_a):
            n = len(cites.get(a, []))
            if n == 0:
                verdict[a] = "NOT COVERED"
            elif a in changed:
                verdict[a] = "SUPERSEDED"
            elif a in added:
                verdict[a] = "COVERED"     # new anchor already cited by a case
            else:
                verdict[a] = "COVERED"
        for a in gone:                      # requirement no longer in the live spec
            if cites.get(a):
                verdict[a] = "SUPERSEDED (requirement removed from spec)"

        # tester impact: which C-ids assert something the live spec no longer says
        impacted = sorted({cid for a in changed + gone for cid in cites.get(a, [])})
        pin_wrong = sorted(c["cid"] for c in by_report[code]
                           if str(pins[c["cid"]]["cited"]) != str(lver))
        safe = sorted(c["cid"] for c in by_report[code] if c["cid"] not in impacted)

        res = {
            "report": code, "live_version": lver, "live_lastmod": lmod,
            "held_version": hver if diffable else None, "diffable": diffable,
            "cases": len(by_report[code]),
            "anchors_live": len(live_a), "anchors_held": len(held_a),
            "unchanged": unchanged, "changed": changed, "xref_only": xref_only,
            "added": added, "gone": gone,
            "verdict_counts": {v: sum(1 for x in verdict.values() if x == v)
                               for v in sorted(set(verdict.values()))},
            "verdicts": verdict,
            "cites": {a: cites.get(a, []) for a in sorted(set(live_a) | set(gone))},
            "impacted_cids": impacted,
            "mispinned_cids": pin_wrong,
            "safe_cids": safe,
        }
        json.dump(res, open(os.path.join(OUT, f"{code}.json"), "w"), indent=1)
        summary[code] = {k: res[k] for k in
                         ("live_version", "live_lastmod", "held_version", "diffable",
                          "cases", "anchors_live", "anchors_held", "verdict_counts")}
        summary[code].update({"changed": len(changed), "xref_only": len(xref_only),
                              "added": len(added), "gone": len(gone),
                              "impacted": len(impacted), "mispinned": len(pin_wrong),
                              "safe": len(safe)})
        print(f"{code}: live v{lver} ({lmod}) held v{hver if diffable else '—'} "
              f"cases={len(by_report[code])} anchors live={len(live_a)} held={len(held_a)} "
              f"| changed={len(changed)} added={len(added)} gone={len(gone)} "
              f"| impacted={len(impacted)} mispinned={len(pin_wrong)}")
        print(f"    verdicts: {res['verdict_counts']}")

    p = os.path.join(OUT, "SUMMARY.json")
    old = json.load(open(p)) if os.path.exists(p) else {}
    old.update(summary)
    json.dump(old, open(p, "w"), indent=1)


if __name__ == "__main__":
    main()
