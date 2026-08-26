#!/usr/bin/env python3
"""Diff each case against the spec version IT WAS ACTUALLY WRITTEN AGAINST.

Why this exists: our newest export on disk is often OLDER than the version the cases cite
(WIP: we hold v15, the cases cite v21/v22/v24, live is v28). A held-vs-live diff therefore
measures a stretch of history the cases never lived through — it reports changes that were
already absorbed and misses the ones that were not. So the pinned version is fetched from
Confluence as a historical revision and each PIN GROUP is diffed against live separately.

Stale test is the same as stale_check.py: the case still contains wording the pinned
definition had and the live definition does not, and does not contain the replacement.

NO TESTRAIL WRITE (Rule 6).
"""
import difflib, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from verify import flatten, anchor_texts, live_body, definition, R, OUT, DATA, SPECS
from stale_check import runs, norm

GROUPS = {"WIP": [21, 22, 24], "PV": [10]}


def pinned_body(slug, v):
    d = json.load(open(os.path.join(SPECS, f"{slug}-v{v}.json")))
    assert d["version"]["number"] == v, f"{slug} v{v}: got v{d['version']['number']}"
    return d["body"]["storage"]["value"]


def main():
    cases = {("C%d" % c["id"]): c for c in json.load(open(os.path.join(DATA, "live-cases.json")))}
    pins = {r["cid"]: r for r in json.load(open(os.path.join(DATA, "case-version-pins.json")))}
    out_all = {}
    for code, vers in GROUPS.items():
        slug = R[code][0]
        lx, lver, _ = live_body(slug)
        la = anchor_texts(flatten(lx))
        res = json.load(open(os.path.join(OUT, f"{code}.json")))
        report = {"report": code, "live_version": lver, "groups": {}}
        for v in vers:
            pa = anchor_texts(flatten(pinned_body(slug, v)))
            group = [cid for cid, p in pins.items()
                     if p["report"] == code and str(p["cited"]) == str(v)]
            both = set(pa) & set(la)
            changed = [a for a in sorted(both) if definition(pa, a) != definition(la, a)]
            gone = sorted(set(pa) - set(la))
            added = sorted(set(la) - set(pa))
            stale = {}
            for a in changed:
                h, l = definition(pa, a) or "", definition(la, a) or ""
                rem = [r for r in runs(h.split(), l.split(), "removed")
                       if r.lower() not in l.lower()
                       and any(len(w) >= 5 for w in re.findall(r"[A-Za-z]+", r))]
                add = runs(h.split(), l.split(), "added")
                for cid in res["cites"].get(a, []):
                    if cid not in group:
                        continue
                    c = cases[cid]
                    txt = norm(" ".join([c["title"], c["pre"] or "", c["steps"] or "",
                                         c["expected"] or ""])).lower()
                    hit = [r for r in rem if r.lower() in txt]
                    if hit and not any(r.lower() in txt for r in add):
                        stale.setdefault(cid, []).append(
                            {"anchor": a, "case_still_says": hit[:3], "live_says": l[:300],
                             "title": c["title"]})
            report["groups"][f"v{v}"] = {
                "cases_pinned_here": len(group), "anchors_pinned": len(pa),
                "changed_vs_live": len(changed), "gone": gone, "added_in_live": len(added),
                "stale_cids": sorted(stale), "stale": stale}
            print(f"{code} pin v{v} -> live v{lver}: cases={len(group)} "
                  f"anchors={len(pa)} changed={len(changed)} added={len(added)} gone={len(gone)} "
                  f"| STALE={len(stale)} {sorted(stale)}")
        json.dump(report, open(os.path.join(OUT, f"{code}-pinned.json"), "w"), indent=1)
        out_all[code] = report["groups"]
    json.dump(out_all, open(os.path.join(OUT, "PINNED-SUMMARY.json"), "w"), indent=1)


if __name__ == "__main__":
    main()
