#!/usr/bin/env python3
"""Read-only runnability audit of the live Maintenance Reminders cases (Rule 114 / 117), aimed at what the
manual tester raised before: cases whose meaning is unclear, out of context, or not doable by hand.
Usage: python3 runnability_audit.py <live-cases.json> <out.md>"""
import sys, json, re, html
L = json.load(open(sys.argv[1]))
def txt(h): return html.unescape(re.sub(r"<[^>]+>", " ", h or "")).replace("\xa0", " ")
def split_exp(e):
    t = txt(e); i = t.find("Source"); return (t[:i] if i > 0 else t), t
CHECKS = {
 "requirement code in preconditions/steps/plain results": r"\bS\d{1,2}-[RNE]\d+\b",
 "engineering words (API, endpoint, server, database, payload, 4xx/5xx, JSON, devtools, console, network tab)":
     r"\b(API|endpoint|server|database|DB|payload|JSON|devtools|console|network tab|HTTP|[45]0[0-9])\b",
 "plan or design jargon (Plan 1/2, TD-, FD-, NFR, artboard, board, frame, D-number)":
     r"\b(Plan [12]|TD-\d+|FD-\d+|NFR-?\w*|artboard|design board|frame [A-Z]\w*)\b",
 "points to another case or section instead of saying what to do":
     r"(as in C\d+|see C\d+|same as C\d+|from C\d+|previous case|conditions in S|per S\d|as above|see above)",
 "placeholder left in text": r"(\{[a-z_ ]+\}|<id>|TBD|\?\?|XXX|lorem)",
 "feature-flag wording": r"(feature flag|maintenance_reminders|Flag on)",
 "unclear verbs (verify the logic / ensure it works / check behaviour)":
     r"\b(verify the logic|ensure it works|check (the )?behaviou?r|works correctly|as expected)\b",
}
rows = []; hits = {k: [] for k in CHECKS}; extra = {"no preconditions": [], "no steps": [], "title > 80": [],
  "steps with no numbered list": [], "very long step (>350 chars)": [], "asks the tester to record wording (not judge)": [],
  "says part cannot be checked by hand": [], "plain results missing": []}
for cid, c in L.items():
    pre, steps = txt(c["pre"]), txt(c["steps"]); plain, full = split_exp(c["exp"])
    tester = pre + "\n" + steps + "\n" + plain
    for k, rx in CHECKS.items():
        m = re.findall(rx, tester, flags=re.I if "unclear" in k or "engineering" in k else 0)
        if m: hits[k].append((cid, sorted({x if isinstance(x, str) else x[0] for x in m})[:4]))
    if len(pre.strip()) < 15: extra["no preconditions"].append(cid)
    if len(steps.strip()) < 15: extra["no steps"].append(cid)
    if len(c["title"]) > 80: extra["title > 80"].append(cid)
    if "<li" not in (c["steps"] or ""): extra["steps with no numbered list"].append(cid)
    for li in re.findall(r"<li>(.*?)</li>", c["steps"] or "", flags=re.S):
        if len(txt(li)) > 350: extra["very long step (>350 chars)"].append(cid); break
    if re.search(r"record (the|what) (build|screen)|write down (the|what)|note (the|what) wording", tester, re.I):
        extra["asks the tester to record wording (not judge)"].append(cid)
    if re.search(r"cannot be checked by hand", full, re.I): extra["says part cannot be checked by hand"].append(cid)
    if "Expected results" not in full: extra["plain results missing"].append(cid)
U = "https://shopview.testrail.io/index.php?/cases/view/"
out = [f"# Runnability audit — {len(L)} live Maintenance Reminders cases\n"]
for k, v in list(hits.items()):
    out.append(f"## {k}: {len(v)}")
    out += [f"- [C{c}]({U}{c}) ({L[c]['chunk']}) — {L[c]['title']} — found: {', '.join(m)}" for c, m in v]; out.append("")
for k, v in extra.items():
    out.append(f"## {k}: {len(v)}")
    out += [f"- [C{c}]({U}{c}) ({L[c]['chunk']}) — {L[c]['title']}" for c in v]; out.append("")
open(sys.argv[2], "w").write("\n".join(out))
for k, v in list(hits.items()) + list(extra.items()): print(f"{len(v):4}  {k}")
