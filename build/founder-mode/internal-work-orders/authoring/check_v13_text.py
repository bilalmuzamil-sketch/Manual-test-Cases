#!/usr/bin/env python3
"""Round 4 (13 Nov 2026): proves, for every case, (1) each PRD quote is word for word in PRD v1.3 and (2) its tester text
(title, preconditions, steps, plain results) names nothing v1.3 removed: the Close confirmation (the word "confirmation" within
160 characters after "Close", other windows excluded), the second hint line ("Map their expense accounts", "hint lines",
"first hint", "second hint"), the old confirmation sentence ("This posts", "This marks", "This completes").
Writes po-answers-2026-11-12/write/check-v13-text.json.   python3 check_v13_text.py"""
import os, sys, json, re, html
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
NOW = json.load(open(f"{D}/proposals.json"))
PRD = open(f"{P}/sources/CONFLUENCE-942243841-v1.3-read-2026-11-12.md").read()
norm = lambda s: re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s)).replace("\\", "").replace("**", "").replace("`", "")).strip()
PRDN = norm(PRD)
CLOSE = re.compile(r"Close[^.]{0,160}?confirmation", re.I)
OTHER = re.compile(r"(Convert|Reopen|Remove|Make internal|Archive|Delete|Switch|Turn off|Change Customer)[^.]{0,80}confirmation", re.I)
GONE = [r"Map their expense accounts", r"hint lines", r"first hint", r"(?<!no )second hint", r"\bThis posts\b", r"\bThis marks\b", r"\bThis completes\b",
        r"two hints?"]
# Read and allowed (13 Nov 2026): "with no confirmation" / "no second hint line" say what v1.3 removed is absent (S3-R1, S1-R3 "There is no
# second line"); "QuickBooks mark" stays in v1.3 (S1-R16: "the Settings hint of S1-R3", S1-R13, S1-R15, S5-R1). Retired cases are skipped.
NEG = re.compile(r"(with )?no (Close )?confirmation", re.I)
import importlib.util
_s = importlib.util.spec_from_file_location("_r", f"{D}/cases_zzz_v13.py")
RETIRED = set(re.findall(r'retire\("([^"]+)"', open(f"{D}/cases_zzz_v13.py").read()))
out = {"quote_misses": {}, "removed_text": {}, "quotes_checked": 0, "retired_skipped": []}
for k, v in NOW.items():
    f = v["fields"]; e = f["custom_expected"]
    res, rest = e.split("<p><strong>Exact quotes", 1)
    q = rest.split("References from Design")[0]
    for m in re.finditer(r"<li>(.*?)</li>", q, re.S):
        t = norm(m.group(1))
        mm = re.match(r"^(.*?):\s*[“\"](.*)[”\"]$", t)
        if not mm: continue
        lab, quote = mm.groups()
        if lab.startswith(("Tech plan", "Jira", "Design", "PO answer")): continue
        out["quotes_checked"] += 1
        for part in re.split(r"\s*\[…\]\s*|\s*…\s*", quote):
            if part and norm(part) not in PRDN: out["quote_misses"].setdefault(k, []).append(f"{lab}: {part[:120]}")
    tester = norm(" | ".join([f["title"], f["custom_preconds"], f["custom_steps"], res]))
    if k in RETIRED: out["retired_skipped"].append(k); continue
    hits = [m.group(0)[-80:] for m in CLOSE.finditer(tester) if not OTHER.search(m.group(0)) and not NEG.search(m.group(0)[-40:])] + \
           [g for g in GONE if re.search(g, tester, re.I)]
    if hits: out["removed_text"][k] = hits
json.dump(out, open(f"{P}/po-answers-2026-11-12/write/check-v13-text.json", "w"), indent=1, ensure_ascii=False)
print("cases checked", len(NOW), "| PRD quotes checked", out["quotes_checked"], "| retired skipped", out["retired_skipped"], "| quote misses", len(out["quote_misses"]), "| removed text named", len(out["removed_text"]))
for k, v in list(out["quote_misses"].items())[:20]: print("Q", k, v[:2])
for k, v in out["removed_text"].items(): print("R", k, v[:3])
