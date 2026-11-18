import json, re
from collections import Counter, defaultdict
C = json.load(open("cases.json"))
CMP = re.compile(r"\bproduction\b|before the release|before this release|old version|older version|old build|previous (?:build|version|release)|must not change|\bunchanged\b|\bas today\b|today's (?!date|day\b)|\bas before\b|same as before|\bstaging\b|\bV1\b|before the change|after the release", re.I)
DATE_RES = re.compile(r"\bPast Due\b|\bdays? past due\b|\bDue Date\b|\bag(?:e)?ing\b|\b1-30\b|\b31-60\b|\bas-of date\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}, \d{4}\b|\btoday's date\b|\btomorrow\b|\byesterday\b|\bdate\b|\bdated\b|\bdue (?:on|today)\b|\bdays? (?:after|before|ago|old|late)\b", re.I)
rows = []
for id_, c in C.items():
    t_all = " ".join([c["title"], c["pre"], c["steps"], c["res"]])
    cm = CMP.findall(t_all)
    dm = DATE_RES.findall(c["res"])
    c["cmp_hits"] = sorted(set(x.lower() for x in cm)); c["date_hits"] = sorted(set(x.lower() for x in dm))
    rows.append(c)
cnt = defaultdict(Counter)
for c in rows:
    cnt[c["suite"]]["total"] += 1
    if c["cmp_hits"]: cnt[c["suite"]]["cmp"] += 1
    if c["date_hits"]: cnt[c["suite"]]["date"] += 1
for s, v in cnt.items(): print(s, dict(v))
hit = Counter(h for c in rows for h in c["cmp_hits"]); print(hit.most_common(30))
dh = Counter(h for c in rows for h in c["date_hits"]); print(dh.most_common(30))
json.dump(rows, open("rows.json", "w"))
