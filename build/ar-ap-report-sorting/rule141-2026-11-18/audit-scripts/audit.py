import json, re
from collections import Counter, defaultdict
R = json.load(open("rows.json")); RUNS = json.load(open("runs.json"))
XV = re.compile(r"before (?:the|this) release|\bas today\b|\btoday's (?!date|and yesterday|day\b|schedule)|\bToday picture|\bToday\" picture|\bas before\b|same as before|as (?:it is |it was )?in production|(?:on|in|from|with) production\b(?! test account)|production (?:shows|showed|today|build|version)|\bold (?:version|build|screen)|previous (?:build|version|release)|must not change|still (?:looks|works|reads|shows) as|\bthe same as (?:today|before)", re.I)
REF = re.compile(r"\bas today\b|\bas before\b|same as before|the same as (?:today|before)|as (?:it is |it was )?in production|production (?:shows|showed)|\bToday\"? picture|\btoday's (?!date|and yesterday|day\b|schedule|file)\w+|still (?:looks|works|reads|shows) as|must not change|before (?:the|this) release[^.\n]{0,80}(?:screenshot|note|export|save|saved|write down|wrote down|downloaded|took|take|captur|print|record)|(?:screenshot|note|export|save|saved|write down|wrote down|downloaded|took|take|captur|print)[^.\n]{0,80}before (?:the|this) release(?! was installed, with)|(?:the|its|their) (?:old|previous) (?:template|file|screen|value|wording)|(?:read|reads|worded|shown|work|works|looks|look) (?:exactly )?as (?:it|they) (?:did|was|were) before", re.I)
PRODWORD = re.compile(r"\bproduction\b", re.I)
IS = re.compile(r"\bunchanged\b|before the change|\bstaging\b", re.I)
DATE_VAL = re.compile(r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}, \d{4}\b|\btoday\'s date\b|\byesterday\b|\btomorrow\b|\bPast Due (?:of )?\d+|\b(?:in|into|under|to|from|moves? to|stays? in) (?:the )?\"?(?:Current|1-30|31-60|61-90|91 And Over)\b|\b(?:Due Date|due date|Invoice Date|invoice date|Date|Posting date|posting date|as-of date|date)\"?[^.\n]{0,25}\b(?:reads|shows|is|are)\b[^.\n]{0,25}(?:\d{4}|today|yesterday|tomorrow|day)|\bdays? (?:ago|late|overdue)\b|\b\d+ days? past due\b", re.S)
def has(p, t): return re.search(p, t, re.I) is not None
out = []
for c in R:
    tt = " ".join([c["title"], c["pre"], c["steps"], c["res"]])
    xv = sorted(set(m.group(0).lower() for m in XV.finditer(tt)))
    sec_inv = c["sec"] in ("INV", "REL", "PROD") or "must not change" in (c["section_name"] or "").lower() or "release day" in (c["section_name"] or "").lower()
    date = bool(DATE_VAL.search(c["res"]))
    tt2 = re.sub(r"(?:data|bookmark,?|entries|pair|version|entry) (?:\w+ ){0,3}saved (?:to its history )?(?:with [\w ]+ )?before (?:this|the) release|saved the address", "LEGACYDATA", tt)
    ref = sorted(set(m.group(0).lower()[:60] for m in REF.finditer(tt2)))
    if xv and not ref: kind = "LEGACY"
    elif xv: kind = "XV"
    else: kind = None
    kind = kind if kind else ("SEC" if sec_inv else ("IS" if IS.search(tt) or PRODWORD.search(tt) else None))
    if not kind and not date: continue
    pre_steps = c["pre"] + " " + c["steps"]
    P = {}
    if kind == "XV":
        asof = has(r"as-of|as of|date range", tt)
        P["1-location"] = has(r"same location|at the same location|the same named location", tt)
        P["1-user"] = has(r"same (?:Admin|user|login|account|staff member)", tt)
        P["1-timezone"] = has(r"time[- ]zone", pre_steps) and has(r"browser|computer's (?:clock|time zone)", pre_steps) and has(r"same|both", pre_steps)
        P["1-asof"] = (not asof) or has(r"same (?:as-of|as of|date range|date)", tt)
        P["1-ref-opened"] = has(r"(?:open|sign in to|switch to)[^.\n]{0,80}production|same sitting|side by side", c["steps"]) or has(r"same sitting", pre_steps)
        P["1-screenshots"] = has(r"screenshot[^.\n]{0,40}both|both[^.\n]{0,40}screenshot", tt) or has(r"screenshot (?:of )?(?:each|every) side", tt)
    if date:
        P["2-timezone"] = has(r"time[- ]zone|location's (?:own )?(?:date|calendar|clock|local time)|local time", c["pre"] + " " + c["res"])
        P["2-control"] = has(r"midday|noon|12:00|12 pm|control (?:document|record|invoice|bill)", tt)
    fails = [k for k, v in P.items() if not v]
    run = RUNS[c["suite"]]
    if not c["cid"]: memb = "not in TestRail"
    elif not run["name"]: memb = f"no run (run {run['run']} no longer exists)"
    else: memb = f"in run {run['run']}" if int(c["cid"]) in set(run["case_ids"]) else f"held (not in run {run['run']})"
    out.append(dict(suite=c["suite"], key=c["key"], cid=c["cid"], title=c["title"], sec=c["sec"], section=c["section_name"], kind=kind, date=date,
                    xv=xv, ref=ref, checks=P, fails=fails, member=memb))
json.dump(out, open("audit.json", "w"), indent=0)
cnt = defaultdict(Counter)
for o in out:
    s = o["suite"]; cnt[s]["kind:" + str(o["kind"])] += 1
    if o["date"]: cnt[s]["date"] += 1
    if o["fails"]: cnt[s]["fail"] += 1
for s, v in cnt.items(): print(s, dict(v))
print(Counter(x for o in out for x in o["xv"]).most_common(40))
