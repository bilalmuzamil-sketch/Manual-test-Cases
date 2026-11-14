"""Invariant of the live merge: every line the outside editors added (in live, not in our 10 Nov read-back) is still in the merged body, except
where a named rule replaced it (R1 From line, R2 build line, R3 marker, R4 quote, R5 listed tester line); and every line the merged body adds
over live is a line of the v13 library body (ours) or an R1 From line. Writes merge-invariant.json."""
import json, csv, re
from collections import Counter
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; W = f"{B}/currency-2026-11-14"
M = json.load(open(f"{W}/proposals-v13-on-live.json")); P = json.load(open(f"{B}/authoring/proposals.json"))
LIVE = {c["id"]: c for c in json.load(open(f"{W}/live-before/live-2026-11-14.json"))["cases"]}
SPLIT = re.compile(r"(</p>|</li>|<ul>|</ul>|<ol>|</ol>)")
L = lambda s: [x for x in SPLIT.sub(r"\1\n", s or "").split("\n") if x]
def kind(l):
    if l.startswith("<p>From: "): return "R1 from"
    if l.startswith(("<p>Not yet checked", "<p>Last checked", "<p>Partly checked")): return "R2 build"
    if l.startswith("<p>AUTOMATION:"): return "R3 marker"
    if re.match(r"<li><strong>[^<]*:</strong>", l): return "R4 quote"
    return "R5 tester"
out = {}; tally = Counter()
for k, v in M.items():
    cid = v["case"]; base = json.load(open(f"{B}/currency-2026-11-10/applied/C{cid}-after.json")); lv = LIVE[cid]
    lost, alien = [], []
    for f in ["title", "custom_preconds", "custom_steps", "custom_expected"]:
        bl, tl, ml, ol = set(L(base.get(f))), L(lv.get(f)), set(L(v["fields"].get(f))), set(L(P[k]["fields"].get(f)))
        if f == "title": bl, tl, ml, ol = {base.get(f)}, [lv.get(f)], {v["fields"].get(f)}, {P[k]["fields"].get(f)}
        for x in tl:
            if x not in bl and x not in ml: lost.append((f, kind(x), x[:160]))
        for x in ml:
            if x not in set(tl) and x not in ol and kind(x) != "R1 from": alien.append((f, kind(x), x[:160]))
    for _, kd, _ in lost: tally["their line replaced: " + kd] += 1
    tally["alien lines"] += len(alien)
    if lost or alien: out[k] = {"case": cid, "their_lines_replaced": lost, "lines_not_from_ours": alien}
json.dump(out, open(f"{W}/merge-invariant.json", "w"), indent=1, ensure_ascii=False)
print(dict(tally)); print("cases with a replaced outside line:", sorted(out))
for k, v in out.items():
    for x in v["their_lines_replaced"]:
        if x[1] in ("R5 tester",): print("  R5", k, x)
    for x in v["lines_not_from_ours"]: print("  ALIEN", k, x)
