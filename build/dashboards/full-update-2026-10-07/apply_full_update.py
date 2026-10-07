#!/usr/bin/env python3
"""Apply the Dashboard full update (QA lead 2026-10-07: "Update Dashboard ... never in DELTA mode ... runnable").
Reads the three worker proposal files, checks every rule, then (with --apply) writes to TestRail.
  python3 apply_full_update.py            check only (prints every problem; exit 1 if any)
  python3 apply_full_update.py --apply    write: snapshot before/after, update, read back, add new cases
Only OUR cases (created_by 3) are touched. Foreign cases are never written."""
import sys, json, re, os, glob, html
sys.path.insert(0, "build/maintenance-reminder-v2")
from mr_lib import api
H = "build/dashboards/full-update-2026-10-07"
V42 = open("build/dashboards/sources/CONFLUENCE-788430850-Dashboard-v1-2026-10-07-v42.md").read()
APPLY = "--apply" in sys.argv
def ws(s): return re.sub(r"\s+", " ", s.replace("**", "").replace("\\", "")).strip()
V42N = ws(V42)
def esc(t): return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
def ol(x): return "<ol>" + "".join(f"<li>{esc(i)}</li>" for i in x) + "</ol>"
def ul_raw(x): return "<ul>" + "".join(f"<li>{i}</li>" for i in x) + "</ul>"
STAMP = re.compile(r"\s*(Last checked against build [^ ]+ on [0-9/]+\.)")
SHORTHAND = re.compile(r"\b(S\d+-[RNE]\d+|parity|denominator|bucket|n/a state|Rule \d+|delta)\b|;", re.I)
def expected(p):
    src = p["source"]; m = STAMP.search(src); stamp = m.group(1) if m else None
    if m: src = STAMP.sub("", src).strip()
    out = "<p><strong>Expected results</strong></p>" + ul_raw(esc(r) for r in p["results"])
    out += f"<p><strong>Source &mdash; where this behaviour comes from</strong><br>{esc(src)}</p>"
    out += "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>" + ul_raw(
        f"<strong>{esc(a)}:</strong> &ldquo;{esc(q)}&rdquo;" for a, q in p["quotes"])
    if stamp: out += f"<p>{esc(stamp)}</p>"
    return out + f"<p>{esc(p['marker'])}</p>"
problems = []; plans = []; news = []
for f in sorted(glob.glob(f"{H}/proposals-*.json")):
    d = json.load(open(f))
    for kind, items in (("upd", d.get("updates", [])), ("new", d.get("new", []))):
        for p in items:
            k = p.get("case_id") or p.get("key")
            t = p["title"]
            if len(t) > 80: problems.append(f"{k}: title {len(t)} chars")
            if SHORTHAND.search(t): problems.append(f"{k}: title shorthand/semicolon: {t}")
            if not p["preconds"] or not p["steps"] or not p["results"] or not p["quotes"]: problems.append(f"{k}: empty part")
            if not p["marker"].startswith("AUTOMATION: ") or "AUTOMATION:" in " ".join(p["results"]): problems.append(f"{k}: marker")
            for a, q in p["quotes"]:
                if ws(q) not in V42N: problems.append(f"{k}: quote {a} not verbatim in v42: {q[:90]}")
            tester = " ".join(p["preconds"] + p["steps"] + p["results"])
            for bad in ("Dashboard feature", "Rule 11", "Rule 5", "seed the exact", "conditions in S", "DashboardAdministrator"):
                if bad.lower() in tester.lower(): problems.append(f"{k}: tester text contains '{bad}'")
            if re.search(r"^\s*(confirm|verify|check that)\b", " ".join(p["steps"][:1]), re.I): pass
            payload = {"title": t, "custom_preconds": ol(p["preconds"]), "custom_steps": ol(p["steps"]), "custom_expected": expected(p)}
            if kind == "upd": plans.append((int(p["case_id"]), payload, p.get("change_summary", "")))
            else: news.append((p["key"], int(p["section_id"]), payload, p.get("why", "")))
ids = [c for c, _, _ in plans]
if len(ids) != len(set(ids)): problems.append("a case is proposed twice")
ours = {json.load(open(f))["id"]: json.load(open(f)) for f in glob.glob(f"{H}/snapshots-before/C*.json")}
for c in ids:
    if c not in ours or ours[c]["created_by"] != 3: problems.append(f"C{c}: not ours or unknown")
missing = [c for c, v in ours.items() if v["created_by"] == 3 and c not in ids]
print(f"updates {len(plans)} · new {len(news)} · our cases not in any proposal: {sorted(missing)}")
for p in problems: print("PROBLEM", p)
if problems and not APPLY: sys.exit(1)
if APPLY:
    assert not problems, "fix problems first"
    os.makedirs(f"{H}/applied", exist_ok=True); log = []
    for cid, payload, why in plans:
        c = api(f"get_case/{cid}")
        assert c["created_by"] == 3 and c["updated_by"] == 3, f"C{cid} changed by someone else"
        json.dump(c, open(f"{H}/applied/C{cid}-before.json", "w"), indent=1)
        api(f"update_case/{cid}", payload); a = api(f"get_case/{cid}")
        json.dump(a, open(f"{H}/applied/C{cid}-after.json", "w"), indent=1)
        ok = all((a.get(k) or "") == v for k, v in payload.items())
        log.append({"op": "update", "case": f"C{cid}", "automated": c.get("custom_atmstatus") == 3, "verified": ok, "change": why})
        print(("OK " if ok else "MISMATCH ") + f"C{cid}")
    for key, sec, payload, why in news:
        payload.update({"template_id": 1, "type_id": 7, "priority_id": 2, "custom_automation_type": 2, "custom_atmstatus": 1})
        r = api(f"add_case/{sec}", payload); a = api(f"get_case/{r['id']}")
        ok = all((a.get(k) or "") == v for k, v in payload.items() if k.startswith("custom_p") or k in ("title", "custom_steps", "custom_expected"))
        log.append({"op": "add", "key": key, "case": f"C{r['id']}", "section": sec, "verified": ok, "why": why})
        print(("OK " if ok else "MISMATCH ") + f"C{r['id']} {key}")
    json.dump(log, open(f"{H}/applied/apply-log.json", "w"), indent=1)
    print("verified", sum(x["verified"] for x in log), "of", len(log))
