#!/usr/bin/env python3
"""Rule 141 gate (QA lead 18 Nov 2026: "Exact value, else production"; build.py check in all nine suites).

Checks every case in <suite>/authoring/proposals.json:
  point 1 - a case that compares two sides (before/after the release, production, the old version, "as today", "must not change") names
            the same location, the same user, the app time-zone setting and the browser/computer time zone, the same as-of date (where it
            has one), opens the reference side in the same sitting (or side by side), and screenshots both sides;
  point 2 - a case whose results judge a date or a day names the time zone and has a control record (midday / noon / control document).
The detection is the 18 Nov 2026 audit's (build/ar-ap-report-sorting/rule141-2026-11-18/audit-scripts/, build/RULE-141-AUDIT-2026-11-18.md).

The 442 cases that audit found are in rule141-baseline-2026-11-18.json with a fingerprint of their tester text. Such a case is reported as
"Rule 141 fix pending" and does not fail the build while its text is unchanged; once its text changes it must pass (Rule 134: a changed case
is rewritten top to bottom). Any other failing case is a PROBLEM.

    python3 rule141_gate.py <suite folder>            report
    python3 rule141_gate.py --baseline <folders...>   (re)write the baseline - only on the QA lead's say-so
From build.py:  probs += rule141_gate.problems(<suite folder>)"""
import sys, os, re, json, html, hashlib
HERE = os.path.dirname(os.path.abspath(__file__)); BUILD = os.path.dirname(HERE)
BASE = os.path.join(HERE, "rule141-baseline-2026-11-18.json")

def _txt(h):
    h = re.sub(r"</(li|p|ol|ul)>", "\n", h or ""); h = re.sub(r"<[^>]+>", "", h); return html.unescape(h)

XV = re.compile(r"before (?:the|this) release|\bas today\b|\btoday's (?!date|and yesterday|day\b|schedule)|\bToday picture|\bToday\" picture|\bas before\b|same as before|as (?:it is |it was )?in production|(?:on|in|from|with) production\b(?! test account)|production (?:shows|showed|today|build|version)|\bold (?:version|build|screen)|previous (?:build|version|release)|must not change|still (?:looks|works|reads|shows) as|\bthe same as (?:today|before)", re.I)
REF = re.compile(r"\bas today\b|\bas before\b|same as before|the same as (?:today|before)|as (?:it is |it was )?in production|production (?:shows|showed)|\bToday\"? picture|\btoday's (?!date|and yesterday|day\b|schedule|file)\w+|still (?:looks|works|reads|shows) as|must not change|before (?:the|this) release[^.\n]{0,80}(?:screenshot|note|export|save|saved|write down|wrote down|downloaded|took|take|captur|print|record)|(?:screenshot|note|export|save|saved|write down|wrote down|downloaded|took|take|captur|print)[^.\n]{0,80}before (?:the|this) release(?! was installed, with)|(?:the|its|their) (?:old|previous) (?:template|file|screen|value|wording)|(?:read|reads|worded|shown|work|works|looks|look) (?:exactly )?as (?:it|they) (?:did|was|were) before", re.I)
DATE_VAL = re.compile(r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}, \d{4}\b|\btoday\'s date\b|\byesterday\b|\btomorrow\b|\bPast Due (?:of )?\d+|\b(?:in|into|under|to|from|moves? to|stays? in) (?:the )?\"?(?:Current|1-30|31-60|61-90|91 And Over)\b|\b(?:Due Date|due date|Invoice Date|invoice date|Date|Posting date|posting date|as-of date|date)\"?[^.\n]{0,25}\b(?:reads|shows|is|are)\b[^.\n]{0,25}(?:\d{4}|today|yesterday|tomorrow|day)|\bdays? (?:ago|late|overdue)\b|\b\d+ days? past due\b", re.S)
def _has(p, t): return re.search(p, t, re.I) is not None

def parts(v):
    f = v.get("fields", v); ex = _txt(f.get("custom_expected", ""))
    cut = min([i for i in (ex.find("Exact quotes from the source"), ex.find("AUTOMATION:"), ex.find("References from Design")) if i >= 0] or [len(ex)])
    return dict(title=f.get("title", ""), pre=_txt(f.get("custom_preconds", "")), steps=_txt(f.get("custom_steps", "")), res=ex[:cut])

def fingerprint(v):
    p = parts(v); return hashlib.sha1("\n".join([p["title"], p["pre"], p["steps"], p["res"]]).encode()).hexdigest()[:16]

def fails(v):
    c = parts(v); tt = " ".join([c["title"], c["pre"], c["steps"], c["res"]])
    tt2 = re.sub(r"(?:data|bookmark,?|entries|pair|version|entry) (?:\w+ ){0,3}saved (?:to its history )?(?:with [\w ]+ )?before (?:this|the) release|saved the address", "LEGACYDATA", tt)
    xv, ref = XV.search(tt), REF.search(tt2)
    P, ps = {}, c["pre"] + " " + c["steps"]
    if xv and ref:
        P["1-location"] = _has(r"same location|at the same location|the same named location", tt)
        P["1-user"] = _has(r"same (?:Admin|user|login|account|staff member)", tt)
        P["1-timezone"] = _has(r"time[- ]zone", ps) and _has(r"browser|computer's (?:clock|time zone)", ps) and _has(r"same|both", ps)
        P["1-asof"] = (not _has(r"as-of|as of|date range", tt)) or _has(r"same (?:as-of|as of|date range|date)", tt)
        P["1-ref-opened"] = _has(r"(?:open|sign in to|switch to)[^.\n]{0,80}production|same sitting|side by side", c["steps"]) or _has(r"same sitting", ps)
        P["1-screenshots"] = _has(r"screenshot[^.\n]{0,40}both|both[^.\n]{0,40}screenshot", tt) or _has(r"screenshot (?:of )?(?:each|every) side", tt)
    if DATE_VAL.search(c["res"]):
        P["2-timezone"] = _has(r"time[- ]zone|location's (?:own )?(?:date|calendar|clock|local time)|local time", c["pre"] + " " + c["res"])
        P["2-control"] = _has(r"midday|noon|12:00|12 pm|control (?:document|record|invoice|bill)", tt)
    return [k for k, ok in P.items() if not ok]

def _suite(folder): return os.path.relpath(os.path.abspath(folder), BUILD)

def problems(folder, quiet=False):
    P = json.load(open(os.path.join(folder, "authoring", "proposals.json")))
    base = json.load(open(BASE)) if os.path.exists(BASE) else {}
    s, out, pend = _suite(folder), [], 0
    for k, v in P.items():
        f = fails(v)
        if not f: continue
        if base.get(f"{s}|{k}") == fingerprint(v): pend += 1; continue
        out.append(f"Rule 141 {k}: {', '.join(f)} (comparison: same location, same user, app and browser time zones, same as-of date, both sides "
                   f"opened in one sitting and screenshotted; dates: name the time zone and add a control record)")
    if not quiet: print(f"Rule 141 gate: {len(out)} failing | {pend} fix pending from the 18 Nov 2026 audit (text unchanged)")
    return out

if __name__ == "__main__":
    a = sys.argv[1:]
    if a and a[0] == "--baseline":
        base = {}
        for folder in a[1:]:
            s = _suite(folder)
            for k, v in json.load(open(os.path.join(folder, "authoring", "proposals.json"))).items():
                if fails(v): base[f"{s}|{k}"] = fingerprint(v)
        json.dump(base, open(BASE, "w"), indent=0, sort_keys=True); print("baseline", len(base)); sys.exit(0)
    if not a: sys.exit(__doc__)
    pr = problems(a[0]); [print("PROBLEM", p) for p in pr]; sys.exit(1 if pr else 0)
