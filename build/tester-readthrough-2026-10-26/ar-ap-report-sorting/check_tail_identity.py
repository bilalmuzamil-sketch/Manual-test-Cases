#!/usr/bin/env python3
"""Tester read-through, 26 Oct 2026 (A/R and A/P Report Sorting): for every remaining case, the Expected Result from the quotes block
onward ("<p><strong>Exact quotes from the source" to the end: the quotes with their From: lines, the build line, References from
Design and the AUTOMATION line) must be byte-identical to what TestRail holds (applied/C<id>-after.json, the last read-back), except
the cases listed in ADDED_QUOTE, where a source-backed control was added with its quote: for those the script prints the old and
new quote list and checks that the only differences are the added quote, the story on the epic's From line, and nothing in the
References from Design block or the AUTOMATION line. Run after authoring/build.py (it reads authoring/proposals.json).
python3 check_tail_identity.py   (exit 1 on any mismatch)"""
import json, csv, sys, re, html
S = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"
ADDED_QUOTE = {"S8-07": "S3-R3", "S8-07b": "S3-R3"}
MARK = "<p><strong>Exact quotes from the source"
prop = json.load(open(f"{S}/authoring/proposals.json"))
ids = {r["key"]: r["case_id"] for r in csv.DictReader(open(f"{S}/testrail-id-map.csv"))}
bad, same, added, missing = [], 0, [], []
for k, v in prop.items():
    if k not in ids: missing.append(k); continue
    old = json.load(open(f"{S}/applied/C{ids[k]}-after.json"))["custom_expected"]
    new = v["fields"]["custom_expected"]
    if MARK not in old or MARK not in new: bad.append((k, "no quotes block")); continue
    o, n = old[old.index(MARK):], new[new.index(MARK):]
    if o == n:
        if k in ADDED_QUOTE: bad.append((k, "listed as added-quote but unchanged"))
        else: same += 1
        continue
    if k not in ADDED_QUOTE: bad.append((k, "quotes block onward differs")); continue
    od, nd = o.split("References from Design")[1], n.split("References from Design")[1]
    if od != nd: bad.append((k, "References from Design / AUTOMATION changed")); continue
    ol = re.findall(r"<li>(.*?)</li>", o.split("References from Design")[0]); nl = re.findall(r"<li>(.*?)</li>", n.split("References from Design")[0])
    extra = [x for x in nl if x not in ol]
    if [x for x in ol if x not in nl] or len(extra) != 1 or not extra[0].startswith(f"<strong>{ADDED_QUOTE[k]}:</strong>"):
        bad.append((k, f"quote list differs beyond the added {ADDED_QUOTE[k]}")); continue
    added.append((k, ids[k], html.unescape(re.sub(r"<[^>]+>", "", extra[0]))))
print(f"cases {len(prop)} | quotes block onward byte-identical: {same} | changed only by an added quote: {len(added)} | not in the id map: {missing}")
for k, cid, q in added: print(f"  ADDED {k} C{cid}: {q}")
for k, why in bad: print(f"  MISMATCH {k} C{ids.get(k)}: {why}")
sys.exit(1 if bad or missing else 0)
