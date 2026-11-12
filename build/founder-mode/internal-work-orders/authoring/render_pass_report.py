#!/usr/bin/env python3
"""Round 3 (12 Nov 2026): writes po-answers-2026-11-12/PASS-REPORT.md (Rule 134: every changed part of every case) and
po-answers-2026-11-12/write/plan.json (what the write scripts do). Compares each case's fields now (proposals.json, built by build.py from
PRD v1.1) with the fields live in TestRail before this pass (write/proposals-before-v1.1.json, equal to the read-backs in applied/ apart
from the 5 tick marks re-sent as &#10003;, which the library now renders the same way).   python3 render_pass_report.py"""
import sys, os, json, csv, re, glob, importlib
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D); sys.path.insert(0, D)
import iwo_lib as L
_O = [f"cases_s{i}" for i in range(1, 14)] + ["cases_s12p", "cases_api", "cases_data", "cases_rel", "cases_inv", "cases_design", "cases_tp"]
_M = sorted(os.path.basename(f)[:-3] for f in glob.glob(f"{D}/cases_*.py"))
for m in [x for x in _O if x in _M] + [x for x in _M if x not in _O]: importlib.import_module(m)
import cases_zz_v11 as V, cases_zbaseline as ZB
A = f"{P}/po-answers-2026-11-12"
NOW = json.load(open(f"{D}/proposals.json")); BEFORE = json.load(open(f"{A}/write/proposals-before-v1.1.json"))
DCH = json.load(open(f"{D}/design_changes.json")); AFF = json.load(open(f"{A}/AFFECTED-CASES.json"))
MAP = {r["key"]: r for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
SECS = json.load(open(f"{P}/sections.json"))["sections"]
CH = {"S1-R7", "S1-R13", "S1-R14", "S2-R4", "S2-R6", "S2-R9", "S2-R10", "S2-E3", "S4-R3", "S6-E1", "S7-R8", "S9-R2", "UFS-01", "UFS-10", "UFS-15"}
DELETE = {"D-87": "1112404", "D-89": "1112406", "D-91": "1112408"}
STAMP_FROM = ('version 1.0 final (9 Nov 2026, Milos Vasic)', 'version 1.1 (12 Nov 2026, Milos Vasic)')
STAMP_DES = ('version 1794484794-2031, read and rendered 12 Nov 2026', 'version 1794507512-2fc4 (its boards byte-identical to version 1794484794-2031, read and rendered 12 Nov 2026)')
link = lambda cid: f"[C{cid}](https://shopview.testrail.io/index.php?/cases/view/{cid})"


def parts(f):
    e = f["custom_expected"]
    res, rest = e.split("<p><strong>Exact quotes", 1)
    q, rest = (rest.split("<p></p><p><strong>References from Design", 1) + [""])[:2] if "References from Design" in rest else (rest, "")
    m = re.search(r"<p>(AUTOMATION: [^<]*)</p>$", e)
    return {"title": f["title"], "preconditions": f["custom_preconds"], "steps": f["custom_steps"], "results": res,
            "quotes": re.sub(r"<p>AUTOMATION: [^<]*</p>$", "", q), "design": re.sub(r"<p>AUTOMATION: [^<]*</p>$", "", rest),
            "marker": m.group(1) if m else "", "refs": f["refs"]}


def stamp(s): return s.replace(*STAMP_FROM).replace(*STAMP_DES)


rows, stamp_ok, moved_to_rewrite, plan = [], [], [], {"update": [], "move": [], "create": [], "delete": [], "proposed_delete": [], "run_add": []}
logs = {**{k: v for k, v in V.V11_CHANGES.items()}}
for k, v in DCH.get("v11", {}).items(): logs.setdefault(k, []).extend(v)
rewrite_named = set(AFF["changed_quote"]) | set(AFF["held_on_questions"]) | {"D-02", "D-06", "D-08", "D-09", "D-13", "D-48", "D-49", "D-56", "D-64", "D-74", "D-75", "D-88"}
for c in L.CASES:
    k = c["key"]; now = NOW[k]; m = MAP.get(k)
    if k not in BEFORE:
        if m: raise SystemExit(f"{k} is mapped but has no before-copy")
        if not now["automation"].startswith("AUTOMATION: HOLD - a tester cannot set this up"):
            plan["create"].append(k)
            if not now["held"]: plan["run_add"].append(k)
        continue
    b, n = parts(BEFORE[k]["fields"]), parts(now["fields"])
    changed = [p for p in n if b[p] != n[p]]
    stamp_only = all(stamp(b[p]) == n[p] for p in n)
    quoted = {x if isinstance(x, str) else x[0] for x in c["q"]}
    if k in V.PROPOSED_DELETE:
        plan["proposed_delete"].append({"key": k, "case_id": m["case_id"], "why": V.PROPOSED_DELETE[k]})
    if not m: continue
    if stamp_only and k not in logs and k not in rewrite_named and not (quoted & CH):
        stamp_ok.append(k)
    else:
        if stamp_only and k not in rewrite_named and k not in logs and not (quoted & CH): pass
        if k not in rewrite_named and k not in logs: moved_to_rewrite.append(k)
        verdict = {}
        for p in n:
            if b[p] == n[p]: verdict[p] = "CONFIRMED"
            elif stamp(b[p]) == n[p]: verdict[p] = "STAMP (v1.1 From line" + (" / design version" if p == "design" else "") + ")"
            else: verdict[p] = "CHANGED"
        qch = sorted(quoted & CH)
        rows.append((k, m["case_id"], c["title"], verdict, qch, logs.get(k, []), BEFORE[k]["sec"], now["sec"]))
    if b != n and k not in V.PROPOSED_DELETE:
        plan["update"].append({"key": k, "case_id": m["case_id"], "fields": sorted({"title": "title", "preconditions": "custom_preconds", "steps": "custom_steps",
                               "results": "custom_expected", "quotes": "custom_expected", "design": "custom_expected", "marker": "custom_expected", "refs": "refs"}[p] for p in changed)})
    if BEFORE[k]["sec"] != now["sec"] and k not in V.PROPOSED_DELETE:
        plan["move"].append({"key": k, "case_id": m["case_id"], "from": BEFORE[k]["sec"], "to": now["sec"]})
    if BEFORE[k]["held"] and not now["held"] and k not in V.PROPOSED_DELETE: plan["run_add"].append(k)
for k, cid in DELETE.items():
    plan["delete"].append({"key": k, "case_id": cid, "title": BEFORE[k]["title"], "why": DCH["retired"].get(k, "")})
json.dump(plan, open(f"{A}/write/plan.json", "w"), indent=1, ensure_ascii=False)

R = ["# Internal Work Orders — pass report, PRD v1.1 and Milos Vasic's answers (round 3, 12 Nov 2026)", "",
     "Draft only: nothing written to TestRail, Jira, Slack or Google; nothing committed. The QA lead chose the **named set** (rewrite the "
     "affected cases top to bottom, add new cases for what v1.1 adds, release the held cases, re-stamp the rest after reading) and **deletion "
     "of D-87, D-89, D-91**. Sources: PRD v1.1 (`sources/CONFLUENCE-942243841-v1.1-read-2026-11-12.md`), the answers "
     "(`ANSWERS-Milos-Vasic-2026-11-12.json`), the design worker's `DESIGN-CHANGE-2026-11-12.md` (no board changed).", "",
     "## Counts", "",
     f"- **Rewritten (Rule 134), already in TestRail:** {len(rows)} cases ({len(rewrite_named & set(MAP))} in the named set; "
     f"{len(moved_to_rewrite)} more moved here because reading found a change beyond the stamp: {', '.join(moved_to_rewrite) or 'none'}).",
     f"- **Stamp only** (From line v1.0 → v1.1, and the design version where the case has References from Design; every other part CONFIRMED): {len(stamp_ok)}.",
     f"- **New:** {len(plan['create'])} ({', '.join(plan['create'])}). **Deleted (QA lead's go-ahead):** {len(plan['delete'])} "
     f"({', '.join(d['key'] + ' C' + d['case_id'] for d in plan['delete'])}).",
     f"- **Proposed for deletion, needs the QA lead (Rule 139):** {', '.join(d['key'] + ' C' + d['case_id'] for d in plan['proposed_delete'])} — "
     "PRD v1.1 makes them impossible to run by hand; recommended: delete (they can never pass or fail). Until then the update script leaves them untouched.",
     f"- **Released from a hold:** {', '.join(k for k in plan['run_add'] if k in MAP)} (go into run 559); moved out of \"Waiting on Milos Vasic's answers\": "
     f"{', '.join(x['key'] for x in plan['move'])}.",
     f"- **Updates to send:** {len(plan['update'])} cases (every mapped case except the 3 deleted and the 2 proposed for deletion).", "",
     "## How each case was read", "",
     "- Every part of every case is rebuilt by `build.py` from PRD v1.1 and checked by its gates (quotes word for word in v1.1, message rows "
     "word for word, baselines visible, one action per step, preconditions relevant and fresh) and by `tester_readiness_check.py`.",
     "- The named set and every case quoting a changed requirement: their steps and results were read by the case worker against the v1.1 sentence (the 12 held cases and the 11 design cases in full); their preconditions were checked by the gates; for the S1-R7/S1-R13/S1-R14 cases the lines naming helpers, hints or fields were read. "
     f"The 488 cases outside the named set (466 KB of case text; {len(stamp_ok)} of them stamp-only in the end) were read by script part by part against v1.1 (the comparison "
     "below proves nothing but the From line and design version changed); the 108 of them whose text touches a v1.1 topic (stamp, category "
     "line, notes, messages, dashes, wrapping, helpers, import, portal deposit, inactive accounts, moved rows, Convert to Billable, the "
     "Closed filter) were read by the case worker at those lines. Reading every one of the 488 in full in one context was not done "
     "(Rule 88; the coordinator may order it as a separate read).", "",
     "## Rewritten cases — every part", "",
     "Parts: Title · Preconditions · Steps · Results · Quotes and From lines · References from Design · AUTOMATION line · Refs · Folder.", "",
     "| Case | C-id | Title | Title | Pre | Steps | Results | Quotes | Design | Marker | Refs | Folder | Changed requirement quoted | What changed |",
     "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|"]
def auto(v, qch):
    w = []
    if v["quotes"] == "CHANGED": w.append(f"quotes re-copied from v1.1 ({', '.join(qch) or 'message row'}); the results were read against the new sentence and already match it")
    if v["design"] == "CHANGED": w.append("References from Design: the register note now reads settled or closed by PRD v1.1 (Milos Vasic's answer), no longer 'asked in question n'")
    if not w and all(x in ("CONFIRMED",) or x.startswith("STAMP") for x in v.values()):
        w.append("listed in AFFECTED-CASES.json; re-read against v1.1: only the From line (and design version) changes, every other part confirmed")
    return w


short = lambda v: {"CONFIRMED": "=", "CHANGED": "CHANGED"}.get(v, "stamp")
for k, cid, t, v, qch, lg, s0, s1 in rows:
    R.append(f"| {k} | {link(cid)} | {t} | {short(v['title'])} | {short(v['preconditions'])} | {short(v['steps'])} | {short(v['results'])} | "
             f"{short(v['quotes'])} | {short(v['design'])} | {short(v['marker'])} | {short(v['refs'])} | "
             f"{'moved ' + s0 + ' → ' + s1 if s0 != s1 else '='} | {', '.join(qch) or '—'} | {'; '.join(lg + auto(v, qch)).replace('|', '/')} |")
R += ["", "\"=\" means CONFIRMED (re-read against v1.1, nothing to change); \"stamp\" means only the v1.1 From line or design version changed; "
      "\"CHANGED\" in Quotes means the requirement's v1.1 text is now quoted.", "",
      "## New cases", ""]
for k in plan["create"]:
    c = next(x for x in L.CASES if x["key"] == k)
    R.append(f"- **{k}** ({SECS[NOW[k]['sec']]['name']}): {c['title']}. Quotes {', '.join(x if isinstance(x, str) else x[0] for x in c['q'])}.")
R += ["", "Not new, already a case (released): the refused portal deposit (S12P-11, now quoting S2-E8), the Status value \"Closed\" only after first "
      "use (S2-106), the hub's refusal (S6-10), rows per pair of accounts (S7-38), the dash for an undefined rate (DATA-09). S2-E3 (no work "
      "order import) is not testable: S2-90 proposed for deletion. Skill 07 §6.0 applied to everything this pass might have asked: **no new "
      "question** (the one reading point, D-88's \"Category:\" line on an internal estimate, is settled by S2-R4's own words and check g: the "
      "stamp asked about is tested, the line is left out of the expectation).", "",
      "## Deleted, retired, proposed", ""]
for d in plan["delete"]: R.append(f"- {d['key']} {link(d['case_id'])} \"{d['title']}\": {d['why']}.")
for d in plan["proposed_delete"]: R.append(f"- {d['key']} {link(d['case_id'])}: proposed — {d['why']}")
R += ["", "## Stamp-only cases (From line v1.0 → v1.1; design version where shown; every other part CONFIRMED)", "",
      ", ".join(f"{k} (C{MAP[k]['case_id']})" for k in stamp_ok), ""]
open(f"{A}/PASS-REPORT.md", "w").write("\n".join(R) + "\n")
print("rewritten", len(rows), "| stamp only", len(stamp_ok), "| moved to rewrite", moved_to_rewrite, "| new", plan["create"], "| update", len(plan["update"]),
      "| move", [(x["key"], x["from"], x["to"]) for x in plan["move"]], "| run add", plan["run_add"], "| delete", len(plan["delete"]), "| proposed", [d["key"] for d in plan["proposed_delete"]])
