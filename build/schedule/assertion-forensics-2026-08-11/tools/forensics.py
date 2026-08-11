#!/usr/bin/env python3
"""Rule-41 / Rule-57 assertion forensics over the Schedule suite.

READ-ONLY. Diffs the EXPECTED-RESULT ASSERTION BODY of every Schedule case across
every committed live snapshot, EXCLUDING the Rule-54 provenance line, the Rule-61
automation marker and pure formatting - because those move legitimately on every
pass and would otherwise drown the signal.

Usage:  python3 forensics.py            # writes evidence/*.json
"""
import json
import os
import re
import difflib
import datetime
import hashlib

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
OUT = os.path.join(ROOT, "build/schedule/assertion-forensics-2026-08-11/evidence")

# --- the snapshot series, chronological, each with the STATE it represents ------
SERIES = [
    ("T0", "2026-07-30", "bodies as at the pre-Rule-54 retrofit (before the first live VIU)",
     "build/schedule/provenance-2026-08-04/snapshots/pre-write-live-cases-4254.json"),
    ("T1", "2026-08-04", "after the first live VIU + the recovery pass",
     "build/schedule/recovery-2026-08-04/live-pull-after-recovery.json"),
    ("T2", "2026-08-05 14:10Z", "after the final-VIU / expected-behaviour repair pass",
     "build/schedule/provenance-reword-2026-08-05/snapshots/PRE-cases.json"),
    ("T3", "2026-08-05 17:42Z", "after the provenance re-word + the 3 new coverage-gap cases",
     "build/schedule/full-viu-2026-08-05/snapshots/PRE-cases-168.json"),
    ("T4", "2026-08-06 07:21Z", "after the full-VIU write of all 168",
     "build/schedule/full-viu-2026-08-05/snapshots/POST-WRITE-168-2026-08-06.json"),
    ("T5", "2026-08-11 09:39Z", "after the 2026-08-10 source-accuracy rewrite and the 6 panel cases",
     "build/schedule/c30041-latest-wins-2026-08-11/evidence/schedule-all-cases.json"),
    ("T6", "2026-08-11 10:19Z", "after the C30041 latest-wins trim",
     "build/schedule/build-verify-2026-08-11/evidence/cases-174-START.json"),
    ("T7", "2026-08-11 12:00Z", "before the read-on-date sweep",
     "build/schedule/read-dates-2026-08-11/snapshots/cases-PRE.json"),
    ("T8", "2026-08-11 13:39Z", "LIVE, read by this pass",
     "/tmp/testrail/SCHED-LIVE-forensics-2026-08-11.json"),
]

# ---------------------------------------------------------------- normalisation
PROV_PAT = re.compile(
    r"(this is the expected behaviour as per|this is the expected behavior as per|"
    r"last checked against build|^automation:\s|read on \d|, read on |"
    r"^\s*-{3,}\s*$|^\s*<hr\s*/?>\s*$)", re.I)


def strip_html(s):
    s = s.replace("\r\n", "\n").replace("\r", "\n")
    s = re.sub(r"<\s*br\s*/?>", "\n", s, flags=re.I)
    s = re.sub(r"<\s*/\s*(li|p|ol|ul|div)\s*>", "\n", s, flags=re.I)
    s = re.sub(r"<\s*li\s*>", "\n", s, flags=re.I)
    s = re.sub(r"<[^>]+>", "", s)
    s = s.replace("&nbsp;", " ").replace("&amp;", "&").replace("&lt;", "<")
    s = s.replace("&gt;", ">").replace("&quot;", '"').replace("&#39;", "'")
    return s


LI = re.compile(r"<\s*li\s*>(.*?)<\s*/\s*li\s*>", re.I | re.S)


def body(expected):
    """Return (assertions, notes) with provenance / marker / formatting removed.

    RAW-MARKUP CASES: 16-20 Schedule cases stored their expected results as raw
    <ol><li> HTML that TestRail showed literally to the tester. Those <li> items
    carry no leading "1." digits, so a naive reader files them as prose and every
    later conversion to plain numbered text then reads as "assertions appeared from
    nothing" - a pure formatting artefact, and exactly the noise this pass must
    exclude. So <li> items are numbered here before anything else, making a
    raw-markup body directly comparable with its plain-text successor.
    """
    if not expected:
        return [], []
    if LI.search(expected):
        items = [strip_html(m.group(1)).strip() for m in LI.finditer(expected)]
        rest = LI.sub("\n", expected)
        numbered = "\n".join(f"{i+1}. {t}" for i, t in enumerate(items) if t.strip())
        expected = numbered + "\n" + strip_html(rest)
    txt = strip_html(expected)
    # cut everything from the provenance separator onward when what follows is provenance
    lines = [l.rstrip() for l in txt.split("\n")]
    kept = []
    for l in lines:
        if not l.strip():
            continue
        if PROV_PAT.search(l.strip()):
            continue
        kept.append(l.strip())
    asserts, notes = [], []
    for l in kept:
        m = re.match(r"^(\d+)[.)]\s*(.*)$", l)
        if m:
            asserts.append(norm(m.group(2)))
        else:
            notes.append(norm(l))
    return [a for a in asserts if a], [n for n in notes if n]


def norm(s):
    s = s.replace("’", "'").replace("‘", "'")
    s = s.replace("“", '"').replace("”", '"')
    s = s.replace("–", "-").replace("—", "-").replace(" ", " ")
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def load(path):
    p = path if path.startswith("/") else os.path.join(ROOT, path)
    d = json.load(open(p))
    cs = d if isinstance(d, list) else (list(d.values()) if isinstance(d, dict) else [])
    if isinstance(d, dict) and "cases" in d:
        cs = d["cases"]
    out = {}
    for c in cs:
        if isinstance(c, dict) and "custom_expected" in c and c.get("id"):
            out[int(c["id"])] = c
    return out


def main():
    os.makedirs(OUT, exist_ok=True)
    snaps = []
    for tag, when, why, path in SERIES:
        cs = load(path)
        snaps.append(dict(tag=tag, when=when, why=why, path=path, cases=cs))
        print(f"{tag} {when:22s} n={len(cs):4d}  {path}")

    live = snaps[-1]["cases"]
    rows = {}
    for cid, c in live.items():
        a, n = body(c["custom_expected"])
        hist = []
        for s in snaps:
            sc = s["cases"].get(cid)
            if sc is None:
                hist.append(dict(tag=s["tag"], when=s["when"], present=False))
                continue
            sa, sn = body(sc["custom_expected"])
            hist.append(dict(tag=s["tag"], when=s["when"], present=True,
                             asserts=sa, notes=sn,
                             ahash=hashlib.sha256("\u241f".join(sa).encode()).hexdigest()[:12],
                             nhash=hashlib.sha256("\u241f".join(sn).encode()).hexdigest()[:12],
                             title=sc.get("title", ""), refs=sc.get("refs", "")))
        # transitions where the ASSERTION set moved
        trans = []
        prev = None
        for h in hist:
            if not h["present"]:
                continue
            if prev is not None and h["ahash"] != prev["ahash"]:
                trans.append(dict(frm=prev["tag"], to=h["tag"],
                                  frm_when=prev["when"], to_when=h["when"],
                                  before=prev["asserts"], after=h["asserts"]))
            prev = h
        # transitions where only the NOTES moved
        ntrans = []
        prev = None
        for h in hist:
            if not h["present"]:
                continue
            if prev is not None and h["nhash"] != prev["nhash"]:
                ntrans.append(dict(frm=prev["tag"], to=h["tag"],
                                   before=prev["notes"], after=h["notes"]))
            prev = h
        first = next(h["tag"] for h in hist if h["present"])
        rows[cid] = dict(cid=cid, title=c.get("title", ""), refs=c.get("refs", ""),
                         section_id=c.get("section_id"),
                         first_seen=first, n_assert_changes=len(trans),
                         n_note_changes=len(ntrans),
                         assert_transitions=trans, note_transitions=ntrans,
                         live_asserts=a, live_notes=n)
    json.dump(rows, open(os.path.join(OUT, "assertion-history.json"), "w"), indent=1)

    changed = {k: v for k, v in rows.items() if v["n_assert_changes"]}
    print(f"\ncases live                        : {len(rows)}")
    print(f"cases whose ASSERTION SET never moved: {len(rows)-len(changed)}")
    print(f"cases with >=1 assertion change   : {len(changed)}")
    from collections import Counter
    cnt = Counter()
    for v in rows.values():
        for t in v["assert_transitions"]:
            cnt[(t["frm"], t["to"])] += 1
    print("\nassertion changes per transition:")
    for k, n in sorted(cnt.items()):
        print(f"  {k[0]} -> {k[1]} : {n}")
    print("\nfirst-seen distribution:", Counter(v["first_seen"] for v in rows.values()))


if __name__ == "__main__":
    main()
