#!/usr/bin/env python3
"""Which impacted cases ACTUALLY assert a superseded expectation?

A case is "impacted" only because it CITES an anchor whose text moved. That is not the same
as being wrong: on Inventory Value most citing cases had already been rewritten for v10 and
merely mention the old behaviour in a negative assertion or a tester note. Sending a tester
to re-check those would be a false alarm.

So this measures CONTENT, not citation:
  - for each changed anchor, difflib the HELD definition against the LIVE one and keep the
    REMOVED word-runs (>= MINRUN words) — wording the spec no longer contains;
  - a citing case is STALE only if its own text still contains one of those removed runs;
  - a case containing the removed run AND the replacement run is treated as CURRENT: that is
    the shape of a deliberate negative assertion ("a date range is NOT offered") or of the
    "an earlier version of this report offered…" tester note.

Output: reports/<CODE>-stale.json + a printed count. NO TESTRAIL WRITE (Rule 6).
"""
import difflib, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from verify import (flatten, anchor_texts, live_body, held_body, definition, R, OUT, DATA)

MINRUN = 1          # short edits are the decisive ones ("date-range control" -> "as of" date
                    # control" is a 2-word replace); chance matches are killed instead by the
                    # much stronger filter below: the run must be absent from the ENTIRE live
                    # spec body, so a case containing it asserts wording the spec nowhere has.
STOP = re.compile(r"^[\W\d]+$")


def runs(a_words, b_words, kind):
    """Word-runs present in a but not in b (kind='removed') or vice versa."""
    out = []
    sm = difflib.SequenceMatcher(a=a_words, b=b_words, autojunk=False)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag in ("replace", "delete") and kind == "removed" and i2 - i1 >= MINRUN:
            out.append(" ".join(a_words[i1:i2]))
        if tag in ("replace", "insert") and kind == "added" and j2 - j1 >= MINRUN:
            out.append(" ".join(b_words[j1:j2]))
    return [r for r in out if not STOP.match(r)]


def norm(t):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", t or "")).strip()


def main():
    cases = {("C%d" % c["id"]): c for c in json.load(open(os.path.join(DATA, "live-cases.json")))}
    allres = {}
    for code in (sys.argv[1:] or list(R)):
        slug, hslug, hver = R[code]
        lx, lver, _ = live_body(slug)
        live_flat_l = flatten(lx).lower()
        la, ha = anchor_texts(flatten(lx)), anchor_texts(flatten(held_body(hslug, hver)))
        res = json.load(open(os.path.join(OUT, f"{code}.json")))

        stale, current, unresolved = {}, [], {}
        for a in res["changed"]:
            h, l = definition(ha, a) or "", definition(la, a) or ""
            rem = runs(h.split(), l.split(), "removed")
            add = runs(h.split(), l.split(), "added")
            # Keep runs that carry a content word. The filter is scoped to THIS anchor's live
            # definition, NOT to the whole page: the superseded phrase usually survives on the
            # page inside a historical note ("an earlier version offered a date-range control"),
            # and a whole-page filter therefore silently cleared C30597, whose step still drives
            # the retired control. Stale-vs-current is decided below by whether the case ALSO
            # states the replacement wording.
            rem = [r for r in rem
                   if r.lower() not in (l or "").lower()
                   and any(len(w) >= 5 for w in re.findall(r"[A-Za-z]+", r))]
            for cid in res["cites"].get(a, []):
                c = cases[cid]
                txt = norm(" ".join([c["title"], c["pre"] or "", c["steps"] or "", c["expected"] or ""]))
                hit = [r for r in rem if r.lower() in txt.lower()]
                if not hit:
                    continue
                has_new = any(r.lower() in txt.lower() for r in add)
                rec = {"anchor": a, "stale_wording": hit[:3],
                       "live_wording": (l[:400] or None), "title": c["title"]}
                if has_new:
                    unresolved.setdefault(cid, []).append(rec)   # states both -> negative assertion
                else:
                    stale.setdefault(cid, []).append(rec)
        impacted = set(res["impacted_cids"])
        current = sorted(impacted - set(stale) )
        out = {"report": code, "live_version": lver, "held_version": hver,
               "impacted": len(impacted), "stale": stale,
               "stale_cids": sorted(stale), "false_alarm_cids": current,
               "states_both_cids": sorted(unresolved)}
        json.dump(out, open(os.path.join(OUT, f"{code}-stale.json"), "w"), indent=1)
        allres[code] = {"impacted": len(impacted), "stale": len(stale),
                        "false_alarm": len(current), "states_both": len(unresolved)}
        print(f"{code}: impacted={len(impacted)}  TRULY STALE={len(stale)} {sorted(stale)}")
        print(f"     states-both(ok, negative assertion)={sorted(unresolved)}")
    json.dump(allres, open(os.path.join(OUT, "STALE-SUMMARY.json"), "w"), indent=1)


if __name__ == "__main__":
    main()
